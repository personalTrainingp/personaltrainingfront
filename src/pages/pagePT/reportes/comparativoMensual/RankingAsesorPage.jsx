import { Row, Col, Card } from 'react-bootstrap';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';
import { getDaysInMonth } from '../resumenEjecutivo/hooks/useResumenUtils';
import { RenovationsBreakdownTable } from './components/RenovationsBreakdownTable';
import { ReentryBreakdownTable } from './components/ReentryBreakdownTable';
import { GeneralSalesBreakdownTable } from './components/GeneralSalesBreakdownTable';
import { useComparativoMensualLogic } from './hooks/useComparativoMensualLogic';
import { TopControlsVentas } from './components/TopControlsVentas';
import { useState, useEffect } from 'react';
import { PageBreadcrumb } from '@/components';

const RankingAsesorPage = () => {
    const {
        dataVentas,
        loading,
        year, setYear,
        selectedMonth, setSelectedMonth,
        cutDay, setCutDay, setInitDay
    } = useResumenEjecutivoStore(null, { initialMonth: 1 });

    const [viewMode, setViewMode] = useState('standard');
    const [customStartDay, setCustomStartDay] = useState(1);
    const [customEndDay, setCustomEndDay] = useState(new Date().getDate());

    // Auto-adjust day range when month/year changes
    useEffect(() => {
        const max = getDaysInMonth(selectedMonth, year);
        if (customStartDay > max) handleStartDayChange(max);
        if (customEndDay > max) handleEndDayChange(max);
    }, [selectedMonth, year]);

    const handleStartDayChange = (val) => {
        setCustomStartDay(val);
        setInitDay(val);
    };

    const handleEndDayChange = (val) => {
        setCustomEndDay(val);
        setCutDay(val);
    };

    const { monthsData } = useComparativoMensualLogic({
        ventas: dataVentas,
        year: Number(year),
        startMonth: Number(selectedMonth) - 1,
        cutDay,
        customStartDay,
        customEndDay,
    });

    return (
        <>
            <PageBreadcrumb title={'Comparativo por asesor'} />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <TopControlsVentas
                                year={year} setYear={setYear}
                                selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                                customStartDay={customStartDay} handleStartDayChange={handleStartDayChange}
                                customEndDay={customEndDay} handleEndDayChange={handleEndDayChange}
                                viewMode={viewMode} setViewMode={setViewMode}
                                showViewButtons={false}
                            />

                            {loading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-5">
                                    <div>
                                        <h4 className="mb-3 text-uppercase fw-bold text-muted">Renovaciones</h4>
                                        <RenovationsBreakdownTable
                                            ventas={dataVentas}
                                            monthsData={monthsData}
                                            customStartDay={customStartDay}
                                            customEndDay={customEndDay}
                                        />
                                    </div>

                                    <div>
                                        <h4 className="mb-3 text-uppercase fw-bold text-muted">Reinscripciones</h4>
                                        <ReentryBreakdownTable
                                            ventas={dataVentas}
                                            monthsData={monthsData}
                                            customStartDay={customStartDay}
                                            customEndDay={customEndDay}
                                        />
                                    </div>

                                    <div>
                                        <h4 className="mb-3 text-uppercase fw-bold text-muted">Ventas Generales</h4>
                                        <GeneralSalesBreakdownTable
                                            ventas={dataVentas}
                                            monthsData={monthsData}
                                            customStartDay={customStartDay}
                                            customEndDay={customEndDay}
                                        />
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default RankingAsesorPage;
