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
            // marginTop: "15px", // Eliminado para centrar verticalmente
          color: "black",
        }}
      >
        Hora: {formattedTime}
      </div>
    );
  };
  export const App = ({ id_empresa }) => {
  const { obtenerTablaVentas, dataVentas, obtenerLeads, dataLead, dataLeadPorMesAnio } = useVentasStore();
    const { obtenerVentas, repoVentasPorSeparado, loading } = useReporteStore();
    const [clickServProd, setclickServProd] = useState("total");
    const { RANGE_DATE } = useSelector(e => e.DATA);
    const dispatch = useDispatch();
    const [cutDay, setCutDay] = useState(new Date().getDate()); 
    const [initDay, setInitDay] = useState(1);
    console.log({dataVentas});
  // Estado para mes seleccionado
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1 = enero ... 12 = diciembre
  const year = new Date().getFullYear();

  useEffect(() => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, selectedMonth - 1, initDay);
    const endDate = new Date(year, selectedMonth - 1, cutDay);
    dispatch(onSetRangeDate([startDate, endDate]));
  }, [selectedMonth, initDay, cutDay, dispatch]);


    useEffect(() => {
      console.log('RANGE_DATE:', RANGE_DATE);
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
// 👇 lee los datos por programa (como en ty)
const { obtenerComparativoResumen, dataGroup } = useReporteResumenComparativoStore();

// 👇 ya usas RANGE_DATE; dispara la carga por programa
useEffect(() => {
  if (RANGE_DATE?.[0] && RANGE_DATE?.[1]) {
    obtenerComparativoResumen(RANGE_DATE);
  }
}, [RANGE_DATE]);

// 👇 mapeo de id de programa a la etiqueta que usas en avatares
const progNameById = {
  2: "CHANGE 45",
  3: "FS 45",
  4: "FISIO MUSCLE",
  5: "VERTIKAL CHANGE",
};

// 👉 construimos el override dinámico { "CHANGE 45": { ALEJANDRO: 19, ALVARO: 12 }, "FS 45": {...} }
const sociosOverride = useMemo(() => {
  try {
    if (!Array.isArray(dataGroup)) {
      console.log("[sociosOverride] dataGroup NO es array:", dataGroup);
      return {};
    }

    // Rango real (00:00:00 y 23:59:59.999)
    const start = RANGE_DATE?.[0] ? new Date(RANGE_DATE[0]) : null;
    const end   = RANGE_DATE?.[1] ? new Date(RANGE_DATE[1]) : null;
    if (end) end.setHours(23,59,59,999);

    console.log("[sociosOverride] RANGE_DATE raw:", RANGE_DATE);
    console.log("[sociosOverride] start:", start, "end (EO day):", end);

    // Normalizador robusto de fechas del backend
    const parseBackendDate = (s) => {
      if (!s) return null;
      // ejemplos backend: "2025-09-24 15:13:05.000 -05:00"
      // 1) mete la 'T' y pega el offset al tiempo
      const normalized = String(s).replace(" ", "T").replace(" -", "-");
      const d = new Date(normalized);
      if (!Number.isNaN(d.getTime())) return d;
      // fallback con dayjs (por si llega en otro formato)
      const d2 = dayjs(s).toDate();
      return Number.isNaN(d2.getTime()) ? null : d2;
    };

    const res = {};

    for (const pgm of dataGroup) {
      const progKey = (progNameById[pgm?.id_pgm] || pgm?.name_pgm || "").trim().toUpperCase();
      if (!progKey) continue;
      if (!res[progKey]) res[progKey] = {};

      const source = Array.isArray(pgm?.detalle_ventaMembresium) ? pgm.detalle_ventaMembresium : [];
      console.log(`\n[${progKey}] total detalle_ventaMembresium:`, source.length);

      // 1) filtra ventas pagadas dentro del rango
      const ventas = source.filter(v => {
        if (!v || Number(v?.tarifa_monto) === 0) return false; // quita canjes/traspasos
        const iso =
          v?.tb_ventum?.fecha_venta ||
          v?.tb_ventum?.createdAt ||
          v?.fecha_venta ||
          v?.createdAt;

        const d = parseBackendDate(iso);

        if (!d || !start || !end) {
          if (!d) console.log(`[${progKey}] fecha invalida:`, iso);
          return false;
        }
        const ok = d >= start && d <= end;
        if (!ok) {
          // ayuda visual para entender por qué no entra al rango
          console.log(
            `[${progKey}] fuera de rango -> fecha:`, d,
            "| start:", start,
            "| end:", end,
            "| raw:", iso
          );
        }
        return ok;
      });

      console.log(`[${progKey}] ventas dentro de rango:`, ventas.length);

      // 2) por asesor (clientes únicos)
      const porAsesor = new Map();
      for (const v of ventas) {
        const nombreFull =
          v?.tb_ventum?.tb_empleado?.nombre_empl ||
          v?.tb_ventum?.tb_empleado?.nombres_apellidos_empl ||
          v?.tb_ventum?.tb_empleado?.nombres_apellidos ||
          "";
        const asesor = (nombreFull.split(" ")[0] || "").toUpperCase();
        if (!asesor) {
          console.log(`[${progKey}] venta sin asesor:`, v?.tb_ventum?.tb_empleado);
          continue;
        }
        const idCliente =
          v?.tb_ventum?.id_cli ??
          v?.id_cli ??
          v?.tb_cliente?.id_cli ??
          v?.tb_ventum?.tb_cliente?.id_cli;

        if (!idCliente) {
          console.log(`[${progKey}] venta sin id_cli:`, v?.tb_ventum);
          continue;
        }

        if (!porAsesor.has(asesor)) porAsesor.set(asesor, new Set());
        porAsesor.get(asesor).add(idCliente);
      }

      porAsesor.forEach((setIds, asesor) => {
        res[progKey][asesor] = setIds.size;
      });

      console.log(`[${progKey}] override por asesor:`, Object.fromEntries(
        Array.from(porAsesor.entries()).map(([k, s]) => [k, s.size])
      ));
    }

    console.log("[sociosOverride] RESULT:", res);
    return res;
  } catch (e) {
    console.error("[sociosOverride] error:", e);
    return {};
  }
}, [dataGroup, RANGE_DATE]);



    // columnas (las del diseño de tu imagen)
    const columns = useMemo(() => ([
      // { key: "marzo",  label: "MARZO",  currency: "S/." },
      // { key: "abril",  label: "ABRIL",  currency: "S/." },
      { key: "mayo",   label: "MAYO",   currency: "S/." },
      { key: "junio",  label: "JUNIO",  currency: "S/." },
      { key: "julio",  label: "JULIO",  currency: "S/." },
      { key: "agosto", label: "AGOSTO", currency: "S/." },
      { key: "septiembre", label: "SEPTIEMBRE", currency: "S/." },
    ]), []);

    // (opcional) KPIs de marketing por mes
    const marketing = {
      inversion_redes: { marzo: 1098, abril: 3537, mayo: 4895, junio: 4622, julio: 4697, agosto: 5119, septiembre: 0 },
      leads:           { marzo: 84,  abril: 214,  mayo: 408,  junio: 462,  julio: 320,  agosto: 417, septiembre: 0  },
      cpl:             { marzo: 13.07,  abril: 16.53,   mayo: 12,   junio: 10,    julio: 14.68,   agosto: 12.28, septiembre: 0   },
      cac:             { marzo: null,  abril: null,   mayo: null,   junio: null,   julio: null,   agosto: null, septiembre: 0   },
    };


    const tableData = useMemo(() => ventasToExecutiveData({
      ventas: dataVentas,
      columns,
      titleLeft: "CIRCUS",
      titleRight: `RESUMEN EJECUTIVO HASTA EL ${cutDay} DE CADA MES`,
      marketing,
      cutDay,               // coméntalo si no quieres corte
      initDay,
      footerFullMonth: true // footer = mes completo
    }), [dataVentas, columns, marketing, cutDay]);
    // Mapea tus IDs reales
    const originMap = {
      1454: "WALK-IN",
      1455: "DIGITAL",
      1456: "REFERIDO",
      1457: "CARTERA",
    };
    const dataMkt = buildDataMktByMonth(dataLead, initDay, cutDay)

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

  function getLastNMonths(selectedMonth, year, n = 4) {
    const result = [];
    let monthIdx = selectedMonth - 1; // 0-based
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
        monthIdx = 11; // diciembre
        currentYear--; // retrocede un año
      }
    }
    return result.reverse(); // para que quede cronológico
  }

    
  function generarResumenRanking(array) {
    // Totales generales
    const sumaMontoTotal = array.reduce((acc, row) => acc + (row?.monto || 0), 0);
    const sumaTotalSocios = array.reduce((acc, row) => acc + (row.socios || 0), 0);
    const sumaTotalSesiones = array.reduce((acc, row) => acc + (row.sesiones || 0), 0);

    // Filas por asesor
    const resumenFilas = array.map((row) => {
      const nombreAsesor = row.empl?.split(" ")[0] || row.nombre || "";
      const socios = row.socios || 0;

      // Ticket medio: monto / socios (sin dividir entre 2)
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
    { urlImage: "/change_blanco.png", name_image: "CHANGE 45" },
    { urlImage: "/fs45_blanco.png", name_image: "FS 45" },
    { urlImage: "/muscle_blanco.png", name_image: "FISIO MUSCLE" },
  // { urlImage: "https://archivosluroga.blob.core.windows.net/membresiaavatar/cyl-avatar.png", name_image: "CHANGE YOUR LIFE" },
   { urlImage: "/vertikal_act.png", name_image: "VERTIKAL CHANGE" }, // <--- imagen local
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

    // Sesiones: suma segura
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

  const countDigitalClientsForMonth = (ventasList = [], anio, mesNombre, fromDay = 1, cut = 21) => {
    
    const MESES_LOCAL = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const monthLower = String(mesNombre).toLowerCase();
    const monthIdx = MESES_LOCAL.indexOf(monthLower === "septiembre" ? "septiembre" : monthLower);
    if (monthIdx < 0) return 0;

    let cnt = 0;
    for (const v of ventasList) {
      const iso = v?.fecha_venta || v?.fecha || v?.createdAt;
      if (!iso) continue;
      const d = new Date(iso);
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

  const mesesSeleccionados = getLastNMonths(selectedMonth, year);

  const dataMktWithCac = useMemo(() => {
    try {
      const copy = { ...(dataMkt || {}) };
      const meses = mesesSeleccionados || [];
      meses.forEach((f) => {
        const mesRaw = String(f?.mes || "").toLowerCase();
        const mesKeyName = mesRaw === "septiembre" ? "setiembre" : mesRaw;
        const key = `${f?.anio}-${mesKeyName}`;
        const inversionesRaw = Number(copy[key]?.inversiones_redes || 0);

       
        const inversion = inversionesRaw;

        const clientesDigitales = countDigitalClientsForMonth(dataVentas || [], f?.anio, f?.mes, initDay, cutDay);
        const cac = clientesDigitales > 0 ? inversion / clientesDigitales : 0;

        if (!copy[key]) copy[key] = { inversiones_redes: inversionesRaw, leads: 0, cpl: 0, cac: 0 };
        copy[key].cac = cac;
        copy[key].clientes_digitales = clientesDigitales;
      });

      return copy;
    } catch (err) {
    
      return dataMkt || {};
    }
  }, [dataMkt, dataVentas, mesesSeleccionados, initDay, cutDay]);
  return (
      <>
        <PageBreadcrumb title="RESUMEN EJECUTIVO" subName="Ventas" />
        <Row className="mb-3">
          <Col lg={12}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"40px" }}>

            
    {/* 👇 Nuevo: Selector de mes */}
    <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
      <label style={{ fontWeight: 600, fontSize: '2em', color: 'black' }}>Mes:</label>
      <select
        value={selectedMonth}
        onChange={e => setSelectedMonth(parseInt(e.target.value, 10))}
        style={{ fontSize: '1.7em' , fontWeight: "bold" }}
      >
        {[
          "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
          "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"
        ].map((mes, idx) => (
          <option key={idx+1} value={idx+1}>{mes}</option>
        ))}
      </select>
    </div>
    {/* Día de inicio */}
    <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
      <label style={{ fontWeight: 600, fontSize: '2em', color: 'black' }}>Día de inicio:</label>
      <select
        value={initDay}
        onChange={e => setInitDay(parseInt(e.target.value, 10))}
        style={{ fontSize: '1.5em' }}
      >
        {Array.from({ length: 31 }, (_, i) => i + 1).map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>

    {/* Día de corte */}
    <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
      <label style={{ fontWeight: 600, fontSize: '2em', color: 'black' }}>Día de corte:</label>
      <select
        value={cutDay}
        onChange={e => setCutDay(parseInt(e.target.value, 10))}
        style={{ fontSize: '1.5em' }}
      >
        {Array.from({ length: 31 }, (_, i) => i + 1).map(n => (
          <option key={n} value={n}>{n}</option>
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
        <Row className="mb-4">
          <Col lg={6} className="pt-0">
            <div style={{marginBottom: '30px'}}>
            <ExecutiveTable
    ventas={dataVentas}
    fechas={mesesSeleccionados}
    dataMktByMonth={dataMktWithCac}
    initialDay={initDay}
    cutDay={cutDay}
  />
            </div>
            <div style={{marginBottom: '32px'}}>
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
          <Col lg={6}>
            <div style={{marginBottom: '32px'}}>
              <ComparativoVsActual
              ventas={dataVentas}
    fechas={mesesSeleccionados}
    dataMktByMonth={dataMkt}
    initialDay={initDay}
    cutDay={cutDay}
              />
            </div>
            <div style={{marginBottom: '32px'}}>
              <GraficoLinealInversionRedes
                data={dataLeadPorMesAnio}
                fechas={[new Date()]}
              />
            </div>
            <Col lg={12}>
              {/* 👇 Y justo después el Ranking */}
              <div style={{marginTop: '15px'}}>
                <TarjetasPago
                  tasks={
                    (TotalDeVentasxProdServ("total")?.asesores_pago || [])
                      .filter(item => item.monto && item.monto > 0)
                      .map(item => ({
                        ...item,
                        nombre: item.nombre?.split(" ")[0] || item.nombre
                      }))
                  }
                  title={"Ranking"}
                  dataSumaTotal={
                    (TotalDeVentasxProdServ("total")?.asesores_pago || [])
                      .filter(item => item.monto && item.monto > 0)
                      .reduce((total, item) => total + item.monto, 0) || 0
                  }
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
      />
    </Col>
  </Row>

        </Row>
      </>
    );
  };
