import React, { useEffect, useMemo, useState } from 'react'
import { useReportePuntoEquilibrioStore } from './useReportePuntoEquilibrioStore'
import { Col, Row, Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalConceptos } from './ModalConceptos'
import dayjs from 'dayjs'
import { FechaRangeMES } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'

export const EmpresaPuntoEquilibrio = ({id_empresa,  background, textEmpresa, bgHEX}) => {
  const { obtenerGastosxFecha, dataGastos, dataPrestamos } = useReportePuntoEquilibrioStore()
      const { RANGE_DATE, dataView } = useSelector(e=>e.DATA)
  useEffect(() => {
    obtenerGastosxFecha(RANGE_DATE, id_empresa)
  }, [id_empresa, RANGE_DATE])
  console.log(dataGastos.find(gr=>gr.grupo==="RECURSOS HUMANOS")?.conceptos.find(con=>con.concepto==='PLANILLA')?.items, "rrr");
  const planillas = dataGastos.find(gr=>gr.grupo==="RECURSOS HUMANOS")?.conceptos.find(con=>con.concepto==='PLANILLA')?.items
    // 1) Calcula totales con useMemo
  const totalMontopen = useMemo(
    () => dataGastos.reduce((sum, g) => sum + (g.montopen || 0), 0),
    [dataGastos]
  );
  const totalMontousd = useMemo(
    () => dataGastos.reduce((sum, g) => sum + (g.montousd || 0), 0),
    [dataGastos]
  );
  const [dataProp, setdataProp] = useState({isView: false, data: []})
  const onOpenModalConceptos=(data)=>{
    setdataProp({isView: true, data: data.conceptos})
  }
  const onCloseModalConceptos=()=>{
    setdataProp({isView: false, data: []})
  }
  console.log({RANGE_DATE: dayjs(RANGE_DATE[0]).format('MMMM')});
  
  return (
		<div className="w-100">
              <FechaRangeMES rangoFechas={RANGE_DATE} textColor={`${bgHEX}`}/>
              <br/>
			<Row>
				<Col lg={6}>
					<Row>
						<Col lg={12}>
							<Table striped>
								<thead className={`${background}`}>
									<tr>
										<th className="text-white p-1" colSpan={2}>
											<div style={{ fontSize: '48px' }}>
												{dayjs(RANGE_DATE[0]).format('MMMM')}<span className="mx-4">EGRESOS</span> 2025
											</div>
										</th>
										<th className="text-white text-center p-1">
											<div style={{ fontSize: '50px' }}>S/.</div>
										</th>
										<th className="text-white text-center p-1">
											<div style={{ fontSize: '50px' }}>$</div>
										</th>
									</tr>
								</thead>
								<tbody>
									{dataGastos.map((g, index) => {
										return (
											<tr className={``}>
												<td
													className={`text-center fw-bolder fs-1 `}
													colSpan={2}
												>
													<div
														className={`bg-porsiaca text-left ${textEmpresa}`}
														onClick={() => onOpenModalConceptos(g)}
													>
														<span className="mr-4">{index + 1}</span>
														{g.grupo}
													</div>
												</td>
												<td
													className={`text-center ${g.montopen === 0 ? 'fw-light' : 'fw-bold'} fs-1`}
												>
													<div className="bg-porsiaca text-right mr-4">
														<NumberFormatMoney amount={g.montopen} />
													</div>
												</td>
												<td
													className={`text-center ${g.montousd === 0 ? 'fw-light' : 'fw-bold'} fs-1`}
												>
													<div
														className={`bg-porsiaca text-right   ${g.montousd !== 0 && 'text-ISESAC'}`}
													>
														<NumberFormatMoney amount={g.montousd} />
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
								<tfoot className={`${background}`}>
									<tr>
										<td
											colSpan={2}
											className="fw-bold text-start text-white"
											style={{ fontSize: '40px' }}
										>
											Total
										</td>
										<td
											className="fw-bold text-right"
											style={{ fontSize: '40px' }}
										>
                      <span className='text-change mr-4'>
											  <NumberFormatMoney amount={-totalMontopen} />
                      </span>
										</td>
										<td
											className="fw-bold text-right"
											style={{ fontSize: '40px' }}
										>
                      <span className='text-change'>
											  <NumberFormatMoney amount={-totalMontousd} />
                      </span>
										</td>
									</tr>
								</tfoot>
							</Table>
						</Col>
						<Col lg={12}>
							<TableRH
								background={background}
                RANGE_DATE={RANGE_DATE}
								data={dataPrestamos}
								textEmpresa={textEmpresa}
							/>
						</Col>
					</Row>
				</Col>
				<Col className='ml-8'>
					<Row>
						<Col lg={12} className="mb-5">
							<TableVentas 
                RANGE_DATE={RANGE_DATE}
              background={background} textEmpresa={textEmpresa} />
						</Col>
						<Col lg={12}>
							<TableDetalle
								background={background}
                RANGE_DATE={RANGE_DATE}
								totalEgresosPEN={totalMontopen}
								totalEgresosUSD={totalMontousd}
								textEmpresa={textEmpresa}
							/>
						</Col>
					</Row>
				</Col>
			</Row>
			<ModalConceptos
				background={background}
				textEmpresa={textEmpresa}
				onHide={onCloseModalConceptos}
				show={dataProp.isView}
				dataProp={dataProp.data}
			/>
		</div>
  );
}

const TableRH=({data, background, textEmpresa, RANGE_DATE})=>{
  return (
    <div>
        <Table striped>
          <thead className={`bg-azulfuerte`}>
            <tr>
              <th className="text-black fs-2"></th>
              <th className="text-white text-center p-1"><div style={{fontSize: '50px'}}> {dayjs(RANGE_DATE[0]).format('MMMM')}<span className='mx-4'>PRESTAMOS</span> 2025 </div></th>
              <th className="text-white text-center p-1"><div  style={{fontSize: '50px'}}>S/.</div></th>
              <th className="text-white text-center p-1"><div style={{fontSize: '50px'}}>$</div></th>
            </tr>
          </thead>
          <tbody>
            
            {
              data.map((g, index)=>{
                return (
                  <tr className={``}>
                    <td className="fw-bold fs-1">
                      <div className={`bg-porsiaca text-left text-azulfuerte`}>
                        {index+1}
                      </div>
                    
                      </td>
                    <td className={`text-center fw-bolder fs-1`}>
                      <div className={`bg-porsiaca text-left text-azulfuerte`}>
                        {/* {g.grupo} */}
                        PRESTAMOS RAL
                      </div>
                    </td>
                    <td className={`text-center ${g.montopen===0?'fw-light':'fw-bold'} fs-1`}>
                      <div className='bg-porsiaca text-right'>
                        <NumberFormatMoney amount={g.montopen}/>
                      </div>
                    </td>
                    <td className={`text-center ${g.montousd===0?'fw-light':'fw-bold'} fs-1`}>
                      <div className={`bg-porsiaca text-right  ${g.montousd!==0&&'text-ISESAC'}`}>
                        <NumberFormatMoney amount={g.montousd}/>
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
    </div>
  )
}


const TableVentas=({data, background, textEmpresa, RANGE_DATE})=>{
  return (
    <div>
        <Table striped>
          <thead className={`${background}`}>
            
            <tr>
              <th className="text-white p-1" colSpan={2}><div style={{fontSize: '48px'}}> {dayjs(RANGE_DATE[0]).format('MMMM')}<span className='mx-4'>VENTAS</span> 2025</div></th>
              <th className="text-white text-center p-1"><div  style={{fontSize: '50px'}}>S/.</div></th>
            </tr>
          </thead>
          <tbody>
            <tr className={``}>
              
                    <td className={`text-center fw-bolder fs-1`} colSpan={2}>
													<div
														className={`bg-porsiaca text-left ${textEmpresa}`}
														// onClick={() => onOpenModalConceptos(g)}
													>
														<span className="mr-4">{1}</span>
                              NUEVOS
													</div>
                    </td>
                    <td className={`text-center ${0===0?'fw-light':'fw-bold'} fs-1`}>
                      <div className={`bg-porsiaca text-right  ${0!==0&&'text-ISESAC'}`}>
                        <NumberFormatMoney amount={0}/>
                      </div>
                    </td>
                  </tr>
                  
            <tr className={``}>
                    <td className={`text-center fw-bolder fs-1`} colSpan={2}>
                      
													<div
														className={`bg-porsiaca text-left ${textEmpresa}`}
														// onClick={() => onOpenModalConceptos(g)}
													>
														<span className="mr-4">{2}</span>
                              RENOVACIONES
													</div>
                    </td>
                    <td className={`text-center ${0===0?'fw-light':'fw-bold'} fs-1`}>
                      <div className={`bg-porsiaca text-right  ${0!==0&&'text-ISESAC'}`}>
                        <NumberFormatMoney amount={0}/>
                      </div>
                    </td>
                  </tr>
                  
            <tr className={``}>
                    <td className={`text-center fw-bolder fs-1`} colSpan={2}>
                      
													<div
														className={`bg-porsiaca text-left ${textEmpresa}`}
														// onClick={() => onOpenModalConceptos(g)}
													>
														<span className="mr-4">{3}</span>
                              REINSCRIPCIONES
													</div>
                    </td>
                    <td className={`text-center ${0===0?'fw-light':'fw-bold'} fs-1`}>
                      <div className={`bg-porsiaca text-right  ${0!==0&&'text-ISESAC'}`}>
                        <NumberFormatMoney amount={0}/>
                      </div>
                    </td>
                  </tr>
            <tr className={``}>
                    <td className={`text-center fw-bolder fs-1`} colSpan={2}>
                      
													<div
														className={`bg-porsiaca text-left ${textEmpresa}`}
														// onClick={() => onOpenModalConceptos(g)}
													>
														<span className="mr-4">{4}</span>
                              MONKEY FIT
													</div>
                    </td>
                    <td className={`text-center ${0===0?'fw-light':'fw-bold'} fs-1`}>
                      <div className={`bg-porsiaca text-right  ${0!==0&&'text-ISESAC'}`}>
                        <NumberFormatMoney amount={0}/>
                      </div>
                    </td>
                  </tr>
            <tr className={``}>
                    <td className={`text-center fw-bolder fs-1`} colSpan={2}>
                      
													<div
														className={`bg-porsiaca text-left ${textEmpresa}`}
														// onClick={() => onOpenModalConceptos(g)}
													>
														<span className="mr-4">{5}</span>
                              PRODUCTOS
													</div>
                    </td>
                    <td className={`text-center ${0===0?'fw-light':'fw-bold'} fs-1`}>
                      <div className={`bg-porsiaca text-right  ${0!==0&&'text-ISESAC'}`}>
                        <NumberFormatMoney amount={0}/>
                      </div>
                    </td>
                  </tr>
          </tbody>
          
          <tfoot className={`${background}`}>
            <tr>
              <td colSpan={2} className="fw-bold text-start text-white" style={{fontSize: '40px'}}>
                Total
              </td>
              <td className="fw-bold text-right  text-white" style={{fontSize: '40px'}}>
                <NumberFormatMoney amount={0} />
              </td>
            </tr>
          </tfoot>
        </Table>
    </div>
  )
}


const TableDetalle=({data, background, textEmpresa, totalEgresosUSD, totalEgresosPEN, RANGE_DATE})=>{
  return (
    <div>
        <Table striped>
          <thead className={`${background}`}>
            <tr>
              <th className="text-white p-1" colSpan={1}><div style={{fontSize: '37px'}}> {dayjs(RANGE_DATE[0]).format('MMMM')}<span className='mx-3'>COMPARATIVO</span> 2025</div></th>
              <th className="text-white text-center p-1"><div  style={{fontSize: '37px'}}>S/.</div></th>
              <th className="text-white text-center p-1"><div  style={{fontSize: '37px'}}>$</div></th>
            </tr>
          </thead>
          <tbody>
            <tr className={``}>
                    <td className={`text-center fw-bolder fs-1`}>
                      <div className={`bg-porsiaca text-left ${textEmpresa} mr-4`}>
                        INGRESOS
                      </div>
                    </td>
                    <td className={`text-center ${0===0?'fw-light':'fw-bold'} fs-1`}>
                      <div className={`bg-porsiaca text-right  ${0!==0&&'text-ISESAC'} mr-4`}>
                        <NumberFormatMoney amount={0}/>
                      </div>
                    </td>
                  </tr>
            <tr className={``}>
                    <td className={`text-center fw-bolder fs-1`}>
                      <div className={`bg-porsiaca text-left ${textEmpresa}`}>
                        EGRESOS
                      </div>
                    </td>
                    <td className={`text-center ${0===0?'fw-light':'fw-bold'} fs-1 `}>
                      <div className={`bg-porsiaca text-right  ${0!==0&&'text-ISESAC'} mr-4`}>
                        <NumberFormatMoney amount={-totalEgresosPEN}/>
                      </div>
                    </td>
                    <td className={`text-center ${0===0?'fw-light':'fw-bold'} fs-1`}>
                      <div className={`bg-porsiaca text-right  ${0!==0&&'text-ISESAC'}`}>
                        <NumberFormatMoney amount={-totalEgresosUSD}/>
                      </div>
                    </td>
                  </tr>
            <tr className={``}>
                    <td className={`text-center fw-bolder`}  style={{fontSize: '40px'}}>
                      <div className={`bg-porsiaca text-left ${textEmpresa}`}>
                        UTILIDAD
                      </div>
                    </td>
                    <td className={`text-center ${2===0?'fw-light':'fw-bold'}`}  style={{fontSize: '40px'}}>
                      <div className={`bg-porsiaca text-right text-change  ${2!==0&&'text-ISESAC'} mr-4`}>
                        <NumberFormatMoney amount={-totalEgresosPEN}/>
                      </div>
                    </td>
                    <td className={`text-center ${2===0?'fw-light':'fw-bold'}`}  style={{fontSize: '40px'}}>
                      <div className={`bg-porsiaca text-right text-change  ${2!==0&&'text-ISESAC'}`}>
                        <NumberFormatMoney amount={-totalEgresosUSD}/>
                      </div>
                    </td>
                  </tr>
          </tbody>
        </Table>
    </div>
  )
}