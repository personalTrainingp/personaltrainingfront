import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap';

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

export const TableGasto = ({id_empresa, mesesSeleccionadosNums, bgTotal, gruposSinPrestamos, mesesNombres, bgMultiValue, onOpenModalDetallexCelda, totalPorMes, prestamosGroup, totalGeneral, selectedMonths, dataVentasxMes=[]  }) => {

  return (
    <div className="table-responsive" style={{ width: '95vw' }}>
				<Table className="tabla-egresos"  bordered style={{border: '4px solid black'}}>
				<colgroup>
					<col className={`${bgTotal} text-white`} style={{ width: 350 }}/>
					<col style={{ width: 140 }} />
					{mesesSeleccionadosNums.map(mesNum => (
					<col key={mesNum} style={{ width: 150 }} />
					))}
					<col className={`${bgTotal}`} style={{ width: 150 }} />
					<col className={`${bgTotal}`} style={{ width: 150 }} />
					<col className={`${bgTotal}`} style={{ width: 150 }} />
				</colgroup>
				
				{gruposSinPrestamos.map((grp, i, arr) => {
					const sumaTotalAnualGrupos = gruposSinPrestamos.reduce(
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
						{/* Encabezado del grupo */}
						<thead className={bgTotal}>
						<tr>
							<th className={`sticky-td-${id_empresa} text-white fs-1`}>
								<div
									
								>
									{grp.grupo === 'ATENCIÓN AL CLIENTE' ? (
									<>
										{i + 1}. ATENCIÓN AL CLIENTE
									</>
									) : grp.grupo === 'PRESTAMOS' ? (
									<span className="text-danger">PRESTAMOS</span>
									) : (
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
									width: 140,
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
							{mesesSeleccionadosNums.map(mesNum => (
							<th
								key={mesNum}
								style={{width: 190}}
							>
								<div 
									className="text-white text-center fs-1 m-0 p-0">
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
						{grp.conceptos.filter(e=>e.items.reduce(
							(sum, it) => sum + (it.monto_total || 0),
							0
							)!==0).map((c, idx) => {
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
							<tr key={c.concepto} className={dataColor(c.concepto)}>
								<td   className={`fw-bold fs-2 sticky-td-${id_empresa} p-1 ${bgTotal} text-white`}>
											{idx + 1}. {c.concepto}
							    </td>
								<td className="fw-bold fs-2" >
									<div className="bg-white text-right" style={{marginRight: '40px'}}>
										{cantidadMovimiento}
									</div>
								</td>
								{mesesSeleccionadosNums.map(mesNum => {
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
							<tr className={`${bgTotal} `}>
								<td className={`text-white fs-2 sticky-td-${id_empresa}`}  >
										TOTAL MES
										<br/>
										% REPRESENTACION
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
								<td className="text-white text-right"  style={{fontSize: '40px'}}><NumberFormatMoney amount={mesesSumaxGrupo?.reduce((a, b)=>a+b, 0)}/></td>
								<td  className="text-white text-right" style={{fontSize: '40px'}}><NumberFormatMoney amount={100}/></td>
								<td className="text-white text-right" style={{fontSize: '40px'}}><NumberFormatMoney amount={mesesSumaxGrupo?.reduce((a, b)=>a+b, 0)/12}/></td>
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
