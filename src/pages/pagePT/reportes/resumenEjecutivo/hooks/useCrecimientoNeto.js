import { useState, useEffect, useMemo } from 'react';
import PTApi from '@/common/api/PTApi';

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const useCrecimientoNeto = (dataVentas, mapaVencimientos, year, id_empresa) => {
    const [activosPorMes, setActivosPorMes] = useState({});
    const [loadingActivos, setLoadingActivos] = useState(false);

    // 0. Fetch Activos (Vigentes) por Mes - Reused logic for independence
    useEffect(() => {
        const fetchActivos = async () => {
            setLoadingActivos(true);
            const results = {};

            const promises = MESES.map(async (_, index) => {
                const month = index + 1;
                const lastDay = new Date(year, month, 0).getDate();

                try {
                    const { data } = await PTApi.get("/parametros/membresias/vigentes/lista", {
                        params: {
                            empresa: id_empresa || 598,
                            year,
                            selectedMonth: month,
                            cutDay: lastDay,
                        },
                    });
                    return { month: index, total: Number(data?.total || 0) };
                } catch (error) {
                    console.error(`Error fetching vigentes for ${month}/${year}`, error);
                    return { month: index, total: 0 };
                }
            });

            try {
                const responses = await Promise.all(promises);
                responses.forEach(r => {
                    results[r.month] = r.total;
                });
                setActivosPorMes(results);
            } catch (err) {
                console.error("Error fetching vigentes batch", err);
            } finally {
                setLoadingActivos(false);
            }
        };

        if (year) {
            fetchActivos();
        }
    }, [year, id_empresa]);

    // 1. Calcular Inscritos (Nuevas Ventas)
    const inscritosPorMes = useMemo(() => {
        const counts = Array(12).fill(0);
        if (!dataVentas) return counts;

        dataVentas.forEach((venta) => {
            const fecha = new Date(venta.fecha_venta || venta.createdAt);
            if (fecha.getFullYear() !== year) return;

            const isRenovacion = venta.id_origen === 691;
            if (!isRenovacion) {
                counts[fecha.getMonth()]++;
            }
        });
        return counts;
    }, [dataVentas, year]);

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
            // Nota: Usamos activosPorMes[i] que es el total al final del mes.
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
        activosPorMes, // Exportamos también
        loadingActivos,
        MESES
    };
};