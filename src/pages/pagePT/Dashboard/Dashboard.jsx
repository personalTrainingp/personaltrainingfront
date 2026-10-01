import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { confirmDialog } from 'primereact/confirmdialog';
import { PageBreadcrumb } from '@/components';
import { useDashboardStore } from '@/hooks/hookApi/useDashboardStore';
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
	const [version, setVersion] = useState(0);

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
	const editable = ancho > BREAKPOINTS.md;

	const onLayoutChange = (layout) => {
		if (!edicion || !editable) return;
		setPendiente(deLayout(layout));
	};

	const onGuardarLayout = async () => {
		setGuardando(true);
		const ok = !pendiente || await guardarLayout(dashboard.id, pendiente);
		setGuardando(false);
		if (!ok) return;
		setPendiente(null);
		setEdicion(false);
	};

	const onCancelar = async () => {
		setPendiente(null);
		setEdicion(false);
		await obtenerDashboard(dashboard.id);
		setVersion(v => v + 1);
	};

	const onEditarWidget = (w) => { setEditando(w); setConfigAbierta(true); setUltimoWidget(w.id); };

	const asentarLayout = async () => {
		if (!edicion || !pendiente) return widgets;
		if (!(await guardarLayout(dashboard.id, pendiente))) return null;
		setPendiente(null);
		return pendiente;
	};

	const onDuplicar = async (w) => {
		const base = await asentarLayout();
		if (!base) return;
		await crearWidget(dashboard.id, { tipo: w.tipo, titulo: `${w.titulo} (copia)`, ...siguientePosicion(base), w: w.w, h: w.h, config: w.config });
	};

	const onEliminar = (w) => {
		confirmDialog({
			message: `¿Eliminar el widget "${w.titulo}"?`,
			header: 'Confirmar',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Eliminar',
			rejectLabel: 'Cancelar',
			acceptClassName: 'p-button-danger',
			accept: async () => { if (await asentarLayout()) await eliminarWidget(dashboard.id, w.id); },
		});
	};

	const onGuardarConfig = async (valor) => {
		let ok;
		if (editando) {
			ok = await actualizarWidget(dashboard.id, editando.id, valor);
		} else {
			const base = await asentarLayout();
			ok = base && await crearWidget(dashboard.id, { ...valor, ...siguientePosicion(base), ...tamanoPorTipo(valor.tipo) });
		}
		if (!ok) return;
		setConfigAbierta(false);
		setEditando(null);
	};

	const onAgregarPropuesta = async (p) => {
		const base = await asentarLayout();
		if (!base) return false;
		const creado = await crearWidget(dashboard.id, { tipo: p.tipo, titulo: p.titulo, ...siguientePosicion(base), w: p.w, h: p.h, config: p.config });
		if (creado) setUltimoWidget(creado.id);
		return !!creado;
	};

	const onAgregarPropuestas = async (lista) => {
		const base = await asentarLayout();
		if (!base) return 0;
		let posicion = siguientePosicion(base);
		let creados = 0;
		for (const p of lista) {
			const creado = await crearWidget(dashboard.id, { tipo: p.tipo, titulo: p.titulo, x: posicion.x, y: posicion.y, w: p.w, h: p.h, config: p.config });
			if (!creado) break;
			setUltimoWidget(creado.id);
			creados += 1;
			posicion = { x: 0, y: posicion.y + p.h };
		}
		return creados;
	};

	const onAccionChat = async (a) => {
		if (!a.widget) return false;
		setUltimoWidget(a.widget);
		const base = await asentarLayout();
		if (!base) return false;
		if (a.accion === 'eliminar') return eliminarWidget(dashboard.id, a.widget);
		if (a.cambios) {
			const cambios = { ...a.cambios };
			if (cambios.y === 999) cambios.y = siguientePosicion(base).y;
			return actualizarWidget(dashboard.id, a.widget, cambios);
		}
		return true;
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
					) : editable && (
						<Button variant='light' onClick={() => setEdicion(true)} disabled={!dashboard}><i className='mdi mdi-pencil me-1'></i>Editar</Button>
					)}
				</div>
			</div>
			{error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert>}
			{edicion && <Alert variant='warning' className='py-2'>Modo edición: arrastre los widgets desde su título, cambie el tamaño desde la esquina inferior derecha y guarde al terminar.</Alert>}
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
					key={version}
					width={ancho}
					className={`layout ${edicion ? 'en-edicion' : ''}`}
					layouts={layouts}
					breakpoints={BREAKPOINTS}
					cols={COLS}
					rowHeight={80}
					margin={[12, 12]}
					isDraggable={edicion && editable}
					isResizable={edicion && editable}
					draggableHandle='.drag-handle'
					onLayoutChange={onLayoutChange}
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
			<ChatDrawer show={chatAbierto} onHide={() => setChatAbierto(false)} dashboardId={dashboard ? dashboard.id : null} enviarChat={enviarChat} onAgregarPropuesta={onAgregarPropuesta} onAgregarPropuestas={onAgregarPropuestas} onAccion={onAccionChat} ultimoWidget={ultimoWidget} />
		</>
	);
};
