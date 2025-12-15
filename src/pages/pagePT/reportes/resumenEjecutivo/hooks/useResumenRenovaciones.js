import { useState, useEffect, useMemo } from 'react';
import PTApi from '@/common/api/PTApi';
import { getFechaFin, norm } from './useResumenUtils';

export const useResumenRenovaciones = (id_empresa, fechas, dataGroup, pgmNameByIdDynamic) => {
    const { year, selectedMonth, cutDay } = fechas;

    const [mapaVencimientos, setMapaVencimientos] = useState({});
    const [renewalsApi, setRenewalsApi] = useState([]);
    const [vigentesRows, setVigentesRows] = useState([]);
    const [vigentesTotal, setVigentesTotal] = useState(0);

    useEffect(() => {
        fetchVencimientos();
        fetchRenewalsApi();
        fetchVigentes();
    }, [id_empresa, year, selectedMonth, cutDay]);

    const fetchVencimientos = async () => {
        try {
            const { data } = await PTApi.get('/venta/vencimientos-mes', { params: { year, id_empresa: id_empresa || 598 } });
            if (data.ok && Array.isArray(data.data)) {
                const map = {};
                data.data.forEach(row => map[row.Mes] = { vencimientos: row['Vencimientos (Fec Fin)'], renovacionesBackend: row['Renovaciones (Pagadas)'], pendienteBackend: row['Pendiente Real'] });
                setMapaVencimientos(map);
            }
        } catch (err) { console.error(err); }
    };

    const fetchRenewalsApi = async () => {
        try {
            const { data } = await PTApi.get('/parametros/renovaciones/por-vencer', { params: { empresa: id_empresa || 598, dias: 15 } });
            setRenewalsApi(data?.renewals || []);
        } catch (e) { console.error(e); }
    };

    const fetchVigentes = async () => {
        try {
            const { data } = await PTApi.get('/parametros/membresias/vigentes/lista', { params: { empresa: id_empresa || 598, year, selectedMonth, cutDay } });
            setVigentesRows(data?.vigentes || []);
            setVigentesTotal(Number(data?.total || 0));
        } catch (e) { setVigentesRows([]); setVigentesTotal(0); }
    };

    const renewalsLocal = useMemo(() => {
        if (!Array.isArray(dataGroup)) return [];
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return dataGroup.flatMap(pgm => pgm?.detalle_ventaMembresium || []).map((m, idx) => {
            const fin = getFechaFin(m);
            return {
                id: m?.id || `m-${idx}`, id_pgm: m?.id_pgm ?? null,
                cliente: m?.tb_ventum?.tb_cliente?.nombres_apellidos || "SIN NOMBRE",
                plan: pgmNameByIdDynamic?.[m?.id_pgm] || (m?.id_pgm ? `PGM ${m.id_pgm}` : "-"),
                fechaFin: fin ? fin.toISOString().slice(0, 10) : null,
                dias_restantes: fin ? Math.round((fin - today) / 86400000) : null,
                monto: Number(m?.tarifa_monto ?? 0),
                ejecutivo: m?.tb_ventum?.tb_empleado?.nombres_apellidos || "-", notas: ""
            };
        });
    }, [dataGroup, pgmNameByIdDynamic]);

    const vigentesBreakdown = useMemo(() => {
        const counter = new Map();
        for (const r of vigentesRows) {
            const name = r?.plan || pgmNameByIdDynamic?.[r?.id_pgm] || "SIN PROGRAMA";
            const key = norm(name);
            if (!counter.has(key)) counter.set(key, { label: name, count: 0 });
            counter.get(key).count += 1;
        }
        return Array.from(counter.values()).sort((a, b) => b.count - a.count).slice(0, 3);
    }, [vigentesRows, pgmNameByIdDynamic]);

    return {
        mapaVencimientos,
        renewals: renewalsApi.length ? renewalsApi : renewalsLocal,
        vigentesRows, vigentesTotal, vigentesBreakdown
    };
};