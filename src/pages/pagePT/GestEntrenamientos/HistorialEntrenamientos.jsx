import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Modal, Button, Form } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import { HistoryDateFilter } from './HistoryDateFilter';
import { ResultadosRetoPanel } from './components/ResultadosRetoPanel';
import { useHistorialEntrenamientosLogic } from './hooks/useHistorialEntrenamientosLogic';
import { AG_GRID_LOCALE_ES } from './utils/agGridLocale';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './style/HistorialEntrenamientosMobile.css';

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function HistorialEntrenamientos() {
    const {
        year, setYear,
        selectedMonth, setSelectedMonth,
        initDay, setInitDay,
        cutDay, setCutDay,
        rowData,
        selectedClient, setSelectedClient, loadClientesHistorial,
        loading,
        setGridApi,
        colDefs,
        handleSearch,
        viewingClient, setViewingClient,
        checkUnsaved,
        // New exports
        membresias, selectedMembresia, setSelectedMembresia
    } = useHistorialEntrenamientosLogic();

    // 1. Detectar Móvil
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleViewDetails = (data) => {
        const idCli = data.id_cliente || (data.Cliente ? data.Cliente.id : null) || (data.tb_cliente ? data.tb_cliente.id_cli : null);

        if (idCli) {
            setViewingClient({
                idCliente: idCli,
                idDetalleMembresia: data.id_detalle_membresia
            });
        }
    };

    return (
        <Container fluid className="p-2 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="m-0 text-primary fw-bold">
                    <i className="bi bi-clock-history me-2"></i>
                    Historial de Fisio Muscle
                </h3>
            </div>

            <Card className="shadow-sm border-0 mb-3" style={{ borderRadius: 12 }}>
                <Card.Body className="p-3">
                    <HistoryDateFilter
                        year={year}
                        setYear={setYear}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        initDay={initDay}
                        setInitDay={setInitDay}
                        cutDay={cutDay}
                        setCutDay={setCutDay}
                        selectedClient={selectedClient}
                        setSelectedClient={setSelectedClient}
                        loadOptions={loadClientesHistorial}
                        onSearch={handleSearch}
                    />

                    {/* Selector de Membresía */}
                    {selectedClient && (
                        <div className="mt-3">
                            <Form.Label className="fw-bold small text-muted mb-1 text-uppercase">Historial de Membresía</Form.Label>
                            <Form.Select
                                value={selectedMembresia ? selectedMembresia.id : ''}
                                onChange={e => {
                                    const m = membresias.find(x => x.id == e.target.value);
                                    setSelectedMembresia(m || null);
                                }}
                                className="fw-bold text-primary border-primary"
                            >
                                <option value="">-- Ver Todas --</option>
                                {membresias.map(m => {
                                    const det = m.detalle_ventaMembresia?.[0];
                                    const planName = det?.ProgramaTraining?.name_pgm || m.name_pgm || 'Plan';

                                    let rawDate = det?.fec_inicio_mem || m.fecha_venta;
                                    let fecha = '';

                                    if (rawDate) {

                                        const match = String(rawDate).match(/^(\d{4})-(\d{2})-(\d{2})/);
                                        if (match) {
                                            const [_, y, month, d] = match;
                                            fecha = new Date(y, month - 1, d).toLocaleDateString();
                                        } else {
                                            const d = new Date(rawDate);
                                            if (!isNaN(d.getTime())) {
                                                // Adjust for UTC if needed, but manual construction above is safer for pure dates
                                                // If it fails regex, fallback to standard local
                                                fecha = d.toLocaleDateString();
                                            }
                                        }
                                    }
                                    return (
                                        <option key={m.id} value={m.id}>
                                            {fecha} - {planName} ({m.asistencias_realizadas}/{m.sesiones_totales})
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </div>
                    )}

                    {/* Client Info Summary */}
                    {selectedClient && (
                        <div className="mt-3 p-2 bg-light rounded d-flex justify-content-around flex-wrap border">
                            <div className="mx-2 text-center">
                                <span className="fw-bold text-muted small d-block">ASISTENCIA</span>
                                <span className={`fs-5 fw-bold ${((selectedMembresia?.asistencias_realizadas || selectedClient.asistencias_realizadas || 0) / (selectedMembresia?.sesiones_totales || selectedClient.sesiones_totales || 1)) >= 0.9 ? 'text-danger' : 'text-primary'}`}>
                                    <i>
                                        {selectedMembresia ? selectedMembresia.asistencias_realizadas : (selectedClient.asistencias_realizadas || 0)} / {selectedMembresia ? selectedMembresia.sesiones_totales : (selectedClient.sesiones_totales || 0)}
                                    </i>
                                </span>
                            </div>
                            <div className="mx-2 text-center">
                                <span className="fw-bold text-muted small d-block">HORARIO</span>
                                <span className="fs-5 fw-bold text-dark">
                                    <i>
                                        {(() => {
                                            // Priority: 1. selectedClient direct info, 2. First row of history (latest)
                                            let t = selectedClient.TurnoGimnasio;
                                            if (!t && rowData && rowData.length > 0) {
                                                t = rowData[0].TurnoGimnasio;
                                            }

                                            if (!t) return 'Sin Horario';
                                            if (t.hora_inicio && t.hora_fin) {
                                                const getHHMM = (v) => v.includes('T') ? v.split('T')[1].slice(0, 5) : v.slice(0, 5);
                                                return `${getHHMM(t.hora_inicio)} - ${getHHMM(t.hora_fin)}`;
                                            }
                                            return t.nombre || 'Sin Horario';
                                        })()}
                                    </i>
                                </span>
                            </div>
                            <div className="mx-2 text-center">
                                <span className="fw-bold text-muted small d-block">PLAN</span>
                                <span className="fs-5 fw-bold text-dark">
                                    <i>
                                        {(() => {
                                            // 1. If membership selected, use detailed info
                                            if (selectedMembresia) {
                                                const det = selectedMembresia.detalle_ventaMembresia?.[0];
                                                const st = det?.SemanasTraining || det?.tb_semana_training;

                                                const pName = det?.ProgramaTraining?.name_pgm || selectedMembresia.name_pgm || 'Plan';

                                                const weeks = st?.semanas_st ? `${st.semanas_st} Semanas` : '';
                                                let details = weeks;

                                                if (st?.sesiones) details += ` | Sesiones: ${st.sesiones}`;
                                                if (st?.nutricion_st) details += ` | Nutricionista: ${st.nutricion_st} Citas`;
                                                if (st?.congelamiento_st) details += ` | Congelamiento: ${st.congelamiento_st} días`;

                                                return `${pName} (${details})`;
                                            }

                                            // 2. Default logic
                                            let planName = selectedClient.name_pgm;

                                            // Fallback to rowData if missing
                                            if (!planName && rowData && rowData.length > 0) {
                                                const r = rowData[0];
                                                planName = r.name_pgm || r.ProgramaTraining?.name_pgm || r.tb_ProgramaTraining?.name_pgm;
                                            }

                                            return planName || 'Sin Plan';
                                        })()}
                                    </i>
                                </span>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* 2. Clase grid-container para el CSS y quitar height fijo inline */}
            <div
                className="ag-theme-alpine shadow-sm grid-container"
                style={{
                    height: isMobile ? 'calc(100vh - 280px)' : 800,
                    width: '100%',
                    minHeight: '400px'
                }}
            >                {loading && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            )}
                <AgGridReact
                    key={isMobile ? 'mobile-grid' : 'desktop-grid'}
                    domLayout={isMobile ? 'autoHeight' : 'normal'}
                    pagination={true}
                    paginationPageSize={isMobile ? 5 : 10}
                    suppressColumnVirtualisation={isMobile}
                    rowData={rowData}
                    columnDefs={colDefs}
                    animateRows={true}
                    context={{ onViewDetails: handleViewDetails, selectedClient }}
                    onGridReady={p => setGridApi(p.api)}
                    defaultColDef={{ resizable: true, sortable: true, filter: false, wrapText: true, autoHeight: true, wrapHeaderText: true, autoHeaderHeight: true }}
                    overlayNoRowsTemplate='<span style="padding: 10px;">No hay registros en este rango de fechas.</span>'
                    localeText={AG_GRID_LOCALE_ES}
                />
            </div>

            {/* Modal de Detalles */}
            <Modal show={!!viewingClient} onHide={() => setViewingClient(null)} size="xl" centered fullscreen="md-down">
                <Modal.Header closeButton>
                    <Modal.Title><i className="bi bi-file-medical-fill me-2"></i> Resultados del Reto</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ minHeight: '500px' }}>
                    {viewingClient && (
                        <ResultadosRetoPanel
                            idCliente={viewingClient.idCliente || viewingClient}
                            idDetalleMembresia={viewingClient.idDetalleMembresia} // Pasar idDetalleMembresia
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setViewingClient(null)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}