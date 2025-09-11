import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useVentasStore } from "./useVentasStore";
import { ventasToExecutiveData } from "./adapters/ventasToExecutiveData";
import ExecutiveTable from "./components/ExecutiveTable";
import ComparativoVsActual from "./components/ComparativoVsActual";
import { PageBreadcrumb } from "@/components";
import ClientesPorOrigen from "./components/ClientesPorOrigen";

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
  ]), []);

  // (opcional) KPIs de marketing por mes
  const marketing = {
    inversion_redes: { marzo: 1098, abril: 3537, mayo: 4895, junio: 4622, julio: 4697, agosto: 5119 },
    leads:           { marzo: 84,  abril: 214,  mayo: 408,  junio: 462,  julio: 320,  agosto: 417  },
    cpl:             { marzo: 13.07,  abril: 16.53,   mayo: 12,   junio: 10,    julio: 14.68,   agosto: 12.28   },
    cac:             { marzo: null,  abril: null,   mayo: null,   junio: null,   julio: null,   agosto: null   },
  };

  // Día de corte 1..31 (si no quieres corte, deja null)
  const [cutDay, setCutDay] = useState(21);
  const [initDay, setInitDay] = useState(1);

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
            <Col className="pt-0">
              <ExecutiveTable data={tableData} initDay={initDay} cutDay={cutDay} />
            </Col>
            <Col>
          <ClientesPorOrigen
            ventas={dataVentas}
            initDay={initDay}
            columns={columns}
            originMap={{}}
            originsOrder={[]}
            cutDay={cutDay}            // día de corte por mes
            uniqueByClient={true} // cuenta ventas (como pediste)
          />
            </Col>
          </Row>
        </Col>
        <Col lg={6}>
              <ComparativoVsActual
                  ventas={dataVentas}
                  initDay={initDay}
                  columns={columns}
                  cutDay={cutDay}            // día de corte opcional (1..31)
                  referenceMonth={"agosto"} // opcional; si lo omites, usa el último mes con datos
                />
        </Col>
      </Row>
    </>
  );
};
