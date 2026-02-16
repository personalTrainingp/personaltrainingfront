import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useConflictsHistory } from '../hooks/useConflictsHistory';

export const ModalConflictsHistory = ({ show, onHide, id_empresa }) => {
    const { historyData, loading } = useConflictsHistory(id_empresa, show);

    const formatDate = (rowData) => {
        // Helper to format date cells
        return <span style={{ fontSize: '0.9rem' }}>{rowData}</span>;
    };

    const socioTemplate = (rowData) => (
        <div>
            <div className="fw-bold">{rowData.nombre_cliente}</div>
            <small className="text-muted">ID: {rowData.cliente_id}</small>
        </div>
    );

    const planATemplate = (rowData) => (
        <div>
            <div className="badge bg-light text-dark border">{rowData.plan_A}</div>
            <div style={{ fontSize: '0.85rem' }}>{rowData.inicio_A} - {rowData.fin_A}</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Ticket: {rowData.venta_A}</div>
        </div>
    );

    const planBTemplate = (rowData) => (
        <div>
            <div className="badge bg-light text-dark border">{rowData.plan_B}</div>
            <div style={{ fontSize: '0.85rem' }}>{rowData.inicio_B} - {rowData.fin_B}</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Ticket: {rowData.venta_B}</div>
        </div>
    );

    const conflictTemplate = (rowData) => {
        const days = rowData.dias_solapados;
        const isWarning = days === 1;
        return (
            <span className={`badge ${isWarning ? 'bg-warning text-dark' : 'bg-danger'}`}>
                {days} Días
            </span>
        );
    };

    return (
        <Dialog
            header={`Historial Completo de Conflictos (${historyData.length})`}
            visible={show}
            style={{ width: '90vw', maxWidth: '1200px' }}
            onHide={onHide}
            maximized={false}
        >
            <div className="card">
                <DataTable
                    value={historyData}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    loading={loading}
                    emptyMessage="No se encontraron conflictos históricos."
                    stripedRows
                    size="small"
                >
                    <Column field="nombre_cliente" header="Socio" body={socioTemplate} sortable filter filterPlaceholder="Buscar socio..." />
                    <Column field="asesor_A" header="Asesores" body={(r) => (
                        <div style={{ fontSize: '0.9rem' }}>
                            <div>A: {r.asesor_A}</div>
                            <div>B: {r.asesor_B}</div>
                        </div>
                    )} sortable />
                    <Column header="Membresía A (Original)" body={planATemplate} />
                    <Column header="Membresía B (Nueva/Cruce)" body={planBTemplate} />
                    <Column field="dias_solapados" header="Conflicto" body={conflictTemplate} sortable style={{ textAlign: 'center' }} />
                </DataTable>
            </div>
        </Dialog>
    );
};
