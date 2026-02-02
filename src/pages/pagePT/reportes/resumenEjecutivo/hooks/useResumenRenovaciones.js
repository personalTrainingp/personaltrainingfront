import { useState, useEffect, useMemo } from 'react';
import PTApi from '@/common/api/PTApi';
import { getFechaFin, norm } from './useResumenUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const useResumenRenovaciones = (id_empresa, fechas, dataGroup, pgmNameByIdDynamic) => {
    const { year, selectedMonth, cutDay } = fechas;

    const [mapaVencimientos, setMapaVencimientos] = useState({});
    const [renewalsFromApi, setRenewalsFromApi] = useState([]);
    const [vigentesRows, setVigentesRows] = useState([]);
    const [vigentesTotal, setVigentesTotal] = useState(0);
    const [vencimientosFiltrados, setVencimientosFiltrados] = useState(null);

    useEffect(() => {
        fetchVencimientos();
        fetchRenewalsApi();
        fetchVigentes();
    }, [id_empresa, year, selectedMonth, cutDay]);

    const fetchRenewalsApi = async () => {
        try {
            const params = {
                empresa: id_empresa || 598,
                year,
                month: selectedMonth,
                initDay: 1,
                cutDay
            };

            const { data } = await PTApi.get('/parametros/renovaciones/por-vencer', { params });
            const list = (data?.renewals || []).map(r => ({
                id: r.id,
                cliente: r.cliente,
                plan: r.plan,
                fechaFin: r.fechaFin,
                dias_restantes: r.dias_restantes,
                monto: Number(r.monto),
                ejecutivo: r.ejecutivo,
                expiration: r.fechaFin ? new Date(r.fechaFin + 'T00:00:00') : null,
                notes: ""
            }));

            setRenewalsFromApi(list);
            setVencimientosFiltrados(list.length);

        } catch (error) {
            console.error(error);
            setRenewalsFromApi([]);
        }
    };

    const fetchVencimientos = async () => {
        try {
            const fetchYearData = async (y) => {
                const { data } = await PTApi.get('/venta/vencimientos-mes', {
                    params: {
                        year: y,
                        id_empresa: id_empresa || 598
                    }
                });
                if (data.ok && Array.isArray(data.data)) {
                    const map = {};
                    data.data.forEach(row => {
                        let monthKey = "";
                        if (row.Mes && typeof row.Mes === "string" && row.Mes.includes("-")) {
                            monthKey = row.Mes;
                        } else {
                            const monthParamMap = {
                                "ENE": "01", "FEB": "02", "MAR": "03", "ABR": "04", "MAY": "05", "JUN": "06",
                                "JUL": "07", "AGO": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DIC": "12"
                            };
                            let monthNum = row.Mes;
                            if (monthParamMap[String(row.Mes).toUpperCase()]) {
                                monthNum = monthParamMap[String(row.Mes).toUpperCase()];
                            } else if (!isNaN(row.Mes)) {
                                monthNum = String(row.Mes).padStart(2, '0');
                            }
                            monthKey = `${y}-${monthNum}`;
                        }

                        const vTotal = row["Vencimientos (Fec Fin)"] ?? row["VENCIMIENTOS POR MES"] ?? 0;
                        const rTotal = row["Renovaciones (Pagadas)"] ?? row["RENOVACIONES DEL MES"] ?? 0;
                        const pReal = row["Pendiente Real"] ?? row["PENDIENTE DE RENOVACIONES"] ?? 0;
                        const acumulado = row["ACUMULADO CARTERA"] ?? 0;

                        map[monthKey] = {
                            renovaciones: rTotal,
                            porcentaje: vTotal > 0 ? `${((rTotal / vTotal) * 100).toFixed(1)}%` : "0.0%",
                            vencimientos: vTotal,
                            pendiente: pReal,
                            acumulado: acumulado
                        };
                    });
                    return map;
                }
                return {};
            };

            const [mapCurrent, mapPrev] = await Promise.all([
                fetchYearData(year),
                fetchYearData(year - 1)
            ]);

            setMapaVencimientos({ ...mapPrev, ...mapCurrent });

        } catch (err) { console.error(err); }
    };

    const fetchVigentes = async () => {
        try {
            const { data } = await PTApi.get('/parametros/membresias/vigentes/lista', { params: { empresa: id_empresa || 598, year, selectedMonth, cutDay } });
            setVigentesRows(data?.vigentes || []);
            setVigentesTotal(Number(data?.total || 0));
        } catch (e) { setVigentesRows([]); setVigentesTotal(0); }
    };

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
        renewals: renewalsFromApi,
        vigentesRows, vigentesTotal, vigentesBreakdown,
        vencimientosFiltrados
    };
};