import { useState, useEffect, useMemo } from 'react';
import { useVigentesHistoricoStore } from './useVigentesHistoricoStore';

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const useSeguimientoRenovaciones = (dataVentas, mapaVencimientos, year, id_empresa, cutDay = null, cutMonth = null) => {

    // Obtenemos del store
    const { fetchVigentesHistorico, data, loading } = useVigentesHistoricoStore();

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

    // 🔥 3. Fetch Activos (Vigentes) por Mes - USANDO STORE
    useEffect(() => {
        if (year) {
            fetchVigentesHistorico(id_empresa, year, cutDay, cutMonth);
        }
    }, [year, id_empresa, cutDay, cutMonth, fetchVigentesHistorico]);

    // 🔥 LA SOLUCIÓN: Reemplazamos el useState y el useEffect por un useMemo puro.
    // Esto calcula los resultados al vuelo (síncronamente) y evita el re-render extra.
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

    return {
        inscritosPorMes,
        renovacionesPorMes,
        activosPorMes,
        loadingActivos,
        MESES
    };
};
