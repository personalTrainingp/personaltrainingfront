import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { ItemPago } from './ItemPago'
import { Table } from 'react-bootstrap'
import { GraficoPago } from './GraficoPago'
import { Loading } from '@/components/Loading'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { DateMask, MoneyFormatter } from '@/components/CurrencyMask'
import { TabPanel, TabView } from 'primereact/tabview'
import { Button } from 'primereact/button'
import { arrayEstadoContrato, arrayEstadoTask } from '@/types/type'
import { Badge } from 'primereact/badge'
function sumarMontosPorMoneda(data, tipoMoneda) {
	return data
	  .reduce((total, item) => total + item.monto, 0); // Suma los montos
  }


export const ModalReportePagos = ({objContrato, monto, codigo_pago, nombre_prov, tipo_moneda, onHide, show}) => {
	const { obtenerEgresosPorCodigoProv, gastosxContratoProv, descargarContratoProvxID } = useProveedorStore()
	useEffect(() => {
		if(codigo_pago!=='' && codigo_pago!==null){
			obtenerEgresosPorCodigoProv(codigo_pago, tipo_moneda)
		}
	}, [codigo_pago, tipo_moneda])
	
  return (
		<>
			{
				<Dialog
					header={`Detalles de #${codigo_pago} - ${nombre_prov}`}
					onHide={onHide}
					visible={show}
					position="right"
					style={{ height: '100rem', width: '50rem' }}
				>
					{codigo_pago == 0 ? (
						<>
						Cargando...
						</>
					) : (
						<>
							<TabView>
								<TabPanel header='Informacion del contrato'>
									<div className='d-flex justify-content-xxl-center'>
										<ul className='list-none w-100 font-15 font-bold'>
											
											<li className='mb-2 p-2'>
												<Button onClick={descargarContratoProvxID} className='mx-2' icon={'pi pi-file-pdf fs-3'}> CONTRATO</Button>
												<Button className='mx-2' icon={'pi pi-file-pdf fs-3'}> PRESUPUESTO</Button>
											</li>
											<li className='mb-2 p-2'>
												<span className='fw-bolder underline'>TRABAJO: </span>
												<span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{objContrato.observacion}</span>
											</li>
											<li className='mb-2 p-2'>
												<span className='fw-bolder underline'>CODIGO DE TRABAJO: </span>
												<span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>#{objContrato.cod_trabajo}</span>
											</li>
											<li className='mb-2 p-2'>
												<span className='fw-bolder underline'>PENALIDAD POR DIA: </span>
												<span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{objContrato.penalidad_porcentaje}</span>
											</li>
											<li className='mb-2 p-2'>
												<span className='fw-bolder underline'>Estado: </span>
												<span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}> <Badge severity={arrayEstadoContrato.find(id=>id.value === objContrato.estado_contrato).severity} value={ arrayEstadoContrato.find(id=>id.value === objContrato.estado_contrato).label}/> </span>
											</li>
											<li className='mb-2 p-2'>
												<span className='fw-bolder underline'>FECHA DE INICIO: </span>
												<span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}><DateMask date={objContrato.fecha_inicio} format={'dddd DD [ DE ] MMMM [ del ] YYYY'}/></span>
											</li>
											<li className='mb-2 p-2'>
												<span className='fw-bolder underline'>FECHA DE TERMINO: </span>
												<span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}><DateMask date={objContrato.fecha_fin} format={'dddd DD [ DE ] MMMM [ del ] YYYY'}/></span>
											</li>
											<li className='mb-2 p-2'>
												<span className='fw-bolder underline'>HORA DE TERMINO: </span>
												<span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}><DateMask date={objContrato.hora_fin} format={'hh:mm A'}/></span>
											</li>
											<li className='mb-2 p-2'>
												<span className='fw-bolder underline'>MONTO: </span>
												<span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}><MoneyFormatter amount={objContrato.monto_contrato} symbol={objContrato.tipo_moneda}/></span>
											</li>
											<li className='mb-2 p-2'>
												<span className='fw-bolder underline'>FIRMA: </span>
												<span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>(CARGAR FIRMA) (VER FIRMA)</span>
											</li>
											<li className='mb-2 p-2'>
												<a className='underline cursor-pointer'>ELIMINAR</a>
											</li>
										</ul>
									</div>
								</TabPanel>
								<TabPanel header='Pagos'>
									
							<GraficoPago abono={sumarMontosPorMoneda(gastosxContratoProv)} saldo={monto-sumarMontosPorMoneda(gastosxContratoProv)}/>
							<h2>
								SALDO: <MoneyFormatter symbol={tipo_moneda=='PEN'?'S/. ':'$ '} amount={monto-sumarMontosPorMoneda(gastosxContratoProv)}/>
							</h2>
							<h2>
								ABONADO: <MoneyFormatter symbol={tipo_moneda=='PEN'?'S/. ':'$ '} amount={sumarMontosPorMoneda(gastosxContratoProv)}/>
							</h2>
							<Table responsive className="table-centered mb-0">
								<thead>
									<tr>
										<th scope="col">ID</th>
										<th scope="col">Fecha de comprobante</th>
										<th scope="col">Fecha de pago</th>
										<th scope="col">Nº oper.</th>
										<th scope="col" >Monto</th>
										<th scope="col">Observacion</th>
									</tr>
								</thead>
								<tbody>
									{
										gastosxContratoProv?.map((gasto) => (
											<tr key={gasto.id}>
												<td>
													{gasto.id}
												</td>
												<td>
													<DateMask date={gasto.fec_comprobante} format={'dddd D [de] MMMM [del] YYYY'}/>
												</td>
												<td>
													<DateMask date={gasto.fec_pago} format={'dddd D [de] MMMM [del] YYYY'}/>
												</td>
												<td>{gasto.n_operacion}</td>
												<td style={{width: '150px'}}><MoneyFormatter amount={gasto.monto} symbol={gasto.moneda=='PEN'?'S/. ':'$ '}/></td>
												<td>{gasto.descripcion}</td>
											</tr>
                                        )) || []
									}
								</tbody>
							</Table>
								</TabPanel>
							</TabView>
						</>
					)}
				</Dialog>
			}
		</>
  );
}
