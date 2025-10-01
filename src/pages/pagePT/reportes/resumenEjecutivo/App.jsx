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
import { ResumenComparativo } from "../resumenComparativo/ResumenComparativo";
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

  // Día de corte 1..31 (si no quieres corte, deja null)
 

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
  
  
 function generarResumenRanking(array) {
  // Totales generales
  const sumaMontoTotal = array.reduce((acc, row) => acc + (row?.monto || 0), 0);

  // Usamos los socios que ya trae rankingData (evitamos recalcular mal)
  const sumaTotalSocios = array.reduce((acc, row) => acc + (row.socios || 0), 0);

  // Total de sesiones
  const sumaTotalSesiones = array.reduce((acc, row) => acc + (row.sesiones || 0), 0);

  // Filas por asesor
  const resumenFilas = array.map((row) => {
    const nombreAsesor = row.empl?.split(" ")[0] || row.nombre || "";
    // Ajuste: dividir socios entre 2 y multiplicar ticket medio por 2
    const sociosAjustados = row.socios ? row.socios / 2 : 0;
    const ticketMedioAjustado = sociosAjustados ? (row.monto / sociosAjustados).toFixed(2) : "0.00";

    return [
      { header: "ASESORES", value: nombreAsesor, isPropiedad: true },
      {
        header: "S/. VENTA TOTAL",
        value: row.monto?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00",
      },
      { header: "SOCIOS", value: sociosAjustados },
      {
        header: "% VENTA TOTAL",
        value: sumaMontoTotal ? ((row.monto / sumaMontoTotal) * 100).toFixed(2) + " %" : "0 %",
      },
      {
        header: "% SOCIOS",
        value: sumaTotalSocios ? ((sociosAjustados / (sumaTotalSocios / 2)) * 100).toFixed(2) : "0",
      },
      {
        header: "S/. TICKET MEDIO",
        value: ticketMedioAjustado,
      },
      {
        header: "S/. PRECIO POR SESION",
        value: row.sesiones ? (row.monto / row.sesiones).toFixed(2) : "0.00",
      },
    ];
  });

  // Fila de totales
  const resumenTotales = [
    { header: "ASESORES", value: "TOTAL" },
    {
      header: "S/. VENTA TOTAL",
      value: sumaMontoTotal.toLocaleString("es-PE", { minimumFractionDigits: 2 }),
    },
    { header: "SOCIOS", value: sumaTotalSocios/2 },
    { header: "% VENTA TOTAL", value: "100 %" },
    { header: "% SOCIOS", value: "100 %" },
    {
      header: "S/. TICKET MEDIO",
      value: sumaTotalSocios ? (sumaMontoTotal / (sumaTotalSocios / 2)).toFixed(2) : "0.00",

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
  { urlImage: "https://archivosluroga.blob.core.windows.net/membresiaavatar/vertikal CHANGE.png", name_image: "VERTIKAL CHANGE" },
];

console.log("=== Datos crudos de asesores_pago ===");
console.log(TotalDeVentasxProdServ("total")?.asesores_pago);
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
  });


console.log("=== rankingData procesado ===");
console.log(rankingData);

const { resumenFilas, resumenTotales } = 
  rankingData.length > 0 ? generarResumenRanking(rankingData) : { resumenFilas: [], resumenTotales: [] };
const rankingDataUnicos = Object.values(
  rankingData.reduce((acc, item) => {
    if (!acc[item.nombre]) {
      acc[item.nombre] = { ...item };
    } else {
      // Si hay repetidos, suma montos, socios y sesiones
      acc[item.nombre].monto += item.monto;
      acc[item.nombre].socios += item.socios;
      acc[item.nombre].sesiones += item.sesiones;
    }
    return acc;
  }, {})
);


 return (
    <>
      <PageBreadcrumb title="RESUMEN EJECUTIVO" subName="Ventas" />
      <Row className="mb-3">
        <Col lg={12}>
         <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"40px" }}>
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

  {/* 👇 Nuevo: Selector de mes */}
  <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
    <label style={{ fontWeight: 600, fontSize: '2em', color: 'black' }}>Mes:</label>
    <select
      value={selectedMonth}
      onChange={e => setSelectedMonth(parseInt(e.target.value, 10))}
      style={{ fontSize: '1.5em' }}
    >
      {[
        "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
        "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"
      ].map((mes, idx) => (
        <option key={idx+1} value={idx+1}>{mes}</option>
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
              fechas={[
                { label: 'JUNIO', anio: '2025', mes: 'junio' },
                { label: 'JULIO', anio: '2025', mes: 'julio' },
                { label: 'AGOSTO',anio: '2025', mes: 'agosto' },
                { label: 'SEPTIEMBRE',anio: '2025', mes: 'septiembre' },
              ]}
              dataMktByMonth={dataMkt}
              initialDay={initDay}
              cutDay={cutDay}
            />
          </div>
          <div style={{marginBottom: '32px'}}>
            <ClientesPorOrigen
              ventas={dataVentas}
              fechas={[
                { label: 'JUNIO', anio: '2025', mes: 'junio' },
                { label: 'JULIO', anio: '2025', mes: 'julio' },
                { label: 'AGOSTO', anio: '2025', mes: 'agosto' },
                { label: 'SEPTIEMBRE', anio: '2025', mes: 'septiembre' },
              ]}
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
              fechas={[
                { label: 'JUNIO', anio: '2025', mes: 'junio' },
                { label: 'JULIO', anio: '2025', mes: 'julio' },
                { label: 'AGOSTO',anio: '2025', mes: 'agosto' },
                { label: 'SEPTIEMBRE',anio: '2025', mes: 'septiembre' },
              ]}
              ventas={dataVentas}
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
            <div style={{marginTop: '15px,'}}>
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
    />
  </Col>
</Row>
      </Row>
    </>
  );
};
