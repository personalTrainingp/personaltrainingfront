import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import { useResumenEjecutivoStore } from './resumenEjecutivo/useResumenEjecutivoStore';
import { TopControls } from './resumenEjecutivo/components/TopControls';
import { ConsolidadoVentasAsesores } from './resumenEjecutivo/components/ConsolidadoVentasAsesores';

export const RankingAsesorDiariaPage = () => {
    const {
        selectedMonth, initDay, cutDay, tasaCambio,
        setSelectedMonth, setInitDay, setCutDay, handleSetUltimoDiaMes, setTasaCambio,
        vigentesTotal, vigentesBreakdown,
        dataVentas,
        resumenFilas, resumenTotales, avataresDeProgramas,
        sociosOverride, originBreakdown, advisorOriginByProg,
        avatarByAdvisor,
        isLoading,
        year, setYear
    } = useResumenEjecutivoStore(null); // Pass appropriate ID if necessary or utilize default

    return (
        <>
            <PageBreadcrumb title="Ranking Diario por Asesor" />

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

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            {isLoading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : (
                                <ConsolidadoVentasAsesores
                                    dataVentas={dataVentas} year={year} selectedMonth={selectedMonth}
                                    initDay={initDay} cutDay={cutDay} resumenFilas={resumenFilas} resumenTotales={resumenTotales}
                                    avataresDeProgramas={avataresDeProgramas} sociosOverride={sociosOverride}
                                    originBreakdown={originBreakdown} advisorOriginByProg={advisorOriginByProg}
                                    avatarByAdvisor={avatarByAdvisor}
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default RankingAsesorDiariaPage;
