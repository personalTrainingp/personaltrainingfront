import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import Chart from 'react-apexcharts';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
function sumarTarifaMonto(detalles) {
	return [
	  detalles.detalle_membresia,
	  detalles.detalle_cita_nut,
	  detalles.detalle_cita_tratest,
	  detalles.detalle_prodAccesorios,
	  detalles.detalle_prodSuplementos
	]
	  .flat() // Aplana los arrays para unirlos en uno solo
	  .reduce((total, item) => total + (item?.tarifa_monto || 0), 0); // Suma los valores de tarifa_monto
  }

  function agruparDistritosPorTarifa(data) {
	// Usamos un objeto auxiliar para agrupar por distrito y ubigeo
	const agrupado = {};
  
	data.forEach(({ nombre_distrito, ubigeo_distrito, tarifa_venta }) => {
	  const clave = `${nombre_distrito}-${ubigeo_distrito}`;
  
	  if (!agrupado[clave]) {
		agrupado[clave] = {
		  nombre_distrito,
		  ubigeo_distrito,
		  suma_tarifa_venta: 0,
		  items: []
		};
	  }
  
	  agrupado[clave].suma_tarifa_venta += tarifa_venta;
	  agrupado[clave].items.push({ nombre_distrito, ubigeo_distrito, tarifa_venta });
	});
  
	// Convertimos el objeto agrupado a un array
	return Object.values(agrupado);
  }
const Tarjetas = ({ tasks, title, dataSumaTotal }) => {
	console.log(tasks);
	
	tasks = tasks.map(t=>{
		return {
			nombre_distrito: t.tb_cliente.tb_distrito.distrito,
			ubigeo_distrito: t.tb_cliente.ubigeo_distrito_cli,
			tarifa_venta: sumarTarifaMonto(t)
		}
	}).sort((a, b) => b.suma_tarifa_venta - a.suma_tarifa_venta) || []
    
    const series = [
        {
            name: 'TOTAL',
          data: agruparDistritosPorTarifa(tasks).map(e=>e.suma_tarifa_venta),
        },
      ];
    const options = {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '90%', // Ajusta este valor para hacer las barras más delgadas
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
          categories: agruparDistritosPorTarifa(tasks).map(e=>e.nombre_distrito),
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
	const sumaTotalVenta = agruparDistritosPorTarifa(tasks).reduce((total, item) => total + item.suma_tarifa_venta, 0);
	const sumaTotalCantidad = agruparDistritosPorTarifa(tasks).reduce((total, item) => total + item.items.length, 0);
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
                		<Chart options={options} series={series} type="bar" />
					</Col>
					<Col lg={6}>
						<Table
                        // style={{tableLayout: 'fixed'}}
                        className="table-centered mb-0 fs-4"
                        hover
                        responsive
						striped
                    	>
                        <thead className="bg-primary">
                            <tr>
                                <th className='text-white p-1 fs-3 '>DISTRITO</th>
                                <th className='text-white p-1 fs-3'><span className='w-100 '>CANTIDAD</span></th>
                                <th className='text-white p-1'><span className='w-100 '><SymbolSoles numero={''} isbottom={false}/></span></th>
                            </tr>
                        </thead>
						<tbody>
						{(agruparDistritosPorTarifa(tasks) || []).map((task, index) => {
							return (
								
								<tr>
								<td className='p-1 fs-3 fw-bold h2'>{task.nombre_distrito}</td>
								<td className='p-1 fs-3 fw-bold h2'>{task.items.length}</td>
								<td className='p-1 fs-3 fw-bold h2'><NumberFormatMoney amount={task.suma_tarifa_venta} symbol={task.total_ventas=='DOLARES'?'$':'S/'}/></td>
							</tr>
							);
						})}
								<td className='p-1 fs-1 text-primary fw-bold'>TOTAL</td>
								<td className='p-1 fs-1 fw-bold'>{sumaTotalCantidad}</td>
								<td className='p-1 fs-1 fw-bold'><NumberFormatMoney amount={sumaTotalVenta}/></td>
                        </tbody>
					</Table>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default Tarjetas;