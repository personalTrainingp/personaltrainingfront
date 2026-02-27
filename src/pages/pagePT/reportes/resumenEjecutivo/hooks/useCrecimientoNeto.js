import { useEffect, useMemo } from 'react';
import { useVigentesHistoricoStore } from './useVigentesHistoricoStore';

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const useCrecimientoNeto = (dataVentas, mapaVencimientos, year, id_empresa, cutDay = null, cutMonth = null) => {
    // ❌ BORRADO: const [activosPorMes, setActivosPorMes] = useState({});

    // Obtenemos del store
    const { fetchVigentesHistorico, data, loading } = useVigentesHistoricoStore();

    // 0. Fetch Activos (Vigentes) por Mes - USANDO STORE
    useEffect(() => {
        if (year) {
            fetchVigentesHistorico(id_empresa, year, cutDay, cutMonth);
        }
    }, [year, id_empresa, cutDay, cutMonth, fetchVigentesHistorico]);

    // 🔥 LA SOLUCIÓN: Calcular al vuelo sin causar re-renders
    const activosPorMes = useMemo(() => {
        const key = `${id_empresa || 598}-${year}-${cutMonth ?? 'x'}-${cutDay ?? 'last'}`;
        const rows = data[key] || [];
        const results = {};

        rows.forEach(({ colId, rows: montRows }) => {
            if (!colId) return;
            const parts = colId.split('-');
            const y = Number(parts[0]);
            const m = Number(parts[1]);

            if (y === year) {
                if (cutMonth && m > cutMonth) return; // Filtro de meses futuros

                const monthIndex = m - 1;
                results[monthIndex] = Array.isArray(montRows) ? montRows.length : 0;
            }
        });

        return results;
    }, [data, year, id_empresa, cutDay, cutMonth]);

    const loadingActivos = loading[`${id_empresa || 598}-${year}-${cutMonth ?? 'x'}-${cutDay ?? 'last'}`] || false;

    // 1. Calcular Inscritos (Nuevas Ventas)
    const inscritosPorMes = useMemo(() => {
        const counts = Array(12).fill(0);
        if (!dataVentas) return counts;

        dataVentas.forEach((venta) => {
            const fecha = new Date(venta.fecha_venta || venta.createdAt);
            if (fecha.getFullYear() !== year) return;

            const mVal = fecha.getMonth() + 1;
            if (mVal > (cutMonth || 12)) return;
            if (mVal === cutMonth && fecha.getDate() > (cutDay || 31)) return;

            const isRenovacion = venta.id_origen === 691;
            if (!isRenovacion) {
                counts[fecha.getMonth()]++;
            }
        });
        return counts;
    }, [dataVentas, year, cutDay, cutMonth]);

    // 2. Extraer Renovaciones, Churn y calcular Churn Rate %
    const stats = useMemo(() => {
        const renovaciones = Array(12).fill(0);
        const churn = Array(12).fill(0);
        const net = Array(12).fill(0);
        const vencimientos = Array(12).fill(0);
        const churnRate = Array(12).fill(0);

        Object.keys(mapaVencimientos).forEach((key) => {
            const [y, m] = key.split("-");
            if (parseInt(y) === year) {
                const monthIndex = parseInt(m) - 1;
                if (monthIndex >= 0 && monthIndex < 12) {
                    const val = mapaVencimientos[key];
                    const rTotal = typeof val === 'object' ? (val.renovaciones || 0) : val;
                    const vTotal = typeof val === 'object' ? (val.vencimientos || 0) : 0;

                    renovaciones[monthIndex] = rTotal;
                    vencimientos[monthIndex] = vTotal;

                    // Churn Absoluto
                    const lost = vTotal - rTotal;
                    churn[monthIndex] = lost > 0 ? lost : 0;
                }
            }
        });

        // Loop separado para calculos que dependen de activosPorMes
        for (let i = 0; i < 12; i++) {
            // Net Growth = Inscritos Nuevos - Churn
            net[i] = inscritosPorMes[i] - churn[i];

            // Churn Rate % = (Bajas / Total Activos) * 100
            const activosTotal = activosPorMes[i] || 0;
            if (activosTotal > 0) {
                churnRate[i] = ((churn[i] / activosTotal) * 100).toFixed(1);
            } else {
                churnRate[i] = 0;
            }
        }

        return { renovaciones, churn, net, vencimientos, churnRate };
    }, [mapaVencimientos, inscritosPorMes, year, activosPorMes]);

    return {
        inscritosPorMes,
        renovacionesPorMes: stats.renovaciones,
        churnPorMes: stats.churn,
        netGrowthPorMes: stats.net,
        churnRatePorMes: stats.churnRate,
        activosPorMes,
        loadingActivos,
        MESES
    };
};