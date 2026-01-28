import { NumberFormatMoney } from '@/components/CurrencyMask';
import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap';
import { useFlujoCajaStore } from './hook/useFlujoCajaStore';
import { useFlujoCaja } from './hook/useFlujoCaja';

export const TableResumen = ({dataIngresos, dataGastos, id_empresa, mesesSeleccionadosNums, bgMultiValue, bgTotal, mesesNombres, totalPorMesIngresos, totalPorMesEgresos, totalPorMesIngExc}) => {
    const { dataGastosxFecha, obtenerEgresosxFecha } = useFlujoCaja();
    const totalIngresos = totalPorMesIngresos.reduce((a,b)=>a+b)
    const totalEgresos = totalPorMesEgresos.reduce((a,b)=>a+b)
    const totalIngExc = totalPorMesIngExc.reduce((a,b)=>a+b)
    useEffect(() => {
        obtenerEgresosxFecha(id_empresa, [new Date(2024, 0, 1), new Date(2026, 11, 31)])
    }, [])
    console.log({dataIngresos, dataGastos}, 'tresu');
    const utilidadBrutaTOTAL = dataIngresos.reduce((total, item)=>total+item.movimientosTotalDeConceptos,0) - dataGastos.reduce((total, item)=>total+item.movimientosTotalDeConceptos,0)
  return (
    <div className="table-responsive">
        <Table className="tabla-egresos" style={{ width: '100%' }} bordered>
        <thead >
          <tr>
            <th className={`fw-bold fs-2 bg-white-1 border-top-10 border-bottom-10 border-left-10 border-right-10`}>
                <div className='text-black'>
                    RESULTADO ANUAL
                </div>
            </th>
            {mesesSeleccionadosNums.map(mesNum => (
              <th key={mesNum} className={`text-white text-center p-1 fs-2 ${bgTotal}`}>
                {mesesNombres[mesNum - 1]}
              </th>
            ))}
            <th className={`text-center p-1 fs-1 border-top-10 border-left-10`}>TOTAL <br/> ANUAL</th>
            {/* <th className={`text-center p-1 fs-1 border-top-10`}>MOV. <br/> ANUAL</th> */}
            <th className={`text-center p-1 fs-1 border-top-10`}>%<br/> PART. <br/> ANUAL</th>
            <th className={`text-center p-1 fs-1 border-top-10 border-right-10`}>PROMEDIO<br/> MENSUAL <br/> ANUAL</th>
          </tr>
        </thead>
          <tbody>
                <tr>
                    <td className={`fw-bold fs-2  sticky-td-${id_empresa} border-left-10 border-right-10`}>
                        <div className='text-white'>
                            INGRESOS
                        </div>
                    </td>
                    {mesesSeleccionadosNums.map(mesNum => {
                        return(
                            <td
                                key={mesNum}
                                className="text-center fs-2 fw-bold"
                                
                            >
                                <div  className={`bg-porsiaca text-right px-2 text-black`}>
                                    <NumberFormatMoney amount={totalPorMesIngresos[mesNum - 1]} />
                                </div>
                            </td>
                        )
                    }
                    )}
                    <td className="text-center fw-bolder border-left-10" style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-black'>
                            <NumberFormatMoney amount={totalIngresos} />
                        </div>
                    </td>
                    {/* <td className="text-center fw-bolder" style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-black'>
                            {dataIngresos.reduce((total, item)=>total+item.movimientosTotalDeConceptos,0)}
                        </div>
                    </td> */}
                    <td className="text-center fw-bolder" style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-black'>
                            <NumberFormatMoney amount={100}/>
                        </div>
                    </td>
                    <td className="text-center fw-bolder border-right-10" style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-black'>
                            <NumberFormatMoney amount={totalIngresos/12}/>
                            {/* {totalIngresos/12} */}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className={`fw-bold fs-2  sticky-td-${id_empresa} border-left-10 border-right-10`}>
                        <div className='text-white'>
                            EGRESOS
                        </div>
                    </td>
                    {mesesSeleccionadosNums.map(mesNum => {
                        return(
                            <td
                                key={mesNum}
                                className="text-center fs-2 fw-bold"
                                
                            >
                                <div  className={`bg-porsiaca text-right px-2 text-change`}>
                                    -<NumberFormatMoney amount={totalPorMesEgresos[mesNum - 1]} />
                                </div>
                            </td>
                        )
                    }
                    )}
                    <td className="text-center fw-bolder border-left-10"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            -<NumberFormatMoney amount={totalEgresos} />
                        </div>
                    </td>
                    {/* <td className="text-center fw-bolder"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            {dataGastos.reduce((total, item)=>total+item.movimientosTotalDeConceptos,0)}
                        </div>
                    </td> */}
                    <td className="text-center fw-bolder"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            <NumberFormatMoney amount={((totalEgresos/totalIngresos))*100} />
                        </div>
                    </td>
                    <td className="text-center fw-bolder border-right-10"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            <NumberFormatMoney amount={totalEgresos/12} />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className={`fw-bold fs-2 sticky-td-${id_empresa} border-left-10 border-right-10`}>
                        <div className='text-white'>
                            UTILIDAD BRUTA
                        </div>
                    </td>
                    {mesesSeleccionadosNums.map(mesNum => {
                        return(
                            <td
                                key={mesNum}
                                className="text-center fs-2 fw-bold"
                                
                            >
                                <div  className={`bg-porsiaca text-right px-2 ${utilidad(totalPorMesIngresos[mesNum - 1], totalPorMesEgresos[mesNum - 1]).espositivo?'text-ISESAC':'text-change'}`}>
                                    {utilidad(totalPorMesIngresos[mesNum - 1], totalPorMesEgresos[mesNum - 1]).espositivo?'+':''}<NumberFormatMoney amount={totalPorMesIngresos[mesNum - 1]-totalPorMesEgresos[mesNum - 1]} />
                                </div>
                            </td>
                        )
                    }
                    )}
                    <td className="text-center fw-bolder border-left-10"  style={{fontSize: '35px'}}>
                        <div className={`bg-porsiaca text-right ${utilidad(totalIngresos, totalEgresos).espositivo?'text-ISESAC':'text-change'}`}>
                            {utilidad(totalIngresos, totalEgresos).espositivo?'+':''}<NumberFormatMoney amount={totalIngresos-totalEgresos} />
                        </div>
                    </td>
                    {/* <td className="text-center fw-bolder"  style={{fontSize: '35px'}}>
                        <div className={`bg-porsiaca text-right ${utilidadBrutaTOTAL<=0?'text-change':'text-ISESAC'}`}>
                            -
                            {utilidadBrutaTOTAL<=0?'-':'+'}<NumberFormatMoney amount={utilidadBrutaTOTAL<=0?-utilidadBrutaTOTAL:utilidadBrutaTOTAL} />
                        </div>
                    </td> */}
                    <td className="text-center fw-bolder"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            <NumberFormatMoney amount={((totalIngresos-totalEgresos)/(totalIngresos))*100} />
                        </div>
                    </td>
                    <td className="text-center fw-bolder border-right-10"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            <NumberFormatMoney amount={(totalIngresos-totalEgresos)/12} />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className={`fw-bold fs-2  sticky-td-${id_empresa} border-left-10 border-right-10`}>
                        <div className='text-white'>
                            ING. EXCEPCIONALES
                        </div>
                    </td>
                    {mesesSeleccionadosNums.map(mesNum => {
                        return(
                            <td
                                key={mesNum}
                                className="text-center fs-2 fw-bold"
                                
                            >
                                <div  className={`bg-porsiaca text-right px-2 text-black`}>
                                    <NumberFormatMoney amount={totalPorMesIngExc[mesNum - 1]} />
                                </div>
                            </td>
                        )
                    }
                    )}
                    <td className="text-center fw-bolder border-left-10" style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-black'>
                            <NumberFormatMoney amount={totalIngExc} />
                        </div>
                    </td>
                    {/* <td className="text-center fw-bolder"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            -
                            <NumberFormatMoney amount={0} />
                        </div>
                    </td> */}
                    <td className="text-center fw-bolder"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            <NumberFormatMoney amount={100} />
                        </div>
                    </td>
                    <td className="text-center fw-bolder border-right-10"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            <NumberFormatMoney amount={0} />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className={`fw-bold fs-2  sticky-td-${id_empresa} border-left-10 border-right-10 border-bottom-10`}>
                        <div className='text-white'>
                            UTILIDAD NETA
                        </div>
                    </td>
                    {mesesSeleccionadosNums.map(mesNum => {
                        return(
                            <td
                                key={mesNum}
                                className="text-center fs-2 fw-bold "
                                
                            >
                                <div  className={`bg-porsiaca text-right px-2 ${utilidad(totalPorMesIngresos[mesNum - 1]+ totalPorMesIngExc[mesNum - 1], totalPorMesEgresos[mesNum - 1]).espositivo?'text-ISESAC':'text-change'}`}>
                                    {/* <NumberFormatMoney amount={totalPorMesIngExc[mesNum - 1]} /> */}
                                    {utilidad(totalPorMesIngresos[mesNum - 1] + totalPorMesIngExc[mesNum - 1], totalPorMesEgresos[mesNum - 1]).espositivo?'+':''}<NumberFormatMoney amount={totalPorMesIngresos[mesNum - 1] + totalPorMesIngExc[mesNum - 1] - totalPorMesEgresos[mesNum - 1]} />

                                </div>
                            </td>
                        )
                    }
                    )}
                    <td className="text-center fw-bolder border-left-10 border-bottom-10"  style={{fontSize: '35px'}}>
                        <div className={`bg-porsiaca text-right ${utilidad(totalIngresos + totalIngExc, totalEgresos).espositivo?'text-ISESAC':'text-change'}`}>
                            {utilidad(totalIngresos+totalIngExc, totalEgresos).espositivo?'+':''}<NumberFormatMoney amount={(totalIngresos + totalIngExc)-totalEgresos} />
                        </div>
                    </td>
                    {/* <td className="text-center fw-bolder border-bottom-10"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            <NumberFormatMoney amount={totalEgresos} />
                        </div>
                    </td> */}
                    <td className="text-center fw-bolder border-bottom-10"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            {/* <NumberFormatMoney amount={100} /> */}
                            {/* <NumberFormatMoney amount={(totalIngresos + totalIngExc)/((totalIngresos + totalIngExc)-totalEgresos)}/> */}
                            {/* <NumberFormatMoney amount={0}/> */}
                            -
                        </div>
                    </td>
                    <td className="text-center fw-bolder border-right-10 border-bottom-10"  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            <NumberFormatMoney amount={totalEgresos} />
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