import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';

const DEDOS = [
	{ value: 0, label: 'Meñique izquierdo' },
	{ value: 1, label: 'Anular izquierdo' },
	{ value: 2, label: 'Medio izquierdo' },
	{ value: 3, label: 'Índice izquierdo' },
	{ value: 4, label: 'Pulgar izquierdo' },
	{ value: 5, label: 'Pulgar derecho' },
	{ value: 6, label: 'Índice derecho' },
	{ value: 7, label: 'Medio derecho' },
	{ value: 8, label: 'Anular derecho' },
	{ value: 9, label: 'Meñique derecho' },
];

const personaInicial = { nombre: '', dni: '', dedo: 6, binaryData: '' };

export const ModalAgregarPersona = ({ show, onHide, agregarPersona, onAgregada }) => {
	const [persona, setpersona] = useState(personaInicial);
	const [isGuardando, setisGuardando] = useState(false);
	const [error, seterror] = useState('');

	const onInputChange = (e) => {
		setpersona({ ...persona, [e.target.name]: e.target.value });
	};
	const onCerrar = () => {
		setpersona(personaInicial);
		seterror('');
		onHide();
	};
	const onGuardar = async (e) => {
		e.preventDefault();
		setisGuardando(true);
		seterror('');
		const resultado = await agregarPersona({ ...persona, dedo: Number(persona.dedo) });
		setisGuardando(false);
		if (!resultado.ok) {
			seterror(resultado.msg);
			return;
		}
		onAgregada(resultado);
		onCerrar();
	};

	return (
		<Modal show={show} onHide={onCerrar} centered>
			<Form onSubmit={onGuardar}>
				<Modal.Header closeButton>
					<Modal.Title>Agregar persona</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && <Alert variant="danger">{error}</Alert>}
					<Form.Group className="mb-3">
						<Form.Label>Nombre</Form.Label>
						<Form.Control name="nombre" value={persona.nombre} onChange={onInputChange} maxLength={40} required autoFocus />
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>DNI</Form.Label>
						<Form.Control
							name="dni"
							value={persona.dni}
							onChange={onInputChange}
							inputMode="numeric"
							pattern="\d{1,9}"
							title="Solo números (hasta 9 dígitos)"
							required
						/>
						<Form.Text muted>Es el PIN con el que la persona marca en el huellero.</Form.Text>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Dedo</Form.Label>
						<Form.Select name="dedo" value={persona.dedo} onChange={onInputChange}>
							{DEDOS.map((d) => (
								<option key={d.value} value={d.value}>
									{d.value} - {d.label}
								</option>
							))}
						</Form.Select>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>BinaryData</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							name="binaryData"
							value={persona.binaryData}
							onChange={onInputChange}
							placeholder="Pega aquí el BinaryData de la huella en base64 (ej. Sr9TUzIx...)"
							style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
							required
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="link" onClick={onCerrar} disabled={isGuardando}>
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
