import { NumberFormatMoney } from '@/components/CurrencyMask';
import React, { useMemo } from 'react'
import { Table } from 'react-bootstrap';
import { TotalesGeneralesxMes, TotalesPorGrupo } from './helpers/totalesxGrupo';

function dataColor(concepto) {
	switch (concepto) {
		case 'YOUTUBE PREMIUM FAMILY':
			return 'bg-yellow'
		case 'CTS':
			return 'bg-yellow'
		case 'SENTINEL':
			return 'bg-yellow'
		case 'PUBLICIDAD DIGITAL':
			return 'bg-yellow'
		default:
			break;
	}
}

export const TableGasto = ({id_empresa, bgPastel, mesesSeleccionadosNums, anio, bgTotal, dataEgresosxMes, mesesNombres, bgMultiValue, onOpenModalDetallexCelda, prestamosGroup, selectedMonths, dataVentasxMes=[]  }) => {
	const totalesPorGrupo = useMemo(()=>{
		return TotalesPorGrupo(dataEgresosxMes).dataTotal
	}, [dataEgresosxMes])
	const { totalPorMes, totalGeneral } = useMemo(() => {
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes(dataEgresosxMes)
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataEgresosxMes]);
  return (
    <div className="table-responsive" style={{ width: '95vw' }}>
				<Table className="tabla-egresos"  bordered >
				<colgroup>
					<col className={`${bgTotal} text-white`} style={{ width: 500 }}/>
					{mesesSeleccionadosNums.map(mesNum => (
						<React.Fragment key={mesNum}>
						<col style={{ width: 150 }} />
						<col style={{ width: 150 }} className={`${bgPastel}`}/>
						</React.Fragment>
					))}
					<col className={`${bgTotal}`} style={{ width: 250 }} />
					<col className={`${bgTotal}`} style={{ width: 200 }} />
					<col className={`${bgTotal}`} style={{ width: 150 }} />
					<col className={`${bgTotal}`} style={{ width: 150 }} />
				</colgroup>

				{totalesPorGrupo.map((grp, i, arr) => {
						const mesesSumaxGrupo = grp.mesesSuma
						const totalesGeneralesGrupo = grp.totalMes
						const sumaCantidadMov = grp.conceptos?.map((c, idx) =>c.items.reduce(
							(sum, it) => sum + (it.lenthItems || 0),
							0
						))
						console.log({mesesSumaxGrupo});
						
					return (
					<React.Fragment key={grp.grupo}>
						{/* Encabezado del grupo */}
						<thead >
						<tr>
							<th className={`text-black bg-white-1 fs-1 border-left-10 border-right-10 border-top-10 border-bottom-10`}>
								<div

								>
									{grp.grupo === 'ATENCIÓN AL CLIENTE' ? (
									<>
										{i + 1}. ATENCIÓN AL CLIENTE
									</>
									) : (
									<>
										{i + 1}. {grp.grupo}
									</>
									)}
								</div>
								</th>
							{mesesSeleccionadosNums.map(mesNum => (
								<React.Fragment key={mesNum}>
									<th
										style={{width: 130}}
										className={`bg-change `}
									>
										<div 
											className="text-white text-center fs-1 m-0 p-0">
											{mesesNombres[mesNum - 1]}
										</div>
									</th>
									<th
										style={{width: 90}}
										className='bgPastel'
									>
										<div 
											className="bgPastel text-white text-center fs-1 m-0 p-0">
											MOV.
										</div>
									</th>
								</React.Fragment>
							))}

							<th className={`bg-white-1 text-center p-1 fs-1 border-left-10 border-top-10`}>
							TOTAL <br/> ANUAL
							</th>
							<th className="bg-white-1 fs-1 border-top-10">
								<div
									className={` text-center`}
									style={{
									width: 130,
									hyphens: 'auto',
									wordBreak: 'break-word',
									overflowWrap: 'break-word',
									whiteSpace: 'normal',
									lineHeight: '1.2',
									}}
								>
									MOV. ANUAL
								</div>
								</th>
								<th className="bg-white-1 p-1 fs-1 border-top-10">
									<div className='text-center'>
										% <br/> PART. <br/> ANUAL
									</div>
								</th>
								<th className="bg-white-1 p-1 fs-1 border-top-10 border-right-10">
									<div className='text-center'>
										PROMEDIO <br/> MENSUAL <br/> ANUAL
									</div>
								</th>
						</tr>
						</thead>

						<tbody>
						{grp?.conceptos?.map((c, idx) => {
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
							
									const mesesSinCero = c.items.filter(i=>i.items.length!==0)
							return (
							<tr key={c.concepto} className={dataColor(c.concepto)}>
								<td   className={`fw-bold fs-2 sticky-td-${id_empresa} border-left-10 border-right-10 p-1 ${bgTotal} text-white`}>
											{idx + 1}. {c.concepto}
							    </td>
								{mesesSeleccionadosNums.map(mesNum => {
								const itemMes = c.items.find(it => it.mes === mesNum) || { monto_total: 0, mes: mesNum };
								return (
									<React.Fragment key={mesNum}>
										<td style={{fontSize: '35px'}}>
											<div
												className={`cursor-text-primary bg-porsiaca text-right ${itemMes.monto_total<=0?'':'fw-bold'}`}
												onClick={() => onOpenModalDetallexCelda({
												...itemMes,
												concepto: c.concepto,
												grupo: grp.grupo,
												})}
											>
												<NumberFormatMoney amount={itemMes.monto_total} />
											</div>
										</td>
										<td style={{fontSize: '35px'}} className='bg-white-1'>
											<div
												className={`cursor-text-primary bg-porsiaca text-right ${itemMes.monto_total<=0?'':'fw-bold'}`}
												// style={{width: '100px'}}
												onClick={() => onOpenModalDetallexCelda({
												...itemMes,
												concepto: c.concepto,
												grupo: grp.grupo,
												})}
											>
												{itemMes.items.length}
											</div>
										</td>
									</React.Fragment>
								);
								})}
								
								<td className='border-left-10'>
									<div className='text-right text-white'  style={{fontSize: '40px'}}>
											<NumberFormatMoney amount={totalConcepto} />
									</div>
								</td>
								<td className="fw-bold" >
									<div className="text-white text-right" style={{fontSize: '40px', width: '90px'}}>
										{cantidadMovimiento}
									</div>
								</td>
								<td>
									<div className='text-center  text-white' style={{fontSize: '40px'}}>
											<NumberFormatMoney amount={(totalConcepto/totalGeneral)*100} />
									</div>
								</td>
								<td className='border-right-10'>
									<div className='text-right  text-white' style={{fontSize: '40px'}}>
											<NumberFormatMoney amount={totalConcepto/dataTotalFormular(anio, c.items.map(i=>i.monto_total)).length} />
									</div>
								</td>
							</tr>
							);
						})}
							<tr className={`${bgTotal} `} style={{fontSize: '35px'}}>
								<td className={`border-left-10 border-right-10 text-white text-center sticky-td-${id_empresa}`}  >
										TOTAL
								</td>
								{
									totalesGeneralesGrupo?.map((m, i)=>{
										return (
											<td  style={{fontSize: '35px'}} className={`${(i+1)%2==0?'bg-change-pastel':'bg-change'}`}>
												<div className="text-white bg-porsiaca text-right">
												{(i+1)%2==0?m:(
												<NumberFormatMoney amount={m}/>
												)}
												</div>
											</td>
										)
									})
								}
								<td className="text-center bg-white-1 border-left-10 border-right-10" colSpan={4}  style={{fontSize: '40px'}}>
									TOTAL ANUAL
									{/* <NumberFormatMoney amount={mesesSumaxGrupo?.reduce((a, b)=>a+b, 0)}/> */}
								</td>
								{/* <td className="bg-white-1 text-right" > 
									<div style={{marginRight: '40px', fontSize: '40px'}}>
										{sumaCantidadMov?.reduce((a, b)=>a+b, 0)}
									</div>
								</td>
								<td  className="bg-white-1 text-center" style={{fontSize: '40px'}}><NumberFormatMoney amount={(mesesSumaxGrupo?.reduce((a, b)=>a+b, 0)/totalGeneral)*100}/>%</td>
								<td className="bg-white-1 text-right" style={{fontSize: '40px'}}>									<NumberFormatMoney amount={mesesSumaxGrupo?.reduce((a, b)=>a+b, 0)/12}/>
</td> */}
							</tr>
							<tr className={`${bgTotal} `} style={{fontSize: '35px'}}>
								<td className={`border-left-10 border-right-10 border-bottom-10 text-white sticky-td-${id_empresa}`}  >
										PARTICIPACION
								</td>
								{
									totalesGeneralesGrupo?.map((m, i)=>{
										return (
											<td style={{fontSize: '35px'}} className={`${(i+1)%2==0?'bg-change-pastel':'bg-change'}`}>
												<div className="text-white bg-porsiaca text-right">
												{(i+1)%2==0?(
													<>
													{
													<NumberFormatMoney amount={(m/sumaCantidadMov?.reduce((a, b)=>a+b, 0))*100}/>
													}
													</>
												):(
													<>
													<NumberFormatMoney amount={(m/mesesSumaxGrupo?.reduce((a, b)=>a+b, 0)*100).toFixed(2)}/>
													</>
												)}
												<span className='mx-2'>%</span>
												</div>
											</td>
										)
									})
								}
								
								<td className="text-right bg-white-1 border-left-10 border-bottom-10"  style={{fontSize: '40px'}}>
									<NumberFormatMoney amount={mesesSumaxGrupo?.reduce((a, b)=>a+b, 0)}/>
								</td><td className="bg-white-1 text-right border-bottom-10" > 
									<div style={{marginRight: '40px', fontSize: '40px'}}>
										{sumaCantidadMov?.reduce((a, b)=>a+b, 0)}
									</div>
								</td>
								<td  className="bg-white-1 text-center border-bottom-10" style={{fontSize: '40px'}}><NumberFormatMoney amount={(mesesSumaxGrupo?.reduce((a, b)=>a+b, 0)/totalGeneral)*100}/>%</td>
								<td className="bg-white-1 text-right border-right-10 border-bottom-10" style={{fontSize: '40px'}}>									
									<NumberFormatMoney amount={mesesSumaxGrupo?.reduce((a, b)=>a+b, 0)/dataTotalFormular(anio, mesesSumaxGrupo).length}/>
								
								</td> 					
							</tr>
							<tr className='bg-white'>
								<div></div>
								<div></div>
								<div></div>
							</tr>
						</tbody>
					</React.Fragment>
					);
				})}
      				</Table>
				</div>
  )
}


function dataTotalFormular(anio=2024, data=[]) {
	return anio===2024?data.slice(data.findIndex(n => n !== 0)):data
}
