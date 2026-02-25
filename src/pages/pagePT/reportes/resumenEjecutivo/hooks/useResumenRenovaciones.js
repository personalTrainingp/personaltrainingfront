import { useState, useEffect, useMemo } from 'react';
import PTApi from '@/common/api/PTApi';
import { fetchVencimientosCached } from '../../resumenCache';
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
    const [isLoadingRenovaciones, setIsLoadingRenovaciones] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingRenovaciones(true);
            try {
                await Promise.all([
                    fetchVencimientos(),
                    fetchVigentes()
                ]);
            } catch (error) {
                console.error("Error fetching renovaciones:", error);
            } finally {
                setIsLoadingRenovaciones(false);
            }
        };
        setRenewalsFromApi([]); // Clear previously loaded renewals when date changes
        setVencimientosFiltrados(null);
        fetchData();
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
                // Use centralized cache to avoid duplicate HTTP requests
                const data = await fetchVencimientosCached(y, id_empresa);
                if (data.ok && Array.isArray(data.data)) {
                    const map = {};
                    data.data.forEach(row => {
                        let monthKey = "";
                        if (row.Mes && typeof row.Mes === "string" && row.Mes.includes("-")) {
                            monthKey = row.Mes;
                        } else {
                            const monthParamMap = {
                                "ENE": "01", "FEB": "02", "MAR": "03", "ABR": "04", "MAY": "05", "JUN": "06",
                                "JUL": "07", "AGO": "08", "SEP": "09", "SET": "09", "OCT": "10", "NOV": "11", "DIC": "12",
                                "ENERO": "01", "FEBRERO": "02", "MARZO": "03", "ABRIL": "04", "MAYO": "05", "JUNIO": "06",
                                "JULIO": "07", "AGOSTO": "08", "SEPTIE": "09", "SETIEM": "09", "SEPTIEMBRE": "09", "SETIEMBRE": "09", "OCTUBRE": "10", "NOVIEMBRE": "11", "DICIEMBRE": "12"
                            };
                            let monthNum = row.Mes;
                            const upperMes = String(row.Mes).toUpperCase().trim();

                            if (monthParamMap[upperMes]) {
                                monthNum = monthParamMap[upperMes];
                            } else if (!isNaN(row.Mes)) {
                                monthNum = String(row.Mes).padStart(2, '0');
                            } else {
                                // Fallback: try to find generic 3 letter match if possible or standard name
                                const keys = Object.keys(monthParamMap);
                                const found = keys.find(k => upperMes.startsWith(k));
                                if (found) monthNum = monthParamMap[found];
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
        loadRenewals: fetchRenewalsApi,
        vigentesRows, vigentesTotal, vigentesBreakdown,
        vencimientosFiltrados,
        isLoadingRenovaciones
    };
};