import React, { useMemo, useState, useEffect } from 'react';
import { Card, Row, Col, Button, Container, Spinner, Badge } from 'react-bootstrap';
import { entrenamientosApi } from '@/api/entrenamientosApi';
import Swal from 'sweetalert2';
import { AgGridReact } from 'ag-grid-react';
import { ResultadosRetoPanel } from './components/ResultadosRetoPanel';
import { ModalCatalogo } from './ModalCatalogo';
import { ModalEditarCatalogo } from './ModalEditarCatalogo';
import { ModalHistorial } from './ModalHistorial';
import { AsistenciaPanel } from './components/AsistenciaPanel';
import { ModalCrearTurno } from './ModalCrearTurno';
import { ModalSeleccionTurno } from './components/ModalSeleccionTurno'; // New Import
import { DateOnlyCellEditor } from './DateOnlyCellEditor';
import { VideoThumbnailCellRenderer } from './VideoThumbnailCellRenderer';
import { ExerciseSelectEditor } from './ExerciseSelectEditor';
import { useGestEntrenamientosLogic } from './hooks/useGestEntrenamientosLogic';
import { useGestEntrenamientosColumns } from './hooks/useGestEntrenamientosColumns';
import { AG_GRID_LOCALE_ES } from './utils/agGridLocale';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './style/GestEntrenamientosMobile.css';

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function GestEntrenamientos() {

    const {
        clienteSel,
        catalogo,
        tiposEjercicio,
        rowData,
        setGridApi,
        hasUnsavedChanges,
        saving,
        showModalCat, setShowModalCat,
        showModalEditCat, setShowModalEditCat,
        showModalHistorial, setShowModalHistorial,
        showModalTurno, setShowModalTurno,
        turnoToEdit, // State
        valGeneral,
        valHistorial,
        loadClientes,
        loadClientesHistorial,
        handleSelectGeneral,
        handleSelectHistorial,
        handleAddRow,
        handleSave,
        showModalPlan, setShowModalPlan, // New States
        handleOpenPlanModal, // New Handler
        handleSavePlan, // New Handler
        showModalSelectTurno, setShowModalSelectTurno,
        handleConfirmTurnoSelection,
        handleHistorialSaved,
        onCatalogoSaved,
        onCatalogoUpdated,
        handleCreateTurno,
        handleEditTurno,
        onTurnoSaved,
        onCellValueChanged,
        turnos,
        planOptions, // Weeks Options
        lastUsedTurno, // Destructurar nuevo estado
        textoTurno,

        // Actions
        handleAddRowFromFirst,
        handleSaveSingleRow,
        handleDeleteRow,
        displayPlanName,
        displayEndDate,
        gridApi // Added gridApi
    } = useGestEntrenamientosLogic();
    const catalogoMap = useMemo(() => {

        const map = {};

        catalogo.forEach(c => map[c.id] = c.nombre);

        return map;

    }, [catalogo]);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);




    const colDefs = useGestEntrenamientosColumns({
        catalogo,
        catalogoMap,
        tiposEjercicio,
        onCellValueChanged,
        handleSaveSingleRow,
        handleDeleteRow,
        handleAddRowFromFirst,
        isMobile
    });
    return (
        <Container fluid className="p-2 fade-in">
            <div className="d-flex justify-content-between align-items-start mb-4">
                <h3 className="m-0 text-primary fw-bold">
                    <i className="bi bi-journal-medical me-2"></i>
                    Gestión de Entrenamientos
                </h3>

            </div>

            <AsistenciaPanel
                idVenta={clienteSel?.id || clienteSel?.id_venta}
                planName={displayPlanName} // Derivado del hook
                calculatedEndDate={displayEndDate} // Derivado del hook
                usedSessions={clienteSel?.asistencias_realizadas}
                totalSessions={clienteSel?.sesiones_totales}
                diasCongelamiento={clienteSel?.dias_congelamiento}
                citasNutricionales={clienteSel?.citas_nutricionales}
                valGeneral={valGeneral}
                onSelectGeneral={handleSelectGeneral}
                loadClientes={loadClientes}
                textoTurno={textoTurno}
                onAddRow={handleAddRow}
                canAdd={!!clienteSel}
            />
            <div
                className={`ag-theme-alpine shadow-sm ${isMobile ? 'grid-container' : ''}`}
                style={{
                    height: isMobile ? 'calc(100vh - 280px)' : 800,
                    width: '100%',
                    minHeight: '400px',
                    borderRadius: 8
                }}
            >
                <AgGridReact
                    key={isMobile ? 'mobile' : 'desktop'}
                    pagination={true}
                    paginationPageSize={isMobile ? 5 : 10}
                    paginationPageSizeSelector={[5, 10, 20, 50]}
                    rowData={rowData}
                    rowHeight={60}
                    columnDefs={colDefs}
                    animateRows={true}
                    onGridReady={p => setGridApi(p.api)}
                    getRowId={params => params.data.id ? String(params.data.id) : undefined} // Ensure Row Node ID matches Data ID
                    defaultColDef={{ resizable: true, sortable: false, filter: false, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true }}
                    context={{
                        onViewDetails: (data) => {
                            console.log("View Details:", data);
                        },
                        onOpenComment: async (data) => {
                            const { value: text } = await Swal.fire({
                                input: 'textarea',
                                inputLabel: 'Comentario',
                                inputPlaceholder: 'Escribe tu comentario aquí...',
                                inputValue: data.comentario || '',
                                showCancelButton: true,
                                confirmButtonText: 'Guardar',
                                cancelButtonText: 'Cancelar'
                            });

                            if (text !== undefined && text !== data.comentario) {
                                try {
                                    // 1. Update Backend
                                    await entrenamientosApi.updateHistorial(data.id, { comentario: text });

                                    // 2. Update Grid UI (Safely)
                                    if (gridApi) {
                                        const rowNode = gridApi.getRowNode(data.id);
                                        if (rowNode) {
                                            rowNode.setData({ ...data, comentario: text });
                                        } else {
                                            // Fallback: apply transaction if node not found by ID
                                            gridApi.applyTransaction({ update: [{ ...data, comentario: text }] });
                                        }
                                    }

                                    Swal.fire('Guardado', 'Comentario actualizado', 'success');
                                } catch (error) {
                                    console.error("Error updating comment:", error);
                                    Swal.fire('Error', 'No se pudo guardar el comentario', 'error');
                                }
                            }
                        }
                    }}
                    overlayNoRowsTemplate='<span style="padding: 10px;">Selecciona un Socio para ver su historial.</span>'
                    getRowStyle={params => !params.data._existing ? { background: '#f0f9ff' } : null}
                    onCellValueChanged={onCellValueChanged}
                    localeText={AG_GRID_LOCALE_ES}
                    suppressColumnVirtualisation={isMobile}
                    domLayout={isMobile ? 'autoHeight' : 'normal'}
                    singleClickEdit={isMobile}
                    stopEditingWhenCellsLoseFocus={true}
                />
            </div>
            {/* Action Buttons Moved Bellow Grid */}
            <div className="d-flex flex-column flex-md-row gap-2 mt-3 justify-content-end">
                <Button variant="outline-success" size="sm" onClick={() => setShowModalCat(true)}>
                    <i className="bi bi-plus-lg me-1"></i> CREAR ENTRENAMIENTO
                </Button>
                <Button variant="outline-warning" size="sm" onClick={() => setShowModalEditCat(true)}>
                    <i className="bi bi-pencil me-1"></i> Editar Entrenamiento (Catálogo)
                </Button>
            </div>
            {clienteSel && (
                <ResultadosRetoPanel
                    idCliente={clienteSel.value}
                    defaultWeeks={clienteSel.semanas_st}
                />
            )}
            <ModalCatalogo
                show={showModalCat}
                onHide={() => setShowModalCat(false)}
                onSaved={onCatalogoSaved}
            />
            <ModalEditarCatalogo
                show={showModalEditCat}
                onHide={() => setShowModalEditCat(false)}
                catalogo={catalogo}
                onUpdated={onCatalogoUpdated}
            />
            <ModalHistorial
                show={showModalHistorial}
                onHide={() => setShowModalHistorial(false)}
                onSaved={handleHistorialSaved}
                catalogo={catalogo}
                tiposEjercicio={tiposEjercicio} // PASAR TIPOS
                turnos={turnos} // PASAR TURNOS
                idCliente={clienteSel?.value}
                idPgm={clienteSel?.id_pgm}
                idDetalleMembresia={clienteSel?.id_detalle_membresia}
                fechaInicio={clienteSel?.fecha_inicio} // Pass Start Date
                namePgm={(() => {
                    console.log("DEBUG Modal Plan:", {
                        id_semana: clienteSel?.id_semana,
                        planOptions: planOptions,
                        name_pgm: clienteSel?.name_pgm,
                        clienteSel: clienteSel
                    });
                    if (clienteSel?.id_semana && planOptions && planOptions.length > 0) {
                        const found = planOptions.find(p => (p.id || p.value) == clienteSel.id_semana);
                        //console.log("Found plan:", found);
                        return found?.label || clienteSel?.name_pgm;
                    }
                    return clienteSel?.name_pgm;
                })()}

                onCreateTurno={handleCreateTurno}
                onEditTurno={handleEditTurno}
                initialTurno={lastUsedTurno} // Pass last used turno
            />
            {/* Modal para Crear/Editar Turno */}
            <ModalCrearTurno
                show={showModalTurno}
                onHide={() => setShowModalTurno(false)}
                onSaved={onTurnoSaved}
                turnoToEdit={turnoToEdit} // Pass editing data
            />

            {/* Modal de Selección de Turno (Nuevo Flujo) */}
            <ModalSeleccionTurno
                show={showModalSelectTurno}
                onHide={() => setShowModalSelectTurno(false)}
                onSave={handleConfirmTurnoSelection}
                turnos={turnos}
                saving={saving}
            />
        </Container>
    );
}