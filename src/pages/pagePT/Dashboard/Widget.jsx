import React, { useEffect, useState } from 'react';
import { Card, Dropdown, Spinner } from 'react-bootstrap';
import { WidgetKpi } from './WidgetKpi';
import { WidgetGrafico } from './WidgetGrafico';
import { WidgetTabla } from './WidgetTabla';
import { etiquetaPeriodo } from './formato';

export const Widget = ({ widget, edicion, onEditar, onDuplicar, onEliminar, datosWidget }) => {
	const [respuesta, setRespuesta] = useState(null);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState('');
	const [intento, setIntento] = useState(0);
	const clave = JSON.stringify(widget.config);

	useEffect(() => {
		let vigente = true;
		setCargando(true);
		setError('');
		datosWidget(widget.config, widget.titulo).then((data) => {
			if (!vigente) return;
			if (data && data.error) setError(data.error);
			else setRespuesta(data);
			setCargando(false);
		});
		return () => { vigente = false; };
	}, [clave, intento]);

	const sinDatos = respuesta && !respuesta.visualizacion;
	const esGrafico = ['lineas', 'area', 'barras', 'dona'].includes(widget.tipo);

	return (
		<Card className='h-100 mb-0 d-flex flex-column'>
			<Card.Header className={`d-flex align-items-center justify-content-between py-2 ${edicion ? 'drag-handle' : ''}`}>
				<div className='text-truncate'>
					{edicion && <i className='mdi mdi-drag me-1 text-muted'></i>}
					<span className='fw-semibold'>{widget.titulo}</span>
					{widget.tipo !== 'kpi' && <small className='text-muted ms-2'>{etiquetaPeriodo(widget.config.periodo)}</small>}
				</div>
				{edicion && (
					<Dropdown align='end' onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
						<Dropdown.Toggle variant='link' className='text-muted p-0 arrow-none'>
							<i className='mdi mdi-dots-vertical font-18'></i>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={() => onEditar(widget)}><i className='mdi mdi-pencil me-1'></i> Editar</Dropdown.Item>
							<Dropdown.Item onClick={() => onDuplicar(widget)}><i className='mdi mdi-content-copy me-1'></i> Duplicar</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item className='text-danger' onClick={() => onEliminar(widget)}><i className='mdi mdi-delete me-1'></i> Eliminar</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				)}
			</Card.Header>
			<Card.Body className='widget-cuerpo py-2'>
				{cargando && (
					<div className='d-flex align-items-center justify-content-center h-100'>
						<Spinner animation='border' size='sm' variant='danger' />
					</div>
				)}
				{!cargando && error && (
					<div className='d-flex flex-column align-items-center justify-content-center h-100 text-center'>
						<span className='text-danger'>{error}</span>
						<button type='button' className='btn btn-sm btn-light mt-2' onClick={() => setIntento(intento + 1)}>Reintentar</button>
					</div>
				)}
				{!cargando && !error && sinDatos && (
					<div className='d-flex align-items-center justify-content-center h-100 text-muted text-center'>{respuesta.texto}</div>
				)}
				{!cargando && !error && respuesta && respuesta.visualizacion && (
					<>
						{widget.tipo === 'kpi' && <WidgetKpi respuesta={respuesta} />}
						{esGrafico && <WidgetGrafico tipo={widget.tipo} respuesta={respuesta} />}
						{(widget.tipo === 'tabla' || widget.tipo === 'ranking') && <WidgetTabla tipo={widget.tipo} respuesta={respuesta} titulo={widget.titulo} />}
						{widget.tipo === 'texto' && <p className='mb-0'>{respuesta.texto}</p>}
					</>
				)}
			</Card.Body>
		</Card>
	);
};
