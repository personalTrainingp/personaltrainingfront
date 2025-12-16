import { useMemo } from "react";

const norm = (s) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

export const fmt = (n, mostrarCero = false) => {
    const num = Number(n) || 0;
    if (num === 0 && !mostrarCero) return "";
    return num.toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const normalizeImgUrl = (u) => {
    if (u == null) return "";
    try { const s = String(u).trim(); return s.replace(/^['"]|['"]$/g, ""); } catch { return ""; }
};

function limaFromISO(iso) {
    if (!iso) return null;
    const s = String(iso).replace(" ", "T").replace(" -", "-");
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utc - 5 * 60 * 60000);
}

const getItemsMembresia = (v) => (v?.detalle_ventaMembresia || v?.detalle_ventaMembresium || []);

const getImporteCorrecto = (v) => {
    if (Number(v?.tarifa_monto) > 0) return Number(v.tarifa_monto);
    const items = getItemsMembresia(v);
    if (items.length > 0) {
        return items.reduce((acc, item) => acc + Number(item.tarifa_monto || 0), 0);
    }
    return Number(v?.monto_total || v?.tb_ventum?.monto_total || v?.monto || 0);
};

export const useSumaSesionesLogic = ({
    ventas, year, month, initDay, cutDay,
    resumenArray, sociosOverride, advisorOriginByProg, avataresDeProgramas, avatarByAdvisor
}) => {


    const uniqueTicketsByAdvisor = useMemo(() => {
        const map = {};
        if (!Array.isArray(ventas) || !year || !month) return map;

        const EXCLUDED_IDS = [3562];
        const mIdx = Number(month) - 1;

        const getAdvisorName = (v) => {
            const nombreFull = v?.tb_ventum?.tb_empleado?.nombres_apellidos ||
                v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl ||
                v?.tb_empleado?.nombres_apellidos_empl ||
                v?.empleado || "";
            return norm((nombreFull.split(" ")[0] || "").trim());
        };

        ventas.forEach(v => {
            if (EXCLUDED_IDS.includes(v?.id_empl)) return;

            const d = limaFromISO(v?.fecha_venta || v?.createdAt);
            if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== mIdx || d.getDate() < Number(initDay) || d.getDate() > Number(cutDay)) return;

            const hasItems = getItemsMembresia(v).length > 0;
            const hasMonto = Number(v.monto_total) > 0;

            if (hasItems || hasMonto) {
                const name = getAdvisorName(v);
                if (!name) return;
                if (!map[name]) map[name] = new Set();
                const key = v.numero_transac ? String(v.numero_transac).trim() : v.id;
                map[name].add(key);
            }
        });

        const counts = {};
        Object.keys(map).forEach(k => counts[k] = map[k].size);
        return counts;
    }, [ventas, year, month, initDay, cutDay]);

    const moneyByAdvisor = useMemo(() => {
        const map = {};
        if (!Array.isArray(ventas)) return map;
        const EXCLUDED_IDS = [3562];
        const mIdx = Number(month) - 1;

        const getAdvisorName = (v) => {
            const nombreFull = v?.tb_ventum?.tb_empleado?.nombres_apellidos || v?.tb_empleado?.nombres_apellidos_empl || "";
            return norm((nombreFull.split(" ")[0] || "").trim());
        };

        ventas.forEach(v => {
            if (EXCLUDED_IDS.includes(v?.id_empl)) return;

            const d = limaFromISO(v?.fecha_venta || v?.createdAt);
            if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== mIdx || d.getDate() < Number(initDay) || d.getDate() > Number(cutDay)) return;

            const monto = getImporteCorrecto(v);
            if (monto > 0) {
                const name = getAdvisorName(v);
                if (name) {
                    if (!map[name]) map[name] = { money: 0, pct: 0 };
                    map[name].money += monto;
                }
            }
        });
        return map;
    }, [ventas, year, month, initDay, cutDay]);

    const progKeys = avataresDeProgramas.map((p) => String(p?.name_image ?? "").trim().toUpperCase());

    const asesores = useMemo(() => {
        const fromResumen = Array.isArray(resumenArray) ? resumenArray.filter(f => norm(f?.[0]?.value) !== "TOTAL").map(f => String(f?.[0]?.value ?? "").trim().toUpperCase()) : [];
        const fromOverride = Object.values(sociosOverride || {}).flatMap(p => Object.keys(p || {}));
        const fromAdvisor = Object.values(advisorOriginByProg || {}).flatMap(p => Object.keys(p || {})).map(n => String(n).trim().toUpperCase());
        const fromUnique = Object.keys(uniqueTicketsByAdvisor).map(k => k.toUpperCase());

        return Array.from(new Set([...fromResumen, ...fromOverride, ...fromAdvisor, ...fromUnique])).filter(Boolean);
    }, [resumenArray, sociosOverride, advisorOriginByProg, uniqueTicketsByAdvisor]);

    const filas = useMemo(() => {
        let rawFilas = asesores.map((asesor) => {
            const row = [{ header: "NOMBRE", value: asesor, isPropiedad: true }];
            progKeys.forEach((pk) => {
                const val = sociosOverride?.[pk]?.[asesor] ?? 0;
                row.push({ header: pk, value: val });
            });
            return row;
        });

        return rawFilas.filter((fila) => {
            const asesor = fila[0]?.value ?? "";
            if (uniqueTicketsByAdvisor[norm(asesor)] > 0) return true;
            for (const pk of Object.keys(advisorOriginByProg)) {
                const counts = advisorOriginByProg?.[pk]?.[asesor];
                if (counts && (Number(counts.nuevos) > 0 || Number(counts.renovaciones) > 0 || Number(counts.reinscripciones) > 0 || Number(counts.o) > 0)) return true;
            }
            return false;
        });
    }, [asesores, progKeys, sociosOverride, uniqueTicketsByAdvisor, advisorOriginByProg]);

    const totalItemsByAdvisor = useMemo(() => {
        const map = {};
        asesores.forEach(asesor => {
            let sum = 0;
            progKeys.forEach(pk => {
                const counts = advisorOriginByProg?.[pk]?.[asesor] ?? { nuevos: 0, renovaciones: 0, reinscripciones: 0, o: 0 };
                sum += (Number(counts.nuevos) || 0) + (Number(counts.renovaciones) || 0) + (Number(counts.reinscripciones) || 0) + (Number(counts.o) || 0);
            });
            map[norm(asesor)] = sum;
        });
        return map;
    }, [asesores, progKeys, advisorOriginByProg]);

    // Total Global Items (debería ser ~40)
    const totalGlobalItems = Object.values(totalItemsByAdvisor).reduce((a, b) => a + b, 0);


    // Ranking y Totales de Dinero
    const totalVisibleMoney = filas.reduce((acc, fila) => {
        const asesor = fila[0]?.value ?? "";
        return acc + (moneyByAdvisor[norm(asesor)]?.money || 0);
    }, 0);

    Object.keys(moneyByAdvisor).forEach((key) => {
        const m = moneyByAdvisor[key]?.money || 0;
        moneyByAdvisor[key].pct = totalVisibleMoney > 0 ? (m * 100) / totalVisibleMoney : 0;
    });

    const rankByAdvisor = useMemo(() => {
        const order = [...asesores].sort((a, b) => (moneyByAdvisor[norm(b)]?.money || 0) - (moneyByAdvisor[norm(a)]?.money || 0));
        const map = {};
        order.forEach((name, i) => (map[name] = i + 1));
        return map;
    }, [asesores, moneyByAdvisor]);

    // Helpers para footer
    const totalByProgAndOrigin = (pk) => {
        const asesoresObj = advisorOriginByProg?.[pk] || {};
        return Object.values(asesoresObj).reduce((acc, c) => ({
            nuevos: acc.nuevos + (Number(c?.nuevos) || 0),
            renovaciones: acc.renovaciones + (Number(c?.renovaciones) || 0),
            reinscripciones: acc.reinscripciones + (Number(c?.reinscripciones) || 0),
            o: acc.o + (Number(c?.o) || 0),
        }), { nuevos: 0, renovaciones: 0, reinscripciones: 0, o: 0 });
    };

    const totalOnlyByProg = (pk) => {
        const t = totalByProgAndOrigin(pk);
        return (t.nuevos || 0) + (t.renovaciones || 0) + (t.reinscripciones || 0) + (t.o || 0);
    };

    const visiblePrograms = avataresDeProgramas.map((img) => ({ img, key: (String(img?.name_image ?? "").trim().toUpperCase()) }));

    const imageByAdvisor = useMemo(() => {
        const map = {};
        if (!Array.isArray(resumenArray)) return map;
        for (const fila of resumenArray) {
            const name = norm(fila?.[0]?.value);
            if (!name || name === "TOTAL") continue;
            const cells = (Array.isArray(fila) ? fila : []);
            let url = "";
            const imgCell = cells.find(c => { const h = norm(c?.header); return h.includes("IMAGEN") || h.includes("FOTO") || h === "IMG"; });
            if (imgCell) url = imgCell.value;
            if (!url) {
                const cand = cells.find((c) => typeof c?.img === "string" || typeof c?.image === "string" || typeof c?.foto === "string");
                url = (cand?.img || cand?.image || cand?.foto) ?? "";
            }
            if (url) map[name] = normalizeImgUrl(url);
        }
        return map;
    }, [resumenArray]);

    return {
        filas,
        uniqueTicketsByAdvisor, // Mantener para debug y filtrar, aunque visualmente usamos items
        moneyByAdvisor,
        rankByAdvisor,
        totalGlobalItems, // NUEVO: Usar este para el total
        totalItemsByAdvisor, // NUEVO: Usar este para el total por fila
        totalVisibleMoney,
        visiblePrograms,
        totalOnlyByProg, // Usado en footer
        totalByProgAndOrigin, // Usado en footer breakdown
        imageByAdvisor,
        norm
    };
};