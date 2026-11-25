import React from "react";
import { Col, Row } from "react-bootstrap";
import { PageBreadcrumb } from "@/components";
import { TopControls } from "../resumenEjecutivo/components/TopControls";
import ExecutiveTable from "../resumenEjecutivo/components/ExecutiveTable";
import { useResumenEjecutivoStore } from "../resumenEjecutivo/useResumenEjecutivoStore";

const ResultadosPorCanal = ({ id_empresa }) => {
  const {
    selectedMonth, initDay, cutDay, tasaCambio,
    setSelectedMonth, setInitDay, setCutDay, handleSetUltimoDiaMes, setTasaCambio,
    vigentesTotal, vigentesBreakdown, avataresDeProgramas,
    dataVentas, mesesTop5, dataMktWithCac, reservasMF, originMap,
    isLoading, year, setYear,
  } = useResumenEjecutivoStore(id_empresa);

  return (
    <>
      <PageBreadcrumb title="RESULTADOS POR CANAL" subName="Ventas" />
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
            setYear={setYear} showTC={false}
          />
        </Col>
      </Row>

      <Row className="mb-6">
        <Col lg={12}>
          <ExecutiveTable
            ventas={dataVentas} fechas={mesesTop5}
            dataMktByMonth={dataMktWithCac} initialDay={initDay} cutDay={cutDay}
            reservasMF={reservasMF} originMap={originMap}
            selectedMonth={selectedMonth} tasaCambio={tasaCambio} year={year}
          />
        </Col>
      </Row>
    </>
  );
};

export default ResultadosPorCanal;
