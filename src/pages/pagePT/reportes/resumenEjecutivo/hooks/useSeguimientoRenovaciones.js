import { useState, useEffect, useMemo } from 'react';
import { useVigentesHistoricoStore } from './useVigentesHistoricoStore';

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const useSeguimientoRenovaciones = (dataVentas, mapaVencimientos, year, id_empresa) => {

    // Obtenemos del store
    const { fetchVigentesHistorico, data, loading } = useVigentesHistoricoStore();

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

    // 🔥 3. Fetch Activos (Vigentes) por Mes - USANDO STORE
    useEffect(() => {
        if (year) {
            fetchVigentesHistorico(id_empresa, year);
        }
    }, [year, id_empresa, fetchVigentesHistorico]);

    // 🔥 LA SOLUCIÓN: Reemplazamos el useState y el useEffect por un useMemo puro.
    // Esto calcula los resultados al vuelo (síncronamente) y evita el re-render extra.
    const activosPorMes = useMemo(() => {
        const key = `${id_empresa || 598}-${year}`;
        const rows = data[key] || [];
        const results = {};

        rows.forEach(({ colId, rows: montRows }) => {
            const [y, m] = colId.split('-');
            if (Number(y) === year) {
                const monthIndex = Number(m) - 1;
                results[monthIndex] = montRows ? montRows.length : 0;
            }
        });

        return results;
    }, [data, year, id_empresa]);

    const loadingActivos = loading[`${id_empresa || 598}-${year}`] || false;

    return {
        inscritosPorMes,
        renovacionesPorMes,
        activosPorMes,
        loadingActivos,
        MESES
    };
};
