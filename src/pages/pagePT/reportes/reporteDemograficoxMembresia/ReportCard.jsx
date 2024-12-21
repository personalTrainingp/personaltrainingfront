import { CardTitle } from '@/components'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
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
export const ReportCard = ({titlo, data}) => {
	// data = data.map(d=>{
	// 	return {
	// 		sexo: d.tb_cliente.sexo_cli,
	// 		tarifa_total: sumarTarifaMonto(d)
	// 	}
	// })
	console.log(data);

  return (
    <Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title={<h1>{titlo}</h1>}
					menuItems={false}
				/>
					<SimpleBar style={{ maxHeight: '100%'}} scrollbarMaxSize={520}>
					<div className='d-flex' style={{width: 'fit-content'}}>
						{
							data.map(g=>(
								<div className='m-2' style={{width: '400px'}}>
									<h3 className='text-center fs-1'>{g.label}</h3>
									<div className='text-center fs-2 fw-bold'>{g.items.length} / <span>VTAS <SymbolSoles isbottom={true} numero={<NumberFormatMoney amount={g.suma_tarifa_venta}/>}/></span></div>
								</div>
							))
						}
					</div>

					</SimpleBar>
			</Card.Body>
		</Card>
  )
}
