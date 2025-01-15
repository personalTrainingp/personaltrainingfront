import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import Chart from 'react-apexcharts';
import sinAvatar from '@/assets/images/sinPhoto.jpg'
import config from '@/config';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { ModalItems } from './ModalItems/ModalItems';
import { useState } from 'react';
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
      { rango_edad: "58 a 63", min: 58, max: 63 },
      { rango_edad: "64 a 69", min: 64, max: 69 },
      { rango_edad: "70 a -|-", min: 70, max: Infinity },
      // { rango_edad: "88 a mas", min: 88, max: Infinity },
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
export const TarjetasPago = ({ tasks, title, dataSumaTotal, rangeEdadOrden, labelsGraphic }) => {
    const pagos = tasks.map(t => ({
        fec_nacimiento: t.tb_cliente.fecha_nacimiento,
        edad: calcularEdad(t.tb_cliente.fecha_nacimiento, t.fecha_venta),
        tb_cliente: t.tb_cliente,
        suma_tarifa: sumarTarifaMonto(t)
    }))
    const series = [
        {
            name: 'TOTAL:',
          data: labelsGraphic,
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
            // he: ''
          },
        },
        colors: ['#D41115'], // Cambia el color de las barras (puedes añadir más colores si hay múltiples series)
        dataLabels: {
            enabled: true,
            offsetX: 10,
            style: {
              fontSize: '60px', // Cambia este valor para hacer los números más grandes
            },
			formatter: function (val, opts) {
				return ''
			},
          },
        xaxis: {
          categories: rangeEdadOrden.map(e=>e.rango_edad),
          fontSize: '45px', // Cambia este valor para hacer los números más grandes
          labels:{
            style:{
              fontSize: '30px', // Cambia este valor para hacer los números más grandes
              fontWeight: 'bold',
              // colors: "#D41115", // Cambia el color de las etiquetas
            }
          }
        },
        yaxis:{
          labels:{
            style: {
              fontSize: '30px', // Cambia este valor para hacer los números más grandes
              fontWeight: 'bold',
              // colors: "#D41115", // Cambia el color de las etiquetas
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
  const totalSumaTarifa = rangeEdadOrden.reduce((acc, curr) => acc + curr.suma_tarifa_total, 0);
  const totalSumaPorcentaje = rangeEdadOrden.reduce((acc, curr) => acc + ((curr.suma_tarifa_total/totalSumaTarifa)*100), 0);
  const ticketMedioSumaTotal = rangeEdadOrden.reduce((acc, curr) => {
    if (curr.items.length === 0) return acc; // No hacer nada si no hay items
    return acc + (curr.suma_tarifa_total / curr.items.length); // Sumar la tarifa promedio
  }, 0);
	const sumaTotalCantidad = rangeEdadOrden.reduce((total, item) => total + item.items.length, 0);
  

  
      const [isOpenModalData, setisOpenModalData] = useState(false)
        const [labelNam, setlabelNam] = useState('')
        const [data, setdata] = useState([])
        const onOpenModalData = (d, nameLabel)=>{
          setisOpenModalData(true)
          setlabelNam(nameLabel)
          setdata(d)
        }
        const onCloseModalData = ()=>{
              setisOpenModalData(false)
          }
  return (
    <Card>
			<Card.Body>
                <Row>
                  <Col lg={6}>
                <h2 className='mt-0 text-white bg-primary border rounded-4 p-1'>{title}</h2>
                            <Chart options={options} series={series} type="bar" width="880" height="700"/>
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
                                <th className='text-center text-white p-1 fs-3'><span>EDAD</span></th>
                                <th className='text-center text-white p-1 fs-3 ml-1'><span>SOCIOS</span></th>
                                <th className='text-white p-1 fs-3 text-center'><SymbolSoles isbottom={false}/></th>
                                <th className='text-white p-1 fs-3 text-center'>%</th>
                                <th className='text-white p-1 fs-3 text-center'>TICKET MEDIO</th>
                            </tr>
                        </thead>
						<tbody>
                {rangeEdadOrden.map((p, index)=>(
                  <tr onClick={()=>onOpenModalData(p.items, p.rango_edad)}>
                    {/* <tr>{index+1}</tr> */}
                    <td className='text-primary fs-2 p-1'><span className='ml-6'>{p.rango_edad}</span></td>  
                    <td className='ml-1 fs-2 p-1'><span className='ml-6' style={{marginRight: '0'}}>{p.items.length}</span></td>  
                    <td className='fs-2 p-1'><span className='ml-6'><NumberFormatMoney amount={p.suma_tarifa_total}/></span></td>  
                    <td className='text-center fs-2 p-1'>{((p.suma_tarifa_total/totalSumaTarifa)*100).toFixed(2)}</td>  
                    <td className='text-center fs-2 p-1'><NumberFormatMoney amount={((p.suma_tarifa_total/p.items.length))}/></td>  
                  </tr>
                ))
                }
                
								<td className='text-center p-1 fs-1 text-primary fw-bold'>TOTAL</td>
								<td className='text-primary text-center p-1 fs-1 fw-bold'>{sumaTotalCantidad}</td>
								<td className='text-primary  p-1 fs-1 fw-bold'><NumberFormatMoney amount={totalSumaTarifa}/></td>
								<td className='text-primary text-center p-1 fs-1 fw-bold'>{totalSumaPorcentaje.toFixed(2)}</td>
								<td className='text-primary text-center p-1 fs-1 fw-bold'>{(ticketMedioSumaTotal/10).toFixed(2)}</td>
                <td/>
                        </tbody>
					        </Table>
                  </Col>
                </Row>
			</Card.Body>
      <ModalItems onHide={onCloseModalData} show={isOpenModalData} data={data} labelNam={labelNam}/>
		</Card>
  )
}
