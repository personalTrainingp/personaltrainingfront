import React, { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { ButtonGroup, Button } from 'react-bootstrap';
import { ModalDetalleDia } from './ModalDetalleDia';

// Paleta categórica validada (claro / oscuro). Orden fijo: cada categoría conserva su color
// aunque cambie el rango de fechas (el backend envía los programas ordenados por id).
const PALETA = {
	light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'],
	dark: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'],
};
const TINTA = {
	light: { texto: '#52514e', grilla: '#e7e6e2' },
	dark: { texto: '#c3c2b7', grilla: '#3a3a37' },
};
const SERIE_TOTAL = { light: '#0b0b0b', dark: '#ffffff' };

// Tema actual de la app (data-bs-theme en <html>), actualizado si el usuario lo cambia
const useTema = () => {
	const leer = () => (document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light');
	const [tema, settema] = useState(leer);
	useEffect(() => {
		const observador = new MutationObserver(() => settema(leer()));
		observador.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });
		return () => observador.disconnect();
	}, []);
	return tema;
};

const etiquetaDia = (fecha) => {
	const [, mes, dia] = fecha.split('-');
	return `${dia}/${mes}`;
};

// Curva de asistencia diaria: personas distintas que marcaron cada día, total o por programa
export const CurvaAsistencia = ({ serieDiaria = [], categorias = [] }) => {
	const tema = useTema();
	const [vista, setvista] = useState('programa'); // 'programa' | 'total'

	const series = useMemo(() => {
		if (vista === 'total') return [{ name: 'Clientes que asistieron', data: serieDiaria.map((d) => d.personas) }];
		return categorias.map((c) => ({ name: c, data: serieDiaria.map((d) => d.porCategoria[c] || 0) }));
	}, [vista, serieDiaria, categorias]);

	const colores = vista === 'total' ? [SERIE_TOTAL[tema]] : categorias.map((_, i) => PALETA[tema][i % 8]);

	const options = {
		chart: {
			type: 'line',
			toolbar: { show: false },
			zoom: { enabled: false },
			animations: { enabled: false },
			background: 'transparent',
			fontFamily: 'inherit',
		},
		theme: { mode: tema },
		colors: colores,
		stroke: { width: 2, curve: 'straight' },
		markers: { size: 4, strokeWidth: 2, strokeColors: tema === 'dark' ? '#1a1a19' : '#fcfcfb', hover: { size: 6 } },
		dataLabels: { enabled: false },
		grid: { borderColor: TINTA[tema].grilla, strokeDashArray: 0, xaxis: { lines: { show: false } } },
		xaxis: {
			categories: serieDiaria.map((d) => etiquetaDia(d.fecha)),
			labels: { style: { colors: TINTA[tema].texto }, rotate: -45, hideOverlappingLabels: true },
			axisBorder: { color: TINTA[tema].grilla },
			axisTicks: { show: false },
			crosshairs: { show: true },
			tooltip: { enabled: false },
		},
		yaxis: {
			min: 0,
			forceNiceScale: true,
			decimalsInFloat: 0,
			title: { text: 'Clientes', style: { color: TINTA[tema].texto, fontWeight: 400 } },
			labels: { style: { colors: TINTA[tema].texto } },
		},
		legend: {
			show: series.length > 1,
			position: 'top',
			horizontalAlign: 'left',
			labels: { colors: TINTA[tema].texto },
			markers: { width: 10, height: 10, radius: 2 },
		},
		tooltip: {
			shared: true,
			intersect: false,
			theme: tema,
			x: {
				formatter: (_, { dataPointIndex }) => {
					const d = serieDiaria[dataPointIndex];
					return d ? `${etiquetaDia(d.fecha)} · ${d.personas} clientes · ${d.marcaciones} marcaciones` : '';
				},
			},
			y: { formatter: (v) => `${v} ${v === 1 ? 'cliente' : 'clientes'}` },
		},
	};

	return (
		<div>
			<div className="d-flex justify-content-end mb-2">
				<ButtonGroup size="sm">
					<Button variant={vista === 'programa' ? 'primary' : 'outline-primary'} onClick={() => setvista('programa')}>
						Por programa
					</Button>
					<Button variant={vista === 'total' ? 'primary' : 'outline-primary'} onClick={() => setvista('total')}>
						Total
					</Button>
				</ButtonGroup>
			</div>
			<Chart key={`${tema}-${vista}`} options={options} series={series} type="line" height={340} />
		</div>
	);
};

// Vista en tabla de la misma curva (accesible y exportable): un día por fila, con su detalle
export const TablaPorDia = ({ serieDiaria = [], categorias = [], detallePorDia = {} }) => {
	const [fechaDetalle, setfechaDetalle] = useState(null);
	return (
		<div className="table-responsive">
			<table className="table table-sm table-hover mb-0">
				<thead>
					<tr>
						<th>Día</th>
						{categorias.map((c) => (
							<th key={c} className="text-end">
								{c}
							</th>
						))}
						<th className="text-end">Clientes</th>
						<th className="text-end">Marcaciones</th>
						<th className="text-center">Detalle</th>
					</tr>
				</thead>
				<tbody>
					{serieDiaria.map((d) => (
						<tr key={d.fecha}>
							<td>{etiquetaDia(d.fecha)}</td>
							{categorias.map((c) => (
								<td key={c} className="text-end">
									{d.porCategoria[c] || 0}
								</td>
							))}
							<td className="text-end fw-semibold">{d.personas}</td>
							<td className="text-end text-muted">{d.marcaciones}</td>
							<td className="text-center">
								<Button
									variant="outline-primary"
									size="sm"
									disabled={d.personas === 0}
									onClick={() => setfechaDetalle(d.fecha)}
								>
									Ver detalle
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<ModalDetalleDia
				fecha={fechaDetalle}
				personas={fechaDetalle ? detallePorDia[fechaDetalle] || [] : []}
				onHide={() => setfechaDetalle(null)}
			/>
		</div>
	);
};
