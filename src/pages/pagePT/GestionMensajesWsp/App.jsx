import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Card, Col, Form, ListGroup, Row, Spinner } from 'react-bootstrap';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { PageBreadcrumb } from '@/components';
import { useMensajesWspStore } from './useMensajesWspStore';

// Los mensajes nuevos llegan por el webhook: se refresca la lista cada 15 s
const INTERVALO_REFRESCO = 15000;

// Si el cliente usa nombre de usuario de WhatsApp, Meta puede no enviar su número: el chat es su ID (ej. PE.1349...)
const numeroVisible = (chat) => (/^\d+$/.test(chat) ? chat : 'Sin número');

const formatoFecha = (fecha) => {
	const f = dayjs(fecha);
	return f.isSame(dayjs(), 'day') ? f.format('HH:mm') : f.locale('es').format('DD/MM/YY');
};

const IconoEstado = ({ estado, error }) => {
	if (estado === 'read') return <span className="text-info">✓✓</span>;
	if (estado === 'delivered') return <span>✓✓</span>;
	if (estado === 'sent') return <span>✓</span>;
	if (estado === 'failed') return <span className="text-danger" title={error}>⚠ No enviado</span>;
	return null;
};

export const App = () => {
	const {
		dataChats,
		dataMensajes,
		hayMas,
		isLoadingChats,
		isLoadingMensajes,
		error,
		obtenerChats,
		obtenerMensajes,
		obtenerMensajesAnteriores,
	} = useMensajesWspStore();
	const [busqueda, setbusqueda] = useState('');
	const [chatActivo, setchatActivo] = useState(null);
	// Total de mensajes del chat activo la ultima vez que se cargo: si cambia, llegaron mensajes nuevos
	const totalVisto = useRef(null);
	const finMensajes = useRef(null);

	useEffect(() => {
		const timer = setTimeout(() => obtenerChats(busqueda), 400);
		const intervalo = setInterval(() => obtenerChats(busqueda, true), INTERVALO_REFRESCO);
		return () => {
			clearTimeout(timer);
			clearInterval(intervalo);
		};
	}, [busqueda]);

	useEffect(() => {
		if (!chatActivo) return;
		const chat = dataChats.find((c) => c.chat === chatActivo);
		if (!chat || totalVisto.current === chat.total) return;
		const primeraCarga = totalVisto.current === null;
		totalVisto.current = chat.total;
		obtenerMensajes(chatActivo, !primeraCarga);
	}, [chatActivo, dataChats]);

	useEffect(() => {
		finMensajes.current?.scrollIntoView({ block: 'end' });
	}, [dataMensajes.length && dataMensajes[dataMensajes.length - 1].id]);

	const onSeleccionarChat = (chat) => {
		if (chat === chatActivo) return;
		totalVisto.current = null;
		setchatActivo(chat);
	};

	const chatSeleccionado = dataChats.find((c) => c.chat === chatActivo);

	return (
		<div>
			<PageBreadcrumb title={'Mensajes de WhatsApp'} />
			{error && <Alert variant="danger">{error}</Alert>}
			<Row>
				<Col md={4} className="mb-3">
					<Card className="h-100">
						<Card.Header>
							<Form.Control placeholder="Buscar por número o nombre" value={busqueda} onChange={(e) => setbusqueda(e.target.value)} />
						</Card.Header>
						<div style={{ height: '65vh', overflowY: 'auto' }}>
							{isLoadingChats ? (
								<div className="text-center p-4">
									<Spinner animation="border" />
								</div>
							) : (
								<ListGroup variant="flush">
									{dataChats.length === 0 && <ListGroup.Item className="text-center text-muted">No hay mensajes</ListGroup.Item>}
									{dataChats.map((c) => (
										<ListGroup.Item key={c.chat} action active={c.chat === chatActivo} onClick={() => onSeleccionarChat(c.chat)}>
											<div className="d-flex justify-content-between">
												<strong className="text-truncate">{c.nombre || numeroVisible(c.chat)}</strong>
												<small className="text-nowrap ms-2">{formatoFecha(c.fecha)}</small>
											</div>
											{c.nombre && <small className="d-block">{numeroVisible(c.chat)}</small>}
											<small className="d-block text-truncate opacity-75">
												{c.enviado_por_mi ? 'Tú: ' : ''}
												{c.body}
											</small>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</div>
					</Card>
				</Col>
				<Col md={8} className="mb-3">
					<Card className="h-100">
						<Card.Header>
							{chatSeleccionado ? (
								<>
									<strong>{chatSeleccionado.nombre || numeroVisible(chatSeleccionado.chat)}</strong>
									{chatSeleccionado.nombre && <span className="ms-2 text-muted">{numeroVisible(chatSeleccionado.chat)}</span>}
								</>
							) : (
								<span className="text-muted">Seleccione un chat</span>
							)}
						</Card.Header>
						<div style={{ height: '65vh', overflowY: 'auto' }} className="p-3 bg-light">
							{isLoadingMensajes ? (
								<div className="text-center p-4">
									<Spinner animation="border" />
								</div>
							) : (
								chatActivo && (
									<>
										{hayMas && (
											<div className="text-center mb-2">
												<Button size="sm" variant="link" onClick={() => obtenerMensajesAnteriores(chatActivo)}>
													Ver mensajes anteriores
												</Button>
											</div>
										)}
										{dataMensajes.map((m) => (
											<div key={m.id} className={`d-flex mb-2 ${m.enviado_por_mi ? 'justify-content-end' : 'justify-content-start'}`}>
												<div
													className={`px-3 py-2 rounded shadow-sm ${m.enviado_por_mi ? 'bg-success-subtle' : 'bg-white'}`}
													style={{ maxWidth: '75%' }}
												>
													<div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.body}</div>
													<div className="text-end text-muted" style={{ fontSize: 11 }}>
														{dayjs(m.fecha).locale('es').format('DD/MM/YY HH:mm')}{' '}
														{m.enviado_por_mi && <IconoEstado estado={m.estado} error={m.error} />}
													</div>
												</div>
											</div>
										))}
										<div ref={finMensajes} />
									</>
								)
							)}
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	);
};
