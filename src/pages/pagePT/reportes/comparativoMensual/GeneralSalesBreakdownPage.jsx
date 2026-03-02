import { Row, Col, Card } from 'react-bootstrap';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';
import { getDaysInMonth } from '../resumenEjecutivo/hooks/useResumenUtils';
import { GeneralSalesBreakdownTable } from './components/GeneralSalesBreakdownTable';
import { useComparativoMensualLogic } from './hooks/useComparativoMensualLogic';
import { TopControlsVentas } from './components/TopControlsVentas';
import { useState, useEffect } from 'react';
import { PageBreadcrumb } from '@/components';

const GeneralSalesBreakdownPage = () => {
    const {
        dataVentas,
        loading,
        year, setYear,
        selectedMonth, setSelectedMonth,
        cutDay, setCutDay, setInitDay
    } = useResumenEjecutivoStore();

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
            <PageBreadcrumb title={'Reportes'} subName={'Comparativo Mensual Ventas'} />
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
                                <GeneralSalesBreakdownTable
                                    ventas={dataVentas}
                                    monthsData={monthsData}
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default GeneralSalesBreakdownPage;
