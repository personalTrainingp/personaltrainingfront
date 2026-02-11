import { useState, useMemo } from 'react';

const ADVISORS = ['ALVARO', 'ALEJANDRO'];

export const useComisionesLogic = (ventas, year, month) => {
    const [cuotaSugerida, setCuotaSugerida] = useState(100000);
    const [openPayParam, setOpenPayParam] = useState(4.5);

    // ESCALAS DE REFERENCIA (TABLA SUPERIOR)
    const [scales, setScales] = useState([
        { scale: 1, pct: 95, com: 1.40 },
        { scale: 2, pct: 100, com: 2.00 },
        { scale: 3, pct: 105, com: 2.50 },
        { scale: 4, pct: 110, com: 3.00 },
    ]);

    // ESCALAS PARA PROYECCIÓN MENSUAL (TABLA INFERIOR 1)
    const PROJECTION_STEPS = [
        { scale: 1, pct: 86, com: 1.10 },
        { scale: 2, pct: 90, com: 1.25 },
        { scale: 3, pct: 95, com: 1.40 },
        { scale: 4, pct: 100, com: 2.00 },
        { scale: 5, pct: 105, com: 2.50 },
        { scale: 6, pct: 110, com: 3.00 },
    ];

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
        newScales[index].com = parseFloat(val) || 0;
        setScales(newScales);
    };

    // 1. TABLA DE REFERENCIA (SUPERIOR)
    const refRows = useMemo(() => {
        const cuotaInd = cuotaSugerida / 2; // Referencia sobre cuota individual
        return scales.map(s => {
            const ventaTarget = cuotaInd * (s.pct / 100); // 95% de 60k
            return { ...s, data: calculateRow(ventaTarget, s.com) };
        });
    }, [cuotaSugerida, openPayParam, scales]);

    // 2. DATOS POR VENDEDOR
    const commissionData = useMemo(() => {
        const cuotaInd = cuotaSugerida / 2; // 60,000
        const metaQuincena = cuotaInd * 0.40; // 24,000 (40%)

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

            // C. TABLA PROYECCIONES MENSUAL (6 FILAS)
            const projections = PROJECTION_STEPS.map(step => {
                const ventaSim = cuotaInd * (step.pct / 100);
                return {
                    ...step,
                    ...calculateRow(ventaSim, step.com)
                };
            });

            // D. TABLA QUINCENA (NUEVA - 2 FILAS: 100% y 110% de la meta quincenal)
            // Según imagen, 100% de la meta quincenal paga 2.50% (Scale 5 aprox) o 2.00%
            // Usaremos la lógica de escalas:
            // 100% cumplimiento quincena -> Venta = 24,000. 
            // 110% cumplimiento quincena -> Venta = 26,400.
            const quincenaSteps = [
                { pctMeta: 100, label: '100%', com: 2.00, scaleLabel: '4' }, // Asumiendo Escala 4
                { pctMeta: 110, label: '110%', com: 3.00, scaleLabel: '5' }  // Asumiendo Escala 5
            ];

            const quincenaData = quincenaSteps.map(step => {
                const ventaQ = metaQuincena * (step.pctMeta / 100);
                return {
                    scale: step.scaleLabel,
                    alcance: step.label, // "100%"
                    pct: step.pctMeta,   // numérico
                    com: step.com,
                    ...calculateRow(ventaQ, step.com)
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