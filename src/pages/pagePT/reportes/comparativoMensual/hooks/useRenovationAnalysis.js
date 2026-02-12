import { useMemo } from 'react';

export const useRenovationAnalysis = (ventas, monthsData) => {
    return useMemo(() => {
        const dataMap = new Map();

        // 1. Initialize map with months
        monthsData.forEach(m => {
            dataMap.set(m.key, {
                ...m,
                totalCount: 0,
                renovationCount: 0
            });
        });

        const toLimaDate = (iso) => {
            if (!iso) return null;
            try {
                const d = new Date(iso);
                const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
                return new Date(utcMs - 5 * 60 * 60000);
            } catch { return null; }
        };

        // 2. Iterate Sales
        ventas.forEach(v => {
            const d = toLimaDate(v.fecha_venta || v.fecha || v.createdAt);
            if (!d) return;

            const vKey = `${d.getFullYear()}-${d.getMonth()}`;
            if (!dataMap.has(vKey)) return;

            const entry = dataMap.get(vKey);

            // Check totals (Sum of amounts > 0)
            // If the sale has any item with amount > 0, we count it as a sale?
            // User request usually implies counting transaction rows if they are valid sales.
            // Let's check detail items.

            const details = v.detalle_ventaMembresia || v.detalle_venta_membresia || [];
            if (!details.length) return;

            const totalAmount = details.reduce((acc, det) => acc + Number(det.tarifa_monto || det.monto || det.precio || 0), 0);

            if (totalAmount > 0) {
                entry.totalCount += 1; // Count this sale ticket

                // Check if it is a renovation
                if (Number(v.id_origen) === 691) {
                    entry.renovationCount += 1;
                }
            }
        });

        return Array.from(dataMap.values());
    }, [ventas, monthsData]);
};
