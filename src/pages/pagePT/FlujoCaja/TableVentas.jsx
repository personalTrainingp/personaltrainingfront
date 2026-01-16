import { NumberFormatMoney } from '@/components/CurrencyMask'
import React, { useMemo } from 'react'
import { Table } from 'react-bootstrap'
import { TotalesGeneralesxMes, TotalesPorGrupo } from './helpers/totalesxGrupo'

export const TableVentas = ({dataIngresosxMes=[], background, bgTotal, mesesSeleccionadosNums, mesesNombres, onOpenModalDetallexCelda}) => {
	const totalesPorGrupo = useMemo(()=>{
		return TotalesPorGrupo(dataIngresosxMes).dataTotal
	}, [dataIngresosxMes])
	const { totalPorMes, totalGeneral } = useMemo(() => {
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes(dataIngresosxMes)
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataIngresosxMes]);
  return (
    <>
	<div  className="table-responsive" style={{ width: '95vw' }}>
		<Table className="tabla-egresos" bordered style={{border: '4px solid black'}}>
			<colgroup>
					<col className={`${bgTotal} text-white`} style={{ width: 350 }} />
					<col style={{ width: 100 }} />
					{mesesSeleccionadosNums?.map(mesNum => (
					<col key={mesNum} style={{ width: 150 }} />
					))}
					<col className={`${bgTotal}`} style={{ width: 150 }} />
					<col className={`${bgTotal}`} style={{ width: 150 }} />
					<col className={`${bgTotal}`} style={{ width: 150 }} />
				</colgroup>
				{
					totalesPorGrupo?.map((grp, i, arr)=>{
						const sumaTotalAnualGrupos = totalesPorGrupo.reduce(
						(acc, g) => acc + g.totalAnual,
						0
						);
						const mesesSumaxGrupo = grp.mesesSuma
									const sumaCantidadMov = grp.conceptos?.map((c, idx) =>c.items.reduce(
									(sum, it) => sum + (it.lenthItems || 0),
									0
									))
						return (
							<React.Fragment key={grp.grupo}>
													<thead className={bgTotal}>
						<tr>
							<th className=" fs-1">
								<div
									className={`p-1 rounded rounded-3 ${bgTotal}`}
									style={{
									width: 360,
									hyphens: 'auto',
									wordBreak: 'break-word',
									overflowWrap: 'break-word',
									whiteSpace: 'normal',
									lineHeight: '1.2',
									}}
								>
									{(
									<>
										{i + 1}. {grp.grupo}
									</>
									)}
								</div>
								</th>
							<th className=" fs-1">
								<div
									className={`${bgTotal} text-center`}
									style={{
									hyphens: 'auto',
									wordBreak: 'break-word',
									overflowWrap: 'break-word',
									whiteSpace: 'normal',
									lineHeight: '1.2',
									}}
								>
									Nº <br/> MOV.
								</div>
								</th>
								{mesesSeleccionadosNums?.map(mesNum => (
								<th
									key={mesNum}
										style={{width: 190}}
									>
									<div 
									className="text-white text-center fs-2 "
									>
									{mesesNombres[mesNum - 1]}
									</div>
								</th>
								))}
								<th className={`${bgTotal} text-center p-1 fs-1`}>
								TOTAL
								</th>
								<th className="text-white p-1 fs-1">
									<div className='text-center'>
										%
									</div>
								</th>
								<th className="text-white p-1 fs-1">
									<div className='text-center'>
										PROMEDIO <br/> ANUAL
									</div>
								</th>
							</tr>
							</thead>
							<tbody>
								{grp.conceptos?.map((c, idx) => {
									const totalConcepto = c.items?.reduce(
									(sum, it) => sum + (it.monto_total || 0),
									0
									);
									const cantidadMovimiento = c.items?.reduce(
									(sum, it) => sum + (it.lenthItems || 0),
									0
									);
									return (
									<tr key={c.concepto}>
										<td className={`fw-bold fs-2 sticky-td`} >
											<div className={`py-3 text-white`}>
											{idx + 1}. {c.concepto}
											</div>
										</td>
										<td className="fw-bold fs-2" >
											<div className="bg-white text-right" style={{marginRight: '40px'}}>
												{cantidadMovimiento}
											</div>
										</td>
										{mesesSeleccionadosNums?.map(mesNum => {
										const itemMes = c.items.find(it => it.mes === mesNum) || { monto_total: 0, mes: mesNum };
										return (
											<td key={mesNum} className="fs-1">
												<div
													className={`cursor-text-primary fs-2 bg-porsiaca text-right ${itemMes.monto_total<=0?'':'fw-bold'}`}
													style={{width: '180px'}}
													onClick={() => onOpenModalDetallexCelda({
													...itemMes,
													concepto: c.concepto,
													grupo: grp.grupo,
													})}
												>
													<NumberFormatMoney amount={itemMes.monto_total} />
												</div>
											</td>
										);
										})}
										<td>
											<div className='text-right  text-white'  style={{fontSize: '40px'}}>
													<NumberFormatMoney amount={totalConcepto} />
											</div>
										</td>
										<td>
											<div className='text-right  text-white' style={{fontSize: '40px'}}>
													<NumberFormatMoney amount={(totalConcepto/totalGeneral)*100} />
											</div>
										</td>
										<td>
											<div className='text-right  text-white' style={{fontSize: '40px'}}>
													<NumberFormatMoney amount={totalConcepto/12} />
											</div>
										</td>
									</tr>
									);
								})}
								<tr className={`${bgTotal}`}>
									<td className="text-white fs-2">
										<div>
											TOTAL
										</div>
									</td>
									<td className="text-white text-right fs-2" > 
										<div style={{marginRight: '40px'}}>
											{sumaCantidadMov?.reduce((a, b)=>a+b, 0)}
										</div>
									</td>
									{
										mesesSumaxGrupo?.map(m=>{
											return (
												<td >
													<div className="text-white fs-2 bg-porsiaca text-right" style={{width: '180px'}}>
													<NumberFormatMoney amount={m}/>
													</div>
												</td>
											)
										})
									}
									<td className="text-white text-right"  style={{fontSize: '40px'}}><NumberFormatMoney amount={mesesSumaxGrupo.reduce((a, b)=>a+b, 0)}/></td>
									<td  className="text-white text-right" style={{fontSize: '40px'}}><NumberFormatMoney amount={100}/></td>
									<td className="text-white text-right" style={{fontSize: '40px'}}><NumberFormatMoney amount={mesesSumaxGrupo.reduce((a, b)=>a+b, 0)/12}/></td>
								</tr>
							</tbody>
							</React.Fragment>
						)
					})
				}
		</Table>
	</div>
    </>
  )
}
