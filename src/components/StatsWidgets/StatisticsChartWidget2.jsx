import { Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';


/**
 * Renders the chart in widget area
 */
const StatisticsChartWidget2 = ({
	title,
	subtitle,
	type,
	colors,
	name,
	data,
}) => {
	// default options
	const options = {
		chart: {
			sparkline: {
				enabled: true,
			},
		},
		stroke: {
			width: 2,
			curve: 'straight',
		},
		colors: colors || ['#008FFB'],
		title: {
			text: title,
			offsetX: 20,
			offsetY: 20,
			style: {
				fontSize: '24px',
			},
		},
		subtitle: {
			text: subtitle,
			offsetX: 20,
			offsetY: 55,
			style: {
				fontSize: '14px',
			},
		},
	};

	// chart data
	const series = [{ name: name || 'Data', data: data || [] }];

	return (
		<Card>
			<Card.Body className="p-0">
				<Chart
					className="apex-charts"
					options={options}
					series={series}
					type={type || 'bar'}
					height={172}
				/>
			</Card.Body>
		</Card>
	);
};

export default StatisticsChartWidget2;
