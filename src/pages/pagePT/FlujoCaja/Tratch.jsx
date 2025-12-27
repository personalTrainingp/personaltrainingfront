
function unirPorMes(data) {
  const resultado = [];

  data.forEach(({ items }) => {
    items.forEach(({ mes, monto_total, items: subitems }) => {
      let existente = resultado.find(r => r.mes === mes);
      if (!existente) {
        existente = { mes, monto_total: 0, items: [] };
        resultado.push(existente);
      }
      existente.monto_total += monto_total;
      existente.items.push(...subitems);
    });
  });

  return resultado;
}
function totalesGrupo(dataGastoXgrpxconcepto) {
	return useMemo(() => {
		return dataGastoXgrpxconcepto.map((g) => {
			// inicializamos un array de 12 meses en cero
			const mesesSuma = Array.from({ length: 12 }, () => 0);

			g.conceptos.forEach((concepto) => {
				concepto.items.forEach(({ mes, items }) => {
					// items aquí es el array de gastos de ese mes; sumamos cada gasto[i].monto (o el campo que corresponda)
					const sumaDelMes = items.reduce((acc, gasto) => {
						return acc + (gasto.monto*gasto.tc || 0);
					}, 0);
					mesesSuma[mes - 1] += sumaDelMes;
				});
			});

			const totalAnual = mesesSuma.reduce((sum, m) => sum + m, 0);
			return {
				grupo: g.grupo,
				mesesSuma,
				totalAnual,
				conceptos: g.conceptos,
			};
		});
	}, [dataGastoXgrpxconcepto]);
	
}

function totalGeneralYsumaTotal(dataGasto) {
		const { totalPorMes, totalGeneral } = useMemo(() => {
		// otro array de 12 meses en cero
		const totales = Array.from({ length: 12 }, () => 0);

		dataGasto.forEach((grupo) => {
			grupo.conceptos.forEach((concepto) => {
				concepto.items.forEach(({ mes, items }) => {
					// sumamos aquí cada gasto.monto dentro de items
					const sumaDelMes = items.reduce((acc, gasto) => {
						return acc + (gasto.monto || 0);
					}, 0);
					totales[mes - 1] += sumaDelMes;
				});
			});
		});

		const sumaAnual = totales.reduce((acc, v) => acc + v, 0);
		return { totalPorMes: totales, totalGeneral: sumaAnual };
	}, [dataGasto]);
	return {
		totalPorMes,
		totalGeneral
	}
}

const a=()=>{
	return (
		<>
		
										{mesesSeleccionadosNums.map(mesNum => {
										const itemMes = c.items.find(it => it.mes === mesNum) || { monto_total: 0, mes: mesNum };
										return (
											<td key={mesNum} className="text-center fs-1">
												<div
													className={`cursor-text-primary fs-2 bg-porsiaca text-right ${itemMes.monto_total<=0?'':'fw-bold'}`}
													style={{ width: 150 }}
													// onClick={() => onOpenModalDetallexCelda({
													// ...itemMes,
													// concepto: c.concepto,
													// grupo: grp.grupo,
													// })}
												>
													<NumberFormatMoney amount={itemMes.monto_total} />
												</div>
											</td>
										);
										})}
										<td
										className={`${bgTotal} text-center fw-bold`}
										>
										<div className='bg-porsiaca text-right' style={{fontSize: '40px'}}>
											<NumberFormatMoney amount={totalConcepto} />
										</div>
										</td>
										<td className={`${bgTotal} text-center fw-bold fs-1`}
										>
											<div className='bg-porsiaca text-right'>
												{pctConcepto}
											</div>
										</td>
		</>
	)
}

const b=()=>{
	return (
		<>
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
                	{/* <NumberFormatMoney amount={totalPorMes[mesNum - 1]-prestamosGroup.mesesSuma[mesNum - 1]-gruposSinPrestamos.find(e=>e.grupo==='COMPRA PRODUCTOS/ACTIVOS')?.mesesSuma[mesNum - 1]} /> */}
                	<NumberFormatMoney amount={totalPorMes[mesNum - 1]-gruposSinPrestamos.find(e=>e.grupo==='COMPRA PRODUCTOS/ACTIVOS')?.mesesSuma[mesNum - 1]} />
				</div>
              </td>
            ))}
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
              		<NumberFormatMoney amount={totalGeneral-117406.70} />
              		{/* <NumberFormatMoney amount={totalGeneral-prestamosGroup.totalAnual-117406.70} /> */}
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
				const Utilidad = utilidad( montoMes?.detalle_total_productos_18+montoMes?.detalle_total_productos_17+montoMes?.detalletotal_membresia+montoMes?.detalle_total_ingextraordCHANGE, totalPorMes[mesNum - 1])
				// const Utilidad = utilidad( montoMes?.detalle_total_productos_18+montoMes?.detalle_total_productos_17+montoMes?.detalletotal_membresia+montoMes?.detalle_total_ingextraordCHANGE, totalPorMes[mesNum - 1]-prestamosGroup.mesesSuma[mesNum - 1])
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
						totalIngresoExtraord,totalGeneral-prestamosGroup?.totalAnual).espositivo?'text-ISESAC':'text-white'}`}>
              		{utilidad( totalMembresias+
						totalProductos17+
						totalProductos18+
						totalIngresoExtraord,totalGeneral-prestamosGroup?.totalAnual).espositivo?'+':''}<NumberFormatMoney amount={utilidad( totalMembresias+
						totalProductos17+
						totalProductos18+
						totalIngresoExtraord,totalGeneral-prestamosGroup?.totalAnual).utilidad} />
				</div>
            </td>
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
					100
				</div>
			</td>
          </tr>
        </tbody>
		</>
	)
}