import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import { GraficoLinealVentasDiarias2 } from '../comparativoMensual/components/GraficoLinealVentasDiarias2';
import { TopControlsVentas } from '../comparativoMensual/components/TopControlsVentas';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';

const GraficoVentasDiariasPage = () => {
    const {
        dataVentas,
        isLoading,
        year, setYear,
        selectedMonth, setSelectedMonth,
        cutDay, setCutDay,
        initDay, setInitDay
    } = useResumenEjecutivoStore(null, { initialMonth: 1 });

    const [customStartDay, setCustomStartDay] = useState(initDay);
    const [customEndDay, setCustomEndDay] = useState(cutDay);

    const handleStartDayChange = (val) => {
        setCustomStartDay(val);
        setInitDay(val);
    };

    const handleEndDayChange = (val) => {
        setCustomEndDay(val);
        setCutDay(val);
    };

    return (
        <>
            <PageBreadcrumb title={'Gráfico Lineal Ventas Diarias'} subName="Reporte" />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <TopControlsVentas
                                year={year} setYear={setYear}
                                selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                                customStartDay={customStartDay} handleStartDayChange={handleStartDayChange}
                                customEndDay={customEndDay} handleEndDayChange={handleEndDayChange}
                                showViewButtons={false}
                            />

                            {isLoading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : (
                                <GraficoLinealVentasDiarias2
                                    ventas={dataVentas || []}
                                    year={year}
                                    month={selectedMonth}
                                    cutDay={cutDay}
                                    initDay={initDay}
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default GraficoVentasDiariasPage;
