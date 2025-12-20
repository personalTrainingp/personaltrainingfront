import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'
import { Table } from 'react-bootstrap'

export const TableVentas = ({dataVentasxMes=[], background, bgTotal, mesesSeleccionadosNums, mesesNombres}) => {
	  // Total de membresías
  
  const totalIngresoExtraord = dataVentasxMes.reduce(
    (acc, item) => acc + (Number(item?.detalle_total_ingextraordCHANGE) || 0),
    0
  )
	  const totalMembresias = dataVentasxMes.reduce(
    (acc, item) => acc + (Number(item?.detalletotal_membresia) || 0),
    0
  )
  const totalProductos17 = dataVentasxMes.reduce(
    (acc, item) => acc + (Number(item?.detalle_total_productos_17) || 0),
    0
  )
  const totalProductos18 = dataVentasxMes.reduce(
    (acc, item) => acc + (Number(item?.detalle_total_productos_18) || 0),
    0W
  )
  const totalSuma = totalMembresias + totalProductos17+totalProductos18 + totalIngresoExtraord
  const ingExtraCHANGE = [
	{ monto_tarifa: 0, mes: '2025-01', mesNumero: 1 },
	{ monto_tarifa: 0, mes: '2025-02', mesNumero: 2 },
	{ monto_tarifa: 0, mes: '2025-03', mesNumero: 3 },
	{ monto_tarifa: 0, mes: '2025-04',mesNumero: 4 },
	{ monto_tarifa: 0, mes: '2025-05', mesNumero: 5 },
	{ monto_tarifa: 6206.67, mes: '2025-06', mesNumero: 6 },
	{ monto_tarifa: 2941.74, mes: '2025-07', mesNumero: 7 },
	{ monto_tarifa: 7735.49, mes: '2025-08', mesNumero: 8 },
	{ monto_tarifa: 4464.22, mes: '2025-09', mesNumero: 9 },
	{ monto_tarifa: 6781.26, mes: '2025-10', mesNumero: 10 },
	{ monto_tarifa: 10513.91, mes: '2025-11', mesNumero: 11 },
	{ monto_tarifa: 0, mes: '2025-12', mesNumero: 12 }
  ]
  const dataIngresos = mesesSeleccionadosNums.map(e=>{
	const mesIngExt = ingExtraCHANGE.find(ex=>ex.mesNumero===e)
	return {
		mes: mesIngExt.mes,
		mesNumero: mesIngExt.mesNumero,
		montoIngresoExtraord: mesIngExt?.monto_tarifa
	}
  })
  console.log(dataVentasxMes);
  
  return (
    <>
	<div  className="table-responsive" style={{ width: '95vw' }}>
		<Table className="tabla-egresos">
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
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={montoVenta?.detalletotal_membresia}/>
													</div>
												</td>
											)
										})
									}
											<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={totalMembresias}/>
													</div>
												</td>
											<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={(totalMembresias/totalSuma)*100}/>
													</div>
												</td>
								</tr>

								
								<tr>
									<td className="fw-bold fs-2 sticky-td">
										<div className="bg-white py-3">
											SUPLEMENTOS
										</div>
									</td>
									{
										mesesSeleccionadosNums.map(mesNum=>{
											const montoVenta = dataVentasxMes.find(e=>Number(e.mesNumero)===mesNum)
											return (
												<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={montoVenta?.detalle_total_productos_17}/>
													</div>
												</td>
											)
										})
									}
											<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={(totalProductos17)}/>
													</div>
												</td>
											<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={(totalProductos17/totalSuma)*100}/>
													</div>
												</td>
								</tr>

								
								<tr>
									<td className="fw-bold fs-2 sticky-td">
										<div className="bg-white py-3">
											ACCESORIOS
										</div>
									</td>
									{
										mesesSeleccionadosNums.map(mesNum=>{
											const montoVenta = dataVentasxMes.find(e=>Number(e.mesNumero)===mesNum)
											return (
												<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={montoVenta?.detalle_total_productos_18}/>
													</div>
												</td>
											)
										})
									}
											<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={totalProductos18}/>
													</div>
												</td>
											<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={(totalProductos18/totalSuma)*100}/>
													</div>
												</td>
								</tr>
								
								<tr>
									<td className="fw-bold fs-2 sticky-td">
										<div className="bg-white py-3">
											ING. EXTRAORD.
										</div>
									</td>
									{
										mesesSeleccionadosNums.map(mesNum=>{
											const montoVenta = dataVentasxMes.find(e=>Number(e.mesNumero)===mesNum)
											return (
												<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={montoVenta?.detalle_total_ingextraordCHANGE}/>
													</div>
												</td>
											)
										})
									}
											<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={(totalIngresoExtraord)}/>
													</div>
												</td>
											<td className="fw-bold fs-2 sticky-td">
													<div className="bg-white py-3 text-right">
														<NumberFormatMoney amount={(totalIngresoExtraord/totalSuma)*100}/>
													</div>
												</td>
								</tr>
								<tr style={{fontSize: '31px'}}>
									<td className={`fw-bolder fs-1 ${bgTotal}`}>
									<div className={`${bgTotal}`} style={{fontSize: '31px'}}>
										TOTAL
										{/* <br/>
										% REPRESENTACION */}
									</div>
									</td>
									{mesesSeleccionadosNums.map(mesNum => {
										const montoMes = dataVentasxMes.find(e=>Number(e.mesNumero)===mesNum)
										return(
											<td
												key={mesNum}
												className="text-center fw-bolder"
												
											>
												<div style={{ width: 150 }} className='bg-porsiaca text-white text-right'>
													<NumberFormatMoney amount={montoMes?.detalle_total_productos_18+montoMes?.detalle_total_productos_17+montoMes?.detalletotal_membresia} />
													{/* <br/>
													{pctMesGrupo}% */}
												</div>
											</td>
										)
									}
									)}
									<td className="text-center fw-bolder">
									<div className='bg-porsiaca text-right text-white' style={{fontSize: '40px'}}>
										<NumberFormatMoney amount={totalMembresias+totalProductos17+totalProductos18 + totalIngresoExtraord} />
									</div>
									</td>
									<td className="text-center fw-bolder" style={{fontSize: '40px'}}>
									<div className='bg-porsiaca text-right text-white ml-3'>
										100.00
									</div>
									</td>
								</tr>
							</tbody>
		</Table>
	</div>
    </>
  )
}
