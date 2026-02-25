import { useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";

dayjs.extend(utc);
dayjs.locale("es");

export const useGraficoLinealInversionRedes = (data = []) => {
    const [red, setRed] = useState("ambos");

    const norm = (s) =>
        String(s || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const getId = (it) =>
        Number(
            it?.id_param ??
            it?.idRed ??
            it?.id_red ??
            it?.id_canal ??
            it?.canal_id ??
            it?.origen_id ??
            it?.id
        );

    const labelFrom = (it) =>
        it?.parametro?.label_param ??
        it?.label_param ??
        it?.nombre_param ??
        it?.canal ??
        it?.red ??
        it?.origen ??
        it?.origen_label ??
        it?.label ??
        "";

    const detectNetwork = (it) => {
        const id = getId(it);
        if (id === 1515) return "meta";
        if (id === 1514) return "tiktok";

        const L = norm(labelFrom(it));
        if (/(meta|facebook|instagram)/.test(L)) return "meta";
        if (/tiktok/.test(L)) return "tiktok";
        return "desconocido";
    };

    const keepByFilter = (it) => {
        if (red === "ambos") return true;
        return detectNetwork(it) === red;
    };

    const lastFour = useMemo(() => {
        return (Array.isArray(data) ? data : []).slice(0, 4);
    }, [data]);

    const maxDays = useMemo(() => {
        let max = 28;
        for (const m of lastFour) {
            if (Array.isArray(m?.items) && m.items.length > 0) {
                const d = dayjs.utc(m.items[0].fecha);
                if (d.isValid()) {
                    const mDays = d.daysInMonth();
                    if (mDays > max) max = mDays;
                }
            }
        }
        return max;
    }, [lastFour]);

    const series = useMemo(() => {
        return lastFour.map((m, idx) => {
            const items = Array.isArray(m?.items) ? m.items.filter(keepByFilter) : [];
            const buckets = Array(maxDays).fill(null);
            const base = items[0] ? dayjs.utc(items[0].fecha) : dayjs();

            for (const it of items) {
                const d = dayjs.utc(it?.fecha);
                if (!d.isValid()) continue;
                if (d.month() !== base.month() || d.year() !== base.year()) continue;

                const day = d.date();
                if (day <= maxDays) {
                    const raw = typeof it?.cantidad === "string" ? it.cantidad.trim() : it?.cantidad;
                    const val = Number(raw);
                    const num = Number.isFinite(val) ? val : 0;
                    if (buckets[day - 1] === null) buckets[day - 1] = 0;
                    buckets[day - 1] += num;
                }
            }

            for (let i = 0; i < buckets.length; i++) {
                if (buckets[i] === null) buckets[i] = 0;
            }

            return {
                name: m?.fecha ?? `Serie ${idx + 1}`,
                data: buckets,
            };
        });
    }, [lastFour, red, maxDays]);

    const baseMonthForAxis = useMemo(() => {
        let best = null;
        let bestDays = 0;
        for (const m of lastFour) {
            if (Array.isArray(m?.items) && m.items.length > 0) {
                const d = dayjs.utc(m.items[0].fecha);
                if (d.isValid() && d.daysInMonth() > bestDays) {
                    bestDays = d.daysInMonth();
                    best = d;
                }
            }
        }
        return best || dayjs();
    }, [lastFour]);

    const categories = useMemo(
        () =>
            Array.from({ length: maxDays }, (_, i) => {
                const d = baseMonthForAxis.date(i + 1);
                return `${d.format("dddd")} ${i + 1}`.toUpperCase();
            }),
        [baseMonthForAxis, maxDays]
    );

    // Opciones del gráfico
    const options = {
        chart: {
            type: "line",
            toolbar: { show: false },
            parentHeightOffset: 0,
            fontFamily: 'inherit',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.05
            }
        },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        stroke: { curve: "smooth", width: 3 },
        markers: {
            size: 4,
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: { size: 6 }
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4,
            padding: { bottom: 60, left: 10, right: 10, top: 10 }
        },
        xaxis: {
            categories,
            labels: {
                rotate: -45,
                rotateAlways: true,
                style: { fontSize: "12px", colors: '#64748b' },
                offsetY: 5,
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            title: {
                text: "Cantidad",
                style: { color: '#64748b', fontWeight: 500 }
            },
            labels: { style: { colors: '#64748b' } }
        },
        legend: {
            position: "top",
            horizontalAlign: 'center',
            offsetY: 0,
            itemMargin: { horizontal: 10, vertical: 0 }
        },
        tooltip: {
            theme: 'light',
            x: { show: true },
            y: { formatter: (val) => `${val}` }
        },
    };

    return {
        red,
        setRed,
        series,
        options
    };
};
