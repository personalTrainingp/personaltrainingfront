import { Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';

import { CardTitle } from '@/components';
import { MoneyFormatter } from '@/components/CurrencyMask';

const ProjectStatistics = ({data}) => {
	const apexOpts = {
		chart: {
			height: 327,
			type: 'bar',
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '55%',
			},
		},
		dataLabels: {
			enabled: false,
		},
		colors: ['#ced1ff', '#727cf5'],
		xaxis: {
			categories: ['Ene','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		},
		legend: {
			offsetY: 7,
		},
		yaxis: {
			title: {
				text: 'S/ (VENTAS)',
			},
			
		},
		fill: {
			opacity: 1,
		},
		grid: {
			row: {
				colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
				opacity: 0.2,
			},
			borderColor: '#f1f3fa',
			padding: {
				bottom: 5,
			},
		},
		tooltip: {
			y: {
				formatter: function (val) {
					return formatCurrency(val);
				},
			},
		},
	};
	const formatCurrency = (value) => {
		return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
	};
	// data = data.map(e=>{
	// 	return {
	// 		data: e.data.map(m=>{
	// 			return m;
	// 		}),
	// 		name: e.name
	// 	}
	// })
	console.log();
	
	return (
		<Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between"
					title="Comparativa con el mejor año"
				/>
				<div style={{ height: '327px' }} className="mt-3 chartjs-chart">
					<Chart
						options={apexOpts}
						series={data}
						type="bar"
						height={327}
						className="apex-charts"
					/>
				</div>
			</Card.Body>
		</Card>
	);
};

export default ProjectStatistics;
