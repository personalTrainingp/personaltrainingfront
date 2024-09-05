import { Card, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { MoneyFormatter } from '@/components/CurrencyMask';
import Chart from 'react-apexcharts';

const Tarjetas = ({ tasks, title, dataSumaTotal }) => {
	const pagos = tasks.map(producto => ({
        nombre_producto: producto.forma_pago,
        total_ventas: producto.monto
    })).sort((a, b) => b.total_ventas - a.total_ventas) || []
    
    const series = [
        {
            name: 'TOTAL',
          data: pagos.map(e=>e.total_ventas),
        },
      ];
    const options = {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '50%', // Ajusta este valor para hacer las barras más delgadas
          },
        },
        colors: ['#D41115'], // Cambia el color de las barras (puedes añadir más colores si hay múltiples series)
        dataLabels: {
            enabled: true,
            style: {
              fontSize: '20px', // Cambia este valor para hacer los números más grandes
            },
			formatter: function (val, opts) {
				return ''
			},
          },
        xaxis: {
          categories: pagos.map(e=>e.nombre_producto),
        },
		yaxis:{
			labels:{
				style: {
				  fontSize: '15px',
				  fontWeight: 'bold',
				},
			}
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
	return (
		<Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title={title}
					menuItems={false}
				/>
                <Chart options={options} series={series} type="bar" height={350} />
				{(pagos || []).map((task, index) => {
					return (
						<div
							className={classNames({ 'mb-3': index < pagos.length - 1 })}
							key={task.nombre_producto}
						>
							<div className="d-flex align-items-center">
								<div className="flex-grow-1 ms-2">
									<h5 className="my-0 fw-semibold">{task.nombre_producto}</h5>
								</div>
								{task.completedTask ? (
									<h5 className="my-0">
										{task.completedTask}
									</h5>
								) : (
                                    <h5 className="my-0"><MoneyFormatter amount={task.total_ventas} symbol={task.total_ventas=='DOLARES'?'$':'S/'}/> - {((task.total_ventas / dataSumaTotal) * 100).toFixed(2)}%</h5>
								)}
							</div>
						</div>
					);
				})}
			</Card.Body>
		</Card>
	);
};

export default Tarjetas;
