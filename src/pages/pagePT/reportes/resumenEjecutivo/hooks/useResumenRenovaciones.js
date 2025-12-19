import { useState, useEffect, useMemo } from 'react';
import PTApi from '@/common/api/PTApi';
import { getFechaFin, norm } from './useResumenUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const useResumenRenovaciones = (id_empresa, fechas, dataGroup, pgmNameByIdDynamic) => {
    const { year, selectedMonth, cutDay } = fechas;

    const [mapaVencimientos, setMapaVencimientos] = useState({});
    const [renewalsApi, setRenewalsApi] = useState([]);
    const [vigentesRows, setVigentesRows] = useState([]);
    const [vigentesTotal, setVigentesTotal] = useState(0);
    const [vencimientosFiltrados, setVencimientosFiltrados] = useState(null);

    useEffect(() => {
        fetchVencimientos();
        fetchRenewalsApi();
        fetchVigentes();
        fetchVencimientosFiltrados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id_empresa, year, selectedMonth, cutDay]);

    const fetchVencimientosFiltrados = async () => {
        try {
            // 1. Determinar el último día real del mes seleccionado
            const lastDayOfMonth = new Date(year, selectedMonth, 0).getDate();

            // LOGICA CLAVE: Si el slider está al final del mes, NO filtramos.
            // Devolvemos NULL para que la Tabla use el valor del Mapa (54)
            if (parseInt(cutDay) >= lastDayOfMonth) {
                console.log("Slider al final del mes: Usando valor del resumen general.");
                setVencimientosFiltrados(null);
                return;
            }

            // Si el slider no está al final, pedimos la lista para filtrar
            const { data } = await PTApi.get(`/reporte/reporte-seguimiento-membresia/${id_empresa || 598}`, {
                params: {
                    year,
                    selectedMonth,
                    cutDay: lastDayOfMonth, // Pedimos TODO el mes al backend
                    isClienteActive: false
                }
            });

            if (data?.newMembresias && Array.isArray(data.newMembresias)) {

                // Agrupar por cliente (Última fecha)
                const clientMap = new Map();
                data.newMembresias.forEach(item => {
                    const clientId = item.id_cli || item.tb_ventum?.id_cli || item.tb_ventum?.tb_cliente?.id_cli;
                    const key = clientId || `unk_${Math.random()}`;
                    const dateStr = item.fecha_fin_new || item.fec_fin_mem;
                    if (!dateStr) return;
                    const d = dayjs(dateStr);
                    if (!d.isValid()) return;

                    if (!clientMap.has(key)) {
                        clientMap.set(key, d);
                    } else {
                        const existing = clientMap.get(key);
                        if (d.isAfter(existing)) clientMap.set(key, d);
                    }
                });

                // Contar según el slider
                let count = 0;
                clientMap.forEach((maxDate) => {
                    const mYear = maxDate.year();
                    const mMonth = maxDate.month() + 1; // dayjs month es 0-index
                    const mDay = maxDate.date();

                    if (mYear === parseInt(year) &&
                        mMonth === parseInt(selectedMonth) &&
                        mDay <= parseInt(cutDay)) {
                        count++;
                    }
                });

                setVencimientosFiltrados(count);

            } else {
                setVencimientosFiltrados(0);
            }
        } catch (error) {
            console.error(error);
            setVencimientosFiltrados(null); // En error, fallback al mapa
        }
    };

    const fetchVencimientos = async () => {
        try {
            // Este endpoint es el que trae el 54 correcto
            const { data } = await PTApi.get('/venta/vencimientos-mes', {
                params: {
                    year,
                    id_empresa: id_empresa || 598
                }
            });
            if (data.ok && Array.isArray(data.data)) {

                const monthParamMap = {
                    "ENE": "01", "FEB": "02", "MAR": "03", "ABR": "04", "MAY": "05", "JUN": "06",
                    "JUL": "07", "AGO": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DIC": "12",
                    "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06",
                    "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12"
                };

                const map = {};
                data.data.forEach(row => {
                    let monthNum = row.Mes;
                    if (monthParamMap[String(row.Mes).toUpperCase()]) {
                        monthNum = monthParamMap[String(row.Mes).toUpperCase()];
                    } else if (!isNaN(row.Mes) && String(row.Mes).length === 1) {
                        monthNum = `0${row.Mes}`;
                    } else if (!isNaN(row.Mes) && String(row.Mes).length === 2) {
                        monthNum = String(row.Mes);
                    }

                    const monthKey = `${year}-${monthNum}`;
                    map[monthKey] = {
                        renovaciones: row["RENOVACIONES DEL MES"],
                        porcentaje: (typeof row["RENOVACIONES %"] === 'number')
                            ? `${row["RENOVACIONES %"].toFixed(1)}%`
                            : row["RENOVACIONES %"],
                        vencimientos: row["VENCIMIENTOS POR MES"], // AQUÍ VIENE EL 54
                        pendiente: row["PENDIENTE DE RENOVACIONES"],
                        acumulado: row["ACUMULADO CARTERA"]
                    };
                });
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
        vigentesRows, vigentesTotal, vigentesBreakdown,
        vencimientosFiltrados
    };
};