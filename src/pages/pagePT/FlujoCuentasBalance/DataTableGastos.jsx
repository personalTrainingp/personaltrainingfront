import React, { useEffect, useState, useMemo } from 'react'
import Select from 'react-select'; // <-- importar react-select
import { useFlujoCajaStore } from './hook/useFlujoCajaStore'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalDetallexCelda } from './ModalDetallexCelda'
import { useDispatch } from 'react-redux'
import { onSetViewSubTitle } from '@/store'
import { onSetRangeDate } from '@/store/data/dataSlice'
import { useGastosCIRCUSYSE } from './hook/useGastosCIRCUSYSE'

export const DataTableGastos = ({ 	id_enterprice,
	anio,
	nombre_empresa,
	background,
	arrayRangeDate,
	bgMultiValue,
	bgTotal }) => {
  const [dataModal, setDataModal] = useState(null)
  const [isOpenModalDetallexCelda, setIsOpenModalDetallexCelda] = useState(false)
  const { obtenerGastosxANIO, dataGastosxANIO } = useFlujoCajaStore()
  const { obtenerGastosxANIOCIRCUSYSE:obtenerGastosCIRCUSYANIO, dataGasto:dataGastosCIRCUSYANIO } = useGastosCIRCUSYSE()
  const dispatch = useDispatch()

  // Nombres de los meses (índices 0–11)
  const mesesNombres = useMemo(
    () => [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ],
    []
  )

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
  // Cargar datos al cambiar empresa o año
  useEffect(() => {
    obtenerGastosCIRCUSYANIO()
    obtenerGastosxANIO(anio, id_enterprice)
  }, [anio, id_enterprice])
  
  // Actualizar subtítulo cuando cambie la empresa
  useEffect(() => {
    dispatch(onSetViewSubTitle(nombre_empresa))
    dispatch(
      onSetRangeDate(arrayRangeDate))
  }, [nombre_empresa])

  // 6) Calcular totales por grupo (sumando cada sub-item en vez de usar monto_total)
  const totalesPorGrupo = useMemo(() => {
    return dataGastosCIRCUSYANIO.map((g) => {
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
  }, [dataGastosCIRCUSYANIO]);
  // justo después de tu useMemo que calcula totalPorMes y totalGeneral
    const prestamosGroup = totalesPorGrupo.find(
    (g) => g.grupo.toUpperCase() === 'PRESTAMOS'
    ) || { mesesSuma: Array(12).fill(0), totalAnual: 0 };
  // 1) Prepara el array sin “PRESTAMOS”
  const gruposSinPrestamos = totalesPorGrupo.filter(
  (g) => g.grupo.toUpperCase() !== 'PRESTAMOS'
  );

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

  const widthHeadergrupos = 150;
  const backgroundMultiValue = bgMultiValue;
  const onViewMoved = (e, met)=>{
    const items = e.conceptos[1].items[met - 1].items
    onOpenModalDetallexCelda({
                                items,
                                concepto: 'TODOS',
                                grupo: 'PRESTAMOS',
                              })
  }

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
                    <div className="p-1 rounded rounded-3" style={{ width: 350 }}>
                      {grp.grupo === 'ATENCIÓN AL CLIENTE' ? (
                        <>
                          {i + 1}. ATENCION AL <span className="ml-5">CLIENTE</span>
                        </>
                      )  : grp.grupo === 'PRESTAMOS' ? (
                        <span className='text-danger'>PRESTAMOS</span>
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
                    <tr key={c.concepto} className={c.concepto.toUpperCase().includes("AMBOS")? '':c.concepto.toUpperCase().includes("SANEX")? 'bg-greenISESAC':'bg-circus'}>
                      <td className="fw-bold fs-2">
                        {idx + 1}. {c.concepto}
                      </td>
                      {mesesSeleccionadosNums.map(mesNum => {
                        const itemMes = c.items.find(it => it.mes === mesNum) || { monto_total: 0, mes: mesNum };
                        return (
                          <td key={mesNum} className="text-center fs-1">
                            <div
                              className="cursor-text-primary fs-2 bg-porsiaca text-right"
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
                        className={`${bgTotal} text-center fw-bold fs-1`}
                        onClick={() => onOpenModalDetallexCelda({
                          concepto: c.concepto,
                          grupo: grp.grupo,
                          mes: null,
                          monto_total: totalConcepto,
                        })}
                      >
						<div className='bg-porsiaca text-right'>
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
					console.log({grp});
					
						const montoMes = grp.mesesSuma[mesNum - 1];
												// 2) porcentaje del total del grupo en este mes sobre el total general de ese mes
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
                  <td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right'>
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
												// 2) porcentaje del total del grupo en este mes sobre el total general de ese mes
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
														<div style={{ width: 150 }} className='bg-porsiaca text-right'>
															{pctMesGrupo}
														</div>
													</td>
												);
											})}
                  <td className="fw-bolder fs-2" >
                  </td>
                  <td className="fw-bolder fs-1" >
					<div className='bg-porsiaca text-right'>
						100
					</div>
                  </td>
                </tr>
                <tr className={`${bgTotal}`}>
					<td className="fw-bolder fs-1" colSpan={selectedMonths.length+1}>
						<span className='fs-1 mr-3'>%</span> PROMEDIO DE REPRESENTACIÓN ACUMULADA VS. TODOS LOS RUBROS
                  	</td>
					<td className="fw-bolder fs-1">
						<div className='bg-porsiaca text-right fs-1'>
							{sumaTotalAnualGrupos > 0
                        ? ((grp.totalAnual / sumaTotalAnualGrupos) * 100).toFixed(2)
                        : '0.00'}%
						</div>
                  	</td>
					<td>
					</td>
                </tr>
                <tr>
					<td className="fw-bolder fs-2" colSpan={selectedMonths.length+1}>
						<div className='bg-danger opacity-0'>
asdf
						</div>
					</td>
                </tr>
              </tbody>
            </React.Fragment>
          );
        })}

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
				<div className='bg-porsiaca text-right'>
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
			{/* NUEVA fila de TOTAL PRESTAMOS */}
			<tr className={`bg-azulfuerte`}>
				<td className="fw-bold fs-2">TOTAL PRESTAMOS</td>
				{mesesSeleccionadosNums.map((mesNum) => (
				<td key={mesNum} className="text-center fs-1 fw-bold">
					<div className='bg-porsiaca text-right' onClick={()=>onViewMoved(prestamosGroup, mesNum)}>
						<NumberFormatMoney amount={prestamosGroup.mesesSuma[mesNum - 1]} />
					</div>
				</td>
				))}
				<td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right'>
						<NumberFormatMoney amount={prestamosGroup.totalAnual} />
					</div>
				</td>
				<td className="text-center fw-bolder fs-1">
					<div className='bg-porsiaca text-right'>
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
  )
}
