import React from 'react';
import Chart from 'react-apexcharts';
import { formatear, formatearCorto } from './formato';

const COLORES = ['#CD1014', '#1f2937', '#EEBE00', '#17a700', '#0ea5e9', '#8b5cf6', '#ec4899', '#84cc16'];
const TIPO_APEX = { lineas: 'line', area: 'area', barras: 'bar', dona: 'donut' };

export const WidgetGrafico = ({ tipo, respuesta, alto }) => {
	const v = respuesta.visualizacion;
	const unidad = respuesta.unidad || 'soles';
	const tipoApex = TIPO_APEX[tipo] || 'bar';
	const esDona = tipoApex === 'donut';
	const etiquetas = v.etiquetas.map(e => String(e));
	const series = esDona
		? (v.series[0] ? v.series[0].valores.map(n => Number(n) || 0) : [])
		: v.series.map(s => ({ name: s.nombre, data: s.valores.map(n => Number(n) || 0) }));
	const options = {
		chart: { toolbar: { show: false }, animations: { enabled: false }, fontFamily: 'inherit' },
		colors: COLORES,
		dataLabels: { enabled: esDona, formatter: (val) => `${Math.round(val)}%` },
		legend: { position: 'bottom', show: esDona || v.series.length > 1 },
		tooltip: { y: { formatter: (val) => formatear(val, unidad) } },
		grid: { strokeDashArray: 4 },
	};
	if (esDona) {
		options.labels = etiquetas;
	} else {
		options.xaxis = { categories: etiquetas, labels: { rotate: -45, hideOverlappingLabels: true, trim: true } };
		options.yaxis = { labels: { formatter: (val) => formatearCorto(val, unidad) } };
		options.stroke = { curve: 'smooth', width: tipoApex === 'line' ? 3 : 1 };
		options.plotOptions = { bar: { borderRadius: 3, columnWidth: '60%' } };
		if (tipoApex === 'area') options.fill = { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } };
	}
	return <Chart options={options} series={series} type={tipoApex} height={alto || '100%'} width='100%' />;
};
