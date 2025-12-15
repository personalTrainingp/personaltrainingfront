import { useState, useEffect, useMemo } from 'react';
import PTApi from '@/common/api/PTApi';
import config from '@/config';
import { useVentasStore } from '@/hooks/hookApi/useVentasStore';
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import { useReporteResumenComparativoStore } from "../../resumenComparativo/useReporteResumenComparativoStore";
import { useProductosAgg } from '../../totalVentas/TarjetasProductos';
import {
    norm, agruparPorVenta, parseBackendDate, isBetween,
    limaFromISO, MESES
} from './useResumenUtils';

export const useResumenVentas = (id_empresa, fechas) => {
    const { initDay, cutDay, selectedMonth, year, start, end, RANGE_DATE } = fechas;

    const { obtenerTablaVentas, dataVentas } = useVentasStore();
    const { obtenerVentas, repoVentasPorSeparado } = useReporteStore();
    const { obtenerComparativoResumen, dataGroup } = useReporteResumenComparativoStore();

    const [programas, setProgramas] = useState([]);
    const [reservasMF, setReservasMF] = useState([]);

    useEffect(() => {
        if (RANGE_DATE && RANGE_DATE[0] && RANGE_DATE[1]) {
            obtenerVentas(RANGE_DATE);
            obtenerComparativoResumen(RANGE_DATE).catch(console.error);
        }
        obtenerTablaVentas(id_empresa || 598);
        obtenerProgramas();
        obtenerReservasMF();
    }, [id_empresa, RANGE_DATE]);

    const obtenerProgramas = async () => {
        try { const { data } = await PTApi.get('/programaTraining/get_tb_pgm'); setProgramas(data || []); }
        catch (err) { console.error(err); }
    };
    const obtenerReservasMF = async () => {
        try { const { data } = await PTApi.get('/reserva_monk_fit', { params: { limit: 2000, onlyActive: true } }); setReservasMF(data?.rows || []); }
        catch (err) { console.error(err); }
    };

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
        const buildMonthRevenueMap = (ventas) => {
            const map = new Map();
            for (const v of ventas || []) {
                const d = limaFromISO(v?.fecha_venta || v?.createdAt);
                if (!d || d.getDate() < initDay || d.getDate() > cutDay) continue;
                const key = `${d.getFullYear()}-${d.getMonth()}`;
                if (!map.has(key)) map.set(key, { year: d.getFullYear(), mIdx: d.getMonth(), total: 0 });
                (v?.detalle_ventaMembresia || []).forEach(s => map.get(key).total += Number(s?.tarifa_monto || 0));
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
        const src = Array.isArray(dataGroup) ? dataGroup : [];
        for (const pgm of src) {
            const progKey = (progNameById[pgm?.id_pgm] || pgm?.name_pgm || "").trim().toUpperCase();
            if (!progKey) continue;
            if (!outSets[progKey]) outSets[progKey] = {};

            const process = (list, cb) => list.forEach(v => {
                const nombreFull = v?.tb_ventum?.tb_empleado?.nombre_empl || v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl || v?.tb_ventum?.tb_empleado?.nombres_apellidos || "";
                const asesor = (nombreFull.split(" ")[0] || "").toUpperCase();
                if (!asesor) return;
                if (!outSets[progKey][asesor]) outSets[progKey][asesor] = { nuevos: [], renovaciones: [], reinscripciones: [], canjes: [], transferencias: [], traspasos: [] };
                cb(outSets[progKey][asesor], v);
            });

            const allItems = pgm?.detalle_ventaMembresium || [];
            const unicas = agruparPorVenta(allItems);

            process(unicas.filter(f => Number(f?.tarifa_monto) !== 0), (b, v) => {
                const o = v?.tb_ventum?.id_origen;
                if (o === 691) b.renovaciones.push(v);
                else if (o === 692 || o === 696) b.reinscripciones.push(v);
                else b.nuevos.push(v);
            });
            process(unicas.filter(f => Number(f?.tarifa_monto) === 0), (b, v) => {
                const tf = v?.tb_ventum?.id_tipoFactura;
                if (tf === 701) b.traspasos.push(v); else if (tf === 703) b.canjes.push(v);
            });
            process(pgm?.ventas_transferencias || [], (b, v) => b.transferencias.push(v));
        }

        const outCounts = {};
        Object.entries(outSets).forEach(([pk, asesores]) => {
            outCounts[pk] = {};
            Object.entries(asesores).forEach(([asesor, t]) => {
                outCounts[pk][asesor] = {
                    nuevos: t.nuevos.length, renovaciones: t.renovaciones.length,
                    reinscripciones: t.reinscripciones.length, o: t.canjes.length + t.transferencias.length,
                    canjes: t.canjes.length, transferencias: t.transferencias.length, traspasos: t.traspasos.length
                };
            });
        });
        return outCounts;
    }, [dataGroup, progNameById]);

    const originBreakdown = useMemo(() => {
        const out = {};
        (Array.isArray(dataGroup) ? dataGroup : []).forEach(pgm => {
            const progKey = (progNameById[pgm?.id_pgm] || pgm?.name_pgm || "").trim().toUpperCase();
            if (!progKey) return;
            const items = (pgm?.detalle_ventaMembresium || []).filter(v => Number(v?.tarifa_monto) !== 0 && isBetween(parseBackendDate(v?.tb_ventum?.fecha_venta || v?.createdAt), start, end));
            const ren = items.filter(v => v?.tb_ventum?.id_origen === 691).length;
            const rein = items.filter(v => v?.tb_ventum?.id_origen === 692 || v?.tb_ventum?.id_origen === 696).length;
            out[progKey] = { nuevos: items.length - ren - rein, renovaciones: ren, reinscripciones: rein };
        });
        return out;
    }, [dataGroup, start, end, progNameById]);

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
            (Array.isArray(dataGroup) ? dataGroup : []).forEach(pgm => {
                const progKey = (progNameById[pgm?.id_pgm] || pgm?.name_pgm || "").trim().toUpperCase();
                if (!progKey) return;
                if (!res[progKey]) res[progKey] = {};
                (pgm?.detalle_ventaMembresium || []).forEach(v => {
                    if (Number(v?.tarifa_monto) === 0 || !isBetween(parseBackendDate(v?.tb_ventum?.fecha_venta || v?.createdAt), start, end)) return;
                    const nombreFull = v?.tb_ventum?.tb_empleado?.nombre_empl || v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl || v?.tb_ventum?.tb_empleado?.nombres_apellidos || "";
                    const asesor = (nombreFull.split(" ")[0] || "").toUpperCase();
                    const idCli = v?.tb_ventum?.id_cli ?? v?.id_cli;
                    if (asesor && idCli) {
                        if (!res[progKey][asesor]) res[progKey][asesor] = new Set();
                        res[progKey][asesor].add(idCli);
                    }
                });
                Object.keys(res[progKey]).forEach(k => res[progKey][k] = res[progKey][k].size);
            });
            return res;
        } catch { return {}; }
    }, [dataGroup, start, end, progNameById]);

    const avatarByAdvisor = useMemo(() => {
        const map = {};
        (repoVentasPorSeparado?.total?.empl_monto || []).forEach(it => {
            const key = norm(((it?.empl || it?.tb_empleado?.nombres_apellidos_empl || "").split(" ")[0] || "").trim());
            const raw = it?.avatar || it?.tb_empleado?.avatar || "";
            if (key && raw) map[key] = /^https?:\/\//i.test(raw) ? raw : `${config.API_IMG.AVATAR_EMPL}${raw}`;
        });
        return map;
    }, [repoVentasPorSeparado]);

    const productosPorAsesor = useProductosAgg(dataVentas, RANGE_DATE, { minImporte: 0 });

    return {
        dataVentas, reservasMF, programas,
        rankingData, resumenFilas, resumenTotales,
        advisorOriginByProg, originBreakdown, sociosOverride,
        avatarByAdvisor, productosPorAsesor,
        mesesSeleccionados, pgmNameById: progNameById, pgmNameByIdDynamic, dataGroup
    };
};