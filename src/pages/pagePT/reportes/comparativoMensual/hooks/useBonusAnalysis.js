import { useMemo } from 'react';

// Hardcoded metas based on the user image for 2025
const BONUS_METAS_2025 = {
    0: 50000,  // Enero (Assumption)
    1: 50000,  // Febrero
    2: 50000,  // Marzo
    3: 55000,  // Abril
    4: 55000,  // Mayo
    5: 60000,  // Junio
    6: 60000,  // Julio
    7: 70000,  // Agosto
    8: 75000,  // Septiembre
    9: 85000,  // Octubre
    10: 90000, // Noviembre
    11: 100000 // Diciembre
};

export const useBonusAnalysis = (ventas, monthsData) => {
    return useMemo(() => {
        const dataMap = new Map();

        // 1. Initialize map with months
        monthsData.forEach(m => {
            const meta = m.year === 2025 ? BONUS_METAS_2025[m.monthIdx] : 100000; // Default fallback
            dataMap.set(m.key, {
                ...m,
                accumulated: 0,
                meta
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

            // Filter: Only days 1-15
            if (d.getDate() > 15) return;

            const vKey = `${d.getFullYear()}-${d.getMonth()}`;
            if (!dataMap.has(vKey)) return;

            const entry = dataMap.get(vKey);
            let amount = 0;

            // Sum Memberships
            const memDetails = v.detalle_ventaMembresia || v.detalle_venta_membresia || [];
            memDetails.forEach(det => amount += Number(det.tarifa_monto || det.monto || det.precio || 0));

            // Sum Products
            const prodDetails = v.detalle_ventaProductos || v.detalle_venta_productos || [];
            prodDetails.forEach(det => {
                const qty = Number(det.cantidad || 1);
                const price = Number(det.precio_unitario || det.tarifa_monto || det.precio || 0);
                amount += (qty * price);
            });

            if (amount > 0) {
                entry.accumulated += amount;
            }
        });

        return Array.from(dataMap.values());
    }, [ventas, monthsData]);
};
