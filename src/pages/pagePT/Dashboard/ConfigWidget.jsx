import React, { useEffect, useMemo, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { TIPOS } from './layout';
import { ETIQUETAS_PERIODO } from './formato';

const FILTROS_TEXTO = [
	{ clave: 'vendedor', etiqueta: 'Vendedor', hechos: ['ventas', 'cobrado'] },
	{ clave: 'producto', etiqueta: 'Producto', hechos: ['ventas'] },
	{ clave: 'categoria_producto', etiqueta: 'Categoría de producto', hechos: ['ventas'] },
	{ clave: 'programa', etiqueta: 'Programa', hechos: ['ventas'] },
	{ clave: 'plataforma', etiqueta: 'Plataforma', hechos: ['ventas', 'cobrado'] },
	{ clave: 'forma_pago', etiqueta: 'Forma de pago', hechos: ['cobrado'] },
	{ clave: 'categoria_gasto', etiqueta: 'Categoría de gasto', hechos: ['gastos'] },
	{ clave: 'concepto_gasto', etiqueta: 'Concepto de gasto', hechos: ['gastos'] },
];

const vacio = () => ({ tipo: 'kpi', titulo: '', config: { metrica: 'ventas', dimension: null, serie: null, periodo: 'este_mes', filtros: {}, orden: null, top: null, comparar: true } });

export const ConfigWidget = ({ visible, onHide, semantica, valor, onGuardar, datosWidget }) => {
	const [form, setForm] = useState(vacio());
	const [rango, setRango] = useState({ desde: '', hasta: '' });
	const [previa, setPrevia] = useState(null);
	const [probando, setProbando] = useState(false);
	const [guardando, setGuardando] = useState(false);

	useEffect(() => {
		if (!visible) return;
		const base = valor ? { tipo: valor.tipo, titulo: valor.titulo, config: { ...vacio().config, ...valor.config } } : vacio();
		setForm(base);
		const m = String(base.config.periodo || '').match(/^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/);
		setRango(m ? { desde: m[1], hasta: m[2] } : { desde: '', hasta: '' });
		setPrevia(null);
	}, [visible, valor]);

	const metrica = useMemo(() => (semantica?.metricas || []).find(m => m.clave === form.config.metrica), [semantica, form.config.metrica]);
	const hecho = metrica ? metrica.hecho : 'ventas';
	const dimensiones = useMemo(() => (semantica?.dimensiones || []).filter(d => hecho !== 'propia' && d.hechos.includes(hecho)), [semantica, hecho]);
	const filtrosTexto = FILTROS_TEXTO.filter(f => f.hechos.includes(hecho));
	const esRango = form.config.periodo === 'rango' || /\.\./.test(form.config.periodo || '');

	const setConfig = (campos) => setForm(prev => ({ ...prev, config: { ...prev.config, ...campos } }));
	const setFiltro = (clave, v) => setConfig({ filtros: { ...form.config.filtros, [clave]: v || undefined } });

	const configFinal = () => {
		const c = { ...form.config };
		if (esRango) c.periodo = rango.desde && rango.hasta ? `${rango.desde}..${rango.hasta}` : 'este_mes';
		if (form.tipo === 'kpi') { c.dimension = null; c.serie = null; c.top = null; c.orden = null; } else { c.comparar = false; }
		if (!c.dimension) { c.serie = null; c.top = null; c.orden = null; }
		if (hecho === 'propia') { c.dimension = null; c.serie = null; c.filtros = {}; }
		Object.keys(c.filtros || {}).forEach(k => { if (c.filtros[k] == null || c.filtros[k] === '') delete c.filtros[k]; });
		return c;
	};

	const onProbar = async () => {
		setProbando(true);
		const data = await datosWidget(configFinal(), form.titulo || (metrica && metrica.nombre));
		setPrevia(data);
		setProbando(false);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setGuardando(true);
		await onGuardar({ tipo: form.tipo, titulo: form.titulo || (metrica ? metrica.nombre : 'Widget'), config: configFinal() });
		setGuardando(false);
	};

	return (
		<Dialog header={valor ? 'Editar widget' : 'Nuevo widget'} visible={visible} onHide={onHide} style={{ width: '48vw' }} breakpoints={{ '992px': '75vw', '768px': '95vw' }} draggable={false}>
			<Form onSubmit={onSubmit}>
				<Row className='g-2'>
					<Col xs={12} md={8}>
						<Form.Label>Título</Form.Label>
						<Form.Control value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder={metrica ? metrica.nombre : ''} />
					</Col>
					<Col xs={12} md={4}>
						<Form.Label>Tipo</Form.Label>
						<Form.Select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
							{TIPOS.map(t => <option key={t.id} value={t.id}>{t.etiqueta}</option>)}
						</Form.Select>
					</Col>
					<Col xs={12} md={6}>
						<Form.Label>Métrica</Form.Label>
						<Form.Select value={form.config.metrica} onChange={(e) => setConfig({ metrica: e.target.value, dimension: null, serie: null, filtros: {} })}>
							{(semantica?.metricas || []).map(m => <option key={m.clave} value={m.clave} title={m.descripcion}>{m.nombre}</option>)}
						</Form.Select>
						{metrica && <Form.Text className='text-muted'>{metrica.descripcion}</Form.Text>}
					</Col>
					<Col xs={12} md={6}>
						<Form.Label>Periodo</Form.Label>
						<Form.Select value={esRango ? 'rango' : form.config.periodo} onChange={(e) => setConfig({ periodo: e.target.value })}>
							{(semantica?.periodos || Object.keys(ETIQUETAS_PERIODO)).map(p => <option key={p} value={p}>{ETIQUETAS_PERIODO[p] || p}</option>)}
							<option value='rango'>Rango de fechas…</option>
						</Form.Select>
					</Col>
					{esRango && (
						<>
							<Col xs={6}><Form.Control type='date' value={rango.desde} onChange={(e) => setRango({ ...rango, desde: e.target.value })} /></Col>
							<Col xs={6}><Form.Control type='date' value={rango.hasta} onChange={(e) => setRango({ ...rango, hasta: e.target.value })} /></Col>
						</>
					)}
					{form.tipo !== 'kpi' && hecho !== 'propia' && (
						<>
							<Col xs={12} md={6}>
								<Form.Label>Desglosar por</Form.Label>
								<Form.Select value={form.config.dimension || ''} onChange={(e) => setConfig({ dimension: e.target.value || null, serie: null })}>
									<option value=''>Total (sin desglose)</option>
									{dimensiones.map(d => <option key={d.clave} value={d.clave}>{d.nombre}</option>)}
								</Form.Select>
							</Col>
							<Col xs={12} md={6}>
								<Form.Label>Comparar series por</Form.Label>
								<Form.Select value={form.config.serie || ''} disabled={!form.config.dimension} onChange={(e) => setConfig({ serie: e.target.value || null })}>
									<option value=''>Ninguna</option>
									{dimensiones.filter(d => d.clave !== form.config.dimension && !d.tiempo).map(d => <option key={d.clave} value={d.clave}>{d.nombre}</option>)}
								</Form.Select>
							</Col>
							<Col xs={6} md={3}>
								<Form.Label>Orden</Form.Label>
								<Form.Select value={form.config.orden || ''} disabled={!form.config.dimension || !!form.config.serie} onChange={(e) => setConfig({ orden: e.target.value || null })}>
									<option value=''>Automático</option>
									<option value='desc'>Mayor a menor</option>
									<option value='asc'>Menor a mayor</option>
								</Form.Select>
							</Col>
							<Col xs={6} md={3}>
								<Form.Label>Top</Form.Label>
								<Form.Control type='number' min={1} max={100} value={form.config.top || ''} disabled={!form.config.dimension || !!form.config.serie} onChange={(e) => setConfig({ top: e.target.value ? Number(e.target.value) : null })} />
							</Col>
						</>
					)}
					{form.tipo === 'kpi' && hecho !== 'propia' && (
						<Col xs={12}>
							<Form.Check type='switch' id='cfg-comparar' label='Comparar con el periodo anterior' checked={!!form.config.comparar} onChange={(e) => setConfig({ comparar: e.target.checked })} />
						</Col>
					)}
					{hecho !== 'propia' && (
						<Col xs={12} md={6}>
							<Form.Label>Empresa / sede</Form.Label>
							<Form.Select value={form.config.filtros.empresa || ''} onChange={(e) => setFiltro('empresa', e.target.value)}>
								<option value=''>Todas</option>
								{(semantica?.empresas || ['CHANGE', 'CIRCUS']).map(e => <option key={e} value={e}>{e}</option>)}
							</Form.Select>
						</Col>
					)}
					{filtrosTexto.map(f => (
						<Col xs={12} md={6} key={f.clave}>
							<Form.Label>{f.etiqueta}</Form.Label>
							<Form.Control value={form.config.filtros[f.clave] || ''} placeholder='contiene…' onChange={(e) => setFiltro(f.clave, e.target.value)} />
						</Col>
					))}
				</Row>
				{previa && (
					<div className='alert alert-light border mt-3 mb-0'>
						{previa.error ? <span className='text-danger'>{previa.error}</span> : previa.texto}
					</div>
				)}
				<div className='d-flex flex-wrap justify-content-end gap-2 mt-3'>
					<Button variant='light' onClick={onProbar} disabled={probando}>{probando ? <Spinner size='sm' animation='border' /> : 'Vista previa'}</Button>
					<Button variant='light' onClick={onHide}>Cancelar</Button>
					<Button type='submit' variant='danger' disabled={guardando}>{guardando ? <Spinner size='sm' animation='border' /> : 'Guardar'}</Button>
				</div>
			</Form>
		</Dialog>
	);
};
