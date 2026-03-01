import { Row, Col, Card } from 'react-bootstrap';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';
import { getDaysInMonth } from '../resumenEjecutivo/hooks/useResumenUtils';
import { ComparativoMensualTable } from './components/ComparativoMensualTable';
import { TopControlsVentas } from './components/TopControlsVentas';
import { useState, useEffect } from 'react';
import { PageBreadcrumb } from '@/components';

const ComparativoMensualVentasPage = () => {
    const {
        dataVentas,
        loading,
        year, setYear,
        selectedMonth, setSelectedMonth,
        cutDay, setCutDay, setInitDay
    } = useResumenEjecutivoStore();

    // El estado viewMode aquí es manejado para los controles, pero solo usaremos la vista estándar o goals si se desea
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

    return (
        <>
            <PageBreadcrumb title={'Reportes'} subName={'Comparativo Mensual Ventas'} />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            {/* Reutilizamos los controles estándar para consistencia */}
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
                                <>
                                    {/* Tabla 1: Total Ventas */}
                                    <ComparativoMensualTable
                                        ventas={dataVentas}
                                        year={year}
                                        startMonth={selectedMonth - 1}
                                        cutDay={cutDay}
                                        title="TOTAL VENTAS MEMBRESIAS"
                                        customStartDay={customStartDay}
                                        customEndDay={customEndDay}
                                    />

                                    <hr className="my-5" />

                                    {/* Tabla 2: Renovaciones */}
                                    <ComparativoMensualTable
                                        ventas={dataVentas.filter(v => v.id_origen === 691)}
                                        year={year}
                                        startMonth={selectedMonth - 1}
                                        cutDay={cutDay}
                                        title="RENOVACIONES"
                                        showFortnightly={true}
                                        customStartDay={customStartDay}
                                        customEndDay={customEndDay}
                                    />
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ComparativoMensualVentasPage;
