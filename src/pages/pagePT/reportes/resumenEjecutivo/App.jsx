import React, { useState } from "react";
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
import { MESES } from './hooks/useResumenUtils';
import { OverlappingMembershipsTable } from "./components/OverlappingMembershipsTable";

import { SeguimientoRenovaciones } from "./components/SeguimientoRenovaciones";
import { CrecimientoNeto } from "./components/CrecimientoNeto";
import { LtvCacChart } from "./components/LtvCacChart";
import { ModalConflictsHistory } from "./components/ModalConflictsHistory";

export const App = ({ id_empresa }) => {
  const {
    selectedMonth, initDay, cutDay, tasaCambio,
    setSelectedMonth, setInitDay, setCutDay, handleSetUltimoDiaMes, setTasaCambio,
    vigentesTotal, vigentesBreakdown, vigentesRows,
    renewals, pgmNameById,
    dataVentas, mesesSeleccionados, dataMktWithCac, dataMkt,
    reservasMF, originMap, mapaVencimientos, dataLeadPorMesAnio,
    resumenFilas, resumenTotales, avataresDeProgramas,
    sociosOverride, originBreakdown, advisorOriginByProg,
    avatarByAdvisor, productosPorAsesor, vencimientosFiltrados,
    isLoading,
    year, setYear,
    historicalVentas
  } = useResumenEjecutivoStore(id_empresa);

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  return (
    <>
      <PageBreadcrumb title="INFORME GERENCIAL" subName="Ventas" />

      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <span className="loader"></span>
        </div>
      )}

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
            setYear={setYear}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col lg={12}>
          <RenovacionesPorVencer
            renewals={renewals}
            daysThreshold={9999}
            title={`Renovaciones próximas a vencer: ${String(MESES[selectedMonth - 1] || "").toUpperCase()} (1 - ${cutDay})`}
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
              year={year}
            />
          </div>

          <div style={{ marginBottom: "32px", marginTop: "90px" }}>
            <ComparativoVsActual
              ventas={dataVentas} fechas={mesesSeleccionados}
              dataMktByMonth={dataMkt} reservasMF={reservasMF}
              initialDay={initDay} cutDay={cutDay}
              year={year}
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
                title={`RENOVACIONES - ${year}`} items={dataVentas}
                vencimientosMap={mapaVencimientos} carteraHistoricaInicial={0}
                vencimientosFiltrados={vencimientosFiltrados}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={12}>
              <SeguimientoRenovaciones
                dataVentas={dataVentas}
                mapaVencimientos={mapaVencimientos}
                year={year}
                id_empresa={id_empresa}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={12}>
              <CrecimientoNeto
                dataVentas={dataVentas}
                mapaVencimientos={mapaVencimientos}
                year={year}
                id_empresa={id_empresa}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={12}>
              <LtvCacChart
                dataVentas={dataVentas}
                mapaVencimientos={mapaVencimientos}
                dataMktByMonth={dataMktWithCac}
                year={year}
                id_empresa={id_empresa}
              />
            </Col>
          </Row>

          <ExecutiveTable2
            ventas={dataVentas} fechas={mesesSeleccionados}
            dataMktByMonth={dataMktWithCac} initialDay={initDay} cutDay={cutDay}
            reservasMF={reservasMF} originMap={originMap}
            selectedMonth={selectedMonth} tasaCambio={tasaCambio}
            year={year}
          />
        </Col>

        {/* === GRÁFICOS === */}
        <Col lg={12}>
          <div style={{ marginBottom: "32px", marginTop: "90px" }}>
            <GraficoLinealInversionRedes data={dataLeadPorMesAnio} fechas={[new Date()]} />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <OverlappingMembershipsTable
              ventas={historicalVentas || dataVentas}
              onViewAll={() => setShowHistoryModal(true)}
            />
          </div>
        </Col>

        <Row className="mb-6">
          <Col lg={12}>
            <SumaDeSesiones
              ventas={dataVentas} year={year} month={selectedMonth}
              initDay={initDay} cutDay={cutDay} resumenArray={resumenFilas} resumenTotales={resumenTotales}
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

      <ModalConflictsHistory
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        id_empresa={id_empresa}
      />
    </>
  );
};