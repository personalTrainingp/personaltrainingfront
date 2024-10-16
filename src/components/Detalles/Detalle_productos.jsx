import { arrayCategoriaProducto } from '@/types/type'
import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FUNMoneyFormatter } from '../CurrencyMask'

export const Detalle_productos = ({e}) => {
  return (
    <Table responsive hover className="table-centered table-nowrap mb-0">
					<tbody>
						<tr>
							<td>
								<h5 className="font-14 my-1">
									<Link to="" className="text-body">
                                    {e.tb_producto?.nombre_producto}
									</Link>
								</h5>
								<span className="text-muted font-13">TIPO: {arrayCategoriaProducto.find(i=>i.value===e.tb_producto?.id_categoria)?.label}</span>
							</td>
							<td>
								<span className="text-muted font-13">CANTIDAD</span> <br />
								<span className="font-14 mt-1 fw-normal">{e.cantidad}</span>
							</td>
							<td>
                                <span className="text-muted font-13">MONTO</span> <br />
                                <span className="font-14 mt-1 fw-normal">{FUNMoneyFormatter(e.tarifa_monto, 'S/')}</span>
							</td>
						</tr>
					</tbody>
				</Table>
  )
}
