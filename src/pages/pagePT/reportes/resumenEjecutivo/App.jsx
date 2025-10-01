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
//import {SumaDeSesiones} from '../totalVentas/SumaDeSesiones';

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
 
  useEffect(() => {
    console.log('RANGE_DATE:', RANGE_DATE);
    if (RANGE_DATE && RANGE_DATE[0] && RANGE_DATE[1]) {
      obtenerVentas(RANGE_DATE);
    }
    obtenerTablaVentas(id_empresa || 598);
    obtenerLeads(id_empresa || 598);
  }, [id_empresa, RANGE_DATE]);

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
  const [cutDay, setCutDay] = useState(new Date().getDate()); 
  const [initDay, setInitDay] = useState(1);
  console.log({dataVentas});
  
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
  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const startDate = new Date(year, month, initDay);
    const endDate = new Date(year, month, cutDay);
    dispatch(onSetRangeDate([startDate, endDate]));
  }, [initDay, cutDay, dispatch]);

  return (
    <>
      <PageBreadcrumb title="RESUMEN EJECUTIVO" subName="Ventas" />
      <Row className="mb-3">
        <Col lg={12}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontWeight: 600, fontSize: "2em", color: "black" }}>Día de inicio:</label>
              <select
                value={initDay}
                onChange={(e) => setInitDay(parseInt(e.target.value, 10))}
                style={{ fontSize: "1.5em" }}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontWeight: 600, fontSize: "2em", color: "black" }}>Día de corte:</label>
              <select
                value={cutDay}
                onChange={(e) => setCutDay(parseInt(e.target.value, 10))}
                style={{ fontSize: "1.5em" }}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <RealTimeClock />
          </div>
        </Col>
      </Row>

      <Row className="">
        <Col lg={6} className="pt-0">
          <Row>
            <Col lg={12} className="mb-4">
              <ExecutiveTable    ventas={dataVentas}
                fechas={[
                  // { label: 'MAYO',  anio: '2025', mes: 'mayo' },
                  // { label: 'JUNIO', anio: '2025', mes: 'junio' },
                  { label: 'JULIO', anio: '2025', mes: 'julio' },
                  { label: 'AGOSTO',anio: '2025', mes: 'agosto' },
                  { label: 'SEPTIEMBRE',anio: '2025', mes: 'septiembre' },
                  { label: 'OCTUBRE',anio: '2025', mes: 'octubre' },
                ]}
                dataMktByMonth={dataMkt}
                initialDay={initDay}
                cutDay={cutDay} />
            </Col>
            <Col lg={12}>
              <ClientesPorOrigen
                ventas={dataVentas.filter(v => v.id_origen && v.id_origen !== 0)}           // tu array de ventas
                fechas={[
                  // { label: 'MAYO', anio: '2025', mes: 'mayo' },
                  // { label: 'JUNIO', anio: '2025', mes: 'junio' },
                  { label: 'JULIO', anio: '2025', mes: 'julio' },
                  { label: 'AGOSTO', anio: '2025', mes: 'agosto' },
                  { label: 'SEPTIEMBRE', anio: '2025', mes: 'septiembre' }, 
                  { label: 'OCTUBRE', anio: '2025', mes: 'octubre' }, 
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
                  // 1454: 'WALK-IN',
                  // 1455: 'DIGITAL',
                  // 1456: 'REFERIDO',
                  // 1457: 'CARTERA',
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6}>
          <Row>
            <Col lg={12} className="mb-4">
              <ComparativoVsActual
                  fechas={[
                    // { label: 'MAYO',  anio: '2025', mes: 'mayo' },
                    // { label: 'JUNIO', anio: '2025', mes: 'junio' },
                    { label: 'JULIO', anio: '2025', mes: 'julio' },
                    { label: 'AGOSTO',anio: '2025', mes: 'agosto' },
                    { label: 'SEPTIEMBRE',anio: '2025', mes: 'septiembre' },
                    { label: 'OCTUBRE',anio: '2025', mes: 'octubre' },
                  ]}
                  ventas={dataVentas}
                  initialDay={initDay}
                  cutDay={cutDay}            // día de corte opcional (1..31)
                  // referenceMonth={"agosto"} // opcional; si lo omites, usa el último mes con datos
                />
            </Col>
            <Col lg={12}>
                  <GraficoLinealInversionRedes
                    data={dataLeadPorMesAnio}
                    fechas={[new Date()]}
                  />
            </Col>
             {/* 👇 Aquí agregamos la tabla de ranking */}
    <Col lg={12} className="mb-4">
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
    </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
