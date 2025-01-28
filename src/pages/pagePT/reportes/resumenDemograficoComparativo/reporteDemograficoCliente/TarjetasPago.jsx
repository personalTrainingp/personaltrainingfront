import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import Chart from 'react-apexcharts';
import sinAvatar from '@/assets/images/sinPhoto.jpg'
import config from '@/config';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
function calcularEdad(fechaNacimiento, fechaVenta) {
  const hoy = new Date(fechaVenta);
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  // Ajustar si el cumpleaños no ha ocurrido aún este año
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
  }
  return edad;
}

function sumarTarifaMonto(detalles) {
	return [
	  detalles.detalle_membresia&&detalles.detalle_membresia,
	  detalles.detalle_cita_nut&&detalles.detalle_cita_nut,
	  detalles.detalle_cita_tratest&&detalles.detalle_cita_tratest,
	  detalles.detalle_prodAccesorios&&detalles.detalle_prodAccesorios,
	  detalles.detalle_prodSuplementos&&detalles.detalle_prodSuplementos
	]
	  .flat() // Aplana los arrays para unirlos en uno solo
	  .reduce((total, item) => total + (item?.tarifa_monto || 0), 0); // Suma los valores de tarifa_monto
  }

  const agruparPorRangoEdad = (data) => {
    const rangos = [
      { rango_edad: "38 a 42", min: 38, max: 42 },
      { rango_edad: "43 a 47", min: 43, max: 47 },
      { rango_edad: "28 a 32", min: 28, max: 32 },
      { rango_edad: "48 a 52", min: 48, max: 52 },
      { rango_edad: "33 a 37", min: 33, max: 37 },
      { rango_edad: "53 a 57", min: 53, max: 57 },
      { rango_edad: "22 a 27", min: 22, max: 27 },
      { rango_edad: "16 a 21", min: 16, max: 21 },
      { rango_edad: "10 a 15", min: 10, max: 15 },
      { rango_edad: "88 a mas", min: 88, max: Infinity },
    ];
  
    const resultado = rangos.map((rango) => {
      const items = data.filter(
        (item) => item.edad >= rango.min && item.edad <= rango.max
      );
      const suma_tarifa_total = items.reduce((acc, curr) => acc + curr.suma_tarifa, 0);
  
      return {
        rango_edad: rango.rango_edad,
        suma_tarifa_total,
        items,
      };
    });
  
    return resultado;
  };
export const TarjetasPago = ({ tasks, title, dataSumaTotal }) => {
    const pagos = tasks.map(t => ({
        fec_nacimiento: t.tb_cliente.fecha_nacimiento,
        edad: calcularEdad(t.tb_cliente.fecha_nacimiento, t.fecha_venta),
        tb_cliente: t.tb_cliente,
        suma_tarifa: sumarTarifaMonto(t)
    }))
    // console.log(task.avatar);
    console.log(agruparPorRangoEdad(pagos));
    const series = [
        {
            name: 'TOTAL:',
          data: agruparPorRangoEdad(pagos).map(e=>e.items.length),
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
            offsetX: 10,
            style: {
              fontSize: '16px', // Cambia este valor para hacer los números más grandes
            },
			formatter: function (val, opts) {
				return ''
			},
          },
        xaxis: {
          categories: agruparPorRangoEdad(pagos).map(e=>e.rango_edad),
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
  const totalSumaTarifa = agruparPorRangoEdad(pagos).reduce((acc, curr) => acc + curr.suma_tarifa_total, 0);

  return (
    <Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title={<h2>{title}</h2>}
					menuItems={false}
				/>
                <Row>
                  <Col lg={5}>
                            <Chart options={options} series={series} type="bar" />
                  </Col>
                  <Col lg={1}>
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
                                {/* <th className='text-white p-1 fs-3 '>ID</th> */}
                                <th className='text-white p-1 fs-3 text-center'><span style={{margin: '20px'}}>EDAD</span></th>
                                <th className='text-white text-center p-1 fs-3 ml-1'><span className='ml-5' style={{marginRight: '0'}}>SOCIOS</span></th>
                                <th className='text-white p-1 fs-3 text-center'><SymbolSoles isbottom={false}/></th>
                                <th className='text-white p-1 fs-3 text-center'>%</th>
                                <th className='text-white p-1 fs-3 text-center'>TICKET MEDIO</th>
                            </tr>
                        </thead>
						<tbody>
                {agruparPorRangoEdad(pagos).map((p, index)=>(

                  <tr>
                    {/* <tr>{index+1}</tr> */}
                    <td className='text-center fs-3 p-1'><span style={{margin: '20px'}}>{p.rango_edad}</span></td>  
                    <td className='ml-1 text-center fs-3 p-1'><span className='ml-5' style={{marginRight: '0'}}>{p.items.length}</span></td>  
                    <td className='fs-3 p-1'><NumberFormatMoney amount={p.suma_tarifa_total}/></td>  
                    <td className='text-center fs-3 p-1'>{((p.suma_tarifa_total/totalSumaTarifa)*100).toFixed(2)}</td>  
                    <td className='text-center fs-3 p-1'><NumberFormatMoney amount={((p.suma_tarifa_total/p.items.length))}/></td>  
                  </tr>
                ))
                }
                        </tbody>
					</Table>
                  </Col>
                </Row>
			</Card.Body>
		</Card>
  )
}
