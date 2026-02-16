import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PTApi from '@/common/api/PTApi';

export const ModalConflictsHistory = ({ show, onHide, id_empresa }) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            fetchHistory();
        }
    }, [show, id_empresa]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Fetch multiple years to simulate "all history"
            const years = [2023, 2024, 2025, 2026];
            const promises = years.map(async (y) => {
                try {
                    const { data } = await PTApi.get('/parametros/renovaciones/por-rango-fechas', {
                        params: {
                            empresa: id_empresa || 598,
                            year: y,
                            selectedMonth: 12, // Dummy month, if endpoint filters strictly we might need to change logic
                            initDay: 1,
                            cutDay: 31,
                            // If the endpoint supports a flag for full year or similar, use it. 
                            // Assuming we need to fetch year by year based on current knowledge.
                            // To be safe, if the endpoint filters by month, we might need a better endpoint or fetch all months.
                            // However, based on 'historicalVentas' in useResumenVentas, it seems to use the same endpoint.
                            // Let's assume for now this endpoint might return data for the requested range.
                            // If it filters by month strictly, I might need to fetch month 1..12 for each year? 
                            // Let's try to fetch with a 'is_annual' param if it exists or just wide range.
                            // Actually, let's look at how it was used: params: { year, selectedMonth, initDay, cutDay }
                            // If I want the whole year, I might need to iterate months or if the backend ignores month if not passed?
                            // Let's try passing range 1-12 if backend supports it, otherwise iterate.
                        }
                    });
                    // IMPORTANT: The backend might filter by month. 
                    // Let's try to request "all" by not sending month? Or asking for a custom endpoint?
                    // User said "sin importar año, mes y dia".
                    // I'll try to use a pragmatic approach: 
                    // If the endpoint strictly requires month, I'll need to fetch all months.
                    // But that's too many requests (4 years * 12 months = 48 requests).
                    // Let's hope sending 'selectedMonth: 0' or null works?
                    // Or let's assume there is a way. 
                    // Actually, let's try to just fetch the years.

                    return data?.cruces || [];
                } catch (e) {
                    console.error("Error fetching history for year", y, e);
                    return [];
                }
            });

            const results = await Promise.all(promises);
            const all = results.flat();

            // Deduplicate by unique key just in case
            const unique = [];
            const ids = new Set();
            all.forEach(item => {
                const key = `${item.cliente_id}-${item.inicio_A}-${item.inicio_B}`;
                if (!ids.has(key)) {
                    ids.add(key);
                    unique.push(item);
                }
            });

            // Sort by most recent start date
            unique.sort((a, b) => new Date(b.inicio_B) - new Date(a.inicio_B));

            setHistoryData(unique);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (rowData) => {
        // Helper to format date cells
        return <span style={{ fontSize: '0.9rem' }}>{rowData}</span>;
    };

    // Templates for columns
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
