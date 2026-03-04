import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { SumaDeSesiones } from '../../totalVentas/SumaDeSesiones';
import VentasDiarias from '../../totalVentas/components/VentasDiarias';
import { GraficoLinealVentasDiarias } from '../../totalVentas/components/GraficoLinealVentasDiarias';

export const ConsolidadoVentasAsesores = ({
    dataVentas, year, selectedMonth, initDay, cutDay,
    resumenFilas, resumenTotales, avataresDeProgramas, sociosOverride,
    originBreakdown, advisorOriginByProg, avatarByAdvisor
}) => {
    return (
        <>
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

            <div style={{ marginBottom: 44, marginTop: 30 }}>
                <VentasDiarias
                    ventas={dataVentas} year={year} month={selectedMonth}
                    initDay={initDay} cutDay={cutDay}
                    showSocios={true} sumMode="programas" avatarByAdvisor={avatarByAdvisor}
                />
                <GraficoLinealVentasDiarias
                    ventas={dataVentas} year={year} month={selectedMonth}
                    initDay={initDay} cutDay={cutDay}
                />
            </div>
        </>
    );
};
