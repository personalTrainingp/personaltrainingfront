import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Offcanvas, Spinner, Table } from 'react-bootstrap';
import { formatear } from './formato';

const SUGERENCIAS = ['¿Cuánto vendimos este mes?', 'Ventas por vendedor este mes', 'Compara agosto con julio', 'Top 10 productos del año', '¿Cuántos socios tengo?', 'Gastos por categoría del mes pasado'];

const ERRORES = {
	error_ia: 'El servicio de IA no respondió; intenta en un momento.',
	error_sql: 'Hubo un error consultando los datos. Quedó registrado.',
	periodo_invalido: 'No entendí el periodo. Prueba con "agosto 2026" o "últimos 30 días".',
	sql_rechazado: 'No pude construir esa consulta de forma segura.',
	plan_invalido: 'No pude armar esa consulta. Prueba de otra forma.',
	conexion: 'No se pudo conectar con el servicio de analytics.',
};

const ACCIONES = { eliminar: 'Eliminar widget', mover: 'Mover', redimensionar: 'Redimensionar', filtrar: 'Aplicar filtro', renombrar: 'Renombrar' };

export const ChatDrawer = ({ show, onHide, dashboardId, enviarChat, onAgregarPropuesta, onAccion, ultimoWidget }) => {
	const [mensajes, setMensajes] = useState([]);
	const [texto, setTexto] = useState('');
	const [pensando, setPensando] = useState(false);
	const fin = useRef(null);

	useEffect(() => { if (fin.current) fin.current.scrollIntoView({ behavior: 'smooth' }); }, [mensajes, pensando]);

	const enviar = async (t) => {
		const mensaje = (t ?? texto).trim();
		if (!mensaje || pensando) return;
		setTexto('');
		setMensajes(prev => [...prev, { de: 'usuario', texto: mensaje }]);
		setPensando(true);
		const r = await enviarChat(mensaje, dashboardId, ultimoWidget);
		setMensajes(prev => [...prev, { de: 'bot', r, hecho: false }]);
		setPensando(false);
	};

	const marcarHecho = (i, nota) => setMensajes(prev => prev.map((m, j) => (j === i ? { ...m, hecho: true, nota } : m)));

	const burbuja = (m, i) => {
		if (m.de === 'usuario') return <div key={i} className='d-flex justify-content-end mb-2'><div className='bg-change text-white rounded-3 px-3 py-2' style={{ maxWidth: '85%' }}>{m.texto}</div></div>;
		const r = m.r || {};
		let cuerpo = null;
		if (r.tipo === 'respuesta') {
			const res = r.respuesta;
			cuerpo = (
				<>
					<div>{res.texto}</div>
					{res.insights && res.insights.length > 0 && <ul className='mb-1 mt-1 ps-3 small text-muted'>{res.insights.map((x, k) => <li key={k}>{x}</li>)}</ul>}
					{res.tabla && res.tabla.filas.length > 1 && res.tabla.filas.length <= 12 && (
						<Table size='sm' className='mb-1 mt-1 small'>
							<tbody>{res.tabla.filas.map((f, k) => <tr key={k}>{f.map((c, j) => <td key={j}>{typeof c === 'number' ? formatear(c, res.unidad) : String(c ?? '')}</td>)}</tr>)}</tbody>
						</Table>
					)}
					{!res.verificado && <small className='text-warning d-block'>Consulta construida a medida: verificar antes de decidir.</small>}
					{r.propuestaWidget && res.visualizacion && !m.hecho && (
						<Button size='sm' variant='outline-danger' className='mt-1' onClick={async () => { await onAgregarPropuesta(r.propuestaWidget); marcarHecho(i, 'Agregado al dashboard'); }}>
							<i className='mdi mdi-plus'></i> Agregar al dashboard
						</Button>
					)}
				</>
			);
		} else if (r.tipo === 'dashboard') {
			if (r.accion === 'crear' || r.accion === 'crear_dashboard') {
				cuerpo = (
					<>
						<div>{r.respuesta ? r.respuesta.texto : (r.error ? 'No pude preparar ese widget.' : 'Widget listo para agregar.')}</div>
						{r.propuesta && !r.error && !m.hecho && (
							<Button size='sm' variant='outline-danger' className='mt-1' onClick={async () => { await onAgregarPropuesta(r.propuesta); marcarHecho(i, 'Agregado al dashboard'); }}>
								<i className='mdi mdi-plus'></i> Agregar "{r.propuesta.titulo}"
							</Button>
						)}
					</>
				);
			} else if (!r.widget) {
				cuerpo = <div>No encontré a qué widget te refieres. Dime su nombre tal como aparece en el dashboard.</div>;
			} else {
				cuerpo = (
					<>
						<div>{r.accion === 'eliminar' ? `¿Eliminar el widget "${r.widgetTitulo}"?` : `Voy a aplicar "${ACCIONES[r.accion] || r.accion}" sobre "${r.widgetTitulo}".`}</div>
						{!m.hecho && (
							<Button size='sm' variant={r.accion === 'eliminar' ? 'danger' : 'outline-danger'} className='mt-1' onClick={async () => { await onAccion(r); marcarHecho(i, r.accion === 'eliminar' ? 'Eliminado' : 'Aplicado'); }}>
								{r.accion === 'eliminar' ? 'Confirmar eliminación' : 'Aplicar'}
							</Button>
						)}
					</>
				);
			}
		} else if (r.tipo === 'aclarar') {
			cuerpo = <div>{r.pregunta}</div>;
		} else if (r.tipo === 'fuera') {
			cuerpo = <div>Puedo responder sobre ventas, cobros, gastos, socios y membresías, y crear o modificar widgets del dashboard.</div>;
		} else {
			cuerpo = <div className='text-danger'>{ERRORES[r.motivo] || r.detalle || 'Ocurrió un error.'}</div>;
		}
		return (
			<div key={i} className='d-flex justify-content-start mb-2'>
				<div className='bg-light rounded-3 px-3 py-2' style={{ maxWidth: '92%' }}>
					{cuerpo}
					{m.hecho && m.nota && <small className='text-success d-block mt-1'><i className='mdi mdi-check'></i> {m.nota}</small>}
				</div>
			</div>
		);
	};

	return (
		<Offcanvas show={show} onHide={onHide} placement='end' className='chat-drawer'>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title><i className='mdi mdi-robot me-1'></i> Asistente de datos</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body className='d-flex flex-column p-0'>
				<div className='flex-grow-1 overflow-auto px-3 pt-3'>
					{mensajes.length === 0 && (
						<div className='text-muted small'>
							<p>Pregunta en lenguaje natural. Ejemplos:</p>
							<div className='d-flex flex-wrap gap-1'>
								{SUGERENCIAS.map(s => <Button key={s} size='sm' variant='light' onClick={() => enviar(s)}>{s}</Button>)}
							</div>
						</div>
					)}
					{mensajes.map(burbuja)}
					{pensando && <div className='text-muted small mb-2'><Spinner size='sm' animation='border' className='me-1' /> Consultando…</div>}
					<div ref={fin}></div>
				</div>
				<Form className='border-top p-2 d-flex gap-2' onSubmit={(e) => { e.preventDefault(); enviar(); }}>
					<Form.Control value={texto} onChange={(e) => setTexto(e.target.value)} placeholder='Escribe tu pregunta…' disabled={pensando} autoFocus />
					<Button type='submit' variant='danger' disabled={pensando || !texto.trim()}><i className='mdi mdi-send'></i></Button>
				</Form>
			</Offcanvas.Body>
		</Offcanvas>
	);
};
