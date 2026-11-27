import React from "react";
import { Col, Row } from "react-bootstrap";
import { PageBreadcrumb } from "@/components";
import { TopControls } from "../resumenEjecutivo/components/TopControls";
import { ExecutiveTable2 } from "../resumenEjecutivo/components/ExecutibleTable2";
import { useResumenEjecutivoStore } from "../resumenEjecutivo/useResumenEjecutivoStore";
import { InversionRedesComparativoAnual } from "./InversionRedesComparativoAnual";

const ReporteRedesSociales = ({ id_empresa }) => {
  const {
    selectedMonth, initDay, cutDay, tasaCambio,
    setSelectedMonth, setInitDay, setCutDay, handleSetUltimoDiaMes, setTasaCambio,
    vigentesTotal, vigentesBreakdown, avataresDeProgramas,
    dataVentas, mesesTop5, dataMktWithCac, reservasMF, originMap,
    isLoading, year, setYear,
  } = useResumenEjecutivoStore(id_empresa);

  return (
    <>
      <PageBreadcrumb title="REPORTE REDES SOCIALES" subName="Marketing" />
      {isLoading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <span className="loader"></span>
        </div>
      )}

      <Row className="mb-3">
        <Col lg={12}>
          <TopControls
            key={`tc-${year}-${selectedMonth}-${cutDay}-${vigentesTotal}`}
            selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
            initDay={initDay} setInitDay={setInitDay}
            cutDay={cutDay} setCutDay={setCutDay}
            year={year} onUseLastDay={handleSetUltimoDiaMes}
            vigentesCount={vigentesTotal} vigentesBreakdown={vigentesBreakdown}
            avataresDeProgramas={avataresDeProgramas} useAvatars={true}
            onChangeTasa={setTasaCambio} tasaCambio={tasaCambio}
            setYear={setYear}
          />
        </Col>
      </Row>

      <Row className="mb-6">
        <Col lg={12}>
          <ExecutiveTable2
            soloRedes
            ventas={dataVentas} fechas={mesesTop5}
            dataMktByMonth={dataMktWithCac} initialDay={initDay} cutDay={cutDay}
            reservasMF={reservasMF} originMap={originMap}
            selectedMonth={selectedMonth} tasaCambio={tasaCambio} year={year}
          />
        </Col>
      </Row>

      {/* inversion en redes por año y mes (formato del comparativo anual de flujo de caja) */}
      <Row className="mb-6">
        <Col lg={12}>
          <InversionRedesComparativoAnual tasaCambio={tasaCambio} />
        </Col>
      </Row>
    </>
  );
};

export default ReporteRedesSociales;
