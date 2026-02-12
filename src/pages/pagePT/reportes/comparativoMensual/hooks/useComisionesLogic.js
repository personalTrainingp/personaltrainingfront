import { useState, useMemo } from 'react';

const ADVISORS = ['ALVARO', 'ALEJANDRO'];

export const useComisionesLogic = (ventas, year, month) => {
    const [cuotaSugerida, setCuotaSugerida] = useState(100000);
    const [openPayParam, setOpenPayParam] = useState(4.5);

    // ESCALAS UNIFICADAS (Estado único para todas las tablas)
    const [scales, setScales] = useState([
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

    // 2. DATOS POR VENDEDOR
    const commissionData = useMemo(() => {
        const cuotaInd = cuotaSugerida / 2;
        const metaQuincena = cuotaInd * 0.40;

        return ADVISORS.map(adv => {
            // A. FILTRAR VENTAS REALES
            const advSales = ventas ? ventas.filter(v => {
                const name = (v.tb_empleado?.nombres_apellidos_empl || v.usu_venta_nombre || '').toUpperCase();
                const d = new Date(v.fecha_venta || v.fecha || v.createdAt);
                return name.includes(adv) && (d.getMonth() + 1) === Number(month) && d.getFullYear() === Number(year);
            }) : [];

            const ventaRealTotal = advSales.reduce((sum, v) => sum + (v.detalle_ventaMembresia || []).reduce((s, d) => s + Number(d.tarifa_monto || 0), 0), 0);

            // B. SITUACIÓN ACTUAL (REAL)
            const alcanceReal = cuotaInd > 0 ? (ventaRealTotal / cuotaInd) * 100 : 0;
            const scaleReal = [...scales].reverse().find(s => alcanceReal >= s.pct) || { scale: '-', com: 0 };
            const realData = {
                ...scaleReal,
                alcance: alcanceReal,
                ...calculateRow(ventaRealTotal, scaleReal.com)
            };

            // C. TABLA PROYECCIONES MENSUAL (Usa scales state)
            const projections = scales.map((step, idx) => {
                const ventaSim = cuotaInd * (step.pct / 100);
                return {
                    ...step,
                    index: idx, // Important for editing
                    ...calculateRow(ventaSim, step.com)
                };
            });

            // D. TABLA QUINCENA (100% = Scale 4, 110% = Scale 6)
            // Indices in unified scales: Scale 4 => index 3, Scale 6 => index 5
            const quincenaSteps = [
                { pctMeta: 100, label: '100%', scaleIndex: 3, scaleLabel: '4' },
                { pctMeta: 110, label: '110%', scaleIndex: 5, scaleLabel: '6' }
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
    }, [ventas, year, month, cuotaSugerida, openPayParam, scales]);

    return {
        cuotaSugerida, setCuotaSugerida, openPayParam,
        refRows, commissionData, addScaleRow, updateScaleCommission
    };
};