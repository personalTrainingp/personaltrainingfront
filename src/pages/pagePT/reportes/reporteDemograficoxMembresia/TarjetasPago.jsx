import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import Chart from 'react-apexcharts';
import sinAvatar from '@/assets/images/sinPhoto.jpg'
import config from '@/config';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';

export const TarjetasPago = ({ tasks, title, dataSumaTotal }) => {
    const pagos = tasks.map(producto => ({
        nombre_producto: producto.empl,
        total_ventas: producto.monto,
        avatar: producto.avatar
    })).sort((a, b) => b.total_ventas - a.total_ventas) || []
    // console.log(task.avatar);
    console.log(pagos);
    const series = [
        {
            name: 'TOTAL:',
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
            offsetX: 10,
            style: {
              fontSize: '16px', // Cambia este valor para hacer los números más grandes
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
              fontSize: '15px', // Cambia este valor para hacer los números más grandes
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
                  <Col lg={12}>
                  
						      <Table
                        // style={{tableLayout: 'fixed'}}
                        className="table-centered mb-0 fs-4"
                        hover
                        responsive
                    	>
                        <thead className="bg-primary">
                            <tr>
                                <th className='text-white p-1 fs-3 '>ID</th>
                                <th className='text-white p-1 fs-3 '>NOMBRE DEL SOCIO</th>
                                <th className='text-white p-1 fs-3'>FECHA  CUMPLEAÑOS</th>
                                <th className='text-white p-1 fs-3 '>%</th>
                            </tr>
                        </thead>
						<tbody>
              <tr>
                <td style={{width: '25px'}}>{1}</td>  
              </tr>
                        </tbody>
					</Table>
                  </Col>
                </Row>
			</Card.Body>
		</Card>
  )
}
