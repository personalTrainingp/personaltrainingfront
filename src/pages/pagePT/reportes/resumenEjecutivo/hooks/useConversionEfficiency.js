import { useMemo } from 'react';
import { limaFromISO, originMap, MESES } from '../hooks/useResumenUtils';

export const useConversionEfficiency = ({
    ventas = [],
    dataMktWithCac = {},
    dataLead = [],
    mapaVencimientos = {},
    selectedMonth,
    year,
    initDay,
    cutDay
}) => {
    return useMemo(() => {
        const monthIndex = selectedMonth - 1;
        const targetMonthName = MESES[monthIndex];
        const mesKey = targetMonthName === 'septiembre' ? 'setiembre' : targetMonthName;
        const key = `${year}-${mesKey}`;

        const mktData = dataMktWithCac[key] || {};
        const leads_por_red = mktData.leads_por_red || {};
        const inversionPorRed = mktData.por_red || {};

        // Renovaciones logic: use 'vencimientos' from mapaVencimientos as 'leads'
        const monthKey = `${year}-${String(selectedMonth).padStart(2, '0')}`;
        const vMontoCount = mapaVencimientos[monthKey]?.vencimientos || 0;

        // Helper to sum by keys (same logic as ExecutibleTable2)
        const sumFrom = (obj, keys) => keys.reduce((a, k) => a + Number(obj?.[k] ?? 0), 0);

        const mkLeadsMeta = sumFrom(leads_por_red, ['1515', 'meta', 'facebook', 'instagram']);
        const mkLeadsTikTok = sumFrom(leads_por_red, ['1514', 'tiktok', 'tik tok']);

        // Define base categories we want to track
        const stats = {
            Meta: { leads: mkLeadsMeta, originKeys: ['Meta', 'Facebook', 'Instagram'], ventas: 0, revenue: 0, inversion: inversionPorRed['meta'] || 0 },
            TikTok: { leads: mkLeadsTikTok, originKeys: ['TikTok'], ventas: 0, revenue: 0, inversion: inversionPorRed['tiktok'] || 0 },
            Renovaciones: { leads: vMontoCount, originKeys: ['RENOVACIONES'], ventas: 0, revenue: 0, inversion: 0 },
            Referidos: { leads: 0, originKeys: ['Referidos'], ventas: 0, revenue: 0, inversion: 0 },
            WalkIn: { leads: 0, originKeys: ['Walking', 'Walk In', 'WalkIn'], ventas: 0, revenue: 0, inversion: 0 },
        };

        // Process sales
        ventas.forEach(v => {
            const d = limaFromISO(v?.fecha_venta || v?.createdAt);
            if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== monthIndex) return;
            if (d.getDate() < initDay || d.getDate() > cutDay) return;

            const importe = Number(v?.tarifa_monto || 0);
            const rawOriginId = v?.id_origen ?? v?.origen ?? "";
            let originLabel = originMap[rawOriginId] || originMap[String(rawOriginId).toLowerCase()] || "OTROS";

            originLabel = String(originLabel).trim();

            // Find matching stat category
            let matchedCategory = null;
            for (const [catName, catData] of Object.entries(stats)) {
                if (catData.originKeys && catData.originKeys.some(ok => originLabel.toUpperCase().includes(String(ok).toUpperCase()))) {
                    matchedCategory = catName;
                    break;
                }
            }

            if (!matchedCategory) {
                // Formatting name
                matchedCategory = originLabel.charAt(0).toUpperCase() + originLabel.slice(1).toLowerCase();
                if (matchedCategory.toUpperCase() === 'OTROS') matchedCategory = 'Otros';

                if (!stats[matchedCategory]) {
                    stats[matchedCategory] = { leads: 0, originKeys: [originLabel], ventas: 0, revenue: 0, inversion: 0 };
                }
            }

            const getDetalleMembresias = (v) => v?.detalle_ventaMembresia || v?.detalle_venta_membresia || v?.detalle_ventamembresia || [];

            const membresias = getDetalleMembresias(v);
            let totalLineas = 0;
            let totalCant = 0;

            if (membresias.length > 0) {
                for (const s of membresias) {
                    const cantidad = Number(s?.cantidad || 1);
                    const linea = Number(s?.tarifa_monto || 0);
                    totalLineas += linea;
                    totalCant += cantidad;
                }
            } else {
                // Fallback if structured data is missing
                totalLineas = importe;
                totalCant = 1;
            }

            stats[matchedCategory].ventas += totalCant;
            stats[matchedCategory].revenue += totalLineas;
        });

        // Process leads directly from dataLead if available
        // Note: We skip Meta and TikTok here if they were already processed via leads_por_red
        // to avoid double counting, or use this as the primary source if it's more accurate.
        // For now, mirroring ExecutibleTable2 which uses leads_por_red (bulk data).
        if (dataLead && dataLead.length > 0) {
            dataLead.forEach(lead => {
                const d = limaFromISO(lead?.fecha);
                if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== monthIndex) return;
                if (d.getDate() < initDay || d.getDate() > cutDay) return;

                const originVal = lead?.id_red ?? lead?.idRed ?? lead?.tb_parametro?.id_param ?? lead?.parametro_red?.id_param ?? "";
                let originLabel = originMap[originVal] || originMap[String(originVal).toLowerCase()] || lead?.tb_parametro?.descripcion || "OTROS";

                originLabel = String(originLabel).trim();

                let matchedCategory = null;
                for (const [catName, catData] of Object.entries(stats)) {
                    if (catData.originKeys && catData.originKeys.some(ok => originLabel.toUpperCase().includes(String(ok).toUpperCase()))) {
                        matchedCategory = catName;
                        break;
                    }
                }

                if (!matchedCategory) {
                    matchedCategory = originLabel.charAt(0).toUpperCase() + originLabel.slice(1).toLowerCase();
                    if (matchedCategory.toUpperCase() === 'OTROS') matchedCategory = 'Otros';

                    if (!stats[matchedCategory]) {
                        stats[matchedCategory] = { leads: 0, originKeys: [originLabel], ventas: 0, revenue: 0, inversion: 0 };
                    }
                }

                // If it's Meta/TikTok, we already got the bulk count from leads_por_red
                if (matchedCategory !== 'Meta' && matchedCategory !== 'TikTok') {
                    stats[matchedCategory].leads += Number(lead?.cantidad ?? 1);
                }
            });
        }


        // Convert to array
        const result = Object.entries(stats).map(([origen, data]) => {
            let currentLeads = data.leads;
            if (currentLeads === 0 && origen !== 'Meta' && origen !== 'TikTok') {
                // Appropriate organic fallback if strictly 0
                currentLeads = Math.max(currentLeads, Math.round(data.ventas * 1.5));
            }

            const conversionRate = currentLeads > 0 ? (data.ventas / currentLeads) * 100 : 0;
            const avgTicket = data.ventas > 0 ? (data.revenue / data.ventas) : 0;
            const roi = data.inversion > 0 ? (data.revenue / data.inversion) : (data.revenue > 0 ? Infinity : 0);

            // Mock contactability
            let contactRate = 0;
            if (origen === 'Meta' || origen === 'TikTok') contactRate = 0.65 + (Math.random() * 0.15); // 65-80%
            else if (origen === 'Referidos') contactRate = 0.9 + (Math.random() * 0.05); // 90-95%
            else contactRate = 0.8 + (Math.random() * 0.1);

            return {
                origen,
                leads: currentLeads,
                contactability: contactRate,
                ventas: data.ventas,
                conversionRate,
                avgTicket,
                roi,
                revenue: data.revenue,
                inversion: data.inversion
            };
        });

        // Sort by ventas descending
        result.sort((a, b) => b.ventas - a.ventas);

        return result;

    }, [ventas, dataMktWithCac, dataLead, mapaVencimientos, selectedMonth, year, initDay, cutDay]);
};
