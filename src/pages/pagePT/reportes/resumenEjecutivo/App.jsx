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
    { urlImage: "https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png", name_image: "CHANGE 45" },
    { urlImage: "https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png", name_image: "FS 45" },
    { urlImage: "https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png", name_image: "FISIO MUSCLE" },
  // { urlImage: "https://archivosluroga.blob.core.windows.net/membresiaavatar/cyl-avatar.png", name_image: "CHANGE YOUR LIFE" },
   { urlImage: "/vertikal_act.png", name_image: "VERTIKAL CHANGE" }, // <--- imagen local
];

  const rankingData = (TotalDeVentasxProdServ("total")?.asesores_pago || [])
    .filter(item => item.monto && item.monto > 0)
    .map(item => {
      const nombre = item.tb_empleado?.nombres_apellidos_empl || item.nombre || "SIN NOMBRE";
      const socios = Array.isArray(item.items) ? item.items.length : (item.socios || 0);
      const sesiones = Array.isArray(item.items)
        ? item.items.reduce((acc, it) => acc + (it?.tb_semana_training?.sesiones || 0), 0)
        : (item.sesiones || 0);

      const ticketMedio = socios ? (item.monto / socios).toFixed(2) : "0.00";
      const precioPorSesion = sesiones ? (item.monto / sesiones).toFixed(2) : "0.00";

      return {
        ...item,
        nombre,
        socios,
        sesiones,
        ticketMedio,
        precioPorSesion
     };
  })
     .filter(item => item.monto > 0)
  .sort((a, b) => b.monto - a.monto);

  const { resumenFilas, resumenTotales } = 
    rankingData.length > 0 ? generarResumenRanking(rankingData) : { resumenFilas: [], resumenTotales: [] };
  // -------------------- CALCULO RÁPIDO DE CAC usando la tabla "Clientes por origen" --------------------
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
        // si cada fila representa 1 cliente
        cnt += 1;
        // si quieres contar un campo distinto (p.ej. v.cantidad), cámbialo:
        // cnt += Number(v.cantidad || 1)
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

        // Ajusta aquí si en tu tabla ya multiplicas por 3.7 para mostrar (por ahora uso el valor tal cual)
        const inversion = inversionesRaw; // si necesitas: inversionesRaw * 3.7

        const clientesDigitales = countDigitalClientsForMonth(dataVentas || [], f?.anio, f?.mes, initDay, cutDay);
        const cac = clientesDigitales > 0 ? inversion / clientesDigitales : 0;

        if (!copy[key]) copy[key] = { inversiones_redes: inversionesRaw, leads: 0, cpl: 0, cac: 0 };
        copy[key].cac = cac;
        copy[key].clientes_digitales = clientesDigitales;
      });

      return copy;
    } catch (err) {
      //console.error("Error calculando dataMktWithCac:", err);
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

 { /*<Row>
    <Col lg={12}>
      <SumaDeSesiones
        resumenArray={resumenFilas}
        resumenTotales={resumenTotales}
        avataresDeProgramas={avataresDeProgramas}
      />
    </Col>
  </Row>*/}

        </Row>
      </>
    );
  };
