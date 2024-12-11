import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import Chart from 'react-apexcharts';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';

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
					title={<h2>{title}</h2>}
					menuItems={false}
				/>
				<Row>
					<Col lg={6}>
                		<Chart options={options} series={series} type="bar" height={350} />
					</Col>
					<Col lg={6}>
						<Table
                        // style={{tableLayout: 'fixed'}}
                        className="table-centered mb-0 fs-4"
                        hover
                        responsive
                    	>
                        <thead className="bg-primary">
                            <tr>
                                <th className='text-white p-1 fs-3 '>ID</th>
                                <th className='text-white p-1 fs-3 '>FORMA PAGO</th>
                                <th className='text-white p-1'><span className='w-100 '><SymbolSoles numero={''} isbottom={false}/></span></th>
                                <th className='text-white p-1 fs-3'><span className='w-100 '>%</span></th>
                            </tr>
                        </thead>
						<tbody>
						{(pagos || []).map((task, index) => {
							return (
								
								<tr>
								<td className='fw-bold h2'>{index+1}</td>
								<td className='fw-bold h2'>{task.nombre_producto}</td>
								<td className='fw-bold h2'><NumberFormatMoney amount={task.total_ventas} symbol={task.total_ventas=='DOLARES'?'$':'S/'}/></td>
								<td className='fw-bold h2'>{((task.total_ventas / dataSumaTotal) * 100).toFixed(2)}</td>
							</tr>
							);
						})}
                        </tbody>

					</Table>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default Tarjetas;
