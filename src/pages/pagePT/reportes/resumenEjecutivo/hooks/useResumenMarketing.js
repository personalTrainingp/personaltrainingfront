import { useState, useEffect, useMemo } from 'react';
import PTApi from '@/common/api/PTApi';
import dayjs from 'dayjs';
import { buildDataMktByMonth } from "../adapters/buildDataMktByMonth";
import { limaFromISO, MESES } from './useResumenUtils';

export const useResumenMarketing = (id_empresa, fechas, dataVentas, mesesSeleccionados) => {
    const { initDay, cutDay } = fechas;

    const [dataLead, setDataLead] = useState([]);
    const [dataLeadPorMesAnio, setdataLeadPorMesAnio] = useState([]);
    const [canalParams, setCanalParams] = useState([]);
    const [isLoadingMarketing, setIsLoadingMarketing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingMarketing(true);
            try {
                await Promise.all([
                    obtenerLeads(id_empresa || 598),
                    obtenerCanalParams()
                ]);
            } catch (error) {
                console.error("Error fetching marketing data:", error);
            } finally {
                setIsLoadingMarketing(false);
            }
        };
        fetchData();
    }, [id_empresa]);

    const obtenerLeads = async (empresaId) => {
        try {
            const { data } = await PTApi.get(`/lead/leads/${empresaId}`);
            setDataLead(data.leads);
            const grouped = Object.values((data.leads || []).reduce((acc, item) => {
                const key = dayjs.utc(item.fecha).format('YYYY-MMMM');
                if (!acc[key]) acc[key] = { fecha: key, items: [] };
                acc[key].items.push(item);
                return acc;
            }, {}));
            setdataLeadPorMesAnio(grouped);
        } catch (error) { console.log(error); }
    };

    const obtenerCanalParams = async () => {
        try {
            const { data } = await PTApi.get('/parametros/get_params/inversion/redes');
            setCanalParams((Array.isArray(data) ? data : []).map(d => ({ id_param: d.value, label_param: d.label })));
        } catch (e) {
            setCanalParams([{ id_param: '1514', label_param: 'TIKTOK ADS' }, { id_param: '1515', label_param: 'META ADS' }]);
        }
    };

    const dataMktByMonth = useMemo(() => buildDataMktByMonth(dataLead, initDay, cutDay, canalParams), [dataLead, initDay, cutDay, canalParams]);

    const dataMktWithCac = useMemo(() => {
        const base = { ...(dataMktByMonth || {}) };

        const detectOrigin = (v) => {
            const raw = v?.id_origen ?? v?.origen ?? "";
            const s = String(raw).toLowerCase();
            if (raw === 693 || s.includes("insta")) return "instagram";
            if (raw === 695 || s.includes("tiktok")) return "tiktok";
            if (raw === 694 || s.includes("face")) return "facebook";
            return null;
        };

        // Instead of mesesSeleccionados, iterate over all months available in dataMktByMonth
        for (const key of Object.keys(base)) {
            const obj = { ...(base[key] || {}) };
            const inversion = Number(obj.inversiones_redes ?? 0);
            const [yearStr, monthStr] = key.split('-');
            const anio = Number(yearStr);
            const mesIdx = MESES.indexOf(monthStr === 'setiembre' ? 'septiembre' : monthStr);

            let clientesTotales = 0;
            let clientes_por_red = { tiktok: 0, meta: 0 };

            for (const v of dataVentas || []) {
                const d = limaFromISO(v?.fecha_venta || v?.createdAt);
                if (!d || d.getFullYear() !== anio || d.getMonth() !== mesIdx) continue;
                if (d.getDate() < initDay || d.getDate() > cutDay) continue;

                const origin = detectOrigin(v);
                if (origin) {
                    clientesTotales++;
                    if (origin === "tiktok") clientes_por_red.tiktok++; else clientes_por_red.meta++;
                }
            }
            obj.clientes_digitales = clientesTotales;
            obj.clientes_por_red = clientes_por_red;
            obj.cac = clientesTotales > 0 ? +(inversion / clientesTotales).toFixed(2) : 0;
            base[key] = obj;
        }
        return base;
    }, [dataMktByMonth, dataVentas, initDay, cutDay]);

    return { dataLead, dataLeadPorMesAnio, dataMktByMonth, dataMktWithCac, isLoadingMarketing };
};