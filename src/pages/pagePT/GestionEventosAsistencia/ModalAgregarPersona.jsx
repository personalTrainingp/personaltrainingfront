import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { DEDOS } from './dedos';

const personaInicial = { nombre: '', dni: '', dedo: 6, binaryData: '' };

// precargado (opcional): { nombre, dni } para registrar la huella de un cliente ya conocido
export const ModalAgregarPersona = ({ show, onHide, agregarPersona, onAgregada, precargado = null, titulo = 'Agregar persona' }) => {
	const [persona, setpersona] = useState(personaInicial);
	useEffect(() => {
		if (show && precargado) setpersona({ ...personaInicial, ...precargado });
	}, [show, precargado]);
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
					<Modal.Title>{titulo}</Modal.Title>
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
						<Form.Text muted>Se guarda tal cual como su DNI. El PIN del huellero es el mismo número; si empieza con 0 se le antepone un 1 (01234567 → 101234567).</Form.Text>
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
