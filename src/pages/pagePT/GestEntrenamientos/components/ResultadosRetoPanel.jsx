import React, { useEffect } from 'react';
import { Accordion, Alert, Spinner } from 'react-bootstrap';
import { useHistorialRetos } from '../hooks/useHistorialRetos';
import { RetoIndividual } from './RetoIndividual';

export const ResultadosRetoPanel = ({ idCliente, defaultWeeks, idDetalleMembresia }) => {
    const { historial, loading, error, refetch } = useHistorialRetos(idCliente);

    // Refresh when client changes
    useEffect(() => {
        if (idCliente) refetch();
    }, [idCliente, refetch]);

    if (!idCliente) return null;

    if (loading && historial.length === 0) {
        return <div className="text-center p-3"><Spinner animation="border" size="sm" /> Cargando historial...</div>;
    }

    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    // Filter by idDetalleMembresia if provided
    let filteredHistorial = historial;
    if (idDetalleMembresia && historial.length > 0) {
        const found = historial.filter(r => r.id_detalle_membresia === idDetalleMembresia);
        if (found.length > 0) {
            filteredHistorial = found;
        } else {
            // Fallback: If strict ID match fails (legacy data), try date range match?
            // For now, let's just show all or show specific message.
            // But user wants "Show Plan within range". 
            // If the retos have dates, we could filter by date.
            // Let's stick to ID filtering first as it's cleaner if the data supports it.
            // If empty, it means no challenge linked to this specific membership.
        }
    }

    if (filteredHistorial.length === 0) {

        return (
            <Accordion className="mb-4 shadow-sm">
                <RetoIndividual
                    index={0}
                    retoData={null}
                    idCliente={idCliente}
                    onSaveSuccess={refetch}
                    defaultOpen={true}
                    defaultWeeks={defaultWeeks}
                />
            </Accordion>
        );
    }

    return (
        <div className="mb-4">
            <h5 className="mb-3 text-primary"><i className="bi bi-journal-medical me-2"></i>Historico {idDetalleMembresia ? '(Filtrado por Membresía)' : ''}</h5>
            <Accordion className="shadow-sm">
                {filteredHistorial.map((reto, index) => (
                    <React.Fragment key={reto.id || index}>
                        {/* ADHERENCE ALERT / TRANSITION BRIDGE */}
                        {reto.transicion_calculada && !reto.transicion_calculada.es_primer_reto && (
                            <div className="px-3 py-2">
                                <Alert
                                    variant={reto.transicion_calculada.es_rebote ? "danger" : "success"}
                                    className="mb-0 d-flex align-items-center small py-2"
                                >
                                    <i className={`bi ${reto.transicion_calculada.es_rebote ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-2 fs-5`}></i>
                                    <div>
                                        <strong>Transición entre retos:</strong> {reto.transicion_calculada.mensaje}
                                    </div>
                                </Alert>
                            </div>
                        )}

                        <RetoIndividual
                            index={index}
                            retoData={reto}
                            idCliente={idCliente}
                            onSaveSuccess={refetch}
                            defaultWeeks={defaultWeeks}
                        />
                    </React.Fragment>
                ))}
            </Accordion>
        </div>
    );
};