import { useMemo } from 'react';

// Metas hardcoded 2025 (ejemplo)
const BONUS_METAS_2025 = {
    0: 100000, // Enero
    1: 100000, // Febrero
    2: 100000,
    3: 100000,
    4: 100000,
    5: 100000,
    6: 100000,
    7: 100000,
    8: 100000,
    9: 100000,
    10: 100000,
    11: 100000 // Diciembre
};

export const useBonusAnalysis = (ventas, monthsData, customStartDay = 1, customEndDay = 1) => {
    return useMemo(() => {
        // Datos agregados por mes
        const monthlyData = {};
        const CUT_DAY = 15; // Standard cut-off for bonus

        monthsData.forEach(m => {
            // Meta logic: use provided quota or fallback
            // Si viene quota en m, usarla. Si no, usar hardcoded.
            let meta = m.quota || 0;
            if (!meta && m.year === 2025) {
                meta = BONUS_METAS_2025[m.monthsIdx] || 100000;
            }

            monthlyData[m.key] = {
                accumulated: 0,
                customRange: 0, // Nuevo campo
                meta: meta,
                label: m.label,
                key: m.key
            };
        });

        const toLimaDate = (iso) => {
            if (!iso) return null;
            try {
                const d = new Date(iso);
                const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
                return new Date(utcMs - 5 * 60 * 60000);
            } catch { return null; }
        };

        ventas.forEach(v => {
            const d = toLimaDate(v.fecha_venta || v.fecha || v.createdAt);
            if (!d) return;

            const vKey = `${d.getFullYear()}-${d.getMonth()}`;
            if (!monthlyData[vKey]) return;

            let amount = 0;
            if (Number(v.monto_total) > 0) {
                amount = Number(v.monto_total);
            } else {
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
            }

            if (amount <= 0) return;

            const day = d.getDate();

            // Standard: Only days 1-15
            if (day <= CUT_DAY) {
                monthlyData[vKey].accumulated += amount;
            }

            // Custom Range
            if (day >= customStartDay && day <= customEndDay) {
                monthlyData[vKey].customRange += amount;
            }
        });

        return monthsData.map(m => {
            return {
                ...m,
                ...monthlyData[m.key]
            };
        });
    }, [ventas, monthsData, customStartDay, customEndDay]);
};
