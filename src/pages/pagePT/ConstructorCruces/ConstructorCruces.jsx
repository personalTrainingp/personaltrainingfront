import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { PageBreadcrumb } from '@/components';
import { TablaCruce } from './TablaCruce';
import { GraficoCruce } from './GraficoCruce';
import { DIMENSIONES, MEDIDAS } from './logica';

const SERVICIO = 'https://asistente-change.azurewebsites.net';
const CLAVE_VISTAS = 'cruces_vistas_change';
const VISTAS = [
	{ id: 'tabla', etiqueta: 'Tabla' },
	{ id: 'barras', etiqueta: 'Barras' },
	{ id: 'lineas', etiqueta: 'Líneas' },
	{ id: 'torta', etiqueta: 'Torta' },
];

const leerVistas = () => {
	try { return JSON.parse(localStorage.getItem(CLAVE_VISTAS) || '[]'); } catch { return []; }
};

export const ConstructorCruces = () => {
	const [datos, setDatos] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState('');
	const [dimFila, setDimFila] = useState('empresa');
	const [dimColumna, setDimColumna] = useState('mes');
	const [medida, setMedida] = useState('monto');
	const [operacion, setOperacion] = useState('Sum');
	const [vista, setVista] = useState('tabla');
	const [pregunta, setPregunta] = useState('');
	const [pensando, setPensando] = useState(false);
	const [sugerencia, setSugerencia] = useState('');
	const [nombre, setNombre] = useState('');
	const [guardadas, setGuardadas] = useState(leerVistas());
	const [arrastrado, setArrastrado] = useState(null);

	useEffect(() => {
		const control = new AbortController();
		axios.get(`${SERVICIO}/dataset/ventas`, {
			params: { desde: '2024-01-01', hasta: '2027-01-01' },
			headers: { 'x-token': localStorage.getItem('token') || '' },
			timeout: 45000,
			signal: control.signal,
		})
			.then(({ data }) => setDatos(Array.isArray(data) ? data : []))
			.catch((e) => { if (e.name !== 'CanceledError') setError('No se pudieron cargar los datos. Intenta de nuevo en unos minutos.'); })
			.finally(() => setCargando(false));
		return () => control.abort();
	}, []);

	useEffect(() => { localStorage.setItem(CLAVE_VISTAS, JSON.stringify(guardadas)); }, [guardadas]);

	const onArmarConChat = async () => {
		if (!pregunta.trim()) return;
		setPensando(true);
		setSugerencia('');
		try {
			const { data } = await axios.post(`${SERVICIO}/dataset/interpretar`, { texto: pregunta }, {
				headers: { 'x-token': localStorage.getItem('token') || '' },
				timeout: 45000,
			});
			const fila = data.rows && data.rows[0];
			const columna = data.cols && data.cols[0];
			const val = data.vals && data.vals[0];
			if (DIMENSIONES.includes(fila)) setDimFila(fila);
			if (!columna || DIMENSIONES.includes(columna)) setDimColumna(columna || '');
			if (MEDIDAS.includes(val)) setMedida(val);
			if (['Sum', 'Count'].includes(data.aggregatorName)) setOperacion(data.aggregatorName);
			if (VISTAS.some(v => v.id === data.vista)) setVista(data.vista);
			if (data.motivo) setSugerencia(String(data.motivo).slice(0, 160));
		} catch {
			setSugerencia('No pude interpretar la pregunta. Arma el cruce arrastrando los campos.');
		}
		setPensando(false);
	};

	const onSoltar = (destino) => {
		if (!arrastrado) return;
		const esDimension = DIMENSIONES.includes(arrastrado);
		const esMedida = MEDIDAS.includes(arrastrado);
		if (destino === 'fila' && esDimension) setDimFila(arrastrado);
		if (destino === 'columna' && esDimension) setDimColumna(arrastrado);
		if (destino === 'medida' && esMedida) {
			setMedida(arrastrado);
			setOperacion(arrastrado === 'cantidad' ? 'Count' : 'Sum');
		}
		setArrastrado(null);
	};

	const onGuardarVista = () => {
		const n = nombre.trim();
		if (!n) return;
		const config = { dimFila, dimColumna, medida, operacion, vista };
		setGuardadas([...guardadas.filter(v => v.nombre !== n), { nombre: n, config }]);
		setNombre('');
	};

	const onCargarVista = (v) => {
		setDimFila(v.config.dimFila);
		setDimColumna(v.config.dimColumna);
		setMedida(v.config.medida);
		setOperacion(v.config.operacion);
		setVista(v.config.vista);
		setSugerencia('');
	};

	const zona = (titulo, valor, destino) => (
		<div
			onDragOver={(e) => e.preventDefault()}
			onDrop={() => onSoltar(destino)}
			className="border rounded p-2 h-100"
			style={{ borderStyle: 'dashed', minHeight: '58px' }}
		>
			<small className="text-muted d-block">{titulo}</small>
			<span className="fw-bold">{valor || 'arrastra un campo'}</span>
		</div>
	);

	return (
		<>
			<PageBreadcrumb title="Constructor de cruces" subName="Reportes" />

			<Card>
				<Card.Body>
					<Row className="g-2 align-items-center mb-3">
						<Col md={5}>
							<Form.Control
								value={pregunta}
								onChange={(e) => setPregunta(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && onArmarConChat()}
								placeholder="Escribe qué quieres ver. Ej: ventas por empresa y mes"
							/>
						</Col>
						<Col xs="auto">
							<Button variant="danger" onClick={onArmarConChat} disabled={pensando}>
								{pensando ? <Spinner size="sm" animation="border" /> : 'Armar'}
							</Button>
						</Col>
						{sugerencia && <Col md><span className="badge bg-success-subtle text-success">{sugerencia}</span></Col>}
					</Row>

					<Row className="g-2 mb-3">
						<Col md={4}>
							<small className="text-muted d-block mb-1">Campos disponibles</small>
							<div className="d-flex flex-wrap gap-1">
								{[...DIMENSIONES, ...MEDIDAS].map(c => (
									<span
										key={c}
										draggable
										onDragStart={() => setArrastrado(c)}
										className="badge bg-light text-dark border"
										style={{ cursor: 'grab' }}
									>
										{c}
									</span>
								))}
							</div>
						</Col>
						<Col md={2}>{zona('Filas', dimFila, 'fila')}</Col>
						<Col md={2}>{zona('Columnas', dimColumna, 'columna')}</Col>
						<Col md={2}>{zona('Medida', medida, 'medida')}</Col>
						<Col md={2}>
							<small className="text-muted d-block mb-1">Operación</small>
							<Form.Select size="sm" value={operacion} onChange={(e) => setOperacion(e.target.value)}>
								<option value="Sum">Sumar</option>
								<option value="Count">Contar</option>
							</Form.Select>
						</Col>
					</Row>

					<Row className="g-2 align-items-center mb-3">
						<Col xs="auto">
							{VISTAS.map(v => (
								<Button
									key={v.id}
									size="sm"
									variant={vista === v.id ? 'danger' : 'outline-secondary'}
									className="me-1"
									onClick={() => setVista(v.id)}
								>
									{v.etiqueta}
								</Button>
							))}
						</Col>
						<Col xs="auto">
							<Button size="sm" variant="outline-secondary" onClick={() => setDimColumna('')}>
								Quitar columnas
							</Button>
						</Col>
						<Col md={3}>
							<Form.Control
								size="sm"
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
								placeholder="nombre de la vista"
							/>
						</Col>
						<Col xs="auto">
							<Button size="sm" variant="dark" onClick={onGuardarVista}>Guardar vista</Button>
						</Col>
					</Row>

					{guardadas.length > 0 && (
						<div className="d-flex flex-wrap gap-1 mb-3">
							{guardadas.map(v => (
								<Button key={v.nombre} size="sm" variant="outline-dark" onClick={() => onCargarVista(v)}>
									{v.nombre}
								</Button>
							))}
						</div>
					)}

					{cargando && <div className="text-center py-4"><Spinner animation="border" variant="danger" /></div>}
					{!cargando && error && <p className="text-danger">{error}</p>}
					{!cargando && !error && vista === 'tabla' && (
						<TablaCruce datos={datos} dimFila={dimFila} dimColumna={dimColumna} medida={medida} operacion={operacion} />
					)}
					{!cargando && !error && vista !== 'tabla' && (
						<GraficoCruce datos={datos} dimFila={dimFila} dimColumna={dimColumna} medida={medida} operacion={operacion} vista={vista} />
					)}
				</Card.Body>
			</Card>
		</>
	);
};
