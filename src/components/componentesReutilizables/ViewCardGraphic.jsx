import React from 'react'
import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap'
import { CardTitle } from '@/components';
import Chart from 'react-apexcharts';
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
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
    { rango_edad: "58 a 63", min: 58, max: 63 },
    { rango_edad: "64 a 69", min: 64, max: 69 },
    { rango_edad: "70 a -|-", min: 70, max: Infinity },
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
export const ViewCardGraphic = ({pagos, title, viewData, viewDataCategories, dataTable, dataView}) => {
  const series = [
    {
        name: 'TOTAL:',
      data: viewData,
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
          fontSize: '60px', // Cambia este valor para hacer los números más grandes
        },
  formatter: function (val, opts) {
    return ''
  },
      },
    xaxis: {
      categories: viewDataCategories,
      fontSize: '45px', // Cambia este valor para hacer los números más grandes
      labels:{
        style:{
          fontSize: '20px', // Cambia este valor para hacer los números más grandes
          fontWeight: 'bold',
        }
      }
    },
    yaxis:{
      labels:{
        style: {
          fontSize: '20px', // Cambia este valor para hacer los números más grandes
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

  
  const rangeEdadOrden = agruparPorRangoEdad(pagos).sort((a,b)=>b.items.length-a.items.length)
  
  const totalSumaTarifa = rangeEdadOrden.reduce((acc, curr) => acc + curr.suma_tarifa_total, 0);
  const totalSumaPorcentaje = rangeEdadOrden.reduce((acc, curr) => acc + ((curr.suma_tarifa_total/totalSumaTarifa)*100), 0);
  const ticketMedioSumaTotal = rangeEdadOrden.reduce((acc, curr) => {
    if (curr.items.length === 0) return acc; // No hacer nada si no hay items
    return acc + (curr.suma_tarifa_total / curr.items.length); // Sumar la tarifa promedio
  }, 0);
	const sumaTotalCantidad = rangeEdadOrden.reduce((total, item) => total + item.items.length, 0);
  return (
    <Card>
        <Card.Body>
            <Row>
                <Col lg={5}>
                    <h2 className='mt-0 text-white bg-primary border rounded-4 p-1'>{title}</h2>
                                <Chart options={options} series={series} type="bar" width="700" height="600"/>
                </Col>
                <Col lg={1}>
                </Col>
                <Col lg={7}>
                {/* <Table
                        className="table-centered mb-0 fs-4"
                        hover
                        responsive
                        striped
                    	>
                        <thead className="bg-primary">
                            <tr>
                                <th className='text-white p-1 fs-3 text-center'><span style={{margin: '20px'}}>EDAD</span></th>
                                <th className='text-white text-center p-1 fs-3 ml-1'><span className='ml-5' style={{marginRight: '0'}}>SOCIOS</span></th>
                                <th className='text-white p-1 fs-3 text-center'><SymbolSoles isbottom={false}/></th>
                                <th className='text-white p-1 fs-3 text-center'>%</th>
                                <th className='text-white p-1 fs-3 text-center'>TICKET MEDIO</th>
                            </tr>
                        </thead>
						<tbody>
                {rangeEdadOrden.map((p, index)=>(

                  <tr>
                    <td className='text-primary text-center fs-2 p-1'><span style={{margin: '20px'}}>{p.rango_edad}</span></td>  
                    <td className='ml-1 text-center fs-2 p-1'><span className='ml-5' style={{marginRight: '0'}}>{p.items.length}</span></td>  
                    <td className='fs-2 p-1'><NumberFormatMoney amount={p.suma_tarifa_total}/></td>  
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
					        </Table> */}
                </Col>
            </Row>
        </Card.Body>
    </Card>
  )
}
