import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';

// Corrige el DNI de una persona: solo cambia el DNI del sistema, el PIN del huellero se mantiene
export const ModalEditarDni = ({ persona, onHide, editarDniPersona, onEditado }) => {
	const [dni, setdni] = useState('');
	const [isGuardando, setisGuardando] = useState(false);
	const [error, seterror] = useState('');

	// Al abrir para otra persona: su DNI actual y formulario limpio
	useEffect(() => {
		if (!persona) return;
		setdni(persona.dni || '');
		seterror('');
	}, [persona]);

	const onGuardar = async (e) => {
		e.preventDefault();
		setisGuardando(true);
		seterror('');
		const resultado = await editarDniPersona(persona.pin, dni.trim());
		setisGuardando(false);
		if (!resultado.ok) {
			seterror(resultado.msg);
			return;
		}
		onEditado(resultado);
		onHide();
	};

	return (
		<Modal show={Boolean(persona)} onHide={onHide} centered>
			<Form onSubmit={onGuardar}>
				<Modal.Header closeButton>
					<Modal.Title>Editar DNI</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{persona && (
						<p className="mb-3">
							<b>{persona.nombre}</b> · PIN {persona.pin}
						</p>
					)}
					{error && <Alert variant="danger">{error}</Alert>}
					<Form.Group className="mb-3">
						<Form.Label>DNI</Form.Label>
						<Form.Control
							value={dni}
							onChange={(e) => setdni(e.target.value)}
							inputMode="numeric"
							pattern="\d{1,9}"
							title="Solo números (hasta 9 dígitos)"
							required
							autoFocus
						/>
						<Form.Text muted>
							Solo cambia el DNI del sistema (el que se cruza con los socios en los reportes). El PIN del huellero se mantiene,
							así que la persona sigue marcando igual.
						</Form.Text>
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
