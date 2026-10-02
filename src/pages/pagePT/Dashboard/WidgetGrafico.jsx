import React from 'react';
import Chart from 'react-apexcharts';
import { formatear, formatearCorto } from './formato';

const COLORES = ['#CD1014', '#1f2937', '#EEBE00', '#17a700', '#0ea5e9', '#8b5cf6', '#ec4899', '#84cc16'];
const TIPO_APEX = { lineas: 'line', area: 'area', barras: 'bar', dona: 'donut' };

export const WidgetGrafico = ({ tipo, respuesta, alto }) => {
	const v = respuesta.visualizacion;
	const unidad = respuesta.unidad || 'soles';
	const negativos = v.series.some(s => s.valores.some(n => Number(n) < 0));
	const tipoApex = (TIPO_APEX[tipo] === 'donut' && (v.series.length > 1 || negativos)) || ((tipo === 'lineas' || tipo === 'area') && v.etiquetas.length === 1) ? 'bar' : (TIPO_APEX[tipo] || 'bar');
	const esDona = tipoApex === 'donut';
	const horizontal = tipoApex === 'bar' && !!v.horizontal;
	const orden = v.etiquetas.map((e, i) => i);
	if ((tipoApex === 'line' || tipoApex === 'area') && v.etiquetas.every(e => /^\d{4}(-\d{2}){0,2}( \(en curso\))?$/.test(String(e)))) orden.sort((a, b) => String(v.etiquetas[a]).localeCompare(String(v.etiquetas[b])));
	const etiquetas = orden.map(i => String(v.etiquetas[i]));
	const series = esDona
		? (v.series[0] ? v.series[0].valores.map(n => Number(n) || 0) : [])
		: v.series.map(s => ({ name: s.nombre, data: orden.map(i => (s.valores[i] == null ? null : Number(s.valores[i]) || 0)) }));
	const options = {
		chart: { toolbar: { show: false }, animations: { enabled: false }, fontFamily: 'inherit' },
		colors: COLORES,
		dataLabels: { enabled: esDona, formatter: (val) => `${Math.round(val)}%` },
		legend: { position: 'bottom', show: esDona || v.series.length > 1 },
		tooltip: { y: { formatter: (val) => (val == null ? val : formatear(val, unidad)) } },
		grid: { strokeDashArray: 4 },
	};
	if (esDona) {
		options.labels = etiquetas;
	} else {
		const categorias = horizontal ? etiquetas : etiquetas.map(e => (e.endsWith(' (en curso)') ? [e.slice(0, -11), '(en curso)'] : e));
		options.xaxis = { categories: categorias, labels: horizontal ? { formatter: (val) => formatearCorto(val, unidad) } : { rotate: -45, hideOverlappingLabels: true, trim: true } };
		options.yaxis = horizontal ? { labels: { maxWidth: 200 } } : { labels: { formatter: (val) => formatearCorto(val, unidad) } };
		if (tipoApex === 'line' || tipoApex === 'area') {
			options.yaxis.min = (min) => Math.min(0, min);
			options.markers = { size: 4 };
			options.grid.padding = { right: 40 };
		}
		options.stroke = { curve: 'smooth', width: tipoApex === 'line' ? 3 : 1 };
		options.plotOptions = { bar: { horizontal, borderRadius: 3, columnWidth: '60%' } };
		if (tipoApex === 'area') options.fill = { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } };
	}
	return <Chart options={options} series={series} type={tipoApex} height={alto || '100%'} width='100%' />;
};
