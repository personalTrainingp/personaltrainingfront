import { useState, useMemo, useEffect } from 'react';
import PTApi from '@/common/api/PTApi';

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const useSeguimientoRenovaciones = (dataVentas, mapaVencimientos, year, id_empresa) => {
    const [activosPorMes, setActivosPorMes] = useState({});
    const [loadingActivos, setLoadingActivos] = useState(false);

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

    // 2. Extraer Renovaciones del Mapa
    const renovacionesPorMes = useMemo(() => {
        const counts = Array(12).fill(0);

        Object.keys(mapaVencimientos).forEach((key) => {
            const [y, m] = key.split("-");
            if (parseInt(y) === year) {
                const monthIndex = parseInt(m) - 1;
                if (monthIndex >= 0 && monthIndex < 12) {
                    const val = mapaVencimientos[key];
                    counts[monthIndex] = typeof val === 'object' ? (val.renovaciones || 0) : val;
                }
            }
        });

        return counts;
    }, [mapaVencimientos, year]);

    // 3. Fetch Activos (Vigentes) por Mes
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

    return {
        inscritosPorMes,
        renovacionesPorMes,
        activosPorMes,
        loadingActivos,
        MESES
    };
};
