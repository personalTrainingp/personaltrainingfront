import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
	Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement,
	ArcElement, Tooltip, Legend, Title,
} from 'chart.js';
import { agrupar, formatear } from './logica';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Title);

const COLORES = ['#e11d2a', '#1f2937', '#f59e0b', '#0ea5e9', '#10b981', '#8b5cf6', '#ec4899', '#84cc16'];

export const GraficoCruce = ({ datos, dimFila, dimColumna, medida, operacion, vista }) => {
	if (!datos.length) return <p className="text-muted">Sin datos para mostrar.</p>;

	const esTorta = vista === 'torta';
	const { listaFilas, listaColumnas, celdas, totalesFila } = agrupar(
		datos, dimFila, esTorta ? null : dimColumna, medida, operacion
	);

	const data = {
		labels: listaFilas,
		datasets: esTorta
			? [{ data: totalesFila, backgroundColor: listaFilas.map((_, i) => COLORES[i % COLORES.length]) }]
			: listaColumnas.map((c, j) => ({
				label: c,
				data: celdas.map(fila => fila[j]),
				backgroundColor: COLORES[j % COLORES.length],
				borderColor: COLORES[j % COLORES.length],
				borderWidth: vista === 'lineas' ? 2 : 0,
				fill: false,
				tension: 0.3,
			})),
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: esTorta ? {} : { x: { type: 'category' }, y: { type: 'linear', beginAtZero: true } },
		plugins: {
			title: { display: true, text: `${medida} por ${dimFila}${!esTorta && dimColumna ? ' y ' + dimColumna : ''}` },
			legend: { display: esTorta || listaColumnas.length > 1, position: 'bottom', labels: { boxWidth: 12 } },
			tooltip: { callbacks: { label: (c) => `${c.dataset.label || ''} ${formatear(c.parsed.y ?? c.parsed)}` } },
		},
	};

	const Componente = vista === 'lineas' ? Line : esTorta ? Pie : Bar;

	return (
		<div style={{ height: '460px' }}>
			<Componente
				key={`${vista}-${dimFila}-${dimColumna}-${datos.length}`}
				data={data}
				options={options}
			/>
		</div>
	);
};
