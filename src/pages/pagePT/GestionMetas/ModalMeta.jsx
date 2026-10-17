import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { MESES } from './meses';

const metaInicial = () => {
	const hoy = new Date();
	return { nombre_meta: '', mes: hoy.getMonth() + 1, anio: hoy.getFullYear(), meta: '', bono: '', observacion: '' };
};

// metaEditar: null para crear, o la meta a editar
export const ModalMeta = ({ show, onHide, metaEditar, guardarMeta, onGuardada }) => {
	const [meta, setmeta] = useState(metaInicial);
	const [isGuardando, setisGuardando] = useState(false);
	const [error, seterror] = useState('');

	useEffect(() => {
		if (!show) return;
		seterror('');
		setmeta(
			metaEditar
				? {
						nombre_meta: metaEditar.nombre_meta || '',
						mes: metaEditar.mes,
						anio: metaEditar.anio,
						meta: metaEditar.meta,
						bono: metaEditar.bono,
						observacion: metaEditar.observacion || '',
				  }
				: metaInicial()
		);
	}, [show, metaEditar]);

	const onInputChange = (e) => {
		setmeta({ ...meta, [e.target.name]: e.target.value });
	};
	const onGuardar = async (e) => {
		e.preventDefault();
		setisGuardando(true);
		seterror('');
		const resultado = await guardarMeta(metaEditar?.id_meta, {
			...meta,
			mes: Number(meta.mes),
			anio: Number(meta.anio),
			meta: Number(meta.meta),
			bono: Number(meta.bono || 0),
		});
		setisGuardando(false);
		if (!resultado.ok) {
			seterror(resultado.msg);
			return;
		}
		onGuardada();
		onHide();
	};

	return (
		<Modal show={show} onHide={onHide} centered>
			<Form onSubmit={onGuardar}>
				<Modal.Header closeButton>
					<Modal.Title>{metaEditar ? 'Editar meta' : 'Nueva meta'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && <Alert variant="danger">{error}</Alert>}
					<Row>
						<Col xs={7}>
							<Form.Group className="mb-3">
								<Form.Label>Mes</Form.Label>
								<Form.Select name="mes" value={meta.mes} onChange={onInputChange}>
									{MESES.map((m, i) => (
										<option key={m} value={i + 1}>
											{m}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						</Col>
						<Col xs={5}>
							<Form.Group className="mb-3">
								<Form.Label>Año</Form.Label>
								<Form.Control type="number" name="anio" value={meta.anio} onChange={onInputChange} min={2000} max={2100} required />
							</Form.Group>
						</Col>
					</Row>
					<Form.Group className="mb-3">
						<Form.Label>Nombre</Form.Label>
						<Form.Control name="nombre_meta" value={meta.nombre_meta} onChange={onInputChange} maxLength={150} placeholder="Ej. META OCTUBRE" />
					</Form.Group>
					<Row>
						<Col>
							<Form.Group className="mb-3">
								<Form.Label>Meta (S/)</Form.Label>
								<Form.Control type="number" name="meta" value={meta.meta} onChange={onInputChange} min={0.01} step="0.01" required />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className="mb-3">
								<Form.Label>Bono (S/)</Form.Label>
								<Form.Control type="number" name="bono" value={meta.bono} onChange={onInputChange} min={0} step="0.01" />
							</Form.Group>
						</Col>
					</Row>
					<Form.Group className="mb-3">
						<Form.Label>Observación</Form.Label>
						<Form.Control as="textarea" rows={2} name="observacion" value={meta.observacion} onChange={onInputChange} maxLength={255} />
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="link" onClick={onHide} disabled={isGuardando}>
						Cancelar
					</Button>
					<Button type="submit" disabled={isGuardando}>
						{isGuardando ? 'Guardando...' : 'Guardar'}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
