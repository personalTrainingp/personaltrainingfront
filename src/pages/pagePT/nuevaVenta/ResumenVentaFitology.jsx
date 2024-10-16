import { MoneyFormatter } from '@/components/CurrencyMask'
import { onDeleteOneFitology } from '@/store/uiNuevaVenta/uiNuevaVenta'
import React from 'react'
import { Table } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
/**
 * {
 * "label":"MASAJES REDUCTORES",
 * "value":4,
 * "cantidad":10,
 * "tarifa":399
 * }
 */
export const ResumenVentaFitology = ({dataVenta}) => {
  const dispatch = useDispatch()
	const deleteVentaProducto = (id)=>{
		dispatch(onDeleteOneFitology(id))
	}
  return (
    <Table responsive hover className="table-centered table-nowrap mb-0">
					<tbody>
            {
            dataVenta.map(e=>{
              return (
								<tr key={e.value}>
									<td>
										<span className="text-muted font-13">Nombre del producto</span> <br />
											<span>
												{e.label}
											</span>
									</td>
									<td>
										<span className="text-muted font-13">Cantidad</span> <br />
										<span className="">{e.cantidad}</span>
									</td>
									<td>
										<span className="text-muted font-13">Total</span>
										<h5 className="font-14 mt-1 fw-normal"><MoneyFormatter amount={e.tarifa}/></h5>
									</td>
									<td className="table-action" style={{ width: '90px' }}>
										<Link to="" className="action-icon" onClick={()=>deleteVentaProducto(e.value)}>
											<i className="mdi mdi-delete"></i>
										</Link>
									</td>
								</tr>
							)
            })
            }
					</tbody>
				</Table>
  )
}
