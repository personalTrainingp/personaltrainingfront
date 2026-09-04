import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { confirmDialog } from 'primereact/confirmdialog';
import { PageBreadcrumb } from '@/components';
import { useDashboardStore } from './useDashboardStore';
import { Widget } from './Widget';
import { ConfigWidget } from './ConfigWidget';
import { ChatDrawer } from './ChatDrawer';
import { BREAKPOINTS, COLS, aLayouts, deLayout, siguientePosicion, tamanoPorTipo } from './layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const Dashboard = () => {
	const { dashboards, dashboard, widgets, semantica, cargando, error, setError, obtenerSemantica, obtenerDashboards, obtenerDashboard, crearWidget, actualizarWidget, eliminarWidget, guardarLayout, datosWidget, enviarChat } = useDashboardStore();
	const [edicion, setEdicion] = useState(false);
	const [pendiente, setPendiente] = useState(null);
	const [guardando, setGuardando] = useState(false);
	const [configAbierta, setConfigAbierta] = useState(false);
	const [editando, setEditando] = useState(null);
	const [chatAbierto, setChatAbierto] = useState(false);
	const [ultimoWidget, setUltimoWidget] = useState(null);
	const contenedor = useRef(null);
	const [ancho, setAncho] = useState(0);
	const [bp, setBp] = useState('lg');

	useEffect(() => {
		if (!contenedor.current) return undefined;
		const medir = () => setAncho(contenedor.current ? contenedor.current.getBoundingClientRect().width : 0);
		medir();
		const observador = new ResizeObserver(medir);
		observador.observe(contenedor.current);
		return () => observador.disconnect();
	}, [widgets.length]);

	useEffect(() => {
		obtenerSemantica();
		obtenerDashboards().then((lista) => {
			const inicial = lista.find(d => d.es_default) || lista[0];
			if (inicial) obtenerDashboard(inicial.id);
		});
	}, []);

	const layouts = useMemo(() => aLayouts(widgets), [widgets]);

	const onLayoutChange = (layout) => {
		if (!edicion || (bp !== 'lg' && bp !== 'md')) return;
		setPendiente(deLayout(layout));
	};

	const onGuardarLayout = async () => {
		setGuardando(true);
		if (pendiente) await guardarLayout(dashboard.id, pendiente);
		setPendiente(null);
		setGuardando(false);
		setEdicion(false);
	};

	const onCancelar = async () => {
		setPendiente(null);
		setEdicion(false);
		await obtenerDashboard(dashboard.id);
	};

	const onEditarWidget = (w) => { setEditando(w); setConfigAbierta(true); setUltimoWidget(w.id); };

	const onDuplicar = async (w) => {
		await crearWidget(dashboard.id, { tipo: w.tipo, titulo: `${w.titulo} (copia)`, ...siguientePosicion(widgets), w: w.w, h: w.h, config: w.config });
	};

	const onEliminar = (w) => {
		confirmDialog({
			message: `¿Eliminar el widget "${w.titulo}"?`,
			header: 'Confirmar',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Eliminar',
			rejectLabel: 'Cancelar',
			acceptClassName: 'p-button-danger',
			accept: () => eliminarWidget(dashboard.id, w.id),
		});
	};

	const onGuardarConfig = async (valor) => {
		if (editando) {
			await actualizarWidget(dashboard.id, editando.id, valor);
		} else {
			await crearWidget(dashboard.id, { ...valor, ...siguientePosicion(widgets), ...tamanoPorTipo(valor.tipo) });
		}
		setConfigAbierta(false);
		setEditando(null);
	};

	const onAgregarPropuesta = async (p) => {
		const creado = await crearWidget(dashboard.id, { tipo: p.tipo, titulo: p.titulo, ...siguientePosicion(widgets), w: p.w, h: p.h, config: p.config });
		if (creado) setUltimoWidget(creado.id);
	};

	const onAccionChat = async (a) => {
		if (!a.widget) return;
		setUltimoWidget(a.widget);
		if (a.accion === 'eliminar') { await eliminarWidget(dashboard.id, a.widget); return; }
		if (a.cambios) {
			const cambios = { ...a.cambios };
			if (cambios.y === 999) cambios.y = siguientePosicion(widgets).y;
			await actualizarWidget(dashboard.id, a.widget, cambios);
		}
	};

	return (
		<>
			<PageBreadcrumb title='Dashboard' subName='Analytics' />
			<div className='d-flex flex-wrap align-items-center gap-2 mb-3'>
				{dashboards.length > 1 && (
					<Form.Select className='w-auto' value={dashboard ? dashboard.id : ''} onChange={(e) => obtenerDashboard(Number(e.target.value))}>
						{dashboards.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
					</Form.Select>
				)}
				{dashboard && dashboards.length <= 1 && <h4 className='mb-0 me-2'>{dashboard.nombre}</h4>}
				<div className='ms-auto d-flex flex-wrap gap-2'>
					<Button variant='outline-danger' onClick={() => setChatAbierto(true)}><i className='mdi mdi-robot me-1'></i>Asistente</Button>
					{edicion ? (
						<>
							<Button variant='light' onClick={() => { setEditando(null); setConfigAbierta(true); }}><i className='mdi mdi-plus me-1'></i>Widget</Button>
							<Button variant='light' onClick={onCancelar} disabled={guardando}>Cancelar</Button>
							<Button variant='danger' onClick={onGuardarLayout} disabled={guardando}>{guardando ? <Spinner size='sm' animation='border' /> : 'Guardar'}</Button>
						</>
					) : (
						<Button variant='light' onClick={() => setEdicion(true)} disabled={!dashboard}><i className='mdi mdi-pencil me-1'></i>Editar</Button>
					)}
				</div>
			</div>
			{error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert>}
			{edicion && <Alert variant='warning' className='py-2'>Modo edición: arrastra los widgets desde su título, cambia el tamaño desde la esquina inferior derecha y guarda al terminar.</Alert>}
			{cargando && widgets.length === 0 && (
				<div className='d-flex justify-content-center py-5'><Spinner animation='border' variant='danger' /></div>
			)}
			{!cargando && dashboard && widgets.length === 0 && (
				<div className='text-center text-muted py-5'>
					<p>Este dashboard no tiene widgets.</p>
					<Button variant='danger' onClick={() => { setEdicion(true); setEditando(null); setConfigAbierta(true); }}>Agregar el primero</Button>
				</div>
			)}
			<div ref={contenedor}>
			{widgets.length > 0 && ancho > 0 && (
				<Responsive
					width={ancho}
					className={`layout ${edicion ? 'en-edicion' : ''}`}
					layouts={layouts}
					breakpoints={BREAKPOINTS}
					cols={COLS}
					rowHeight={80}
					margin={[12, 12]}
					isDraggable={edicion}
					isResizable={edicion}
					draggableHandle='.drag-handle'
					onLayoutChange={onLayoutChange}
					onBreakpointChange={setBp}
					compactType='vertical'
				>
					{widgets.map(w => (
						<div key={String(w.id)}>
							<Widget widget={w} edicion={edicion} onEditar={onEditarWidget} onDuplicar={onDuplicar} onEliminar={onEliminar} datosWidget={datosWidget} />
						</div>
					))}
				</Responsive>
			)}
			</div>
			<ConfigWidget visible={configAbierta} onHide={() => { setConfigAbierta(false); setEditando(null); }} semantica={semantica} valor={editando} onGuardar={onGuardarConfig} datosWidget={datosWidget} />
			<ChatDrawer show={chatAbierto} onHide={() => setChatAbierto(false)} dashboardId={dashboard ? dashboard.id : null} enviarChat={enviarChat} onAgregarPropuesta={onAgregarPropuesta} onAccion={onAccionChat} ultimoWidget={ultimoWidget} />
		</>
	);
};
