import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useVentasStore } from "./useVentasStore";
import { ventasToExecutiveData } from "./adapters/ventasToExecutiveData";
import ExecutiveTable from "./components/ExecutiveTable";
import { PageBreadcrumb } from "@/components";
import {ClientesPorOrigen} from "./components/ClientesPorOrigen";
import { ComparativoVsActual } from "./components/ComparativoVsActual";

export const App = ({ id_empresa }) => {
  const { obtenerTablaVentas, dataVentas } = useVentasStore();

  useEffect(() => { obtenerTablaVentas(598); }, [id_empresa]);

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
  const [cutDay, setCutDay] = useState(21);
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
  console.log({dataVentas});
  
  return (
    <>
          <PageBreadcrumb title="RESUMEN EJECUTIVO" subName="Ventas" />

      <Row className="mb-3">
        <Col lg={12}>
          <div style={{ display:"flex", alignItems:"center" }}>
            <label style={{ fontWeight: 600 }}>Día de inicio:</label>
            <select value={initDay} onChange={e=>setInitDay(parseInt(e.target.value,10))}>
              {Array.from({length:31},(_,i)=>i+1).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", alignItems:"center" }}>
            <label style={{ fontWeight: 600 }}>Día de corte:</label>
            <select value={cutDay} onChange={e=>setCutDay(parseInt(e.target.value,10))}>
              {Array.from({length:31},(_,i)=>i+1).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
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
    { label: 'JUNIO', anio: '2025', mes: 'junio' },
    { label: 'JULIO', anio: '2025', mes: 'julio' },
    { label: 'AGOSTO',anio: '2025', mes: 'agosto' },
    { label: 'SEPTIEMBRE',anio: '2025', mes: 'septiembre' },
  ]}
  dataMktByMonth={{
    // '2025-mayo':   { inversiones_redes: 4895, leads: 408, cpl: 12,    cac: 0 },
    '2025-junio':  { inversiones_redes: 4622, leads: 462, cpl: 10,    cac: 0 },
    '2025-julio':  { inversiones_redes: 4697, leads: 320, cpl: 14.68, cac: 0 },
    '2025-agosto': { inversiones_redes: 5119, leads: 417, cpl: 12.28, cac: 0 },
    '2025-septiembre': { inversiones_redes: 5119, leads: 417, cpl: 12.28, cac: 0 },
  }}
  initialDay={initDay}
  cutDay={cutDay} />
            </Col>
            <Col lg={12}>
          <ClientesPorOrigen
            ventas={dataVentas}             // tu array de ventas
            fechas={[
              // { label: 'MAYO', anio: '2025', mes: 'mayo' },
              { label: 'JUNIO', anio: '2025', mes: 'junio' },
              { label: 'JULIO', anio: '2025', mes: 'julio' },
              { label: 'AGOSTO', anio: '2025', mes: 'agosto' },
              { label: 'SEPTIEMBRE', anio: '2025', mes: 'septiembre' }, // acepta 'setiembre'
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
            // uniqueByClient={false} // activa esto si quieres contar ventas
          />
            </Col>
          </Row>
        </Col>
        <Col lg={6}>
              <ComparativoVsActual
                  fechas={[
                    // { label: 'MAYO',  anio: '2025', mes: 'mayo' },
                    { label: 'JUNIO', anio: '2025', mes: 'junio' },
                    { label: 'JULIO', anio: '2025', mes: 'julio' },
                    { label: 'AGOSTO',anio: '2025', mes: 'agosto' },
                    { label: 'SEPTIEMBRE',anio: '2025', mes: 'septiembre' },
                  ]}
                  ventas={dataVentas}
                  initialDay={initDay}
                  // ventas={dataVentas}
                  // initDay={initDay}
                  // columns={columns}
                  cutDay={cutDay}            // día de corte opcional (1..31)
                  // referenceMonth={"agosto"} // opcional; si lo omites, usa el último mes con datos
                />
        </Col>
      </Row>
    </>
  );
};
