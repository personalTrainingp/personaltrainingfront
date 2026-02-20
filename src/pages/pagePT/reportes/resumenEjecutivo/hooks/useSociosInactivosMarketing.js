import { useState, useCallback, useEffect, useMemo } from "react";
import { PTApi } from "@/common";

export const useSociosInactivosMarketing = (empresa = 598, pageSize = 20) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [fechaCorte, setFechaCorte] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filtros
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("dias_sin_renovar");
    const [sortDir, setSortDir] = useState("desc");
    const [page, setPage] = useState(1);

    // Días de inactividad (corte configurable)
    const [dias, setDias] = useState(91);

    // Colapsar
    const [isOpen, setIsOpen] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: res } = await PTApi.get(
                "/parametros/socios/inactivos-91-dias",
                { params: { empresa, dias } }
            );
            setData(res.socios || []);
            setTotal(res.total || 0);
            setFechaCorte(res.fecha_corte || "");
        } catch (e) {
            console.error("Error fetching socios inactivos:", e);
            setError("Error al cargar socios inactivos");
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [empresa, dias]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filtrado + ordenamiento
    const processed = useMemo(() => {
        let list = [...data];

        if (search.trim()) {
            const q = search.toLowerCase().trim();
            list = list.filter(
                (s) =>
                    s.nombre_completo?.toLowerCase().includes(q) ||
                    s.telefono?.toLowerCase().includes(q) ||
                    s.email?.toLowerCase().includes(q) ||
                    s.ultimo_programa?.toLowerCase().includes(q)
            );
        }

        list.sort((a, b) => {
            let va = a[sortField];
            let vb = b[sortField];

            if (sortField === "dias_sin_renovar") {
                va = Number(va) || 0;
                vb = Number(vb) || 0;
            } else if (sortField === "ultima_fecha_fin") {
                va = va || "";
                vb = vb || "";
            } else {
                va = String(va || "").toLowerCase();
                vb = String(vb || "").toLowerCase();
            }

            if (va < vb) return sortDir === "asc" ? -1 : 1;
            if (va > vb) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return list;
    }, [data, search, sortField, sortDir]);

    // Paginación
    const totalPages = Math.ceil(processed.length / pageSize);
    const paginated = useMemo(
        () => processed.slice((page - 1) * pageSize, page * pageSize),
        [processed, page, pageSize]
    );

    useEffect(() => {
        setPage(1);
    }, [search, sortField, sortDir]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const sortIcon = (field) => {
        if (sortField !== field) return " ↕";
        return sortDir === "asc" ? " ▲" : " ▼";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr + "T00:00:00");
        return isNaN(d)
            ? dateStr
            : new Intl.DateTimeFormat("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).format(d);
    };

    const exportToCSV = () => {
        if (processed.length === 0) return;

        const headers = ["Cliente", "Telefono", "Email", "Ultimo Programa", "Fecha Vencimiento", "Dias Inactivos"];
        const rows = processed.map(row => [
            `"${row.nombre_completo || ''}"`,
            `"${row.telefono || ''}"`,
            `"${row.email || ''}"`,
            `"${row.ultimo_programa || ''}"`,
            `"${row.ultima_fecha_fin || ''}"`,
            row.dias_sin_renovar
        ]);

        const csvString = [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvString);

        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        link.setAttribute("download", `Leads_Inactivos_${fechaCorte}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getWhatsAppLink = (phone) => {
        if (!phone || phone === "-") return null;
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length > 5 ? `https://wa.me/51${cleanPhone}` : null;
    };

    const getDaysColor = (days) => {
        if (days >= 365) return "#dc2626";
        if (days >= 180) return "#ea580c";
        if (days >= 91) return "#d97706";
        return "#16a34a";
    };

    return {
        data,
        total,
        fechaCorte,
        loading,
        error,
        search,
        setSearch,
        isOpen,
        setIsOpen,
        processed,
        paginated,
        page,
        setPage,
        totalPages,
        fetchData,
        handleSort,
        sortIcon,
        formatDate,
        exportToCSV,
        getWhatsAppLink,
        getDaysColor,
        dias,
        setDias
    };
};
