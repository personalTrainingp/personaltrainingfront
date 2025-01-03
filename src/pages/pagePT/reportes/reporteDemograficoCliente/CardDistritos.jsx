import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import Chart from 'react-apexcharts';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { TabPanel, TabView } from 'primereact/tabview';
import { TarjetasPago } from './TarjetasPago';
import Tarjetas from './Tarjetas';
import { ModalItems } from './ModalItems/ModalItems';
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
export const CardDistritos = ({tasks, dataSumaTotal}) => {
    
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
	console.log(agruparDistritosPorTarifa(tasks), "distritos");
	
  return (
    <>
        <TabView>
            <TabPanel header={<span className='fs-2'>RANKING POR DISTRITO </span>}>
            {/* <TarjetasPago labelsGraphic={tasks.map(f=>(f.items.length))} rangeEdadOrden={tasks} tasks={tasks} title={'RANKING POR RANGO DE EDAD'}/> */}
				<Tarjetas dataSumaTotal={0} tasks={tasks} title={'RANKING POR DISTRITO'}/>
            </TabPanel>
            <TabPanel header={<span className='fs-2'>RANKING POR DISTRITO POR MONTO DE VENTA</span>}>
			<Tarjetas dataSumaTotal={0} tasks={tasks} title={'RANKING POR DISTRITO POR MONTO DE VENTA'}/>
            {/* <TarjetasPago labelsGraphic={tasks.map(f=>(f.suma_tarifa_total))} rangeEdadOrden={tasks} tasks={tasks} title={'RANKING POR RANGO DE EDAD POR MONTO DE VENTA'}/> */}
            </TabPanel>
            <TabPanel header={<span className='fs-2'>RANKING POR DISTRITO POR TICKET MEDIO</span>}>
			<Tarjetas dataSumaTotal={0} tasks={tasks} title={'RANKING POR DISTRITO POR TICKET MEDIO'}/>
            {/* <TarjetasPago labelsGraphic={tasks.map(f=>(f.suma_tarifa_total/f.items.length))} rangeEdadOrden={tasks} tasks={tasks} title={'RANKING POR RANGO DE EDAD POR TICKET MEDIO'}/> */}
            </TabPanel>
        </TabView>
		<ModalItems />
        </>
  )
}
