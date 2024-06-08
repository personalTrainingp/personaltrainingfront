import { Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';

import { CardTitle } from '@/components';

const ProjectStatistics = () => {
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
				text: '$ (thousands)',
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
					return val;
				},
			},
		},
	};

	// chart data
	const series = [
		{
			name: 'Mejor año: 2021',
			data: [20, 76, 85, 101, 98, 87, 105, 91, 114, 94, 100, 20],
		},
		{
			name: 'Año 2024',
			data: [10, 44, 55, 57, 56, 61, 58, 63, 60, 66, 21, 30],
		},
	];

	return (
		<Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between"
					title="Project Statistics"
				/>
				<div style={{ height: '327px' }} className="mt-3 chartjs-chart">
					<Chart
						options={apexOpts}
						series={series}
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
