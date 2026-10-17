import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { MESES } from './meses';

const asesorInicial = { id_asesor: '', meta_asesor: '' };

// Reparto de la meta mensual entre asesores. Si el asesor ya está asignado, se actualiza su monto.
export const ModalMetaAsesores = ({ show, onHide, meta, dataAsesores, guardarMetaAsesor, eliminarMetaAsesor, onCambio }) => {
	const [asesor, setasesor] = useState(asesorInicial);
	const [isGuardando, setisGuardando] = useState(false);
	const [error, seterror] = useState('');

	useEffect(() => {
		if (show) {
			setasesor(asesorInicial);
			seterror('');
		}
	}, [show]);

	if (!meta) return null;
	const pendiente = meta.meta - meta.total_asignado;

	const onInputChange = (e) => {
		setasesor({ ...asesor, [e.target.name]: e.target.value });
	};
	const onEditar = (a) => {
		setasesor({ id_asesor: a.id_asesor, meta_asesor: a.meta_asesor });
	};
	const onGuardar = async (e) => {
		e.preventDefault();
		setisGuardando(true);
		seterror('');
		const resultado = await guardarMetaAsesor(meta.id_meta, {
			id_asesor: Number(asesor.id_asesor),
			meta_asesor: Number(asesor.meta_asesor),
		});
		setisGuardando(false);
		if (!resultado.ok) {
			seterror(resultado.msg);
			return;
		}
		setasesor(asesorInicial);
		onCambio();
	};
	const onQuitar = async (a) => {
		if (!window.confirm(`¿Quitar a ${a.nombre_asesor} de esta meta?`)) return;
		const resultado = await eliminarMetaAsesor(a.id);
		if (!resultado.ok) {
			seterror(resultado.msg);
			return;
		}
		onCambio();
	};

	return (
		<Modal show={show} onHide={onHide} size="lg" centered>
			<Modal.Header closeButton>
				<Modal.Title>
					Asesores · {MESES[meta.mes - 1]} {meta.anio}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error && <Alert variant="danger">{error}</Alert>}
				<div className="d-flex flex-wrap gap-4 mb-3 fs-5">
					<span>
						Meta: <NumberFormatMoney className="" amount={meta.meta} />
					</span>
					<span>
						Asignado: <NumberFormatMoney className="" amount={meta.total_asignado} />
					</span>
					<span className={pendiente < 0 ? 'text-danger' : ''}>
						{pendiente < 0 ? 'Excedido' : 'Por asignar'}: <NumberFormatMoney className="" amount={Math.abs(pendiente)} />
					</span>
				</div>
				<Form onSubmit={onGuardar}>
					<Row className="align-items-end mb-3 g-2">
						<Col md={6}>
							<Form.Label>Asesor</Form.Label>
							<Form.Select name="id_asesor" value={asesor.id_asesor} onChange={onInputChange} required>
								<option value="">Seleccione...</option>
								{dataAsesores.map((a) => (
									<option key={a.value} value={a.value}>
										{a.label}
									</option>
								))}
							</Form.Select>
						</Col>
						<Col md={4}>
							<Form.Label>Meta del asesor (S/)</Form.Label>
							<Form.Control type="number" name="meta_asesor" value={asesor.meta_asesor} onChange={onInputChange} min={0.01} step="0.01" required />
						</Col>
						<Col md={2}>
							<Button type="submit" className="w-100" disabled={isGuardando}>
								{isGuardando ? '...' : 'Guardar'}
							</Button>
						</Col>
					</Row>
				</Form>
				<Table striped bordered size="sm" className="mb-0">
					<thead>
						<tr>
							<th>Asesor</th>
							<th className="text-end">Meta</th>
							<th className="text-end">% de la meta</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{meta.asesores.length === 0 && (
							<tr>
								<td colSpan={4} className="text-center text-muted">
									Sin asesores asignados
								</td>
							</tr>
						)}
						{meta.asesores.map((a) => (
							<tr key={a.id}>
								<td>{a.nombre_asesor}</td>
								<td className="text-end">
									<NumberFormatMoney className="" amount={a.meta_asesor} />
								</td>
								<td className="text-end">{((a.meta_asesor / meta.meta) * 100).toFixed(1)}%</td>
								<td className="text-end text-nowrap">
									<Button size="sm" variant="link" onClick={() => onEditar(a)}>
										Editar
									</Button>
									<Button size="sm" variant="link" className="text-danger" onClick={() => onQuitar(a)}>
										Quitar
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Modal.Body>
		</Modal>
	);
};
