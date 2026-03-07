import { useState, useMemo, useEffect } from 'react';
import { getQuotaForMonth } from '../utils/quotaUtils';
import { limaFromISO } from '../../resumenEjecutivo/hooks/useResumenUtils';

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
        const cuotaTotal = cuotaSugerida;
        return scales.map((s, idx) => {
            const ventaTarget = cuotaTotal * (s.pct / 100);
            return { ...s, index: idx, data: calculateRow(ventaTarget, s.com) }; // Pass index for editing
        });
    }, [cuotaSugerida, openPayParam, scales]);

    const norm = (s) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    const getItemsMembresia = (v) => (v?.detalle_ventaMembresia || v?.detalle_ventaMembresium || []);

    const getImporteCorrecto = (v) => {
        if (Number(v?.tarifa_monto) > 0) return Number(v.tarifa_monto);
        const items = getItemsMembresia(v);
        if (items.length > 0) {
            return items.reduce((acc, item) => acc + Number(item.tarifa_monto || 0), 0);
        }
        return Number(v?.monto_total || v?.tb_ventum?.monto_total || v?.monto || 0);
    };

    const [renovacionConfig, setRenovacionConfig] = useState([
        { id: 'quincena', label: 'HASTA 15', meta: 20000, comision: 500, minDay: 1, maxDay: 15 },
        { id: 'finMes', label: 'FIN DE MES', meta: 30000, comision: 600, minDay: 16, maxDay: 31 }
    ]);

    const updateRenovacionConfig = (index, field, val) => {
        const newConfig = [...renovacionConfig];
        newConfig[index][field] = parseFloat(val) || 0;
        setRenovacionConfig(newConfig);
    };

    const [totalMetaConfig, setTotalMetaConfig] = useState([
        { id: 'totalMeta', label: 'META TOTAL', meta: 50000, comision: 600 }
    ]);

    const updateTotalMetaConfig = (index, field, val) => {
        const newConfig = [...totalMetaConfig];
        newConfig[index][field] = parseFloat(val) || 0;
        setTotalMetaConfig(newConfig);
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

            // D. TABLA RENOVACIONES
            const renovacionesData = renovacionConfig.map((conf, idx) => {
                const advSalesRenov = ventas ? ventas.filter(v => {
                    const nombreFull = v?.tb_ventum?.tb_empleado?.nombres_apellidos ||
                        v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl ||
                        v?.tb_empleado?.nombres_apellidos_empl ||
                        v?.empleado || v?.usu_venta_nombre || "";
                    const name = norm(nombreFull);
                    const d = limaFromISO(v.fecha_venta || v.fecha || v.createdAt);

                    if (!d) return false;

                    const sameMonthYear = (d.getMonth() + 1) === Number(month) && d.getFullYear() === Number(year);
                    const isRenovacion = Number(v.id_origen) === 691;

                    // Aseguramos que solo conte del conf.minDay al conf.maxDay
                    const diaDeVenta = d.getDate();

                    const isFinMes = conf.id === 'finMes' || idx === 1;
                    const activeMinDay = conf.minDay !== undefined ? conf.minDay : (isFinMes ? 16 : 1);
                    const activeMaxDay = conf.maxDay !== undefined ? conf.maxDay : (isFinMes ? 31 : 15);

                    const evalMinDay = Math.max(Number(initDay), activeMinDay);
                    const evalMaxDay = Math.min(Number(cutDay), activeMaxDay);

                    const withinSpecificDays = diaDeVenta >= evalMinDay && diaDeVenta <= evalMaxDay;

                    return name.includes(adv) && sameMonthYear && withinSpecificDays && isRenovacion;
                }) : [];

                const logrado = advSalesRenov.reduce((sum, v) => sum + getImporteCorrecto(v), 0);

                return {
                    label: conf.label,
                    meta: conf.meta,
                    logrado: logrado,
                    comision: conf.comision,
                    index: idx
                };
            });

            // E. TABLA META TOTAL (todas las ventas)
            const totalMetaData = totalMetaConfig.map((conf, idx) => {
                const logrado = ventaRealTotal; // Venta Bruta / Cuota alcanzada
                return {
                    label: conf.label,
                    meta: conf.meta,
                    logrado: logrado,
                    comision: conf.comision,
                    index: idx
                };
            });

            return { advisor: adv, realData, projections, renovacionesData, totalMetaData };
        });
    }, [ventas, year, month, initDay, cutDay, cuotaSugerida, openPayParam, scales, renovacionConfig, totalMetaConfig]);

    // F. DATOS GLOBALES CONJUNTOS (Renovaciones y Meta Total sumandos)
    const globalRenovacionesData = useMemo(() => {
        return renovacionConfig.map((conf, idx) => {
            const logradoGlobal = commissionData.reduce((sum, adv) => sum + adv.renovacionesData[idx].logrado, 0);
            return {
                label: conf.label,
                meta: conf.meta,
                logrado: logradoGlobal,
                comision: conf.comision,
                index: idx
            };
        });
    }, [renovacionConfig, commissionData]);

    const globalTotalMetaData = useMemo(() => {
        return totalMetaConfig.map((conf, idx) => {
            const logradoGlobal = commissionData.reduce((sum, adv) => sum + adv.totalMetaData[idx].logrado, 0);
            return {
                label: conf.label,
                meta: conf.meta,
                logrado: logradoGlobal,
                comision: conf.comision,
                index: idx
            };
        });
    }, [totalMetaConfig, commissionData]);

    return {
        cuotaSugerida, setCuotaSugerida, openPayParam,
        refRows, commissionData, addScaleRow, updateScaleCommission,
        renovacionConfig, updateRenovacionConfig,
        totalMetaConfig, updateTotalMetaConfig,
        globalRenovacionesData, globalTotalMetaData
    };
};