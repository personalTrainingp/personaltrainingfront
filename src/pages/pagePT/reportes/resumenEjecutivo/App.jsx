      import React, { useEffect, useMemo, useState } from "react";
      import VentasDiarias from "../totalVentas/components/VentasDiarias";
      import { GraficoLinealVentasDiarias } from "../totalVentas/components/GraficoLinealVentasDiarias";
      import { Col, Row } from "react-bootstrap";
      import { useVentasStore } from "./useVentasStore";
      import ExecutiveTable from "./components/ExecutiveTable";
      import { PageBreadcrumb } from "@/components";
      import { ClientesPorOrigen } from "./components/ClientesPorOrigen";
      import { ComparativoVsActual } from "./components/ComparativoVsActual";
      import RenovacionesPorVencer from "./components/RenovacionesPorVencer";
      import RenovacionesPanel from "./components/RenovacionesPanel";
      import VigentesTable from "./components/VigentesTable";
      import { buildDataMktByMonth } from "./adapters/buildDataMktByMonth";
      import { VigentesResumenMensual } from "./components/VigentesResumenMensual";
      import { GraficoLinealInversionRedes } from "./components/GraficoLinealInversionRedes";
      import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
      import { useSelector, useDispatch } from 'react-redux';
      import { onSetRangeDate } from '@/store/data/dataSlice';
      import {SumaDeSesiones} from '../totalVentas/SumaDeSesiones';
      import { useReporteResumenComparativoStore } from "../resumenComparativo/useReporteResumenComparativoStore";
      import config from '@/config';
      import PTApi from '@/common/api/PTApi';
      import { TarjetasProductos, useProductosAgg } from '../totalVentas/TarjetasProductos';
      import { TopControls } from "./components/TopControls";
import { ExecutiveTable2 } from "./components/ExecutibleTable2";

export function limaFromISO(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc - 5 * 60 * 60000); 
}

export function limaStartOfDay(d) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 5, 0, 0, 0));
}

export function limaEndOfDay(d) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999));
}


const parseBackendDate = (s) => {
  if (!s) return null;
  const normalized = String(s).replace(" ", "T").replace(" -", "-");
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
};
const parseDateOnly = (s) => {
  if (!s) return null;
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}
function getFechaFin(m) {
  return (
    parseDateOnly(m?.fec_fin_mem) ||
    parseDateOnly(m?.fec_fin_mem_oftime) ||
    parseDateOnly(m?.fec_fin_mem_viejo) ||
    null
  );
}


const isBetween = (d, start, end) => !!(d && start && end && d >= start && d <= end);
function sumProgramRevenueForMonth(ventas = [], year, monthIdx, fromDay, toDay) {
  let total = 0;
  for (const v of ventas) {
    const d = limaFromISO(v?.fecha_venta || v?.fecha || v?.createdAt);
    if (!d || d.getFullYear() !== Number(year) || d.getMonth() !== monthIdx) continue;

    const last = new Date(year, monthIdx + 1, 0).getDate();
    const from = Math.max(1, Math.min(Number(fromDay || 1), last));
    const to   = Math.max(from, Math.min(Number(toDay || last), last));
    const dia  = d.getDate();
    if (dia < from || dia > to) continue;

    const mems = v?.detalle_ventaMembresia || v?.detalle_ventaMembresium || [];
    for (const it of mems) {
      const cant = Number(it?.cantidad ?? 1) || 1;
      total += cant * (Number(it?.tarifa_monto) || 0);
    }
  }
  return total;
}
      export const App = ({ id_empresa }) => {
      const { obtenerTablaVentas, dataVentas, obtenerLeads, dataLead, dataLeadPorMesAnio } = useVentasStore();
        const { obtenerVentas, repoVentasPorSeparado, loading } = useReporteStore();
        const { RANGE_DATE } = useSelector(e => e.DATA);
        const dispatch = useDispatch();
        const [cutDay, setCutDay] = useState(new Date().getDate()); 
        const [initDay, setInitDay] = useState(1);
      const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
      const year = new Date().getFullYear();
const snapshotDate = useMemo(() => {
  const d = new Date(year, selectedMonth - 1, cutDay);
  d.setHours(0,0,0,0);
  return d;
}, [year, selectedMonth, cutDay]);
const todayLimaStart = useMemo(() => limaStartOfDay(new Date()), []);
const isHistorical = useMemo(
  () => snapshotDate.getTime() < todayLimaStart.getTime(),
  [snapshotDate, todayLimaStart]
);

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
    
      const { data } = await PTApi.get('/programaTraining/get_tb_pgm');

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
        obtenerComparativoResumen(RANGE_DATE).catch(err => {
          console.error("[comparativo] fallo:", err?.response?.data || err.message); 
      }  );
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
      const { data } = await PTApi.get(
        '/parametros/get_params/inversion/redes'
      );
      const mapped = (Array.isArray(data) ? data : []).map(d => ({
        id_param: d.value,
        label_param: d.label,
      }));
      setCanalParams(mapped);
    } catch (e) {
      console.warn(
        'No se pudieron cargar canalParams, uso fallback 1514/1515:',
        e?.message
      );
      setCanalParams([
        { id_param: '1514', label_param: 'TIKTOK ADS' },
        { id_param: '1515', label_param: 'META ADS' },
      ]);
    }
  })();
}, []);

// === dentro de App ===
const [reservasMF, setReservasMF] = useState([]);
useEffect(() => {
  (async () => {
    try {
      const { data } = await PTApi.get('/reserva_monk_fit', {
        params: {
          limit: 2000,
          onlyActive: true,
        },
      });
      setReservasMF(Array.isArray(data?.rows) ? data.rows : []);
      console.log(' reservasMF:', data.rows);
    } catch (err) {
      console.error('Error obteniendo reservas MF:', err);
    }
  })();
}, []);

const allMembresias = useMemo(() => {
if (!Array.isArray(dataGroup)) return [];
return dataGroup.flatMap(pgm =>
  Array.isArray(pgm?.detalle_ventaMembresium) ? pgm.detalle_ventaMembresium : []);
}, [dataGroup]);
const pgmNameById = useMemo(() => {
  const map = {};
  (Array.isArray(dataGroup) ? dataGroup : []).forEach(p => {
    const id = p?.id_pgm;
    const name =
      p?.name_pgm ||
      p?.tb_programa_training?.name_pgm ||
      p?.tb_programa?.name_pgm ||
      null;
    if (id && name) map[id] = name;
  });
  return map;
}, [dataGroup]);
const [tasaCambio, setTasaCambio] = React.useState(3.37);
const renewalsLocal = useMemo(() => {
  const today = new Date(); today.setHours(0,0,0,0);
  return (allMembresias || []).map((m, idx) => {
    const fin = getFechaFin(m);
    const diff = fin ? Math.round((fin - today) / 86400000) : null;

    const cli =
      m?.tb_ventum?.tb_cliente?.nombres_apellidos ||
      [m?.tb_ventum?.tb_cliente?.nombres, m?.tb_ventum?.tb_cliente?.apellidos].filter(Boolean).join(' ') ||
      m?.tb_cliente?.nombres_apellidos ||
      "SIN NOMBRE";

    const ejecutivo =
      m?.tb_ventum?.tb_empleado?.nombre_empl ||
      m?.tb_ventum?.tb_empleado?.nombres_apellidos_empl ||
      m?.tb_ventum?.tb_empleado?.nombres_apellidos ||
      "-";

    const plan =
      m?.tb_programa_training?.name_pgm ||   
      m?.tb_programa?.name_pgm ||           
      m?.tb_programaTraining?.name_pgm ||   
      m?.name_pgm ||                         
      pgmNameById?.[m?.id_pgm] ||           
      (m?.id_pgm ? `PGM ${m.id_pgm}` : "-"); 

    return {
      id: m?.id || `m-${idx}`,
       id_pgm: m?.id_pgm ?? null,
      cliente: cli,
      plan,
      fechaFin: fin ? fin.toISOString().slice(0,10) : null,
      dias_restantes: diff,
      monto: Number(m?.tarifa_monto ?? 0),
      ejecutivo,
      notas: "", // si tienes notas, mapea aquí
    };
  });
}, [allMembresias, pgmNameById]);

function agruparPorVenta(data) {
    if (!Array.isArray(data)) {
        console.error("La variable 'data' no es un array válido."); 
        return [];
      }
    
      const resultado = data?.reduce((acc, item) => {
        const idVenta = item?.tb_ventum?.id; 
        if (!acc.has(idVenta)) {
          acc.set(idVenta, item);
        }
       
        return acc;
      }, new Map());

    return Array.from(resultado?.values()); 
}  
const advisorOriginByProg = useMemo(() => {
 
    const outSets = {};
    const src = Array.isArray(dataGroup) ? dataGroup : [];
    console.log("dataGroup (para advisorOriginByProg)", [dataGroup]);

    for (const pgm of src) {
        const progKey = (progNameById[pgm?.id_pgm] || pgm?.name_pgm || "").trim().toUpperCase();
        if (!progKey) continue;
        if (!outSets[progKey]) outSets[progKey] = {};

        const allItems = Array.isArray(pgm?.detalle_ventaMembresium) ? pgm.detalle_ventaMembresium : [];

        const ventasUnicas = agruparPorVenta(allItems);

        const ventasSinCeros = ventasUnicas.filter(f => Number(f?.tarifa_monto) !== 0);
        const ventasEnCeros = ventasUnicas.filter(f => Number(f?.tarifa_monto) === 0);     
        const transferencias = Array.isArray(pgm?.ventas_transferencias) ? pgm.ventas_transferencias : [];
        const getAsesor = (v) => {
            const nombreFull =
                v?.tb_ventum?.tb_empleado?.nombre_empl ||
                v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl ||
                v?.tb_ventum?.tb_empleado?.nombres_apellidos || "";
            return (nombreFull.split(" ")[0] || "").toUpperCase();
        };

        const allSalesForAdvisors = [...ventasSinCeros, ...ventasEnCeros, ...transferencias];
        for (const v of allSalesForAdvisors) {
            const asesor = getAsesor(v);
            if (!asesor) continue; 
            if (!outSets[progKey][asesor]) {
                outSets[progKey][asesor] = {
                    nuevos: [],
                    renovaciones: [],
                    reinscripciones: [],
                    canjes: [],
                    transferencias: [],
                    traspasos: []
                };
            }
        }

        for (const v of ventasSinCeros) {
            const asesor = getAsesor(v);
            if (!asesor) continue;

            const o = v?.tb_ventum?.id_origen;
            if (o === 691) { // Renovados 
                outSets[progKey][asesor].renovaciones.push(v);
            } else if (o === 692 || o === 696) { // Reinscritos [cite: 87, 140]
                outSets[progKey][asesor].reinscripciones.push(v);
            } else { // Nuevos (todos los demás origenes) 
                outSets[progKey][asesor].nuevos.push(v);
            }
        }

        // 5. Procesar ventasEnCeros (Canjes, Traspasos) 
        for (const v of ventasEnCeros) {
            const asesor = getAsesor(v);
            if (!asesor) continue;

            const tipoFactura = v?.tb_ventum?.id_tipoFactura;
            if (tipoFactura === 701) { // Traspasos 
                outSets[progKey][asesor].traspasos.push(v);
            } else if (tipoFactura === 703) { // Canjes 
                outSets[progKey][asesor].canjes.push(v);
            }
        }
        
        for (const v of transferencias) {
            const asesor = getAsesor(v);
            if (!asesor) continue;
            outSets[progKey][asesor].transferencias.push(v);
        }
    }
    const outCounts = {};
    Object.entries(outSets).forEach(([progKey, asesoresObj]) => {
        outCounts[progKey] = {};
        Object.entries(asesoresObj).forEach(([asesor, byTipo]) => {      
            const otros = byTipo.canjes.length + byTipo.transferencias.length;
            outCounts[progKey][asesor] = {
                nuevos: byTipo.nuevos.length,
                renovaciones: byTipo.renovaciones.length,
                reinscripciones: byTipo.reinscripciones.length,
                o: otros, 
            
                canjes: byTipo.canjes.length,
                transferencias: byTipo.transferencias.length,
                traspasos: byTipo.traspasos.length,
            };
        });
    });

    return outCounts;

}, [dataGroup, progNameById]);
const [start, end] = useMemo(() => {
  if (!Array.isArray(RANGE_DATE) || !RANGE_DATE[0] || !RANGE_DATE[1]) return [null, null];
  return [new Date(RANGE_DATE[0]), new Date(RANGE_DATE[1])];
}, [RANGE_DATE]);
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
      { urlImage: "/vertikal_negro.png", name_image: "VERTIKAL CHANGE" }, 
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

      const countDigitalClientsForMonth = (ventasList = [], anio, mesNombre, fromDay = 1, cut = cutDay) => {
        
        const monthLower = String(mesNombre).toLowerCase();
        const monthIdx = MESES.indexOf(monthLower === "septiembre" ? "septiembre" : monthLower);
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

      const mesesSeleccionados = useMemo(() => {
  const slots = [];
  let mIdx = selectedMonth - 1;
  let y = year;
  for (let i = 0; i < 12; i++) {
    slots.push({ y, mIdx });
    mIdx--; if (mIdx < 0) { mIdx = 11; y--; }
  }

  const actual = { y: year, mIdx: selectedMonth - 1 };
  const keyActual = `${actual.y}-${actual.mIdx}`;

  const scored = slots
    .filter(p => `${p.y}-${p.mIdx}` !== keyActual) 
    .map(p => ({
      ...p,
      score: sumProgramRevenueForMonth(dataVentas, p.y, p.mIdx, initDay, cutDay),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // top 3

  const toFechaObj = ({ y, mIdx }) => ({
    label: MESES[mIdx].toUpperCase(),
    anio: String(y),
    mes: MESES[mIdx], 
  });

  const topOrdenados = [...scored]
    .sort((a, b) => new Date(a.y, a.mIdx) - new Date(b.y, b.mIdx))
    .map(toFechaObj);

  return [...topOrdenados, toFechaObj(actual)];
}, [dataVentas, selectedMonth, year, initDay, cutDay]);
const dataMktWithCac = useMemo(() => {
  const base = { ...(dataMktByMonth || {}) };

  for (const f of mesesSeleccionados) {
    const mesKey = f.mes === 'septiembre' ? 'setiembre' : f.mes;
    const key = `${f.anio}-${mesKey}`;
    const obj = { ...(base[key] || {}) };
    const inversion = Number(obj.inversiones_redes ?? obj.inversion_redes ?? 0);

    const clientesTotales = countDigitalClientsForMonth(
      dataVentas || [], f.anio, f.mes, initDay, cutDay
    );

    let clientes_por_red = { tiktok: 0, meta: 0 };

    for (const v of dataVentas || []) {
      const iso = v?.fecha_venta || v?.fecha || v?.createdAt;
      if (!iso) continue;
      const d = limaFromISO(iso);
      if (!d) continue;
      if (d.getFullYear() !== Number(f.anio)) continue;
      if (d.getMonth() !== MESES.indexOf(f.mes)) continue;

      const origin = detectDigitalOrigin(v);
      if (origin === "tiktok") clientes_por_red.tiktok++;
      if (origin === "facebook" || origin === "instagram" || origin === "meta")
        clientes_por_red.meta++;
    }

    obj.clientes_digitales = clientesTotales;
    obj.clientes_por_red = clientes_por_red; // 👈 clave para el hijo
    obj.cac = clientesTotales > 0 ? +(inversion / clientesTotales).toFixed(2) : 0;

    base[key] = obj;
  }
  return base;
}, [dataMktByMonth, dataVentas, mesesSeleccionados, initDay, cutDay]);


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

const handleSetUltimoDiaMes = () => {
  const ultimoDia = new Date(year, selectedMonth, 0).getDate();
  setCutDay(ultimoDia);
};

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
const [renewalsApi, setRenewalsApi] = useState([]);
useEffect(() => {
  (async () => {
    const { data } = await PTApi.get('/parametros/renovaciones/por-vencer', { params: { empresa: id_empresa || 598, dias: 15 }});
    setRenewalsApi(Array.isArray(data?.renewals) ? data.renewals : []);
  })();
}, [id_empresa]);
const [vigentesRows, setVigentesRows] = useState([]);
const [vigentesTotal, setVigentesTotal] = useState(0);

useEffect(() => {
  (async () => {
    try {
      const { data } = await PTApi.get('/parametros/membresias/vigentes/lista', {
        params: { 
          empresa: id_empresa || 598,
          year,
          selectedMonth,
          cutDay
        }
      });
      setVigentesRows(Array.isArray(data?.vigentes) ? data.vigentes : []);
      setVigentesTotal(Number(data?.total || 0));
    } catch (e) {
      console.error("vigentes/lista error:", e?.message);
      setVigentesRows([]); setVigentesTotal(0);
    }
  })();
}, [id_empresa, year, selectedMonth, cutDay]);

const vigentesBreakdown = useMemo(() => {
  const counter = new Map();

  for (const r of vigentesRows) {
    // El backend ya manda "plan" (CHANGE 45, FS 45, etc.)
    const name =
      r?.plan ||
      pgmNameById?.[r?.id_pgm] ||
      r?.tb_programa_training?.name_pgm ||
      r?.tb_programa?.name_pgm ||
      r?.tb_programaTraining?.name_pgm ||
      "SIN PROGRAMA";

    const key = norm(name);
    if (!counter.has(key)) counter.set(key, { label: name, count: 0 });
    counter.get(key).count += 1;
  }

  return Array.from(counter.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}, [vigentesRows, pgmNameById]);


const productosPorAsesor = useProductosAgg(dataVentas, RANGE_DATE, { minImporte: 0 });
const originMap = {
  "693":"Instagram", "694":"Facebook", "695":"TikTok",
  "690":"Referidos", "691":"RENOVACIONES",
  "692":"REINSCRIPCIONES", "696":"EX-PT ",
  "686":"Walking",// "689":"WSP organico",
  //"1470":"Corporativos BBVA",
  "instagram":"Instagram","facebook":"Facebook","tiktok":"TikTok","meta":"Meta",
  "1514":"TikTok","1515":"Meta",
  0: "OTROS",                   
  "": "OTROS",               
  null: "OTROS", undefined: "OTROS" 
};
    return (
  <>
    <PageBreadcrumb title="INFORME GERENCIAL" subName="Ventas" />
    {/* === CONTROLES SUPERIORES === */}
    <Row className="mb-3">
      <Col lg={12}>
    <TopControls
  key={`tc-${year}-${selectedMonth}-${cutDay}-${vigentesTotal}`}
  selectedMonth={selectedMonth}
  setSelectedMonth={setSelectedMonth}
  initDay={initDay}
  setInitDay={setInitDay}
  cutDay={cutDay}
  setCutDay={setCutDay}
  year={year}
  onUseLastDay={handleSetUltimoDiaMes}
  vigentesCount={vigentesTotal}
  vigentesBreakdown={vigentesBreakdown}
  avataresDeProgramas={avataresDeProgramas}
  useAvatars={true}
   onChangeTasa={setTasaCambio}
     tasaCambio={tasaCambio}  
/>

      </Col>
    </Row>  
    <Row className="mb-3">
  <Col lg={12}>
   <RenovacionesPorVencer
  renewals={renewalsApi.length ? renewalsApi : renewalsLocal}
  daysThreshold={15}
  title="Renovaciones próximas a vencer (≤ 15 días)"
  excludeZeroAmount
  showSummary
  pgmNameById={pgmNameById} 
/>
  </Col>
</Row>

    <Row className="mb-6">
      <Col lg={12} className="pt-0">
        <div style={{ marginBottom: "30px" }}>
          <ExecutiveTable
            ventas={dataVentas}
            fechas={mesesSeleccionados}
            dataMktByMonth={dataMktWithCac}
            initialDay={initDay}
            cutDay={cutDay}
      reservasMF={reservasMF}
        originMap={originMap}  
        selectedMonth={selectedMonth}
  tasaCambio={tasaCambio}            />
        </div>
          <div style={{ marginBottom: "32px", marginTop: "90px" }}>
          <ComparativoVsActual
            ventas={dataVentas}
            fechas={mesesSeleccionados}
            dataMktByMonth={dataMkt}
              reservasMF={reservasMF}
            initialDay={initDay}
            cutDay={cutDay}
          />
        </div>
         <ClientesPorOrigen
  ventas={dataVentas}
  fechas={mesesSeleccionados}
  initialDay={initDay}
  cutDay={cutDay}
  uniqueByClient={false}   
  originMap={{
    703: "CANJE",
    701: "TRASPASO",
    1443: "CANJE",
    686: "Walking",
    687: "Mail",
    690: "REFERIDOS",
    691: "RENOVACIONES",
    692: "REINSCRIPCIONES",
    693: "Instagram",
    694: "Facebook",
    695: "TikTok",
    696: "EX-PT",
    689: "WSP organico",
  //  1470: "CORPORATIVOS BBVA",
  }}
/>
        <Row className="mb-3">
  <Col lg={12}>
    <RenovacionesPanel
      id_empresa={id_empresa}
      baseDate={new Date(year, selectedMonth - 1, 1)} 
      months={12}             
      beforeDays={0}       
      afterDays={91}        
      title="RENOVACIONES - 2025 "
      items={dataVentas}
      carteraHistoricaInicial={0}
    />
  </Col>
</Row>
<ExecutiveTable2
  ventas={dataVentas}
  fechas={mesesSeleccionados}
  dataMktByMonth={dataMktWithCac}
  initialDay={initDay}
  cutDay={cutDay}
  reservasMF={reservasMF}
  originMap={originMap}
  selectedMonth={selectedMonth}
  tasaCambio={tasaCambio}
/>
        <div style={{ marginBottom: "32px", marginTop: "80px" }}>
       
        </div>
      </Col>
      {/* === COMPARATIVOS Y GRÁFICOS === */}
      <Col lg={12}>
      
        <div style={{ marginBottom: "32px", marginTop: "90px" }}>
          <GraficoLinealInversionRedes
            data={dataLeadPorMesAnio}
            fechas={[new Date()]}
          />
        </div>     
      </Col>
      <Row className="mb-6">
        <Col lg={12}>
          <SumaDeSesiones
          ventas={dataVentas}
          year={year}
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
      <Col lg={12}>
  <div style={{ marginTop: "15px", textAlign:"center" }}>
    <TarjetasProductos 
      tasks={productosPorAsesor}          
      title="Ranking Venta de Productos"
      topN={5}
      minImporte={0}
      avatarByAdvisor={avatarByAdvisor}   
    />
  </div>
  </Col>
<div style={{ marginBottom: 44 }}>
  <VentasDiarias
    ventas={dataVentas}
    year={year}
    month={selectedMonth}
    initDay={initDay}
    cutDay={cutDay}
    showSocios={true}
    sumMode="programas"
    avatarByAdvisor={avatarByAdvisor}
  />
  <GraficoLinealVentasDiarias
  ventas={dataVentas}
  year={year}
  month={selectedMonth}
  initDay={initDay}
  cutDay={cutDay}
  //asesores={listaAsesoresOpcional}
/>
<Row className="mb-6 mt-5">
  <Col lg={12}>
    <VigentesTable
      items={vigentesRows}
      title={`SOCIOS VIGENTES (${vigentesTotal})`}
    />
  </Col>
</Row>
<Row className="mb-6 mt-5">
  <Col lg={12}>
    <VigentesResumenMensual
      id_empresa={id_empresa}
      year={year}
      selectedMonth={selectedMonth}
      pgmNameById={pgmNameById}
      avataresDeProgramas={avataresDeProgramas}
    />
  </Col>
</Row>
</div>
    </Row>
  </>
);
      };
