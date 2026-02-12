import { useMemo } from 'react';

export const useClosingAnalysis24Days = (ventas, monthsData) => {
    return useMemo(() => {
        const data = {};

        // Inicializar datos
        monthsData.forEach(m => {
            data[m.key] = {
                firstPart: 0, // Días 1-24
                lastPart: 0,  // Días 25-Fin
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

            // SIN FILTRO DE ORIGEN (Para incluir TODAS las ventas, como en MetaAlcance)
            // if (Number(v.id_origen) !== 691) return; 

            const vKey = `${d.getFullYear()}-${d.getMonth()}`;
            if (!data[vKey]) return; // Fuera del rango

            let amount = 0;
            // Intentar obtener monto total de la venta (si es null, sumar items)
            if (Number(v.monto_total) > 0) {
                amount = Number(v.monto_total);
            } else {
                const details = v.detalle_ventaMembresia || v.detalle_venta_membresia || [];
                details.forEach(det => amount += Number(det.tarifa_monto || det.monto || det.precio || 0));
            }

            if (amount <= 0) return;

            const day = d.getDate();

            if (day <= 24) {
                data[vKey].firstPart += amount;
            } else {
                data[vKey].lastPart += amount;
            }
            data[vKey].total += amount;
        });

        return monthsData.map(m => {
            const d = data[m.key];
            // Ratio: Ultimos 6 dias / Venta 24 dias
            const ratio = d.firstPart > 0 ? (d.lastPart / d.firstPart) * 100 : 0;
            return {
                ...m,
                ...d,
                ratio
            };
        });
    }, [ventas, monthsData]);
};
