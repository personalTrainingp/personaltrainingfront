import { CardTitle } from '@/components'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask';
import { ScrollPanel } from 'primereact/scrollpanel'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import SimpleBar from 'simplebar-react';
function sumarTarifaMonto(detalles) {
	return [
	  detalles.detalle_membresia,
	  detalles.detalle_cita_nut,
	  detalles.detalle_cita_tratest,
	  detalles.detalle_prodAccesorios,
	  detalles.detalle_prodSuplementos
	]
	  .flat() // Aplana los arrays para unirlos en uno solo
	  .reduce((total, item) => total + (item.tarifa_monto || 0), 0); // Suma los valores de tarifa_monto
  }
  
  function agrupar(data) {
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
export const ReportCard = ({titlo, data, normalData}) => {
	console.log(data, normalData, "repo");
	// data = data.map(d=>{
	// 	return {
	// 		sexo: d.tb_cliente.sexo_cli,
	// 		tarifa_total: sumarTarifaMonto(d)
	// 	}
	// })
	const tarifa_venta_total=data.reduce((total, item) => total + item.suma_tarifa_venta, 0)
	const items_total =data.reduce((total, item) => total + item.items.length, 0)
	let merged = [];

// Iterar sobre array2 para agregar o combinar con datos de array1
normalData.forEach(item2 => {
	const match = data.find(item1 => item1.label === item2.label);
	if (match) {
	  merged.push({
		...item2, // Agregar los datos de array2
		suma_tarifa_venta: match.suma_tarifa_venta, // Preservar suma_tarifa_venta
		items: match.items // Preservar items
	  });
	} else {
	  merged.push({
		...item2,
		suma_tarifa_venta: 0, // Si no existe en array1
		items: [] // Si no existe en array1
	  });
	}
  });
  
  // Asegurarse de incluir elementos de array1 que no están en array2
  data.forEach(item1 => {
	if (!normalData.some(item2 => item2.label === item1.label)) {
	  merged.push({ ...item1, value: 0 }); // Usar value como 0 si no existe en array2
	}
  });
  
	console.log(merged);
	merged = merged.sort((a,b)=>{
		    // Ordenar por cantidad (de mayor a menor)
			if (b.items.length !== a.items.length) {
				return b.items.length - a.items.length;
			}
		
			// Si las cantidades son iguales, ordenar por tarifa
			const tarifaA = ((a.suma_tarifa_venta / tarifa_venta_total) * 100).toFixed(2);
			const tarifaB = ((b.suma_tarifa_venta / tarifa_venta_total) * 100).toFixed(2);
		
			return tarifaB - tarifaA; // Ordenar de mayor a menor por tarifa
		((b.suma_tarifa_venta/tarifa_venta_total)*100).toFixed(2)-((a.suma_tarifa_venta/tarifa_venta_total)*100).toFixed(2)
	})
  return (
    <Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title={<h1 className='text-primary'>{titlo}</h1>}
					menuItems={false}
				/>
					<SimpleBar className='' style={{ maxHeight: '100%'}} scrollbarMaxSize={520}>
					<div className='d-flex justify-content-center'>
						<div className='d-flex flex-column' style={{width: 'fit-content'}}>
							{
								merged.map(g=>(
									<div className='m-2' style={{width: '300px'}}>
										<h3 className='text-center fs-2 text-primary'>{g.label}</h3>
										<div className=' fs-3 fw-bold'>SOCIOS: <span className='ml-3'>{g.items.length}</span></div>
										<div className=' fs-3 fw-bold'><span>VENTAS: <SymbolSoles fontSizeS={'fs-4 ml-3'} isbottom={true} numero={<NumberFormatMoney amount={g.suma_tarifa_venta}/>}/></span></div>
										<div className=' fs-2 text-center text-primary fw-bold'>{((g.items.length/items_total)*100).toFixed(2)} %</div>
									</div>
								))
							}
						</div>
					</div>

					</SimpleBar>
			</Card.Body>
		</Card>
  )
}
