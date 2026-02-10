import { useMemo } from 'react';
import { MESES } from '../../resumenEjecutivo/hooks/useResumenUtils';

export const useComparativoMensualLogic = ({ ventas = [], year, startMonth = 0, cutDay = 21 }) => {

    const toLimaDate = (iso) => {
        if (!iso) return null;
        try {
            const d = new Date(iso);
            const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
            return new Date(utcMs - 5 * 60 * 60000);
        } catch { return null; }
    };

    // LÓGICA DE METAS (Hardcoded según requerimiento)
    const getQuotaForMonth = (monthIndex, year) => {
        const y = Number(year);
        // Enero 2026 en adelante: 110k
        if (y >= 2026) return 110000;

        if (y === 2025) {
            // Enero (0) a Julio (6): 60k
            if (monthIndex <= 6) return 60000;
            // Agosto (7): 70k
            if (monthIndex === 7) return 70000;
            // Septiembre (8): 75k
            if (monthIndex === 8) return 75000;
            // Octubre (9): 85k
            if (monthIndex === 9) return 85000;
            // Noviembre (10) y Diciembre (11): 90k
            if (monthIndex >= 10) return 90000;
        }

        // Fallback para años anteriores o no definidos (ej: 2024 o default)
        return 60000;
    };

    const monthsData = useMemo(() => {
        // 1. GENERAR EL RANGO DE 12 MESES DINÁMICAMENTE
        // Si startMonth es 1 (Febrero), generamos de Feb-AñoActual hasta Ene-AñoSiguiente
        const list = [];
        const validKeys = new Set(); // Para filtrar ventas rápido

        for (let i = 0; i < 12; i++) {
            // Calculamos el índice real (0-11) y el año correspondiente
            const absoluteIndex = Number(startMonth) + i;
            const currentMonthIdx = absoluteIndex % 12;
            const yearOffset = Math.floor(absoluteIndex / 12);
            const currentYear = Number(year) + yearOffset;

            const key = `${currentYear}-${currentMonthIdx}`;

            list.push({
                monthIdx: currentMonthIdx,
                year: currentYear,
                label: MESES[currentMonthIdx], // "Enero", "Febrero"...
                key: key // Identificador único: "2024-1"
            });
            validKeys.add(key);
        }

        const dataMap = new Map();

        // 2. PROCESAR VENTAS
        ventas.forEach(v => {
            const d = toLimaDate(v.fecha_venta || v.fecha || v.createdAt);
            if (!d) return;

            // Creamos la key de esta venta: "Año-Mes"
            const vKey = `${d.getFullYear()}-${d.getMonth()}`;

            // FILTRO CLAVE: Solo procesamos si la fecha de la venta está en nuestro rango generado
            if (!validKeys.has(vKey)) return;

            const details = v.detalle_ventaMembresia || v.detalle_venta_membresia || [];
            let amount = 0;
            details.forEach(det => amount += Number(det.tarifa_monto || det.monto || det.precio || 0));

            if (amount <= 0) return;

            const day = d.getDate();

            if (!dataMap.has(vKey)) {
                dataMap.set(vKey, {
                    cut: 0, rest: 0, total: 0,
                    w1: 0, w2: 0, w3: 0, w4: 0, w5: 0,
                    r1_15: 0, r16_end: 0
                });
            }

            const entry = dataMap.get(vKey);
            entry.total += amount;

            if (day <= cutDay) entry.cut += amount; else entry.rest += amount;

            if (day >= 1 && day <= 7) entry.w1 += amount;
            else if (day >= 8 && day <= 14) entry.w2 += amount;
            else if (day >= 15 && day <= 21) entry.w3 += amount;
            else if (day >= 22 && day <= 28) entry.w4 += amount;
            else entry.w5 += amount;

            // New Breakdown: 1-15 vs 16-End
            if (day <= 15) entry.r1_15 += amount;
            else entry.r16_end += amount;
        });

        // 3. MERGE DATOS CON LA LISTA
        return list.map(m => {
            const data = dataMap.get(m.key) || {
                cut: 0, rest: 0, total: 0,
                w1: 0, w2: 0, w3: 0, w4: 0, w5: 0,
                r1_15: 0, r16_end: 0
            };

            // Usamos la nueva función local para obtener la cuota
            const quota = getQuotaForMonth(m.monthIdx, m.year);

            const pctW1 = data.total > 0 ? (data.w1 / data.total) * 100 : 0;
            const pctW2 = data.total > 0 ? (data.w2 / data.total) * 100 : 0;
            const pctW3 = data.total > 0 ? (data.w3 / data.total) * 100 : 0;
            const pctW4 = data.total > 0 ? (data.w4 / data.total) * 100 : 0;
            const pctW5 = data.total > 0 ? (data.w5 / data.total) * 100 : 0;

            const pctR1_15 = data.total > 0 ? (data.r1_15 / data.total) * 100 : 0;
            const pctR16_end = data.total > 0 ? (data.r16_end / data.total) * 100 : 0;

            return {
                ...m, ...data, quota,
                pctW1, pctW2, pctW3, pctW4, pctW5,
                pctR1_15, pctR16_end
            };
        });

    }, [ventas, year, startMonth, cutDay]);

    // LÓGICA DE PROMEDIOS (Igual que antes)
    const { top3Map, top3Averages, last6Averages } = useMemo(() => {
        const fields = ['total', 'w1', 'w2', 'w3', 'w4', 'w5', 'r1_15', 'r16_end'];
        const indicesMap = {};
        const averagesTop3 = {};

        // Top 3 se calcula sobre los 12 meses visibles actualmente
        fields.forEach(field => {
            const sorted = [...monthsData].sort((a, b) => b[field] - a[field]);
            const top3 = sorted.slice(0, 3);
            indicesMap[field] = top3.map(m => m.key); // Usamos KEY en lugar de monthIdx para evitar colisiones si mostramos 13 meses

            if (top3.length > 0) {
                const sum = top3.reduce((acc, curr) => acc + curr[field], 0);
                averagesTop3[field] = sum / top3.length;
            } else {
                averagesTop3[field] = 0;
            }
        });

        const last6Months = monthsData.slice(-6);
        const averagesLast6 = {};

        fields.forEach(field => {
            if (last6Months.length > 0) {
                const sum = last6Months.reduce((acc, curr) => acc + curr[field], 0);
                averagesLast6[field] = sum / last6Months.length;
            } else {
                averagesLast6[field] = 0;
            }
        });

        return { top3Map: indicesMap, top3Averages: averagesTop3, last6Averages: averagesLast6 };
    }, [monthsData]);

    return { monthsData, top3Indices: top3Map, top3Averages, last6Averages };
};