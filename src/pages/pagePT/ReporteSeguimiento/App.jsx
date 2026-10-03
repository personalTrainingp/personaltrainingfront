import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import { useReporteSeguimientoStore } from './useReporteSeguimientoStore';
import { CurvaAsistencia, TablaPorDia } from './CurvaAsistencia';
import { DataTableAsistenciaUnificada, ESTADOS_PERSONA } from './DataTableAsistenciaUnificada';

// Fechas en Perú (YYYY-MM-DD)
const hoyLima = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
const restarDias = (fecha, dias) => {
	const d = new Date(`${fecha}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() - dias);
	return d.toISOString().slice(0, 10);
};

const Indicador = ({ titulo, valor, detalle }) => (
	<Card className="h-100 mb-0">
		<Card.Body className="py-3">
			<div className="text-muted small">{titulo}</div>
			<div className="fs-3 fw-semibold">{valor}</div>
			{detalle && <div className="text-muted small">{detalle}</div>}
		</Card.Body>
	</Card>
);

export const App = () => {
	const { obtenerReporte, dataReporte, isLoading, error } = useReporteSeguimientoStore();
	const [rango, setrango] = useState({ desde: restarDias(hoyLima(), 29), hasta: hoyLima() });
	const [filtroEstado, setfiltroEstado] = useState('');
	const [filtroPrograma, setfiltroPrograma] = useState('');
	const [verTablaDias, setverTablaDias] = useState(false);

	useEffect(() => {
		obtenerReporte(rango.desde, rango.hasta);
	}, []);

	const onChangeFecha = (e) => setrango({ ...rango, [e.target.name]: e.target.value });
	const onBuscar = (e) => {
		e.preventDefault();
		obtenerReporte(rango.desde, rango.hasta);
	};

	const personasFiltradas = useMemo(
		() =>
			(dataReporte?.personas || []).filter(
				(p) =>
					(!filtroEstado || p.estado === filtroEstado) &&
					(!filtroPrograma || (filtroPrograma === '__sin__' ? !p.programa : p.programa === filtroPrograma))
			),
		[dataReporte, filtroEstado, filtroPrograma]
	);
	const programas = (dataReporte?.categorias || []).filter((c) => !['Sin membresía vigente', 'No es cliente'].includes(c));
	const resumen = dataReporte?.resumen;

	return (
		<div>
			<PageBreadcrumb title={'Reporte de asistencia (huellero)'} />

			{/* Filtros en una sola fila, encima de todo */}
			<Form onSubmit={onBuscar} className="mb-3">
				<Row className="align-items-end g-2">
					<Col xs={12} sm={6} md={3}>
						<Form.Label>Fecha inicio</Form.Label>
						<Form.Control type="date" name="desde" value={rango.desde} max={rango.hasta} onChange={onChangeFecha} required />
					</Col>
					<Col xs={12} sm={6} md={3}>
						<Form.Label>Fecha fin</Form.Label>
						<Form.Control type="date" name="hasta" value={rango.hasta} min={rango.desde} onChange={onChangeFecha} required />
					</Col>
					<Col xs={12} md="auto">
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Cargando...' : 'Buscar'}
						</Button>
					</Col>
				</Row>
			</Form>

			{error && <Alert variant="danger">{error}</Alert>}

			{resumen && (
				<Row className="g-2 mb-3">
					<Col xs={6} md>
						<Indicador titulo="Clientes que asistieron" valor={resumen.personasDistintas} />
					</Col>
					<Col xs={6} md>
						<Indicador titulo="Promedio diario" valor={resumen.promedioDiario} detalle="clientes por día" />
					</Col>
					<Col xs={6} md>
						<Indicador titulo="Marcaciones" valor={resumen.marcaciones} />
					</Col>
					<Col xs={6} md>
						<Indicador titulo="Clientes vigentes sin huella" valor={resumen.clientesVigentesSinHuellero} />
					</Col>
					<Col xs={6} md>
						<Indicador titulo="En huellero sin cliente" valor={resumen.huelleroSinCliente} />
					</Col>
				</Row>
			)}

			<Card className="mb-3">
				<Card.Body>
					<h5 className="mt-0 mb-1">Curva de asistencia diaria</h5>
					<p className="text-muted small mb-2">
						Clientes distintos que marcaron cada día (con o sin membresía), según el programa de su membresía vigente ese día.
					</p>
					{dataReporte && (
						<>
							<CurvaAsistencia serieDiaria={dataReporte.serieDiaria} categorias={dataReporte.categorias} />
							<Button variant="link" size="sm" className="px-0" onClick={() => setverTablaDias(!verTablaDias)}>
								{verTablaDias ? 'Ocultar tabla por día' : 'Ver como tabla por día'}
							</Button>
							{verTablaDias && (
								<TablaPorDia
									serieDiaria={dataReporte.serieDiaria}
									categorias={dataReporte.categorias}
									detallePorDia={dataReporte.detallePorDia}
								/>
							)}
						</>
					)}
				</Card.Body>
			</Card>

			<Card>
				<Card.Body>
					<h5 className="mt-0 mb-1">Clientes y personas del huellero</h5>
					<p className="text-muted small mb-2">
						Unidos por DNI (documento del cliente = DNI en el huellero). Incluye los clientes con membresía vigente en el
						rango y todas las personas del huellero.
					</p>
					<Row className="g-2 mb-2">
						<Col xs={12} sm={6} md={3}>
							<Form.Select value={filtroEstado} onChange={(e) => setfiltroEstado(e.target.value)}>
								<option value="">Todos los estados</option>
								{Object.entries(ESTADOS_PERSONA).map(([valor, e]) => (
									<option key={valor} value={valor}>
										{e.label}
									</option>
								))}
							</Form.Select>
						</Col>
						<Col xs={12} sm={6} md={3}>
							<Form.Select value={filtroPrograma} onChange={(e) => setfiltroPrograma(e.target.value)}>
								<option value="">Todos los programas</option>
								{programas.map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
								<option value="__sin__">Sin membresía vigente</option>
							</Form.Select>
						</Col>
						<Col className="d-flex align-items-center">
							<small className="text-muted">{personasFiltradas.length} filas</small>
						</Col>
					</Row>
					<DataTableAsistenciaUnificada list={personasFiltradas} loading={isLoading} />
				</Card.Body>
			</Card>
		</div>
	);
};
