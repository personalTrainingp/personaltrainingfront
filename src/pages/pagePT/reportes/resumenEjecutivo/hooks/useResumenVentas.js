import { useState, useEffect, useMemo, useRef } from 'react';
import PTApi from '@/common/api/PTApi';
import config from '@/config';
import { useVentasStore } from '@/hooks/hookApi/useVentasStore';
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import { useReporteResumenComparativoStore } from "../../resumenComparativo/useReporteResumenComparativoStore";
import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore';
import { useProductosAgg } from '../../totalVentas/TarjetasProductos';
import {
    norm, parseBackendDate, isBetween,
    limaFromISO, MESES
} from './useResumenUtils';

import { globalCache, fetchParametrosRenovacionesCached } from '../../resumenCache';

// GLOBAL CACHE to prevent double-fetching in StrictMode or rapid remounts
/*
const globalCache = {
    rangeKey: null,
    promise: null,
    monkFitPromise: null,
    monkFitData: null
};
*/

export const useResumenVentas = (id_empresa, fechas) => {
    const { initDay, cutDay, selectedMonth, year, start, end, RANGE_DATE } = fechas;

    const { obtenerTablaVentas, dataVentas } = useVentasStore();
    const { obtenerVentasResumen, repoVentasPorSeparado } = useReporteStore();
    const { obtenerComparativoResumen, dataGroup } = useReporteResumenComparativoStore();

    // const { startObtenerTBProgramaPT, programas } = useProgramaTrainingStore(); // Removed to avoid duplicates
    const [programas, setProgramas] = useState([]);
    const [reservasMF, setReservasMF] = useState([]);
    const [historicalVentas, setHistoricalVentas] = useState([]);
    const [isLoadingVentas, setIsLoadingVentas] = useState(false);

    // Ref to track if THIS component instance has already requested this key
    const initiatedRef = useRef(null);

    // Helper to fetch but RETURN data (not set state directly)
    const fetchReservasMFInner = async () => {
        if (globalCache.monkFitPromise) return globalCache.monkFitPromise;

        globalCache.monkFitPromise = PTApi.get('/reserva_monk_fit/resumen', { params: { onlyActive: true } })
            .then(res => res.data?.rows || [])
            .catch(err => {
                console.error(err);
                globalCache.monkFitPromise = null; // Clear on error so retry is possible
                return [];
            });

        return globalCache.monkFitPromise;
    };

    const fetchProgramasInner = async () => {
        if (globalCache.programasPromise) return globalCache.programasPromise;

        globalCache.programasPromise = PTApi.get('/programaTraining/get_tb_pgm')
            .then(res => {
                const data = res.data || [];
                return data.sort((a, b) => {
                    const order = [2, 4, 3, 5];
                    return order.indexOf(a.id_pgm) - order.indexOf(b.id_pgm);
                });
            })
            .catch(err => {
                console.error(err);
                globalCache.programasPromise = null;
                return [];
            });

        return globalCache.programasPromise;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (isLoadingVentas) return;

            // Generate a primitive key for the current request
            const rangeKey = RANGE_DATE && RANGE_DATE[0] && RANGE_DATE[1]
                ? `${RANGE_DATE[0]}-${RANGE_DATE[1]}-${id_empresa || 598}-${year}-${selectedMonth}`
                : null;

            if (!rangeKey) return;

            console.log(`[useResumenVentas] Generated rangeKey: ${rangeKey}`);

            if (initiatedRef.current === rangeKey) return;
            initiatedRef.current = rangeKey;

            setIsLoadingVentas(true);

            try {
                const promiseVentas = obtenerVentasResumen(RANGE_DATE);
                const promiseComparativo = obtenerComparativoResumen(RANGE_DATE).catch(console.error);
                const promiseTabla = obtenerTablaVentas(id_empresa || 598, RANGE_DATE);

                const reservasPromise = fetchReservasMFInner();
                const extensionPromise = fetchProgramasInner();

                const histPromise = fetchParametrosRenovacionesCached({
                    empresa: id_empresa || 598,
                    year,
                    selectedMonth,
                    initDay,
                    cutDay
                });

                // Wait for all
                const [reservasMF, historicalVentas, programasData] = await Promise.all([
                    reservasPromise,
                    histPromise,
                    extensionPromise,
                    promiseVentas,
                    promiseComparativo,
                    promiseTabla
                ]);

                if (historicalVentas) setHistoricalVentas(historicalVentas);
                if (reservasMF) setReservasMF(reservasMF);
                if (programasData) setProgramas(programasData);

            } catch (error) {
                console.error("Error fetching data ventas:", error);
            } finally {
                setIsLoadingVentas(false);
            }
        };

        if (RANGE_DATE && RANGE_DATE[0] && RANGE_DATE[1]) {
            fetchData();
        }

    }, [id_empresa, year, selectedMonth, RANGE_DATE?.[0], RANGE_DATE?.[1]]);

    const progNameById = useMemo(() => ({ 2: "CHANGE 45", 3: "FS 45", 4: "FISIO MUSCLE", 5: "VERTIKAL CHANGE" }), []);

    const pgmNameByIdDynamic = useMemo(() => {
        const map = {};
        (Array.isArray(dataGroup) ? dataGroup : []).forEach(p => {
            const name = p?.name_pgm || p?.tb_programa_training?.name_pgm || p?.tb_programa?.name_pgm;
            if (p?.id_pgm && name) map[p.id_pgm] = name;
        });
        return map;
    }, [dataGroup]);

    const mesesSeleccionados = useMemo(() => {
        // Return all 12 months for the selected year for CAC/LTV calculations
        return Array.from({ length: 12 }, (_, i) => ({
            label: `${MESES[i].toUpperCase()} ${year}`,
            anio: String(year),
            mes: MESES[i],
            mIdx: i
        }));
    }, [year]);

    const mesesTop4 = useMemo(() => {
        const buildMonthRevenueMap = (ventas) => {
            const map = new Map();
            for (const v of ventas || []) {
                const d = limaFromISO(v?.fecha_venta || v?.fecha || v?.createdAt);
                if (!d || d.getDate() < initDay || d.getDate() > cutDay) continue;
                const key = `${d.getFullYear()}-${d.getMonth()}`;
                if (!map.has(key)) map.set(key, { year: d.getFullYear(), mIdx: d.getMonth(), total: 0 });
                (Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : []).forEach(s => map.get(key).total += Number(s?.tarifa_monto || 0));
            }
            return map;
        };
        const monthMap = buildMonthRevenueMap(dataVentas || []);
        const slots = [];
        let mIdx = selectedMonth - 1, y = year;
        for (let i = 0; i < 12; i++) {
            slots.push({ y, mIdx });
            mIdx--;
            if (mIdx < 0) { mIdx = 11; y--; }
        }
        const baseKey = `${year}-${selectedMonth - 1}`;
        const scored = slots.filter(p => `${p.y}-${p.mIdx}` !== baseKey)
            .map(p => ({ ...p, score: monthMap.get(`${p.y}-${p.mIdx}`)?.total || 0 }))
            .sort((a, b) => b.score - a.score).slice(0, 3);

        const toFechaObj = ({ y, mIdx }) => ({ label: `${MESES[mIdx].toUpperCase()} ${y}`, anio: String(y), mes: MESES[mIdx] });
        return [...scored.sort((a, b) => new Date(a.y, a.mIdx) - new Date(b.y, b.mIdx)).map(toFechaObj), toFechaObj({ y: year, mIdx: selectedMonth - 1 })];
    }, [dataVentas, initDay, cutDay, selectedMonth, year]);

    const advisorOriginByProg = useMemo(() => {
        const outSets = {};
        const ventas = Array.isArray(dataVentas) ? dataVentas : [];
        const EXCLUDED_IDS = [3562];

        for (const v of ventas) {
            if (EXCLUDED_IDS.includes(v?.id_empl)) continue;

            const d = limaFromISO(v?.fecha_venta || v?.createdAt);
            if (!d) continue;
            if (d.getFullYear() !== Number(year)) continue;
            if (d.getMonth() !== (selectedMonth - 1)) continue;
            const dia = d.getDate();
            if (dia < Number(initDay) || dia > Number(cutDay)) continue;

            const nombreFull = v?.tb_ventum?.tb_empleado?.nombres_apellidos ||
                v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl ||
                v?.tb_empleado?.nombres_apellidos_empl ||
                v?.empleado || "";
            const asesor = (nombreFull.split(" ")[0] || "").toUpperCase();
            if (!asesor) continue;

            const details = Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : (Array.isArray(v?.detalle_venta_membresia) ? v.detalle_venta_membresia : []);

            if (details.length > 0) {
                details.forEach(item => {
                    const pgmId = item?.id_pgm;
                    const pgmName = pgmNameByIdDynamic[pgmId] || item?.tb_programa_training?.name_pgm;
                    const progKey = (progNameById[pgmId] || pgmName || "").trim().toUpperCase();
                    if (!progKey) return;

                    if (!outSets[progKey]) outSets[progKey] = {};
                    if (!outSets[progKey][asesor]) outSets[progKey][asesor] = { nuevos: 0, renovaciones: 0, reinscripciones: 0, o: 0 };

                    const monto = Number(item?.tarifa_monto || 0);
                    const o = v?.id_origen;

                    if (monto === 0) {
                        outSets[progKey][asesor].o++;
                    } else {
                        if (o === 691) outSets[progKey][asesor].renovaciones++;
                        else if (o === 692 || o === 696) outSets[progKey][asesor].reinscripciones++;
                        else outSets[progKey][asesor].nuevos++;
                    }
                });
            }
        }
        return outSets;
    }, [dataVentas, year, selectedMonth, initDay, cutDay, progNameById, pgmNameByIdDynamic]);

    const originBreakdown = useMemo(() => {
        const out = {};
        const ventas = Array.isArray(dataVentas) ? dataVentas : [];
        ventas.forEach(v => {
            const d = limaFromISO(v?.fecha_venta || v?.createdAt);
            if (!isBetween(d, start, end)) return;

            (Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : []).forEach(item => {
                if (Number(item?.tarifa_monto) === 0) return;
                const pName = pgmNameByIdDynamic[item.id_pgm] || progNameById[item.id_pgm];
                const key = (pName || "").trim().toUpperCase();
                if (!key) return;
                if (!out[key]) out[key] = { nuevos: 0, renovaciones: 0, reinscripciones: 0 };

                const o = v.id_origen;
                if (o === 691) out[key].renovaciones++;
                else if (o === 692 || o === 696) out[key].reinscripciones++;
                else out[key].nuevos++;
            });
        });
        return out;
    }, [dataVentas, start, end, progNameById, pgmNameByIdDynamic]);

    const rankingData = useMemo(() => {
        return (repoVentasPorSeparado.total?.empl_monto || []).filter(i => i.monto > 0).map(i => {
            let socios = typeof i.socios === "number" ? i.socios : (Array.isArray(i.items) ? new Set(i.items.map(it => it?.id_cli ?? it?.tb_venta?.id_cli)).size : 0);
            const sesiones = Array.isArray(i.items) ? i.items.reduce((acc, it) => acc + (it?.tb_semana_training?.sesiones ?? 0), 0) : (i.sesiones || 0);
            return { ...i, nombre: i.tb_empleado?.nombres_apellidos_empl || i.nombre || "SIN NOMBRE", socios, sesiones };
        }).sort((a, b) => b.monto - a.monto);
    }, [repoVentasPorSeparado]);

    const { resumenFilas, resumenTotales } = useMemo(() => {
        if (!rankingData.length) return { resumenFilas: [], resumenTotales: [] };
        const sumMonto = rankingData.reduce((a, r) => a + (r.monto || 0), 0);
        const sumSoc = rankingData.reduce((a, r) => a + (r.socios || 0), 0);
        const sumSes = rankingData.reduce((a, r) => a + (r.sesiones || 0), 0);

        const filas = rankingData.map(r => [
            { header: "ASESORES", value: r.nombre.split(" ")[0], isPropiedad: true },
            { header: "S/. VENTA TOTAL", value: r.monto?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) },
            { header: "SOCIOS", value: r.socios },
            { header: "% VENTA TOTAL", value: sumMonto ? ((r.monto / sumMonto) * 100).toFixed(2) + " %" : "0 %" },
            { header: "% SOCIOS", value: sumSoc ? ((r.socios / sumSoc) * 100).toFixed(2) + " %" : "0 %" },
            { header: "S/. TICKET MEDIO", value: r.socios ? (r.monto / r.socios).toFixed(2) : "0.00" },
            { header: "S/. PRECIO POR SESION", value: r.sesiones ? (r.monto / r.sesiones).toFixed(2) : "0.00" },
        ]);
        const totales = [
            { header: "ASESORES", value: "TOTAL" }, { header: "S/. VENTA TOTAL", value: sumMonto.toLocaleString("es-PE", { minimumFractionDigits: 2 }) },
            { header: "SOCIOS", value: sumSoc }, { header: "% VENTA TOTAL", value: "100 %" }, { header: "% SOCIOS", value: "100 %" },
            { header: "S/. TICKET MEDIO", value: sumSoc ? (sumMonto / sumSoc).toFixed(2) : "0.00" }, { header: "S/. PRECIO POR SESION", value: sumSes ? (sumMonto / sumSes).toFixed(2) : "0.00" }
        ];
        return { resumenFilas: filas, resumenTotales: totales };
    }, [rankingData]);

    const sociosOverride = useMemo(() => {
        try {
            const res = {};
            const ventas = Array.isArray(dataVentas) ? dataVentas : [];
            const EXCLUDED_IDS = [3562];

            for (const v of ventas) {
                if (EXCLUDED_IDS.includes(v?.id_empl)) continue;

                const d = limaFromISO(v?.fecha_venta || v?.createdAt);
                if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== (selectedMonth - 1)) continue;
                if (d.getDate() < Number(initDay) || d.getDate() > Number(cutDay)) continue;

                (Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : []).forEach(vDet => {
                    if (Number(vDet?.tarifa_monto) === 0) return;
                    const pName = pgmNameByIdDynamic[vDet.id_pgm] || progNameById[vDet.id_pgm];
                    const progKey = (pName || "").trim().toUpperCase();
                    if (!progKey) return;

                    if (!res[progKey]) res[progKey] = {};
                    const nombreFull = v?.tb_ventum?.tb_empleado?.nombres_apellidos || v?.tb_empleado?.nombres_apellidos_empl || "";
                    const asesor = (nombreFull.split(" ")[0] || "").toUpperCase();

                    if (asesor) {
                        if (!res[progKey][asesor]) res[progKey][asesor] = new Set();
                        res[progKey][asesor].add(v.id);
                    }
                });
            }
            Object.keys(res).forEach(pk => {
                Object.keys(res[pk]).forEach(asesor => res[pk][asesor] = res[pk][asesor].size);
            });
            return res;
        } catch { return {}; }
    }, [dataVentas, year, selectedMonth, initDay, cutDay, progNameById, pgmNameByIdDynamic]);

    const totalUniqueTicketsByAdvisor = useMemo(() => {
        const counts = {};
        const ventas = Array.isArray(dataVentas) ? dataVentas : [];
        const EXCLUDED_IDS = [3562];
        const mIdx = selectedMonth - 1;

        for (const v of ventas) {
            if (EXCLUDED_IDS.includes(v?.id_empl)) continue;
            const d = limaFromISO(v?.fecha_venta || v?.createdAt);
            if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== mIdx) continue;
            const dia = d.getDate();
            if (dia < Number(initDay) || dia > Number(cutDay)) continue;

            const nombreFull = v?.tb_ventum?.tb_empleado?.nombres_apellidos || v?.tb_empleado?.nombres_apellidos_empl || v?.tb_empleado?.nombres_apellidos || "";
            const asesor = (nombreFull.split(" ")[0] || "").trim().toUpperCase();

            const hasMembershipItem = (Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : []).some(
                it => (Number(it?.tarifa_monto) > 0 || Number(it?.monto) > 0)
                    && (pgmNameByIdDynamic[it.id_pgm] || progNameById[it.id_pgm])
            );
            const hasZeroAmountProgram = (Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : []).some(it => {
                const p = (pgmNameByIdDynamic[it.id_pgm] || progNameById[it.id_pgm]);
                return p && Number(it?.tarifa_monto) === 0;
            });

            if (asesor && (hasMembershipItem || hasZeroAmountProgram)) {
                if (!counts[asesor]) counts[asesor] = new Set();
                counts[asesor].add(v.id);
            }
        }

        const finalMap = {};
        Object.keys(counts).forEach(k => finalMap[k] = counts[k].size);
        return finalMap;
    }, [dataVentas, year, selectedMonth, initDay, cutDay, progNameById, pgmNameByIdDynamic]);


    const avatarByAdvisor = useMemo(() => {
        const map = {};

        // 1. Try to get avatars from the full dataVentas detail
        const ventas = Array.isArray(dataVentas) ? dataVentas : [];
        ventas.forEach(v => {
            const emp = v?.tb_ventum?.tb_empleado || v?.tb_empleado || v?.empleado;
            if (!emp) return;
            const nombreFull = emp?.nombres_apellidos || emp?.nombres_apellidos_empl || emp?.nombre_empl || "";
            const key = norm((nombreFull.split(" ")[0] || "").trim());
            const tbImages = emp?.tb_images || [];
            const lastImage = tbImages[tbImages.length - 1]?.name_image || "";
            const raw = emp?.avatar || lastImage || emp?.image || "";
            if (key && raw && !map[key]) {
                map[key] = /^https?:\/\//i.test(raw) ? raw : `${config.API_IMG.AVATAR_EMPL}${raw}`;
            }
        });

        // 2. Fallback to repoVentasPorSeparado
        (repoVentasPorSeparado?.total?.empl_monto || []).forEach(it => {
            const key = norm(((it?.empl || it?.tb_empleado?.nombres_apellidos_empl || "").split(" ")[0] || "").trim());
            const emp = it?.tb_empleado;
            const tbImages = emp?.tb_images || [];
            const lastImage = tbImages[tbImages.length - 1]?.name_image || "";
            const raw = it?.avatar || emp?.avatar || lastImage || emp?.image || "";
            if (key && raw && !map[key]) {
                map[key] = /^https?:\/\//i.test(raw) ? raw : `${config.API_IMG.AVATAR_EMPL}${raw}`;
            }
        });
        return map;
    }, [dataVentas, repoVentasPorSeparado]);

    const productosPorAsesor = useProductosAgg(dataVentas, RANGE_DATE, { minImporte: 0 });

    return {
        dataVentas, reservasMF, programas,
        rankingData, resumenFilas, resumenTotales,
        advisorOriginByProg, originBreakdown, sociosOverride,
        avatarByAdvisor, productosPorAsesor,
        mesesSeleccionados, mesesTop4, pgmNameById: progNameById, pgmNameByIdDynamic, dataGroup,
        totalUniqueTicketsByAdvisor, isLoadingVentas, historicalVentas // <--- EXPORTADO
    };
};