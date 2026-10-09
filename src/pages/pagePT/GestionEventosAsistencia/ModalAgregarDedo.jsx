import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { DEDOS } from './dedos';

// Agrega la huella de otro dedo a una persona existente (se guarda y se envía al huellero)
export const ModalAgregarDedo = ({ persona, onHide, agregarHuella, onAgregada, titulo = 'Agregar dedo', textoGuardar = 'Guardar y enviar al huellero' }) => {
	const disponibles = DEDOS.filter((d) => !persona?.dedos?.includes(d.value));
	const [dedo, setdedo] = useState('');
	const [binaryData, setbinaryData] = useState('');
	const [isGuardando, setisGuardando] = useState(false);
	const [error, seterror] = useState('');

	// Al abrir para otra persona: primer dedo libre y formulario limpio
	useEffect(() => {
		if (!persona) return;
		setdedo(disponibles[0]?.value ?? '');
		setbinaryData('');
		seterror('');
	}, [persona]);

	const onGuardar = async (e) => {
		e.preventDefault();
		setisGuardando(true);
		seterror('');
		const resultado = await agregarHuella(persona.pin, { dedo: Number(dedo), binaryData });
		setisGuardando(false);
		if (!resultado.ok) {
			seterror(resultado.msg);
			return;
		}
		onAgregada(resultado);
		onHide();
	};

	return (
		<Modal show={Boolean(persona)} onHide={onHide} centered>
			<Form onSubmit={onGuardar}>
				<Modal.Header closeButton>
					<Modal.Title>{titulo}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{persona && (
						<p className="mb-3">
							<b>{persona.nombre}</b> · DNI {persona.pin}
						</p>
					)}
					{error && <Alert variant="danger">{error}</Alert>}
					{disponibles.length === 0 ? (
						<Alert variant="info">Esta persona ya tiene huella en los 10 dedos.</Alert>
					) : (
						<>
							<Form.Group className="mb-3">
								<Form.Label>Dedo</Form.Label>
								<Form.Select value={dedo} onChange={(e) => setdedo(e.target.value)} required>
									{disponibles.map((d) => (
										<option key={d.value} value={d.value}>
											{d.value} - {d.label}
										</option>
									))}
								</Form.Select>
								<Form.Text muted>Solo aparecen los dedos que aún no tienen huella.</Form.Text>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>BinaryData</Form.Label>
								<Form.Control
									as="textarea"
									rows={5}
									value={binaryData}
									onChange={(e) => setbinaryData(e.target.value)}
									placeholder="Pega aquí el BinaryData de la huella en base64 (ej. Sr9TUzIx...)"
									style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
									required
								/>
							</Form.Group>
						</>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="link" onClick={onHide} disabled={isGuardando}>
						Cancelar
					</Button>
					<Button type="submit" disabled={isGuardando || disponibles.length === 0}>
						{isGuardando ? 'Guardando...' : textoGuardar}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
