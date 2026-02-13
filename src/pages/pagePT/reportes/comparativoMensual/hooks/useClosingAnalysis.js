import { useMemo } from 'react';

export const useClosingAnalysis = (ventas, monthsData, customStartDay = 1, customEndDay = 1) => {
    return useMemo(() => {
        const data = {};
        const CUT_DAY = 25; // Standard cut-off

        // Inicializar datos
        monthsData.forEach(m => {
            data[m.key] = {
                firstPart: 0, // Días 1-25
                lastPart: 0,  // Días 26-Fin
                customRange: 0, // Nuevo rango
                total: 0
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

            // Filtro: Solo renovaciones (ID 691)
            if (Number(v.id_origen) !== 691) return;

            const vKey = `${d.getFullYear()}-${d.getMonth()}`;
            if (!data[vKey]) return; // Fuera del rango

            let amount = 0;
            const details = v.detalle_ventaMembresia || v.detalle_venta_membresia || [];
            details.forEach(det => amount += Number(det.tarifa_monto || det.monto || det.precio || 0));

            if (amount <= 0) return;

            const day = d.getDate();

            // Lógica Estándar (1-25)
            if (day <= CUT_DAY) {
                data[vKey].firstPart += amount;
            } else {
                data[vKey].lastPart += amount;
            }

            // Lógica Custom Range
            if (day >= customStartDay && day <= customEndDay) {
                data[vKey].customRange += amount;
            }

            data[vKey].total += amount;
        });

        return monthsData.map(m => {
            const d = data[m.key];
            const ratio = d.firstPart > 0 ? (d.lastPart / d.firstPart) * 100 : 0;
            return {
                ...m,
                ...d,
                ratio
            };
        });
    }, [ventas, monthsData, customStartDay, customEndDay]);
};
