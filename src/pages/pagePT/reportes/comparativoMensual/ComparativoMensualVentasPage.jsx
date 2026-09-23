import { Row, Col, Card } from 'react-bootstrap';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';
import { getDaysInMonth } from '../resumenEjecutivo/hooks/useResumenUtils';
import { ComparativoMensualTable } from './components/ComparativoMensualTable';
import { TopControlsVentas } from './components/TopControlsVentas';
import { useState, useEffect } from 'react';
import { PageBreadcrumb } from '@/components';
import { arrayOrigenDeCliente } from '@/types/type';

const ComparativoMensualVentasPage = () => {
    const {
        dataVentas,
        loading,
        year, setYear,
        selectedMonth, setSelectedMonth,
        cutDay, setCutDay, setInitDay
    } = useResumenEjecutivoStore(null, { initialMonth: 1 });

    // El estado viewMode aquí es manejado para los controles, pero solo usaremos la vista estándar o goals si se desea
    const [viewMode, setViewMode] = useState('standard');
    const [customStartDay, setCustomStartDay] = useState(1);
    const [customEndDay, setCustomEndDay] = useState(new Date().getDate());
    // Buscadores independientes: primeros / últimos N días de cada mes (0 = ocultar columnas)
    const [firstNDays, setFirstNDays] = useState(0);
    const [lastNDays, setLastNDays] = useState(0);
    const toNDays = (val) => Math.max(0, Math.min(31, parseInt(val, 10) || 0));

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

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', margin: '12px 0 20px' }}>
                                {[
                                    { label: 'PRIMEROS N DÍAS', value: firstNDays, set: setFirstNDays },
                                    { label: 'ÚLTIMOS N DÍAS', value: lastNDays, set: setLastNDays }
                                ].map(({ label, value, set }) => (
                                    <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#000', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontWeight: 700, margin: 0 }}>
                                        {label}
                                        <input
                                            type="number"
                                            min={0}
                                            max={31}
                                            value={value}
                                            onChange={(e) => set(toNDays(e.target.value))}
                                            style={{ width: '80px', padding: '4px 8px', fontWeight: 700, fontSize: '18px', borderRadius: '4px', border: 'none', textAlign: 'center' }}
                                        />
                                    </label>
                                ))}
                            </div>

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
                                        title="VENTAS MEMBRESIAS"
                                        customStartDay={customStartDay}
                                        customEndDay={customEndDay}
                                        firstNDays={firstNDays}
                                        lastNDays={lastNDays}
                                    />

                                    <hr className="my-5" />
                                    {
                                        arrayOrigenDeCliente.map(m=>{
                                            return (
                                                <ComparativoMensualTable
                                                    ventas={dataVentas.filter(v => v.id_origen === m.value)}
                                                    year={year}
                                                    startMonth={selectedMonth - 1}
                                                    cutDay={cutDay}
                                                    title={`${m.label}`}
                                                    showFortnightly={true}
                                                    customStartDay={customStartDay}
                                                    customEndDay={customEndDay}
                                                    firstNDays={firstNDays}
                                                    lastNDays={lastNDays}
                                                />
                                            )
                                        })
                                    }
                                    {/* Tabla 2: Renovaciones */}
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
