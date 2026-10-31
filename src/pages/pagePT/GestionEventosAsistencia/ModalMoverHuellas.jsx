import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { nombreDedo } from './dedos';

// Mueve huellas de una persona a otra (ej. se registró con el DNI equivocado): se borran del origen
// y se dan de alta en el destino, en la BD y en los huelleros
export const ModalMoverHuellas = ({ persona, personas = [], onHide, moverHuellas, onMovidas }) => {
	const [dedos, setdedos] = useState([]);
	const [pinDestino, setpinDestino] = useState(null);
	const [isGuardando, setisGuardando] = useState(false);
	const [error, seterror] = useState('');

	// Al abrir para otra persona: todos sus dedos marcados y sin destino
	useEffect(() => {
		if (!persona) return;
		setdedos(persona.dedos || []);
		setpinDestino(null);
		seterror('');
	}, [persona]);

	const opcionesDestino = personas
		.filter((p) => p.pin !== persona?.pin)
		.map((p) => ({ value: p.pin, label: `${p.nombre} · DNI ${p.dni || '—'} · PIN ${p.pin}`, dedos: p.dedos || [] }));
	const destino = opcionesDestino.find((o) => o.value === pinDestino) || null;
	// Dedos que el destino ya tiene ocupados: el backend no mueve nada si coinciden
	const ocupados = destino ? dedos.filter((d) => destino.dedos.includes(d)) : [];

	const onToggleDedo = (dedo) => {
		setdedos(dedos.includes(dedo) ? dedos.filter((d) => d !== dedo) : [...dedos, dedo]);
	};

	const onGuardar = async (e) => {
		e.preventDefault();
		setisGuardando(true);
		seterror('');
		const resultado = await moverHuellas(persona.pin, { pinDestino, dedos });
		setisGuardando(false);
		if (!resultado.ok) {
			seterror(resultado.msg);
			return;
		}
		onMovidas(resultado);
		onHide();
	};

	return (
		<Modal show={Boolean(persona)} onHide={onHide} centered>
			<Form onSubmit={onGuardar}>
				<Modal.Header closeButton>
					<Modal.Title>Mover huellas</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{persona && (
						<p className="mb-3">
							De: <b>{persona.nombre}</b> · DNI {persona.dni || '—'} · PIN {persona.pin}
						</p>
					)}
					{error && <Alert variant="danger">{error}</Alert>}
					<Form.Group className="mb-3">
						<Form.Label>Huellas a mover</Form.Label>
						<div className="d-flex flex-wrap gap-3">
							{(persona?.dedos || []).map((dedo) => (
								<Form.Check
									key={dedo}
									id={`mover-dedo-${dedo}`}
									type="checkbox"
									label={nombreDedo(dedo)}
									checked={dedos.includes(dedo)}
									onChange={() => onToggleDedo(dedo)}
								/>
							))}
						</div>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Para</Form.Label>
						<Select
							placeholder="Buscar persona por nombre, DNI o PIN"
							className="react-select"
							classNamePrefix="react-select"
							options={opcionesDestino}
							value={destino}
							onChange={(o) => setpinDestino(o?.value ?? null)}
							isClearable
						/>
						<Form.Text muted>
							Se borran del huellero para {persona?.nombre || 'el origen'} y se registran para la persona elegida, con el mismo dedo.
						</Form.Text>
					</Form.Group>
					{ocupados.length > 0 && (
						<Alert variant="warning" className="mb-0">
							{destino.label.split(' · ')[0]} ya tiene huella en: {ocupados.map(nombreDedo).join(', ')}. Desmárcalos o elimina esas
							huellas primero.
						</Alert>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="link" onClick={onHide} disabled={isGuardando}>
						Cancelar
					</Button>
					<Button type="submit" disabled={isGuardando || !pinDestino || dedos.length === 0 || ocupados.length > 0}>
						{isGuardando ? 'Moviendo...' : 'Mover y enviar al huellero'}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
