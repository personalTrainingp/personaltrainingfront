import React, { useEffect, useState, useMemo } from 'react';
import Select from 'react-select'; // <-- importar react-select
import { useFlujoCajaStore } from './hook/useFlujoCajaStore';
import { Table } from 'react-bootstrap';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { ModalDetallexCelda } from './ModalDetallexCelda';
import { useDispatch } from 'react-redux';
import { onSetColorView, onSetViewSubTitle } from '@/store';
import { onSetRangeDate } from '@/store/data/dataSlice';

export const DatatableEgresos = ({
	id_enterprice,
	anio,
	nombre_empresa,
	background,
	arrayRangeDate,
	bgMultiValue,
	bgTotal
}) => {
	const [dataModal, setDataModal] = useState(null);
	const [isOpenModalDetallexCelda, setIsOpenModalDetallexCelda] = useState(false);
	const { obtenerGastosxANIO, dataGastosxANIO, dataNoPagos } = useFlujoCajaStore();
	const dispatch = useDispatch();
	
	// 1) Nombres de los meses (índices 0–11)
	const mesesNombres = useMemo(
		() => [
			'ENERO',
			'FEBRERO',
			'MARZO',
			'ABRIL',
			'MAYO',
			'JUNIO',
			'JULIO',
			'AGOSTO',
			'SEPTIEMB.',
			'OCTUBRE',
			'NOVIEMB.',
			'DICIEMBRE',
		],
		[]
	);

	// 2) Crear opciones para react-select (value=1..12, label=“ENERO” etc)
	const monthOptions = useMemo(
		() =>
			mesesNombres.map((nombre, idx) => ({
				value: idx + 1,
				label: nombre,
			})),
		[mesesNombres]
	);

	// 3) Estado local para los meses seleccionados (inicialmente, todos)
	const [selectedMonths, setSelectedMonths] = useState(() => {
  // intenta leer un array de valores [1,2,3...]
  const stored = localStorage.getItem('selectedMonths')
  if (stored) {
    const vals = JSON.parse(stored)
    // reconstruye el array de opciones a partir de los valores guardados
    return monthOptions.filter(opt => vals.includes(opt.value))
  }
  // si no hay nada en storage, selecciona todos por defecto
  return monthOptions
});
// 4) Persiste en localStorage cada vez que cambie la selección
useEffect(() => {
  const vals = selectedMonths.map(opt => opt.value)
  localStorage.setItem('selectedMonths', JSON.stringify(vals))
}, [selectedMonths])
	// 4) Cada vez que cambia empresa o año, recargar datos
	useEffect(() => {
		obtenerGastosxANIO(anio, id_enterprice);
		// obtenerVentasxANIO(anio, id_enterprice)
	}, [anio, id_enterprice]);

	// 5) Al cambiar nombre_empresa, actualizar subtítulo y rango de fechas
	useEffect(() => {
		dispatch(onSetViewSubTitle(nombre_empresa));
		dispatch(onSetColorView(bgMultiValue));
		dispatch(onSetRangeDate(arrayRangeDate));
	}, [nombre_empresa]);

	// 6) Calcular totales por grupo (sumando cada sub-item en vez de usar monto_total)
	const totalesPorGrupo = useMemo(() => {
		return dataGastosxANIO.map((g) => {
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
	}, [dataGastosxANIO]);

	
	
	// justo después de tu useMemo que calcula totalPorMes y totalGeneral
		const prestamosGroup = totalesPorGrupo.find(
		(g) => g.grupo.toUpperCase() === 'PRESTAMOS'
		) || { mesesSuma: Array(12).fill(0), totalAnual: 0 };
	// 1) Prepara el array sin “PRESTAMOS”
	const gruposSinPrestamos = totalesPorGrupo.filter(
	(g) => g.grupo.toUpperCase() !== 'PRESTAMOS'
	);
	const gruposNPagos = totalesGrupo(dataNoPagos)
	console.log({dataNoPagos, nPagos: totalesGrupo(dataNoPagos)});
	// 7) Calcular totales generales por mes para la última fila (sumando cada gasto en items)
	const { totalPorMes, totalGeneral } = useMemo(() => {
		// otro array de 12 meses en cero
		const totales = Array.from({ length: 12 }, () => 0);

		dataGastosxANIO.forEach((grupo) => {
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
	}, [dataGastosxANIO]);

	const { totalPorMes:totalesNpagos, totalGeneral: totalgeneralNpagos}= totalGeneralYsumaTotal(dataNoPagos)

	
	// 8) Funciones para abrir/cerrar el modal
	const onCloseModalDetallexCelda = () => {
		setIsOpenModalDetallexCelda(false);
		setDataModal(null);
	};
	const onOpenModalDetallexCelda = (itemDetail) => {
		setDataModal(itemDetail);
		setIsOpenModalDetallexCelda(true);
	};
	const mesesSeleccionadosNums = useMemo(
		() => selectedMonths.map((opt) => opt.value),
		[selectedMonths]
	);

	const backgroundMultiValue = bgMultiValue;
	const onViewMoved = (e, met, concepto, grupo)=>{
		const items = unirPorMes(e.flatMap(f=>f.conceptos))[met - 1].items
		onOpenModalDetallexCelda({
                                items,
                                concepto,
                                grupo,
                              })
	}
	
	// const cuentasPorPagar = [0, 0, 0, 0, 1500, 13000, 0, 0, 0, 0, 0, 0]; // tu array fijo
	const prestamosPorPagar = [0, 0, 6700, 2000, 4100, 2000, 0, 0, 0, 0, 0, 0]; // tu array fijo
	const RalprestamosPorPagar = [0, 0, 6700, 2000, 4100, 2000, 0, 0, 0, 0, 0, 0]; // tu array fijo
	return (
		<>{/* === MULTI‐SELECT PARA ELEGIR MESES === */}
				<div style={{ marginBottom: '1rem', width: '95vw' }}>
					<Select
						options={monthOptions}
						isMulti
						closeMenuOnSelect={false}
						hideSelectedOptions={false}
						value={selectedMonths}
						onChange={setSelectedMonths}
						placeholder="Selecciona uno o varios meses..."
						styles={{
							control: (provided) => ({
								...provided,
								fontSize: '1.9rem',
								color: 'white',
							}),
							menuList: (provided, state) => ({
								...provided,
								padding: '12px 16px', // Espaciado interno para que cada opción sea más “alta”
							}),
							// Contenedor de las etiquetas seleccionadas ("pills")
							multiValue: (provided) => ({
								...provided,
								backgroundColor: backgroundMultiValue, // fondo rojo para cada etiqueta
								color: 'white',
							}),
							// Texto dentro de cada pill
							multiValueLabel: (provided) => ({
								...provided,
								color: 'white', // texto blanco sobre rojo
								fontSize: '1.45vw',
							}),
						}}
					/>
				</div>
			<div>
				{/* === TABLA ÚNICA CON TODOS LOS GRUPOS Y LA SUMA GENERAL === */}
				<div className="table-responsive" style={{ width: '95vw' }}>
					<Table>
        {/* Definición de columnas: la última columna (TOTAL) en verde */}
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
              <thead className={background}>
                <tr>
					<th className="text-black fs-1">
						<div
							className="p-1 rounded rounded-3"
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

                  <th className={`${bgTotal} text-white text-center p-1 fs-1`}>
                    TOTAL
                  </th>
                  <th className="text-white text-center p-1 fs-1">
                    %
                  </th>
                </tr>
              </thead>

              <tbody>
                {grp.conceptos.map((c, idx) => {
					console.log({c});
					
                  const totalConcepto = c.items.reduce(
                    (sum, it) => sum + (it.monto_total || 0),
                    0
                  );
                  const pctConcepto = grp.totalAnual > 0
                    ? ((totalConcepto / grp.totalAnual) * 100).toFixed(2)
                    : '0.00';

                  return (
                    <tr key={c.concepto}>
                      <td className="fw-bold fs-2">
                        {idx + 1}. {c.concepto}
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

                <tr className={`${bgTotal}`}>
                  <td className="fw-bolder fs-1">TOTAL</td>
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
														className="text-center fw-bolder fs-1"
													>
														<div style={{ width: 150 }} className='bg-porsiaca text-right'>
															<NumberFormatMoney amount={montoMes} />
														</div>
													</td>
					  )
				  }
				  )}
                  <td className="text-center fw-bolder">
					<div className='bg-porsiaca text-right' style={{fontSize: '40px'}}>
                    	<NumberFormatMoney amount={grp.totalAnual} />
					</div>
                  </td>
                  <td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right'>
				  		100
					</div>
				  </td>
                </tr>

                <tr>
                  <td className="fw-bolder fs-2" >
                    <span className='fs-1 mr-3'>%</span> POR MES {grp.grupo}
                  </td>
				  {mesesSeleccionadosNums.map((mesNum) => {
												const montoMes = grp.mesesSuma[mesNum - 1];
												const baseMes = totalPorMes[mesNum - 1] || 0;
												const pctMesGrupo =
													baseMes > 0
														? ((montoMes / baseMes) * 100).toFixed(2)
														: '0.00';
												return (
													<td
														key={mesNum}
														className="text-center fw-bolder fs-1"
													>
														<div style={{ width: 150 }} className='text-right'>
															{pctMesGrupo}%
														</div>
													</td>
												);
											})}
                  <td className="fw-bolder fs-2" >
                  </td>
                  <td className="fw-bolder fs-1" >
					<div className='bg-porsiaca text-right'>
					</div>
                  </td>
                </tr>
                <tr className={`${bgTotal}`}>
					<td className="fw-bolder fs-1" colSpan={selectedMonths.length}>
						<span className='fs-1 mr-3'>%</span> PROMEDIO DE REPRESENTACIÓN ACUMULADA VS. TODOS LOS RUBROS
                  	</td>
					<td className="fw-bolder">
						<div className='text-right' style={{ width: 150, fontSize: '45px' }}>
							{sumaTotalAnualGrupos > 0
                        ? ((grp.totalAnual / sumaTotalAnualGrupos) * 100).toFixed(2)
                        : '0.00'}%
						</div>
                  	</td>
					<td className="fw-bolder fs-1">
                  	</td>
					<td>
					</td>
                </tr>
                <tr>
					<td className="fw-bolder fs-2" colSpan={selectedMonths.length+1}>
						<div>
							NOTA: TODOS LOS PAGOS QUE FIGURAN AQUI, ESTAN HECHOS EN BASE A LA FECHA DE PROVISION
						</div>
					</td>
                </tr>
              </tbody>
            </React.Fragment>
          );
        })}
		{/* VENTAS */}
        {/* {dataVentas?.map((grp, i, arr) => {
          const sumaTotalAnualGrupos = dataVentas.reduce(
            (acc, g) => acc + g.totalAnual,
            0
          );
		  
          return (
            <React.Fragment key={grp.grupo}>
              <thead className={background}>
                <tr>
					<th className="text-black fs-1">
						<div
							className="p-1 rounded rounded-3"
							style={{
							width: 450,
							hyphens: 'auto',
							wordBreak: 'break-word',
							overflowWrap: 'break-word',
							whiteSpace: 'normal',
							lineHeight: '1.2',
							}}
							lang="es"
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

                  <th className={`${bgTotal} text-white text-center p-1 fs-1`}>
                    TOTAL
                  </th>
                  <th className="text-white text-center p-1 fs-1">
                    %
                  </th>
                </tr>
              </thead>

              <tbody>
                {grp.conceptos.map((c, idx) => {
					
                  const totalConcepto = c.items.reduce(
                    (sum, it) => sum + (it.monto_total || 0),
                    0
                  );
                  const pctConcepto = grp.totalAnual > 0
                    ? ((totalConcepto / grp.totalAnual) * 100).toFixed(2)
                    : '0.00';

                  return (
                    <tr key={c.concepto}>
                      <td className="fw-bold fs-2">
                        {idx + 1}. {c.concepto}
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
						<div className={`bg-porsiaca text-right ${totalConcepto<=0?'':'fw-bold'}`} style={{fontSize: '40px'}}>
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

                <tr className={`${bgTotal}`}>
                  <td className="fw-bolder fs-1">TOTAL</td>
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
														className="text-center fw-bolder fs-1"
													>
														<div style={{ width: 150 }} className='bg-porsiaca text-right'>
															<NumberFormatMoney amount={montoMes} />
														</div>
													</td>
					  )
				  }
				  )}
                  <td className="text-center fw-bolder">
					<div className='bg-porsiaca text-right' style={{fontSize: '40px'}}>
                    	<NumberFormatMoney amount={grp.totalAnual} />
					</div>
                  </td>
                  <td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right'>
				  		100
					</div>
				  </td>
                </tr>

                <tr>
                  <td className="fw-bolder fs-2" >
                    <span className='fs-1 mr-3'>%</span> POR MES {grp.grupo}
                  </td>
				  {mesesSeleccionadosNums.map((mesNum) => {
												const montoMes = grp.mesesSuma[mesNum - 1];
												const baseMes = totalPorMes[mesNum - 1] || 0;
												const pctMesGrupo =
													baseMes > 0
														? ((montoMes / baseMes) * 100).toFixed(2)
														: '0.00';
												return (
													<td
														key={mesNum}
														className="text-center fw-bolder fs-1"
													>
														<div style={{ width: 150 }} className='text-right'>
															{pctMesGrupo}%
														</div>
													</td>
												);
											})}
                  <td className="fw-bolder fs-2" >
                  </td>
                  <td className="fw-bolder fs-1" >
					<div className='bg-porsiaca text-right'>
					</div>
                  </td>
                </tr>
                <tr className={`${bgTotal}`}>
					<td className="fw-bolder fs-1" colSpan={selectedMonths.length}>
						<span className='fs-1 mr-3'>%</span> PROMEDIO DE REPRESENTACIÓN ACUMULADA VS. TODOS LOS RUBROS
                  	</td>
					<td className="fw-bolder">
						<div className='text-right' style={{ width: 150, fontSize: '45px' }}>
							{sumaTotalAnualGrupos > 0
                        ? ((grp.totalAnual / sumaTotalAnualGrupos) * 100).toFixed(2)
                        : '0.00'}%
						</div>
                  	</td>
					<td className="fw-bolder fs-1">
                  	</td>
					<td>
					</td>
                </tr>
                <tr>
					<td className="fw-bolder fs-2" colSpan={selectedMonths.length+1}>
						<div>
							NOTA: TODOS LOS PAGOS QUE FIGURAN AQUI, ESTAN HECHOS EN BASE A LA FECHA DE PROVISION
						</div>
					</td>
                </tr>
              </tbody>
            </React.Fragment>
          );
        })} */}
		{/* TOTALES */}
        <thead className={background}>
          <tr>
            <th className="text-black fs-2">MES</th>
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
          <tr className={`${bgTotal}`}>
            <td className="fw-bold fs-2">TOTAL EGRESOS</td>
            {mesesSeleccionadosNums.map(mesNum => (
              <td key={mesNum} className="text-center fs-1 fw-bold">
				<div className='bg-porsiaca text-right' onClick={()=>onViewMoved(dataGastosxANIO, mesNum, 'TOTALES', '')}>
                	<NumberFormatMoney amount={totalPorMes[mesNum - 1]-prestamosGroup.mesesSuma[mesNum - 1]} />
				</div>
              </td>
            ))}
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right'>
              		<NumberFormatMoney amount={totalGeneral-prestamosGroup.totalAnual} />
				</div>
            </td>
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right'>
					100
				</div>
			</td>
          </tr>
          <tr className={`bg-white text-change`}>
            <td className="fw-bold fs-2 text-change">
				<div className='text-change'>
					CUENTAS POR PAGAR
				</div>
			</td>
            {mesesSeleccionadosNums.map(mesNum => (
              <td key={mesNum} className="text-center fs-1 fw-bold">
				<div className='bg-porsiaca text-right text-change' onClick={()=>onViewMoved(dataNoPagos, mesNum, 'CUENTAS POR PAGAR', '')}>
                	<NumberFormatMoney amount={totalesNpagos[mesNum - 1] || 0} />
				</div>
              </td>
            ))}
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-change'>
              		<NumberFormatMoney amount={totalgeneralNpagos} />
				</div>
            </td>
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-change'>
					100
				</div>
			</td>
          </tr>
			{/* NUEVA fila de TOTAL PRESTAMOS */}
			<tr className={`bg-celeste`}>
				<td className="fw-bold fs-2">
					<div className='text-black'>
						PRESTAMOS RAL
					</div>
				</td>
				{mesesSeleccionadosNums.map((mesNum) => (
				<td key={mesNum} className="text-center fs-1 fw-bold">
					<div className='bg-porsiaca text-right text-black' onClick={()=>onViewMoved(prestamosGroup, mesNum)}>
						<NumberFormatMoney amount={prestamosGroup.mesesSuma[mesNum - 1]} />
					</div>
				</td>
				))}
				<td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right text-black'>
						<NumberFormatMoney amount={totalGeneral-prestamosGroup.totalAnual} />
					</div>
				</td>
				<td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right text-black'>
						{totalGeneral > 0
							? ((prestamosGroup.totalAnual / totalGeneral) * 100).toFixed(2)
							: '0.00'}
					</div>
				</td>
			</tr>
			{/* NUEVA fila de TOTAL PRESTAMOS */}
			<tr className={`bg-verdeclaro`}>
				<td className="fw-bold fs-2">
					<div className='text-black'>
						DEVOLUCION PRESTAMOS A RAL
					</div>
				</td>
				{mesesSeleccionadosNums.map((mesNum) => (
				<td key={mesNum} className="text-center fs-1 fw-bold">
					<div className='bg-porsiaca text-right text-black' onClick={()=>onViewMoved(prestamosGroup, mesNum)}>
						<NumberFormatMoney amount={prestamosPorPagar[mesNum - 1] || 0} />
					</div>
				</td>
				))}
				<td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right text-black'>
						<NumberFormatMoney amount={prestamosPorPagar.reduce((a, b) => a + b, 0)} />
					</div>
				</td>
				<td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right text-black'>
						{totalGeneral > 0
							? ((prestamosGroup.totalAnual / totalGeneral) * 100).toFixed(2)
							: '0.00'}
					</div>
				</td>
			</tr>
			{/* NUEVA fila de TOTAL PRESTAMOS */}
			<tr className={`bg-celeste`}>
				<td className="fw-bold fs-2">
					<div className='text-change'>
						SALDO DEUDA A RAL
					</div>
				</td>
				{mesesSeleccionadosNums.map((mesNum) => (
				<td key={mesNum} className="text-center fs-1 fw-bold">
					<div className='bg-porsiaca text-right text-change' onClick={()=>onViewMoved(prestamosGroup, mesNum)}>
						<NumberFormatMoney amount={prestamosPorPagar[mesNum - 1] || 0} />
					</div>
				</td>
				))}
				<td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right text-change'>
						<NumberFormatMoney amount={prestamosPorPagar.reduce((a, b) => a + b, 0)} />
					</div>
				</td>
				<td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right text-change'>
						{totalGeneral > 0
							? ((prestamosGroup.totalAnual / totalGeneral) * 100).toFixed(2)
							: '0.00'}
					</div>
				</td>
			</tr>
        </tbody>
      				</Table>
				</div>
			</div>

			<ModalDetallexCelda
				data={dataModal}
				onHide={onCloseModalDetallexCelda}
				obtenerGastosxANIO={obtenerGastosxANIO}
				show={isOpenModalDetallexCelda}
				id_enterprice={id_enterprice}
				anio={anio}
				bgEmpresa={background}
			/>
		</>
	);
};


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