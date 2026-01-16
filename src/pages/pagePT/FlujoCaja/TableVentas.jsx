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
		
  console.log({totalesPorGrupo, totalPorMes, totalGeneral});
  
  return (
    <>
	<div  className="table-responsive" style={{ width: '95vw' }}>
		<Table className="tabla-egresos">
			<colgroup>
					<col style={{ width: 350 }} />
					<col style={{ width: 350 }} />
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
						return (
							<React.Fragment key={grp.grupo}>
													<thead className={bgTotal}>
						<tr>
							<th className=" fs-1">
								<div
									className={`p-1 rounded rounded-3 ${bgTotal}`}
									style={{
									width: 260,
									hyphens: 'auto',
									wordBreak: 'break-word',
									overflowWrap: 'break-word',
									whiteSpace: 'normal',
									lineHeight: '1.2',
									}}
									
									lang="es" // Importante para la división correcta de palabras
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
									className={`p-1 rounded rounded-3 ${bgTotal} text-center`}
									style={{
									width: 400,
									hyphens: 'auto',
									wordBreak: 'break-word',
									overflowWrap: 'break-word',
									whiteSpace: 'normal',
									lineHeight: '1.2',
									}}
									
									lang="es" // Importante para la división correcta de palabras
								>
									Nº <br/> MOVIMIENTOS
								</div>
								</th>
								{mesesSeleccionadosNums?.map(mesNum => (
								<th
									key={mesNum}
									className="text-white text-center px-4 fs-2"
								>
									{mesesNombres[mesNum - 1]}
								</th>
								))}

								<th className={`${bgTotal} text-center p-1 fs-1`}>
								TOTAL
								</th>
								<th className="text-white p-1 fs-1">
									<div className='text-right mr-4'>
										%
									</div>
								</th>
								<th className="text-white p-1 fs-1">
									<div className='text-right'>
										PROMEDIO <br/> ANUAL
									</div>
								</th>
							</tr>
							</thead>
							<tbody>
								{grp.conceptos?.map((c, idx) => {
									const totalConcepto = c.items.reduce(
									(sum, it) => sum + (it.monto_total || 0),
									0
									);
									const cantidadMovimiento = c.items.reduce(
									(sum, it) => sum + (it.lenthItems || 0),
									0
									);
									const pctConcepto = grp.totalAnual > 0
									? ((totalConcepto / grp.totalAnual) * 100).toFixed(2)
									: '0.00';
									
									return (
									<tr key={c.concepto}>
										<td className="fw-bold fs-2 sticky-td" style={{color: `${bgTotal}`}}>
											<div className="bg-white py-3">
											{idx + 1}. {c.concepto}
											</div>
										</td>
										<td className="fw-bold fs-2 sticky-td" style={{color: `${bgTotal}`}}>
											<div className="bg-white py-3 text-center">
											<div >
												{cantidadMovimiento}
											</div>
											</div>
										</td>
										{mesesSeleccionadosNums?.map(mesNum => {
										const itemMes = c.items.find(it => it.mes === mesNum) || { monto_total: 0, mes: mesNum };
										return (
											<td key={mesNum} className="text-center fs-1">
												<div
													className={`cursor-text-primary fs-2 bg-porsiaca text-right ${itemMes.monto_total<=0?'':'fw-bold'}`}
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
										<td className='fs-2'>
											<div className='text-right  text-white'>
													<NumberFormatMoney amount={(totalConcepto/totalGeneral)*100} />
											</div>
										</td>
										<td className='fs-2'>
											<div className='text-right  text-white'>
													<NumberFormatMoney amount={totalConcepto/12} />
											</div>
										</td>
									</tr>
									);
								})}
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
