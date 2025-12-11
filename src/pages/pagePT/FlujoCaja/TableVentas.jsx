import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'
import { Table } from 'react-bootstrap'

export const TableVentas = ({dataVentasxMes=[], background, bgTotal, mesesSeleccionadosNums, mesesNombres}) => {
	  // Total de membresías
  const totalMembresias = dataVentasxMes.reduce(
    (acc, item) => acc + (Number(item?.detalletotal_membresia) || 0),
    0
  )
  return (
    <>
    <Table>
        <thead className={background}>
						<tr>
							<th className=" fs-1">
								<div
									className={`p-1 rounded rounded-3 ${bgTotal}`}
									style={{
									width: 450,
									hyphens: 'auto',
									wordBreak: 'break-word',
									overflowWrap: 'break-word',
									whiteSpace: 'normal',
									lineHeight: '1.2',
									}}
									
									lang="es" // Importante para la división correcta de palabras
								>
                                    VENTAS
								</div>
								</th>
							{mesesSeleccionadosNums.map(mesNum => (
							<th
								key={mesNum}
								className="text-white text-center p-1 fs-2"
							>
								{mesesNombres[mesNum - 1]}
							</th>
							))}

							<th className={`${bgTotal} text-center p-1 fs-1`}>
							TOTAL
							</th>
							<th className="text-white text-center p-1 fs-1">
							%
							</th>
						</tr>
						</thead>
                        <tbody>
                            <tr>
                                <td className="fw-bold fs-2 sticky-td">
                                    <div className="bg-white py-3">
                                        MEMBRESIAS
                                    </div>
                                </td>
                                {
                                    mesesSeleccionadosNums.map(mesNum=>{
                                        const montoVenta = dataVentasxMes.find(e=>Number(e.mesNumero)===mesNum)
                                        return (
                                            <td className="fw-bold fs-2 sticky-td">
                                                <div className="bg-white py-3">
                                                    <NumberFormatMoney amount={montoVenta?.detalletotal_membresia}/>
                                                </div>
                                            </td>
                                        )
                                    })
                                }
								<td>
									<div >
										<td className="fw-bold fs-2 sticky-td">
                                                <div className="bg-white py-3">
                                                    <NumberFormatMoney amount={totalMembresias}/>
                                                </div>
                                            </td>
									</div>
								</td>
                            </tr>
                            
                        </tbody>
    </Table>
    </>
  )
}
