import { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';
import { ComparativoMensualTable } from './components/ComparativoMensualTable';
import { MetaAlcanceTable } from './components/MetaAlcanceTable';
import { TopControlsVentas } from './components/TopControlsVentas';
import { PageBreadcrumb } from '@/components';

const App = () => {
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
            <PageBreadcrumb title={'Reportes'} subName={'Comparativo Mensual'} />
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
                            />

                            {loading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {viewMode === 'goals' && (
                                        <MetaAlcanceTable
                                            ventas={dataVentas}
                                            year={year}
                                            startMonth={selectedMonth - 1}
                                            cutDay={cutDay}
                                            customStartDay={customStartDay}
                                            customEndDay={customEndDay}
                                        />
                                    )}

                                    {viewMode === 'standard' && (
                                        <>
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

                                            <ComparativoMensualTable
                                                ventas={dataVentas.filter(v => v.id_origen === 691)}
                                                year={year}
                                                startMonth={selectedMonth - 1}
                                                cutDay={cutDay}
                                                title="RENOVACIONES"
                                                showFortnightly={true}
                                                variant="renovations"
                                                customStartDay={customStartDay}
                                                customEndDay={customEndDay}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default App;