import React from "react";
import { Col, Row } from "react-bootstrap";
import { PageBreadcrumb } from "@/components";
import { TopControls } from "./components/TopControls";
import RenovacionesPorVencer from "./components/RenovacionesPorVencer";
import ExecutiveTable from "./components/ExecutiveTable";
import { ComparativoVsActual } from "./components/ComparativoVsActual";
import { ClientesPorOrigen } from "./components/ClientesPorOrigen";
import RenovacionesPanel from "./components/RenovacionesPanel";
import { ExecutiveTable2 } from "./components/ExecutibleTable2";
import { GraficoLinealInversionRedes } from "./components/GraficoLinealInversionRedes";
import { SumaDeSesiones } from '../totalVentas/SumaDeSesiones';
import { TarjetasProductos } from '../totalVentas/TarjetasProductos';
import VentasDiarias from "../totalVentas/components/VentasDiarias";
import { GraficoLinealVentasDiarias } from "../totalVentas/components/GraficoLinealVentasDiarias";
import VigentesTable from "./components/VigentesTable";
import { VigentesResumenMensual } from "./components/VigentesResumenMensual";
import { ProductosResumenMensual } from "./components/ProductosResumenMensual";
import { useResumenEjecutivoStore } from "./useResumenEjecutivoStore";

export const App = ({ id_empresa }) => {
  const store = useResumenEjecutivoStore(id_empresa);

  const {
    year, selectedMonth, initDay, cutDay, tasaCambio,
    setSelectedMonth, setInitDay, setCutDay, handleSetUltimoDiaMes, setTasaCambio,
    vigentesTotal, vigentesBreakdown, vigentesRows,
    renewals, pgmNameById,
    dataVentas, mesesSeleccionados, dataMktWithCac, dataMkt,
    reservasMF, originMap, mapaVencimientos, dataLeadPorMesAnio,
    resumenFilas, resumenTotales, avataresDeProgramas,
    sociosOverride, originBreakdown, advisorOriginByProg,
    avatarByAdvisor, productosPorAsesor
  } = store;

  return (
    <>
      <PageBreadcrumb title="INFORME GERENCIAL" subName="Ventas" />

      {/* === CONTROLES === */}
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
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col lg={12}>
          <RenovacionesPorVencer
            renewals={renewals} daysThreshold={15}
            title="Renovaciones próximas a vencer (≤ 15 días)"
            excludeZeroAmount showSummary pgmNameById={pgmNameById}
          />
        </Col>
      </Row>

      <Row className="mb-6">
        <Col lg={12} className="pt-0">
          <div style={{ marginBottom: "30px" }}>
            <ExecutiveTable
              ventas={dataVentas} fechas={mesesSeleccionados}
              dataMktByMonth={dataMktWithCac} initialDay={initDay} cutDay={cutDay}
              reservasMF={reservasMF} originMap={originMap}
              selectedMonth={selectedMonth} tasaCambio={tasaCambio}
            />
          </div>

          <div style={{ marginBottom: "32px", marginTop: "90px" }}>
            <ComparativoVsActual
              ventas={dataVentas} fechas={mesesSeleccionados}
              dataMktByMonth={dataMkt} reservasMF={reservasMF}
              initialDay={initDay} cutDay={cutDay}
            />
          </div>

          <ClientesPorOrigen
            ventas={dataVentas} fechas={mesesSeleccionados}
            initialDay={initDay} cutDay={cutDay} uniqueByClient={false}
            originMap={originMap}
          />

          <Row className="mb-3">
            <Col lg={12}>
              <RenovacionesPanel
                id_empresa={id_empresa} baseDate={new Date(year, selectedMonth - 1, 1)}
                months={12} beforeDays={0} afterDays={91}
                title="RENOVACIONES - 2025" items={dataVentas}
                vencimientosMap={mapaVencimientos} carteraHistoricaInicial={0}
              />
            </Col>
          </Row>

          <ExecutiveTable2
            ventas={dataVentas} fechas={mesesSeleccionados}
            dataMktByMonth={dataMktWithCac} initialDay={initDay} cutDay={cutDay}
            reservasMF={reservasMF} originMap={originMap}
            selectedMonth={selectedMonth} tasaCambio={tasaCambio}
          />
        </Col>

        {/* === GRÁFICOS === */}
        <Col lg={12}>
          <div style={{ marginBottom: "32px", marginTop: "90px" }}>
            <GraficoLinealInversionRedes data={dataLeadPorMesAnio} fechas={[new Date()]} />
          </div>
        </Col>

        <Row className="mb-6">
          <Col lg={12}>
            <SumaDeSesiones
              ventas={dataVentas} year={year}
              resumenArray={resumenFilas} resumenTotales={resumenTotales}
              avataresDeProgramas={avataresDeProgramas} sociosOverride={sociosOverride}
              originBreakdown={originBreakdown} advisorOriginByProg={advisorOriginByProg}
              avatarByAdvisor={avatarByAdvisor}
            />
          </Col>
        </Row>

        <Col lg={12}>
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <TarjetasProductos
              tasks={productosPorAsesor} title="Ranking Venta de Productos"
              topN={5} minImporte={0} avatarByAdvisor={avatarByAdvisor}
            />
          </div>
        </Col>

        <div style={{ marginBottom: 44 }}>
          <VentasDiarias
            ventas={dataVentas} year={year} month={selectedMonth}
            initDay={initDay} cutDay={cutDay}
            showSocios={true} sumMode="programas" avatarByAdvisor={avatarByAdvisor}
          />
          <GraficoLinealVentasDiarias
            ventas={dataVentas} year={year} month={selectedMonth}
            initDay={initDay} cutDay={cutDay}
          />

          <Row className="mb-6 mt-5">
            <Col lg={12}>
              <VigentesTable items={vigentesRows} title={`SOCIOS VIGENTES (${vigentesTotal})`} />
            </Col>
          </Row>

          <Row className="mb-6 mt-5">
            <Col lg={12}>
              <VigentesResumenMensual
                id_empresa={id_empresa} year={year}
                selectedMonth={selectedMonth} pgmNameById={pgmNameById}
                avataresDeProgramas={avataresDeProgramas}
              />
            </Col>
          </Row>

          <Row className="mb-6 mt-5">
            <Col lg={12}>
              <ProductosResumenMensual
                id_empresa={id_empresa}
                year={year}
                selectedMonth={selectedMonth}
              />
            </Col>
          </Row>
        </div>
      </Row>
    </>
  );
};