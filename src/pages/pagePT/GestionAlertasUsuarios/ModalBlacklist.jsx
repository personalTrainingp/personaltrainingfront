import React, { useEffect } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

export const ModalBlacklist = ({ show, onHide, blacklist, onRemove }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Mensajes Excluidos (Desactivados)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted small">
                    Estos mensajes han sido desactivados manualmnente. No se enviarán por WhatsApp ni generarán futuras alertas mientras estén en esta lista.
                </p>
                {blacklist.length === 0 ? (
                    <div className="text-center p-3">No hay mensajes excluidos.</div>
                ) : (
                    <ListGroup>
                        {blacklist.map((msg, idx) => (
                            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                                <span style={{ fontSize: '0.9rem', maxWidth: '85%' }}>{msg}</span>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => onRemove(msg)}
                                    title="Reactivar (Quitar de lista negra)"
                                >
                                    <i className="pi pi-check" />
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
