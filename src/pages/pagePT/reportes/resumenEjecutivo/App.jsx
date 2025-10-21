      import React, { useEffect, useMemo, useState } from "react";
      import { Col, Row } from "react-bootstrap";
      import { useVentasStore } from "./useVentasStore";
      import { ventasToExecutiveData } from "./adapters/ventasToExecutiveData";
      import ExecutiveTable from "./components/ExecutiveTable";
      import { PageBreadcrumb } from "@/components";
      import { ClientesPorOrigen } from "./components/ClientesPorOrigen";
      import { ComparativoVsActual } from "./components/ComparativoVsActual";
      import { buildDataMktByMonth } from "./adapters/buildDataMktByMonth";
      import { GraficoLinealInversionRedes } from "./components/GraficoLinealInversionRedes";
      import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
      import { TarjetasPago } from '../totalVentas/TarjetasPago';
      import { useSelector, useDispatch } from 'react-redux';
      import { onSetRangeDate } from '@/store/data/dataSlice';
      import {SumaDeSesiones} from '../totalVentas/SumaDeSesiones';
      import { useReporteResumenComparativoStore } from "../resumenComparativo/useReporteResumenComparativoStore";
      import config from '@/config';
      import axios from 'axios';

      const RealTimeClock = () => {
        const [currentTime, setCurrentTime] = useState(new Date());

        useEffect(() => {
          const timerId = setInterval(() => {
            setCurrentTime(new Date());
          }, 1000);
          return () => clearInterval(timerId);
        }, []);

        const formattedTime = currentTime.toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        return (
          <div
            style={{
              fontWeight: 700,
              fontSize: "2em",
              color: "black",
            }}
          >
            Hora: {formattedTime}
          </div>
        );
      };

export function limaFromISO(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc - 5 * 60 * 60000); // UTC-5
}

export function limaStartOfDay(d) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 5, 0, 0, 0));
}

export function limaEndOfDay(d) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + 1, 4, 59, 59, 999));
}

const parseBackendDate = (s) => {
  if (!s) return null;
  const normalized = String(s).replace(" ", "T").replace(" -", "-");
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
};
const isBetween = (d, start, end) => !!(d && start && end && d >= start && d <= end);

  
      export const App = ({ id_empresa }) => {
      const { obtenerTablaVentas, dataVentas, obtenerLeads, dataLead, dataLeadPorMesAnio } = useVentasStore();
        const { obtenerVentas, repoVentasPorSeparado, loading } = useReporteStore();
        const [clickServProd, setclickServProd] = useState("total");
        const { RANGE_DATE } = useSelector(e => e.DATA);
        const dispatch = useDispatch();
        const [cutDay, setCutDay] = useState(new Date().getDate()); 
        const [initDay, setInitDay] = useState(1);
  
  
      const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
      const year = new Date().getFullYear();

     useEffect(() => {
  const y = new Date().getFullYear();
  const startLocal = new Date(y, selectedMonth - 1, initDay);
  const endLocal   = new Date(y, selectedMonth - 1, cutDay);

  const startLima = limaStartOfDay(startLocal);
  const endLima   = limaEndOfDay(endLocal);

  dispatch(onSetRangeDate([startLima, endLima]));
}, [selectedMonth, initDay, cutDay, dispatch]);


        useEffect(() => {
          if (RANGE_DATE && RANGE_DATE[0] && RANGE_DATE[1]) {
            obtenerVentas(RANGE_DATE);
          }
          obtenerTablaVentas(id_empresa || 598);
          obtenerLeads(id_empresa || 598);
        }, [id_empresa, RANGE_DATE]);

        const [programas, setProgramas] = useState([]);

      useEffect(() => {
        const fetchProgramas = async () => {
          try {
            const { data } = await axios.get("http://localhost:4000/api/programaTraining/get_tb_pgm");
            console.log("Programas desde backend:", data);
            setProgramas(data || []);
          } catch (err) {
            console.error("Error obteniendo programas:", err);
          }
        };
        fetchProgramas();
      }, []);
    const { obtenerComparativoResumen, dataGroup } = useReporteResumenComparativoStore();

    useEffect(() => {
      if (RANGE_DATE?.[0] && RANGE_DATE?.[1]) {
        obtenerComparativoResumen(RANGE_DATE);
      }
    }, [RANGE_DATE]);
   
    const progNameById = {
      2: "CHANGE 45",
      3: "FS 45",
      4: "FISIO MUSCLE",
      5: "VERTIKAL CHANGE",
    };
const [canalParams, setCanalParams] = useState([
 
]);

useEffect(() => {
  (async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/parametros/get_params/inversion/redes"
      );
      const mapped = (Array.isArray(data) ? data : []).map(d => ({
        id_param: (d.value),
        label_param: (d.label),

      }));

      setCanalParams(mapped);
    } catch (e) {
      console.warn("No se pudieron cargar canalParams, uso fallback 1514/1515:", e?.message);
      setCanalParams([
        { id_param: "1514", label_param: "TIKTOK ADS" },
        { id_param: "1515", label_param: "META ADS"  },
      ]);
    }
  })();
}, []);
  const { start, end } = useMemo(() => {
    const s = RANGE_DATE?.[0] ? new Date(RANGE_DATE[0]) : null;
    const e = RANGE_DATE?.[1] ? new Date(RANGE_DATE[1]) : null;
    return { start: s, end: e };
  }, [RANGE_DATE]);
const advisorOriginByProg = useMemo(() => {
  const outSets = {};
  const src = Array.isArray(dataGroup) ? dataGroup : [];

  for (const pgm of src) {
    const progKey = (progNameById[pgm?.id_pgm] || pgm?.name_pgm || "").trim().toUpperCase();
    if (!progKey) continue;
    if (!outSets[progKey]) outSets[progKey] = {};

    const items = Array.isArray(pgm?.detalle_ventaMembresium) ? pgm.detalle_ventaMembresium : [];
  
    const pagadas = items.filter(v => {
      if (Number(v?.tarifa_monto) === 0) return false;
      const iso = v?.tb_ventum?.fecha_venta || v?.tb_ventum?.createdAt || v?.fecha_venta || v?.createdAt;
      const d = parseBackendDate(iso);
      return isBetween(d, start, end);
    });

    for (const v of pagadas) {
      const nombreFull =
        v?.tb_ventum?.tb_empleado?.nombre_empl ||
        v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl ||
        v?.tb_ventum?.tb_empleado?.nombres_apellidos || "";
      const asesor = (nombreFull.split(" ")[0] || "").toUpperCase();
      if (!asesor) continue;

      const idCliente =
        v?.tb_ventum?.id_cli ??
        v?.id_cli ??
        v?.tb_cliente?.id_cli ??
        v?.tb_ventum?.tb_cliente?.id_cli;
      if (!idCliente) continue;

      const o = v?.tb_ventum?.id_origen;
      let tipo = "nuevos";
      if (o === 691) tipo = "renovaciones";
      else if (o === 692 || o === 696) tipo = "reinscripciones";

      if (!outSets[progKey][asesor]) {
        outSets[progKey][asesor] = {
          nuevos: new Set(),
          renovaciones: new Set(),
          reinscripciones: new Set(),
        };
      }
      outSets[progKey][asesor][tipo].add(idCliente);
    }
  }
  const outCounts = {};
  Object.entries(outSets).forEach(([progKey, asesoresObj]) => {
    outCounts[progKey] = {};
    Object.entries(asesoresObj).forEach(([asesor, byTipo]) => {
      outCounts[progKey][asesor] = {
        nuevos: byTipo.nuevos.size,
        renovaciones: byTipo.renovaciones.size,
        reinscripciones: byTipo.reinscripciones.size,
      };
    });
  });

  return outCounts;
}, [dataGroup, start, end, progNameById]);

  const originBreakdown = useMemo(() => {
    const out = {};
    const src = Array.isArray(dataGroup) ? dataGroup : [];
    for (const pgm of src) {
      const progKey = (progNameById[pgm?.id_pgm] || pgm?.name_pgm || "")
        .trim()
        .toUpperCase();
      if (!progKey) continue;

      const items = Array.isArray(pgm?.detalle_ventaMembresium)
        ? pgm.detalle_ventaMembresium
        : [];

      const pagadas = items.filter((v) => {
        if (Number(v?.tarifa_monto) === 0) return false;
        const iso =
          v?.tb_ventum?.fecha_venta ||
          v?.tb_ventum?.createdAt ||
          v?.fecha_venta ||
          v?.createdAt;
        const d = parseBackendDate(iso);
        return isBetween(d, start, end);
      });

      const renovaciones = pagadas.filter((v) => v?.tb_ventum?.id_origen === 691).length;
      const reinscripciones = pagadas.filter(
        (v) => v?.tb_ventum?.id_origen === 692 || v?.tb_ventum?.id_origen === 696
      ).length;
      const nuevos = pagadas.length - renovaciones - reinscripciones;

      out[progKey] = { nuevos, renovaciones, reinscripciones };
    }
    return out;
  }, [dataGroup, start, end, progNameById]);

  const sociosOverride = useMemo(() => {
    try {
      if (!Array.isArray(dataGroup)) return {};
      const res = {};
      for (const pgm of dataGroup) {
        const progKey = (progNameById[pgm?.id_pgm] || pgm?.name_pgm || "")
          .trim()
          .toUpperCase();
        if (!progKey) continue;
        if (!res[progKey]) res[progKey] = {};

        const source = Array.isArray(pgm?.detalle_ventaMembresium)
          ? pgm.detalle_ventaMembresium
          : [];

        const ventas = source.filter((v) => {
          if (!v || Number(v?.tarifa_monto) === 0) return false;
          const iso =
            v?.tb_ventum?.fecha_venta ||
            v?.tb_ventum?.createdAt ||
            v?.fecha_venta ||
            v?.createdAt;
          const d = parseBackendDate(iso);
          return isBetween(d, start, end);
        });

        const porAsesor = new Map();
        for (const v of ventas) {
          const nombreFull =
            v?.tb_ventum?.tb_empleado?.nombre_empl ||
            v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl ||
            v?.tb_ventum?.tb_empleado?.nombres_apellidos ||
            "";
          const asesor = (nombreFull.split(" ")[0] || "").toUpperCase();
          if (!asesor) continue;
          const idCliente =
            v?.tb_ventum?.id_cli ??
            v?.id_cli ??
            v?.tb_cliente?.id_cli ??
            v?.tb_ventum?.tb_cliente?.id_cli;
          if (!idCliente) continue;

          if (!porAsesor.has(asesor)) porAsesor.set(asesor, new Set());
          porAsesor.get(asesor).add(idCliente);
        }
        porAsesor.forEach((setIds, asesor) => {
          res[progKey][asesor] = setIds.size;
        });
      }
      return res;
    } catch {
      return {};
    }
  }, [dataGroup, start, end, progNameById]);
        const columns = useMemo(() => ([
          { key: "marzo",  label: "MARZO",  currency: "S/." },
          { key: "abril",  label: "ABRIL",  currency: "S/." },
          { key: "mayo",   label: "MAYO",   currency: "S/." },
          { key: "junio",  label: "JUNIO",  currency: "S/." },
          { key: "julio",  label: "JULIO",  currency: "S/." },
          { key: "agosto", label: "AGOSTO", currency: "S/." },
          { key: "septiembre", label: "SEPTIEMBRE", currency: "S/." },
        ]), []);

        const marketing = {
          inversion_redes: { marzo: 1098, abril: 3537, mayo: 4895, junio: 4622, julio: 4697, agosto: 5119, septiembre: 0 },
          leads:           { marzo: 84,  abril: 214,  mayo: 408,  junio: 462,  julio: 320,  agosto: 417, septiembre: 0  },
          cpl:             { marzo: 13.07,  abril: 16.53,   mayo: 12,   junio: 10,    julio: 14.68,   agosto: 12.28, septiembre: 0   },
          cac:             { marzo: null,  abril: null,   mayo: null,   junio: null,   julio: null,   agosto: null, septiembre: 0   },
        };

   const daysInmonth = (y,m1to12)=>  new Date(y,m1to12,0).getDate();
function handleMonthChange(newMonth) {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const lastDayTarget = daysInmonth(year, newMonth); 
  let nextCutDay;

  if (newMonth === currentMonth && year === currentYear) {
    nextCutDay = Math.min(today.getDate(), lastDayTarget);
  } else {
    nextCutDay = Math.min(cutDay, lastDayTarget);
  }

  const nextInitDay = Math.min(initDay, nextCutDay);

  setSelectedMonth(newMonth);
  setCutDay(nextCutDay);
  setInitDay(nextInitDay);
}



        const tableData = useMemo(() => ventasToExecutiveData({
          ventas: dataVentas,
          columns,
          titleLeft: "CIRCUS",
          titleRight: `RESUMEN EJECUTIVO HASTA EL ${cutDay} DE CADA MES`,
          marketing,
          cutDay,              
          initDay,
          footerFullMonth: true 
        }), [dataVentas, columns, marketing, cutDay]);
        const originMap = {
          1454: "WALK-IN",
          1455: "DIGITAL",
          1456: "REFERIDO",
          1457: "CARTERA",
        };
        const dataMktByMonth = useMemo(
    () => buildDataMktByMonth(dataLead, initDay, cutDay, canalParams), 
    [dataLead, initDay, cutDay,canalParams]
  );
const dataMkt = useMemo(
  () => buildDataMktByMonth(dataLead, initDay, cutDay, canalParams),
  [dataLead, initDay, cutDay, canalParams]
);
        const TotalDeVentasxProdServ = (prodSer) => { 
          switch (prodSer) {
            case 'total':
              return {
                data: repoVentasPorSeparado.total?.data,
                sumaTotal: repoVentasPorSeparado.total?.SumaMonto,
                forma_pago: repoVentasPorSeparado.total?.forma_pago_monto,
                asesores_pago: repoVentasPorSeparado.total?.empl_monto
              };
            
          }
        };
        const MESES = [
        "enero","febrero","marzo","abril","mayo","junio",
        "julio","agosto","septiembre","octubre","noviembre","diciembre"
      ];

      function getLastNMonths(selectedMonth, year, n = 8) {
        const result = [];
        let monthIdx = selectedMonth - 1; 
        let currentYear = year;

        for (let i = 0; i < n; i++) {
          const mesNombre = MESES[monthIdx];
          result.push({ 
            label: mesNombre.toUpperCase(), 
            anio: currentYear.toString(), 
            mes: mesNombre 
          });
          monthIdx--;
          if (monthIdx < 0) {
            monthIdx = 11; 
            currentYear--; 
          }
        }
        return result.reverse(); 
      }
      function generarResumenRanking(array) {
        const sumaMontoTotal = array.reduce((acc, row) => acc + (row?.monto || 0), 0);
        const sumaTotalSocios = array.reduce((acc, row) => acc + (row.socios || 0), 0);
        const sumaTotalSesiones = array.reduce((acc, row) => acc + (row.sesiones || 0), 0);

        const resumenFilas = array.map((row) => {
          const nombreAsesor = row.empl?.split(" ")[0] || row.nombre || "";
          const socios = row.socios || 0;

          const ticketMedio = socios ? (row.monto / socios).toFixed(2) : "0.00";

          return [
            { header: "ASESORES", value: nombreAsesor, isPropiedad: true },
            {
              header: "S/. VENTA TOTAL",
              value: row.monto?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00",
            },
            { header: "SOCIOS", value: socios },
            {
              header: "% VENTA TOTAL",
              value: sumaMontoTotal ? ((row.monto / sumaMontoTotal) * 100).toFixed(2) + " %" : "0 %",
            },
            {
              header: "% SOCIOS",
              value: sumaTotalSocios ? ((socios / sumaTotalSocios) * 100).toFixed(2) + " %" : "0 %",
            },
            {
              header: "S/. TICKET MEDIO",
              value: ticketMedio,
            },
            {
              header: "S/. PRECIO POR SESION",
              value: row.sesiones ? (row.monto / row.sesiones).toFixed(2) : "0.00",
            },
          ];
        });

        const resumenTotales = [
          { header: "ASESORES", value: "TOTAL" },
          {
            header: "S/. VENTA TOTAL",
            value: sumaMontoTotal.toLocaleString("es-PE", { minimumFractionDigits: 2 }),
          },
          { header: "SOCIOS", value: sumaTotalSocios },
          { header: "% VENTA TOTAL", value: "100 %" },
          { header: "% SOCIOS", value: "100 %" },
          {
            header: "S/. TICKET MEDIO",
            value: sumaTotalSocios ? (sumaMontoTotal / sumaTotalSocios).toFixed(2) : "0.00",
          },
          {
            header: "S/. PRECIO POR SESION",
            value: sumaTotalSesiones ? (sumaMontoTotal / sumaTotalSesiones).toFixed(2) : "0.00",
          },
        ];

        return { resumenFilas, resumenTotales };
      }

      const avataresDeProgramas = [
        { urlImage: "/change_negro.png", name_image: "CHANGE 45" },
        { urlImage: "/fs45_negro.png", name_image: "FS 45" },
        { urlImage: "/fisio_muscle_negro.png", name_image: "FISIO MUSCLE" },
      { urlImage: "/vertikal_negro.png", name_image: "VERTIKAL CHANGE" }, // <--- imagen local
    ];  

      const rankingData = (TotalDeVentasxProdServ("total")?.asesores_pago || [])
      .filter(item => item.monto && item.monto > 0)
      .map(item => {
        const nombre = item.tb_empleado?.nombres_apellidos_empl || item.nombre || "SIN NOMBRE";

        let socios;
        if (typeof item.socios === "number") {
          socios = item.socios;
        } else if (Array.isArray(item.items)) {

          const uniqueSocios = new Set(
            item.items.map(it =>
          
              it?.id_cli ?? it?.tb_venta?.id_cli ?? it?.venta?.id_cli ?? it?.id_venta ?? it?.id
            )
          );
          socios = uniqueSocios.size;
        } else {
          socios = 0;
        }

        const sesiones = Array.isArray(item.items)
          ? item.items.reduce(
              (acc, it) => acc + (it?.tb_semana_training?.sesiones ?? it?.sesiones ?? 0),
              0
            )
          : (item.sesiones || 0);

        const ticketMedio = socios ? (item.monto / socios).toFixed(2) : "0.00";
        const precioPorSesion = sesiones ? (item.monto / sesiones).toFixed(2) : "0.00";

        return {
          ...item,
          nombre,
          socios,                 
          sesiones,
          ticketMedio,
          precioPorSesion,
        };
      })
      .sort((a, b) => b.monto - a.monto);

      const { resumenFilas, resumenTotales } = 
        rankingData.length > 0 ? generarResumenRanking(rankingData) : { resumenFilas: [], resumenTotales: [] };

      const detectDigitalOrigin = (venta) => {
        const raw = venta?.id_origen ?? venta?.origen ?? venta?.origen_nombre ?? venta?.origin ?? venta?.source ?? venta?.canal ?? "";
        const asNum = Number(raw);
        if (!Number.isNaN(asNum)) {
          if (asNum === 693) return "instagram";
          if (asNum === 695) return "tiktok";
          if (asNum === 694) return "facebook";
        }
        const s = String(raw).toLowerCase();
        if (s.includes("insta") || s.includes("instagram") || s === "ig") return "instagram";
        if (s.includes("tiktok") || s.includes("tik")) return "tiktok";
        if (s.includes("face") || s.includes("facebook") || s === "fb") return "facebook";
        return null;
      };

      const countDigitalClientsForMonth = (ventasList = [], anio, mesNombre, fromDay = 1, cut = {cutDay}) => {
        
        const MESES_LOCAL = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
        const monthLower = String(mesNombre).toLowerCase();
        const monthIdx = MESES_LOCAL.indexOf(monthLower === "septiembre" ? "septiembre" : monthLower);
        if (monthIdx < 0) return 0;

        let cnt = 0;
        for (const v of ventasList) {
          const iso = v?.fecha_venta || v?.fecha || v?.createdAt;
          if (!iso) continue;
          const d = limaFromISO(iso);
              if (!d) continue;
          if (d.getFullYear() !== Number(anio)) continue;
          if (d.getMonth() !== monthIdx) continue;
          const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
          const from = Math.max(1, Math.min(Number(fromDay || 1), lastDay));
          const to = Math.max(from, Math.min(Number(cut || lastDay), lastDay));
          const dia = d.getDate();
          if (dia < from || dia > to) continue;

          const origin = detectDigitalOrigin(v);
          if (origin === "instagram" || origin === "tiktok" || origin === "facebook") {          
            cnt += 1;      
          }        
        }
        return cnt;
      };

      const mesesSeleccionados = getLastNMonths(selectedMonth, year,8);
const dataMktWithCac = useMemo(() => {
  const base = { ...(dataMktByMonth || {}) };

  for (const f of mesesSeleccionados) {
    const mesKey = f.mes === 'septiembre' ? 'setiembre' : f.mes;
    const key = `${f.anio}-${mesKey}`;
    const obj = { ...(base[key] || {}) };
    const inversion = Number(obj.inversiones_redes ?? obj.inversion_redes ?? 0);

    const clientes = countDigitalClientsForMonth(
      dataVentas || [], f.anio, f.mes, initDay, cutDay
    );

    obj.clientes_digitales = clientes;
    obj.cac = clientes > 0 ? +(inversion / clientes).toFixed(2) : 0;

    base[key] = obj;
  }
  return base;
}, [dataMktByMonth, dataVentas, mesesSeleccionados, initDay, cutDay]);

  useEffect(() => {
    const expected = mesesSeleccionados.map(f => 
      `${f.anio}-${(f.mes === 'septiembre' ? 'setiembre' : f.mes)}`
    );
  }, [mesesSeleccionados]);

  useEffect(() => {
  }, [dataMktByMonth]);

  useEffect(() => {
    const parse = v => v?.fecha ?? v?.createdAt ?? v?.fecha_venta;
    const ds = (dataLead || [])
      .map(x => limaFromISO(parse(x)))
      .filter(d => !Number.isNaN(d.getTime()));
    if (ds.length) {
      const min = new Date(Math.min(...ds));
      const max = new Date(Math.max(...ds));
    } else {
    }
  }, [dataLead]);
const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

const AVATAR_BASE = config?.API_IMG?.AVATAR_EMPL || ""; 

const avatarByAdvisor = useMemo(() => {
  const lista = repoVentasPorSeparado?.total?.empl_monto || [];
  const map = {};

  for (const it of lista) {
    const fullName = it?.empl || it?.tb_empleado?.nombres_apellidos_empl || it?.nombre || "";
    const key = norm((fullName.split(" ")[0] || "").trim());
    if (!key) continue;

    const raw =
      it?.avatar ||
      it?.tb_empleado?.avatar ||
      it?.tb_empleado?.tb_images?.[ (it?.tb_empleado?.tb_images?.length||0) - 1 ]?.name_image ||
      "";

    if (!raw) continue;

    const url = /^https?:\/\//i.test(raw) ? raw : `${config.API_IMG.AVATAR_EMPL}${raw}`;
    map[key] = url;
  }

  return map;
}, [repoVentasPorSeparado?.total?.empl_monto]);
      return (
          <>
            <PageBreadcrumb title="RESUMEN EJECUTIVO" subName="Ventas" />
            <Row className="mb-3">
              <Col lg={12}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"40px" }}>

                
        <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
          <label style={{ fontWeight: 600, fontSize: '2em', color: 'black' }}>Mes:</label>
         <select
  value={selectedMonth}
  onChange={e => {
    const newMonth = parseInt(e.target.value, 10);
    const currentMonth = new Date().getMonth() + 1;

    if (newMonth > currentMonth) return;

    handleMonthChange(newMonth);
  }}
  style={{ fontSize: '1.7em', fontWeight: "bold" }}
>
  {[
    "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
    "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"
  ].map((mes, idx) => {
    const currentMonth = new Date().getMonth() + 1;
    const disabled = idx + 1 > currentMonth; 
    return (
      <option key={idx + 1} value={idx + 1} disabled={disabled}>
        {mes}
      </option>
    );
  })}
</select>
        </div>
      {/* Día de inicio */}
  <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
    <label style={{ fontWeight: 600, fontSize: '2em', color: 'black' }}>Día de inicio:</label>
    <select
      value={initDay}
      onChange={e => {
        const val = parseInt(e.target.value, 10);
        if (val <= cutDay) setInitDay(val); // 
      }}
      style={{ fontSize: '1.5em' }}
    >
      {Array.from({ length: 31 }, (_, i) => i + 1).map(n => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  </div>

{/* Día de corte */}
<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <label style={{ fontWeight: 600, fontSize: "2em", color: "black" }}>
    Día de corte:
  </label>
  <select
    value={cutDay}
    onChange={(e) => {
      const val = parseInt(e.target.value, 10);
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();

      const daysInMonth = (y, m1to12) => new Date(y, m1to12, 0).getDate();
      const lastDayTarget = daysInMonth(year, selectedMonth);

      let next = Math.min(val, lastDayTarget);

      if (selectedMonth === currentMonth) {
        next = Math.min(next, currentDay);
      }
      setCutDay(next);

      if (initDay > next) {
        setInitDay(next);
      }
    }}
    style={{ fontSize: "1.5em" }}
  >
    {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
      <option key={n} value={n}>
        {n}
      </option>
    ))}
  </select>
</div>
        {/* Hora actual */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontWeight: 600, fontSize: '2em', color: 'black' }}>
            Hora: {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
        </div>
      </div>
              </Col>
            </Row>
            <Row className="mb-6">
              <Col lg={12} className="pt-0">
                <div style={{marginBottom: '30px'}}>
                <ExecutiveTable
        ventas={dataVentas}
        fechas={mesesSeleccionados}
        dataMktByMonth={dataMktWithCac }
        initialDay={initDay}
        cutDay={cutDay}
      />
                </div>
                <div style={{marginBottom: '32px',marginTop:"80px"}}>
                  <ClientesPorOrigen
                    ventas={dataVentas}
                    fechas={mesesSeleccionados}
                    initialDay={initDay}
                    cutDay={cutDay}
                    originMap={{
                      686: 'Walking',
                      687: 'Mail',
                      690: 'REFERIDOS',
                      691: 'CARTERA DE RENOVACION',
                      692: 'Cartera de reinscripcion',
                      693: 'Instagram',
                      694: 'Facebook',
                      695: 'tiktok',
                      696: 'EX-PT reinscripcion',
                      689: 'WSP organico',
                      1470: 'CORPORATIVOS BBVA',
                    }}
                  />
                </div>
              </Col>
              <Col lg={12}>
                <div style={{marginBottom: '32px',marginTop:"90px"}}>
                  <ComparativoVsActual
                  ventas={dataVentas}
        fechas={mesesSeleccionados}
        dataMktByMonth={dataMkt}
        initialDay={initDay}
        cutDay={cutDay}
                  />
                </div>
                <div style={{marginBottom: '32px',marginTop:"90px"}}>
                  <GraficoLinealInversionRedes
                    data={dataLeadPorMesAnio}
                    fechas={[new Date()]}
                  />
                </div>
               <Col lg={12}>
  <div style={{ marginTop: '15px' }}>
   <TarjetasPago
  tasks={
    (TotalDeVentasxProdServ("total")?.asesores_pago || [])
      .filter(item =>
        item.monto > 0 &&
        (item.tipo === "programa" ||
         item.categoria === "PROGRAMAS" ||
         item.id_programa !== null)
      )
      .map(item => ({
        ...item,
        nombre: item.nombre?.split(" ")[0] || item.nombre
      }))
  }
  title={"Ranking Venta Membresías"}
/>

  </div>
</Col>
       
              </Col>
    <Row>
        <Col lg={12}>
          <SumaDeSesiones
  resumenArray={resumenFilas}
  resumenTotales={resumenTotales}
  avataresDeProgramas={avataresDeProgramas}
  sociosOverride={sociosOverride}
  originBreakdown={originBreakdown} 
   advisorOriginByProg={advisorOriginByProg} 
    avatarByAdvisor={avatarByAdvisor}
/>
        </Col>
      </Row>

            </Row>
          </>
        );
      };
