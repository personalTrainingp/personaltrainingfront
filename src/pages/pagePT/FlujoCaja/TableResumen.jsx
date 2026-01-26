import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap';

export const TableResumen = ({dataGastos, dataIngresos, id_empresa, mesesSeleccionadosNums, bgMultiValue, bgTotal, mesesNombres, totalPorMesIngresos, totalPorMesEgresos, totalPorMesIngExc}) => {
    const totalIngresos = totalPorMesIngresos.reduce((a,b)=>a+b)
    const totalEgresos = totalPorMesEgresos.reduce((a,b)=>a+b)
    const totalIngExc = totalPorMesIngExc.reduce((a,b)=>a+b)
    console.log({dataGastos, dataIngresos, totalPorMesIngresos, totalPorMesEgresos, totalPorMesIngExc}, 'tresu');
  return (
    <div className="table-responsive" style={{ width: '95vw' }}>
        <Table className="tabla-egresos" bordered>
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
            <th className={`${bgTotal} text-white text-center p-1 fs-1`}>TOTAL</th>
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
                    <td className="text-center fw-bolder" style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-black'>
                            <NumberFormatMoney amount={totalIngresos} />
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
                    <td className="text-center fw-bolder "  style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-change'>
                            -<NumberFormatMoney amount={totalEgresos} />
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
                    <td className="text-center fw-bolder"  style={{fontSize: '35px'}}>
                        <div className={`bg-porsiaca text-right ${utilidad(totalIngresos, totalEgresos).espositivo?'text-ISESAC':'text-change'}`}>
                            {utilidad(totalIngresos, totalEgresos).espositivo?'+':''}<NumberFormatMoney amount={totalIngresos-totalEgresos} />
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
                    <td className="text-center fw-bolder" style={{fontSize: '35px'}}>
                        <div className='bg-porsiaca text-right text-black'>
                            <NumberFormatMoney amount={totalIngExc} />
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
                                className="text-center fs-2 fw-bold"
                                
                            >
                                <div  className={`bg-porsiaca text-right px-2 ${utilidad(totalPorMesIngresos[mesNum - 1]+ totalPorMesIngExc[mesNum - 1], totalPorMesEgresos[mesNum - 1]).espositivo?'text-ISESAC':'text-change'}`}>
                                    {/* <NumberFormatMoney amount={totalPorMesIngExc[mesNum - 1]} /> */}
                                    {utilidad(totalPorMesIngresos[mesNum - 1] + totalPorMesIngExc[mesNum - 1], totalPorMesEgresos[mesNum - 1]).espositivo?'+':''}<NumberFormatMoney amount={totalPorMesIngresos[mesNum - 1] + totalPorMesIngExc[mesNum - 1] - totalPorMesEgresos[mesNum - 1]} />

                                </div>
                            </td>
                        )
                    }
                    )}
                    <td className="text-center fw-bolder"  style={{fontSize: '35px'}}>
                        <div className={`bg-porsiaca text-right ${utilidad(totalIngresos + totalIngExc, totalEgresos).espositivo?'text-ISESAC':'text-change'}`}>
                            {utilidad(totalIngresos+totalIngExc, totalEgresos).espositivo?'+':''}<NumberFormatMoney amount={(totalIngresos + totalIngExc)-totalEgresos} />
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