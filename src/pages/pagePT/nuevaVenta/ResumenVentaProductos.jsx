import { MoneyFormatter } from '@/components/CurrencyMask';
import { onDeleteOneProducto } from '@/store/uiNuevaVenta/uiNuevaVenta';
import React from 'react'
import { Table } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'

export const ResumenVentaProductos = ({dataVenta}) => {
	const dispatch = useDispatch()
	const deleteVentaProducto = (id)=>{
		dispatch(onDeleteOneProducto(id))
	}
  return (
    <>
    <Table responsive hover className="table-centered table-nowrap mb-0">
					<tbody>
						{dataVenta.map(e=>{
							return (
								<tr key={e.id}>
									<td>
										<span className="text-muted font-13">Nombre del producto</span> <br />
											<span>
												{e.nombre_producto}
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
										<Link to="" className="action-icon" onClick={()=>deleteVentaProducto(e.id)}>
											<i className="mdi mdi-delete"></i>
										</Link>
									</td>
								</tr>
							)
						})

						}
					</tbody>
				</Table>
    </>
  )
}
