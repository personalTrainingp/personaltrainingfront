import React from 'react'

export const DatatableIngresos = ({data}) => {
  return (
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
            </tbody>
  )
}
