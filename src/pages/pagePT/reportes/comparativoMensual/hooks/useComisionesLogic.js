import { useState, useMemo, useEffect } from 'react';
import { getQuotaForMonth } from '../utils/quotaUtils';

const ADVISORS = ['ALVARO', 'ALEJANDRO'];

export const useComisionesLogic = (ventas, year, month, initDay = 1, cutDay = 31) => {
    const initialQuota = useMemo(() => getQuotaForMonth(Number(month) - 1, year), [year, month]);
    const [cuotaSugerida, setCuotaSugerida] = useState(initialQuota);
    const [openPayParam, setOpenPayParam] = useState(4.5);

    useEffect(() => {
        setCuotaSugerida(getQuotaForMonth(Number(month) - 1, year));
    }, [year, month]);

    // ESCALAS UNIFICADAS (Estado único para todas las tablas)
    const [scales, setScales] = useState([
        { scale: 0, pct: 0, com: 2.00 },
        { scale: 1, pct: 86, com: 1.10 },
        { scale: 2, pct: 90, com: 1.25 },
        { scale: 3, pct: 95, com: 1.40 },
        { scale: 4, pct: 100, com: 2.00 },
        { scale: 5, pct: 105, com: 2.50 },
        { scale: 6, pct: 110, com: 3.00 },
    ]);

    // --- FUNCIÓN ÚNICA DE CÁLCULO FINANCIERO ---
    const calculateRow = (ventaTotal, pctComision) => {
        const base = ventaTotal / 1.18;
        const igv = ventaTotal - base;
        const renta = base * 0.03;
        // IMPORTANTE: OpenPay se calcula sobre Venta Total según imagen (5,130 es 4.5% de 114,000)
        const openPay = ventaTotal * (openPayParam / 100);
        const ventasNetas = base - renta - openPay;
        const importeComision = ventasNetas * (pctComision / 100);

        return {
            venta: ventaTotal,
            igv,
            base,
            renta,
            openPay,
            ventasNetas,
            importeComision,
            totalComision: importeComision
        };
    };

    // Funciones de control de escalas
    const addScaleRow = () => {
        setScales(prev => {
            const last = prev[prev.length - 1];
            return [...prev, { scale: last.scale + 1, pct: last.pct + 5, com: last.com + 0.5 }];
        });
    };

    const updateScaleCommission = (index, val) => {
        const newScales = [...scales];
        if (newScales[index]) {
            newScales[index].com = parseFloat(val) || 0;
            setScales(newScales);
        }
    };

    // 1. TABLA DE REFERENCIA (SUPERIOR) - Filtra >= 95%
    const refRows = useMemo(() => {
        const cuotaInd = cuotaSugerida / 2;
        return scales.map((s, idx) => {
            const ventaTarget = cuotaInd * (s.pct / 100);
            return { ...s, index: idx, data: calculateRow(ventaTarget, s.com) }; // Pass index for editing
        });
    }, [cuotaSugerida, openPayParam, scales]);

    const norm = (s) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    const limaFromISO = (iso) => {
        if (!iso) return null;
        const s = String(iso).replace(" ", "T").replace(" -", "-");
        const d = new Date(s);
        if (Number.isNaN(d.getTime())) return null;
        const utc = d.getTime() + d.getTimezoneOffset() * 60000;
        return new Date(utc - 5 * 60 * 60000);
    };

    const getItemsMembresia = (v) => (v?.detalle_ventaMembresia || v?.detalle_ventaMembresium || []);

    const getImporteCorrecto = (v) => {
        if (Number(v?.tarifa_monto) > 0) return Number(v.tarifa_monto);
        const items = getItemsMembresia(v);
        if (items.length > 0) {
            return items.reduce((acc, item) => acc + Number(item.tarifa_monto || 0), 0);
        }
        return Number(v?.monto_total || v?.tb_ventum?.monto_total || v?.monto || 0);
    };

    // 2. DATOS POR VENDEDOR
    const commissionData = useMemo(() => {
        const cuotaInd = cuotaSugerida / 2;
        const metaQuincena = cuotaInd * 0.40;

        return ADVISORS.map(adv => {
            // A. FILTRAR VENTAS REALES
            const advSales = ventas ? ventas.filter(v => {
                const nombreFull = v?.tb_ventum?.tb_empleado?.nombres_apellidos ||
                    v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl ||
                    v?.tb_empleado?.nombres_apellidos_empl ||
                    v?.empleado || v?.usu_venta_nombre || "";
                const name = norm(nombreFull);
                const d = limaFromISO(v.fecha_venta || v.fecha || v.createdAt);

                if (!d) return false;

                const sameMonthYear = (d.getMonth() + 1) === Number(month) && d.getFullYear() === Number(year);
                const withinDays = d.getDate() >= Number(initDay) && d.getDate() <= Number(cutDay);

                return name.includes(adv) && sameMonthYear && withinDays;
            }) : [];

            const ventaRealTotal = advSales.reduce((sum, v) => sum + getImporteCorrecto(v), 0);

            // B. SITUACIÓN ACTUAL (REAL)
            const alcanceReal = cuotaInd > 0 ? (ventaRealTotal / cuotaInd) * 100 : 0;
            const matchedScale = [...scales]
                .map((s, idx) => ({ ...s, originalIndex: idx }))
                .reverse()
                .find(s => alcanceReal >= s.pct) || { scale: '-', com: 0, originalIndex: -1 };

            const realData = {
                ...matchedScale,
                index: matchedScale.originalIndex,
                alcance: alcanceReal,
                ...calculateRow(ventaRealTotal, matchedScale.com)
            };

            // C. TABLA PROYECCIONES MENSUAL (Usa scales state)
            const projections = scales.map((step, idx) => {
                const ventaSim = cuotaInd * (step.pct / 100);
                return {
                    ...step,
                    index: idx, // Important for editing
                    ...calculateRow(ventaSim, step.com)
                };
            }).filter(p => p.pct > 0);

            // D. TABLA QUINCENA (100% = Scale 4, 110% = Scale 6)
            // Indices in unified scales: Scale 4 => index 4, Scale 6 => index 6
            const quincenaSteps = [
                { pctMeta: 100, label: '100%', scaleIndex: 4, scaleLabel: '4' },
                { pctMeta: 110, label: '110%', scaleIndex: 6, scaleLabel: '6' }
            ];

            const quincenaData = quincenaSteps.map(step => {
                const ventaQ = metaQuincena * (step.pctMeta / 100);
                const currentScale = scales[step.scaleIndex]; // Get current state
                return {
                    scale: step.scaleLabel,
                    alcance: step.label,
                    pct: step.pctMeta,
                    com: currentScale ? currentScale.com : 0, // Use global state
                    index: step.scaleIndex, // For editing
                    ...calculateRow(ventaQ, currentScale ? currentScale.com : 0)
                };
            });

            return { advisor: adv, realData, projections, quincenaData };
        });
    }, [ventas, year, month, initDay, cutDay, cuotaSugerida, openPayParam, scales]);

    return {
        cuotaSugerida, setCuotaSugerida, openPayParam,
        refRows, commissionData, addScaleRow, updateScaleCommission
    };
};