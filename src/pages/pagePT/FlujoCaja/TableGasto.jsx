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

export const TableGasto = ({mesesSeleccionadosNums, bgTotal, gruposSinPrestamos, mesesNombres, bgMultiValue, onOpenModalDetallexCelda, totalPorMes, prestamosGroup, totalGeneral, selectedMonths, dataVentasxMes=[]  }) => {
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
    0
  )
  const totalIngresoExtraord = dataVentasxMes.reduce(
    (acc, item) => acc + (Number(item?.detalle_total_ingextraordCHANGE) || 0),
    0
  )
  return (
    <div className="table-responsive" style={{ width: '95vw' }}>
		
				<Table className="tabla-egresos">
				<colgroup>
					<col style={{ width: 350 }} />
					{mesesSeleccionadosNums.map(mesNum => (
					<col key={mesNum} style={{ width: 150 }} />
					))}
					<col className={`${bgTotal}`} style={{ width: 150 }} />
					<col className={`${bgTotal}`} style={{ width: 150 }} />
				</colgroup>
				
				{gruposSinPrestamos.map((grp, i, arr) => {
					const sumaTotalAnualGrupos = gruposSinPrestamos.reduce(
					(acc, g) => acc + g.totalAnual,
					0
					);
					
					return (
					<React.Fragment key={grp.grupo}>
						{/* Encabezado del grupo */}
						<thead className={bgTotal}>
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
								<td className="fw-bold fs-2 sticky-td" style={{color: `${bgMultiValue}`}}>
                                    <div className="bg-white py-3">
                                    {idx + 1}. {c.concepto}
                                    <br/>
                                    <div >
                                        ({cantidadMovimiento})
                                    </div>
                                    </div>
							    </td>
								{mesesSeleccionadosNums.map(mesNum => {
								const itemMes = c.items.find(it => it.mes === mesNum) || { monto_total: 0, mes: mesNum };
								return (
									<td key={mesNum} className="text-center fs-1">
                                        <div
                                            className={`cursor-text-primary fs-2 bg-porsiaca text-right ${itemMes.monto_total<=0?'':'fw-bold'}`}
                                            style={{ width: 150 }}
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
								<td
								className={`${bgTotal} text-center fw-bold`}
								onClick={() => onOpenModalDetallexCelda({
									concepto: c.concepto,
									grupo: grp.grupo,
									mes: null,
									monto_total: totalConcepto,
								})}
								>
								<div className='bg-porsiaca text-right' style={{fontSize: '40px'}}>
									<NumberFormatMoney amount={totalConcepto} />
								</div>
								</td>
								<td className={`${bgTotal} text-center fw-bold fs-1`}
								onClick={() => onOpenModalDetallexCelda({
									concepto: c.concepto,
									grupo: grp.grupo,
									mes: null,
									monto_total: totalConcepto,
								})}>
									<div className='bg-porsiaca text-right'>
										{pctConcepto}
									</div>
								</td>
							</tr>
							);
						})}

						<tr className={`${bgTotal}`} style={{fontSize: '31px'}}>
							<td className={`fw-bolder fs-1 ${bgTotal}`}>
							<div className={`${bgTotal}`} style={{fontSize: '31px'}}>
								TOTAL
								<br/>
								% REPRESENTACION
							</div>
							</td>
							{mesesSeleccionadosNums.map(mesNum => {
								const montoMes = grp.mesesSuma[mesNum - 1];
								const baseMes = totalPorMes[mesNum - 1] || 0;
								const pctMesGrupo =
															baseMes > 0
																? ((montoMes / baseMes) * 100).toFixed(2)
																: '0.00';
								return(
									<td
										key={mesNum}
										className="text-center fw-bolder"
										
									>
										<div style={{ width: 150 }} className='bg-porsiaca text-white text-right'>
											<NumberFormatMoney amount={montoMes} />
											<br/>
											{pctMesGrupo}%
										</div>
									</td>
								)
							}
							)}
							<td className="text-center fw-bolder">
							<div className='bg-porsiaca text-right text-white' style={{fontSize: '40px'}}>
								<NumberFormatMoney amount={grp.totalAnual} />
							</div>
							</td>
							<td className="text-center fw-bolder" style={{fontSize: '40px'}}>
							<div className='bg-porsiaca text-right text-white ml-3'>
								100.00
							</div>
							</td>
						</tr>
						<tr>
						</tr>
						<tr className={`${bgTotal}`}>
							<td className="fw-bolder fs-1 text-white"  colSpan={selectedMonths.length}>
								<div>
									<span style={{fontSize: '31px'}}>
										PROMEDIO DE REPRESENTACIÓN ACUMULADA VS. TODOS LOS RUBROS
									</span>
								<span className='text-right ml-5' style={{ fontSize: '45px' }}>
									{sumaTotalAnualGrupos > 0
								? ((grp.totalAnual / sumaTotalAnualGrupos) * 100).toFixed(2)
								: '0.00'}%
								</span>
								</div>
							</td>
							<td className="fw-bolder text-white">
								
							</td>
							<td className="fw-bolder fs-1">
							</td>
							<td>
							</td>
						</tr>
						<tr>
							<div></div>
							<div></div>
						</tr>
						</tbody>
					</React.Fragment>
					);
				})}

<pre>
			{
				JSON.stringify(dataVentasxMes, null, 2)
			}
		</pre>
        <thead className={bgTotal}>
          <tr>
            <th className="text-white fs-2">MES</th>
            {mesesSeleccionadosNums.map(mesNum => (
              <th key={mesNum} className="text-white text-center p-1 fs-2">
                {mesesNombres[mesNum - 1]}
              </th>
            ))}
            <th className={`${bgTotal} text-white text-center p-1 fs-1`}>TOTAL</th>
            <th className="text-white text-center p-1 fs-1">%</th>
          </tr>
        </thead>
        <tbody>
			
          <tr>
            <td className={`fw-bold fs-2 `} style={{color: `${bgMultiValue}`}}>VENTAS</td>
			{mesesSeleccionadosNums.map(mesNum => {
				const montoMes = dataVentasxMes.find(e=>Number(e.mesNumero)===mesNum)
				
				return(
					<td
						key={mesNum}
						className=" fw-bolder fs-2 "
						
					>
						<div  className='bg-porsiaca text-right'>
							<NumberFormatMoney amount={montoMes?.detalle_total_productos_18+montoMes?.detalle_total_productos_17+montoMes?.detalletotal_membresia+montoMes?.detalle_total_ingextraordCHANGE} />
						</div>
					</td>
				)
			}
			)}
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
              		<NumberFormatMoney amount={totalMembresias+
											totalProductos17+
											totalProductos18+
											totalIngresoExtraord} />
				</div>
            </td>
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
					100
				</div>
			</td>
          </tr>
          <tr>
            <td className={`fw-bold fs-2`}>
				<div style={{color: `${bgMultiValue}`}}>
					TOTAL GASTOS
				</div>
			</td>
            {mesesSeleccionadosNums.map(mesNum => (
              <td key={mesNum} className="text-center fs-2 fw-bold">
				<div className={`bg-porsiaca text-right px-2`} onClick={()=>onViewMoved(dataGastosxANIO, mesNum, 'TOTALES', '')}>
                	<NumberFormatMoney amount={totalPorMes[mesNum - 1]-prestamosGroup.mesesSuma[mesNum - 1]-gruposSinPrestamos.find(e=>e.grupo==='COMPRA PRODUCTOS/ACTIVOS')?.mesesSuma[mesNum - 1]} />
				</div>
              </td>
            ))}
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
              		<NumberFormatMoney amount={totalGeneral-prestamosGroup.totalAnual-117406.70} />
				</div>
            </td>
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
					100
				</div>
			</td>
          </tr>

          <tr>
            <td className={`fw-bold fs-2 `} style={{color: `${bgMultiValue}`}}>TOTAL ACTIVOS</td>
            {mesesSeleccionadosNums.map(mesNum => (
              <td key={mesNum} className="text-center fs-2 fw-bold">
				<div className={`bg-porsiaca text-right px-2 `} onClick={()=>onViewMoved(dataGastosxANIO, mesNum, 'TOTALES', '')}>
                	<NumberFormatMoney amount={gruposSinPrestamos.find(e=>e.grupo==='COMPRA PRODUCTOS/ACTIVOS')?.mesesSuma[mesNum - 1]} />
				</div>
              </td>
            ))}
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
              		<NumberFormatMoney amount={117406.70} />
				</div>
            </td>
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
					100
				</div>
			</td>
          </tr>
		  
		  
          <tr >
            <td className={`fw-bold fs-2`}>
				<div className='text-black'>
					TOTAL
				</div>
			</td>
            {mesesSeleccionadosNums.map(mesNum => {
				const montoMes = dataVentasxMes.find(e=>Number(e.mesNumero)===mesNum)
				const Utilidad = utilidad( montoMes?.detalle_total_productos_18+montoMes?.detalle_total_productos_17+montoMes?.detalletotal_membresia+montoMes?.detalle_total_ingextraordCHANGE, totalPorMes[mesNum - 1]-prestamosGroup.mesesSuma[mesNum - 1])
				return (
				  <td key={mesNum} className="text-center fs-2 fw-bold">
					<div className={`bg-porsiaca text-right  px-2 ${Utilidad.espositivo?'text-ISESAC':'text-change'}`} onClick={()=>onViewMoved(dataGastosxANIO, mesNum, 'TOTALES', '')}>
						{Utilidad.espositivo?'+':''}<NumberFormatMoney amount={Utilidad.utilidad} />
					</div>
				  </td>
				)
			}
			
		)
			}
            <td className="text-center fw-bolder fs-1">
				<div className={`bg-porsiaca text-right ${utilidad( totalMembresias+
						totalProductos17+
						totalProductos18+
						totalIngresoExtraord,totalGeneral-prestamosGroup.totalAnual).espositivo?'text-ISESAC':'text-white'}`}>
              		{utilidad( totalMembresias+
						totalProductos17+
						totalProductos18+
						totalIngresoExtraord,totalGeneral-prestamosGroup.totalAnual).espositivo?'+':''}<NumberFormatMoney amount={utilidad( totalMembresias+
						totalProductos17+
						totalProductos18+
						totalIngresoExtraord,totalGeneral-prestamosGroup.totalAnual).utilidad} />
				</div>
            </td>
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
					100
				</div>
			</td>
          </tr>
        </tbody>
      				</Table>
				</div>
  )
}

function utilidad(montoIngreso, montoEgreso) {
	const utilidad = !montoIngreso?-montoEgreso:montoIngreso-montoEgreso;

	return {
		utilidad,
		espositivo: montoIngreso>montoEgreso
	}
}