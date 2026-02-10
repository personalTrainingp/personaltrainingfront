import { useMemo } from 'react';

export const useRenovationsBreakdown = (ventas, monthsData) => {
    return useMemo(() => {
        // 1. Filtrar solo renovaciones (ID 691)
        const renovaciones = ventas.filter(v => Number(v.id_origen) === 691);

        const repsMap = new Map();
        const monthlyTotals = {};

        // Inicializar totales por mes
        monthsData.forEach(m => monthlyTotals[m.key] = { count: 0, amount: 0 });

        const toLimaDate = (iso) => {
            if (!iso) return null;
            try {
                const d = new Date(iso);
                const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
                return new Date(utcMs - 5 * 60 * 60000);
            } catch { return null; }
        };

        renovaciones.forEach(v => {
            const d = toLimaDate(v.fecha_venta || v.fecha || v.createdAt);
            if (!d) return;

            const vKey = `${d.getFullYear()}-${d.getMonth()}`;

            // Solo procesar si el mes está en el rango seleccionado
            if (!monthsData.some(m => m.key === vKey)) return;

            // --- CAMBIO AQUÍ: OBTENER SOLO EL PRIMER NOMBRE ---
            const fullName = v.tb_empleado?.nombres_apellidos_empl || v.usu_venta_nombre || 'Sin Asignar';
            // "ALVARO SALAZAR GOMEZ" -> ["ALVARO", "SALAZAR", "GOMEZ"] -> "ALVARO"
            const repName = fullName.trim().split(' ')[0];

            let amount = 0;
            const details = v.detalle_ventaMembresia || v.detalle_venta_membresia || [];
            details.forEach(det => amount += Number(det.tarifa_monto || det.monto || det.precio || 0));

            // Lógica por Vendedor
            if (!repsMap.has(repName)) {
                repsMap.set(repName, new Map());
            }

            const repMonthMap = repsMap.get(repName);
            if (!repMonthMap.has(vKey)) {
                repMonthMap.set(vKey, { count: 0, amount: 0 });
            }

            const current = repMonthMap.get(vKey);
            current.count += 1;
            current.amount += amount;

            // Totales Globales
            if (monthlyTotals[vKey]) {
                monthlyTotals[vKey].count += 1;
                monthlyTotals[vKey].amount += amount;
            }
        });

        // Ordenar alfabéticamente
        const sortedReps = Array.from(repsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

        // Calculate Grand Total for all months
        const grandTotal = { count: 0, amount: 0 };
        Object.values(monthlyTotals).forEach(val => {
            grandTotal.count += val.count;
            grandTotal.amount += val.amount;
        });

        return {
            repData: sortedReps,
            totals: monthlyTotals,
            grandTotal
        };
    }, [ventas, monthsData]);
};
