import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { ItemPago } from './ItemPago'
import { Table } from 'react-bootstrap'
import { GraficoPago } from './GraficoPago'
import { Loading } from '@/components/Loading'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'

export const ModalReportePagos = ({codigo_pago, onHide, show}) => {
	const { obtenerEgresosPorCodigoProv, gastosxContratoProv } = useProveedorStore()
	useEffect(() => {
		if(codigo_pago!=='' && codigo_pago!==null){
			obtenerEgresosPorCodigoProv(codigo_pago)
		}
	}, [codigo_pago])
  return (
	<>
	{
		(
			<Dialog header={`Pagos del #${codigo_pago}`} onHide={onHide} visible={show} position='right' style={{height: '100rem', width: '40rem'}}>
						{
							codigo_pago==0?(
								<Loading show={codigo_pago==0}/>
							):(
								<>
									<GraficoPago/>
									<Table responsive className="table-centered mb-0">
										<thead>
											<tr>
												<th scope="col">ID</th>
												<th scope="col">Monto</th>
												<th scope="col">Observacion</th>
											</tr>
										</thead>
										<tbody>
											<tr>
											<td>
															<div className="d-flex align-items-center">
																<div className="flex-grow-1 ms-2">
																	{/* {transaction.name} */}
																	nOMBRE
																</div>
															</div>
														</td>
														<td>
															Olaaaaaa
														</td>
											</tr>
										</tbody>
									</Table>
								</>
							)
						}

			</Dialog>
		)
	}
	</>
  )
}
