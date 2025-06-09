import React, { useEffect } from 'react';
import { Card, CardTitle, Col, Row } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { CardEstimado } from '@/components/CardTab/CardEstimado';
import { MoneyFormatter } from '@/components/CurrencyMask';
import { useVentasStore } from '@/hooks/hookApi/useVentasStore';

export const ResumenReporteGeneral = ({ data, IngresosSeparados_x_Fecha }) => {
//   console.log(data);
  
	const apexOpts = {
		chart: {
			id: 'area-datetime',
			type: 'area',
			height: 350,
			zoom: {
				autoScaleYaxis: true,
			},
		},
		// annotations: {
		//   yaxis: [{
		//     y: 30,
		//     borderColor: '#999',
		//     label: {
		//       show: true,
		//       text: 'Support',
		//       style: {
		//         color: "#fff",
		//         background: '#00E396',
		//       },
		//     },
		//   }],
		//   xaxis: [{
		//     x: new Date('14 Nov 2012').getTime(),
		//     borderColor: '#999',
		//     yAxisIndex: 0,
		//     label: {
		//       show: true,
		//       text: 'Rally',
		//       style: {
		//         color: "#fff",
		//         background: '#775DD0',
		//       },
		//     },
		//   }],
		// },
		dataLabels: {
			enabled: false,
		},
		markers: {
			size: 0,
			style: 'hollow',
		},
		xaxis: {
			type: 'datetime',
			min: new Date('01 Mar 2012').getTime(),
			tickAmount: 6,
		},
		tooltip: {
			x: {
				format: 'dd MMM yyyy',
			},
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.2,
				opacityTo: 0.6,
				stops: [0, 100],
				colorStops: [
					{
						offset: 0,
						color: '#00FF00',
						opacity: 0.1,
					},
					{
						offset: 100,
						color: '#00FF00',
						opacity: 0.4,
					},
				],
			},
		},
		stroke: {
			curve: 'smooth',
			width: 3, // Ajuste del grosor de la línea
			colors: ['#48EB3D'], // Verde oscuro
		},
	};

	const series = [
		{
			name: 'Variable',
			data: [
				[1327359600000, 30.95],
				[1327446000000, 31.34],
				[1327532400000, 31.18],
				[1327618800000, 31.05],
				[1327878000000, 31.0],
				[1327964400000, 30.95],
				[1328050800000, 31.24],
				[1328137200000, 31.29],
				[1328223600000, 31.85],
				[1328482800000, 31.86],
				[1328569200000, 32.28],
				[1328655600000, 32.1],
				[1328742000000, 32.65],
				[1328828400000, 32.21],
				[1329087600000, 32.35],
				[1329174000000, 32.44],
				[1329260400000, 32.46],
				[1329346800000, 32.86],
				[1329433200000, 32.75],
				[1329778800000, 32.54],
				[1329865200000, 32.33],
				[1329951600000, 32.97],
				[1330038000000, 33.41],
				[1330297200000, 33.27],
				[1330383600000, 33.27],
				[1330470000000, 32.89],
				[1330556400000, 33.1],
				[1330642800000, 33.73],
			],
		},
	];

	
	
	return (
		<Card>
			<Card.Body>
				<h4>Resumen general</h4>
				<div className="mt-3 chartjs-chart">
					<Row>
						<Col lg={12}>
						<Row>
							<Col xxl={3}>
								<CardEstimado icono={'mdi mdi-arrow-up-bold-outline'} items={[{label: 'membresias', monto: IngresosSeparados_x_Fecha.programas}, {label: 'accesorios', monto: IngresosSeparados_x_Fecha.accesorios}, {label: 'suplementos', monto: IngresosSeparados_x_Fecha.suplementos}, {label: 'fitology', monto: IngresosSeparados_x_Fecha.fitology},{label: 'nutricion', monto: IngresosSeparados_x_Fecha.nutricion},]} backgroundColor={'bg-success'} title={'INGRESOS'} montoSoles={<MoneyFormatter amount={104029.3}/>}/>
							</Col>
							<Col xxl={3}>
								<CardEstimado icono={'mdi mdi-arrow-down-bold-outline'} items={[{label: 'TARATA', monto: data.gastosTarata}, {label: 'REDUCTO', monto: data.gastosReducto}]} backgroundColor={'bg-danger'} title={'EGRESOS'} montoSoles={<MoneyFormatter amount={45389.15}/>}/>
							</Col>
							<Col xxl={3}>
								<CardEstimado icono={'mdi mdi-arrow-up-bold-outline'} backgroundColor={'bg-secondary'} title={'APORTES'} montoSoles={<MoneyFormatter amount={(0)}/>}/>
							</Col>
							<Col xxl={3}>
								<CardEstimado icono={'mdi mdi-chart-line'} backgroundColor={'bg-info'} title={'UTILIDAD'} montoSoles={<MoneyFormatter amount={104029.3-45389.15}/>}/>
							</Col>
						</Row>
						</Col>
					</Row>
				</div>
			</Card.Body>
		</Card>
	);
};
