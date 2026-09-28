import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Row } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import { DataTableEventosAsistencia } from './DataTableEventosAsistencia';
import { useEventosAsistenciaStore } from './useEventosAsistenciaStore';
import { ModalAgregarPersona } from './ModalAgregarPersona';

// Hoy en Perú (YYYY-MM-DD)
const hoyLima = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });

export const App = () => {
	const {
		obtenerEventosAsistencia,
		obtenerEstadoHuelleros,
		agregarPersona,
		dataEventos,
		dataHuelleros,
		minutosOffline,
		isLoading,
		error,
	} = useEventosAsistenciaStore();
	const [rango, setrango] = useState({ desde: hoyLima(), hasta: hoyLima() });
	const [isOpenModalAgregarPersona, setisOpenModalAgregarPersona] = useState(false);
	const [mensajeExito, setmensajeExito] = useState('');

	useEffect(() => {
		obtenerEventosAsistencia(rango.desde, rango.hasta);
		obtenerEstadoHuelleros();
	}, []);

	const onChangeFecha = (e) => {
		setrango({ ...rango, [e.target.name]: e.target.value });
	};
	const onBuscar = (e) => {
		e.preventDefault();
		obtenerEventosAsistencia(rango.desde, rango.hasta);
		obtenerEstadoHuelleros();
	};
	const onPersonaAgregada = ({ persona, huelleros }) => {
		setmensajeExito(
			`${persona.nombre} (DNI ${persona.pin}) fue agregada` +
				(huelleros.length
					? ` y enviada a: ${huelleros.join(', ')}. El huellero la recibirá en su próxima conexión.`
					: '. No hay huelleros activos.')
		);
	};

	return (
		<div>
			<PageBreadcrumb title={'Eventos de asistencia (huellero)'} />
			<Form onSubmit={onBuscar} className="mb-3">
				<Row className="align-items-end g-2">
					<Col xs={12} sm={6} md={3}>
						<Form.Label>Desde</Form.Label>
						<Form.Control type="date" name="desde" value={rango.desde} max={rango.hasta} onChange={onChangeFecha} required />
					</Col>
					<Col xs={12} sm={6} md={3}>
						<Form.Label>Hasta</Form.Label>
						<Form.Control type="date" name="hasta" value={rango.hasta} min={rango.desde} onChange={onChangeFecha} required />
					</Col>
					<Col xs={12} md="auto">
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Buscando...' : 'Buscar'}
						</Button>
					</Col>
					<Col xs={12} md="auto" className="ms-md-auto">
						<Button variant="success" onClick={() => setisOpenModalAgregarPersona(true)}>
							Agregar persona
						</Button>
					</Col>
				</Row>
			</Form>

			<div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
				<span className="fw-semibold">Huelleros:</span>
				{dataHuelleros.map((h) => (
					<Badge
						key={h.DeviceSN}
						bg={h.estado === 'online' ? 'success' : 'secondary'}
						title={h.ultima_ip ? `IP: ${h.ultima_ip}` : 'Nunca se ha conectado'}
					>
						{h.DeviceSN} · {h.estado === 'online' ? 'EN LÍNEA' : 'FUERA DE LÍNEA'}
					</Badge>
				))}
				<small className="text-muted">(en línea = conectado en los últimos {minutosOffline} min)</small>
			</div>

			{mensajeExito && (
				<Alert variant="success" dismissible onClose={() => setmensajeExito('')}>
					{mensajeExito}
				</Alert>
			)}
			{error && <Alert variant="danger">{error}</Alert>}
			<DataTableEventosAsistencia list={dataEventos} loading={isLoading} />
			<ModalAgregarPersona
				show={isOpenModalAgregarPersona}
				onHide={() => setisOpenModalAgregarPersona(false)}
				agregarPersona={agregarPersona}
				onAgregada={onPersonaAgregada}
			/>
		</div>
	);
};
