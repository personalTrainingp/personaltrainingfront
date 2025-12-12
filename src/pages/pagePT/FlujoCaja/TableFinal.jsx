import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'

export const TableFinal = ({bgTotal, mesesSeleccionadosNums, mesesNombres, bgMultiValue, totalGeneral, gruposSinPrestamos, prestamosGroup, totalPorMes}) => {
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
            <td className={`fw-bold fs-2 `} style={{color: `${bgMultiValue}`}}>TOTAL ACTIVOS</td>
            {mesesSeleccionadosNums.map(mesNum => (
              <td key={mesNum} className="text-center fs-2 fw-bold">
				<div className={`bg-porsiaca text-right px-2 `}>
                	<NumberFormatMoney amount={gruposSinPrestamos.find(e=>e.grupo==='COMPRA PRODUCTOS/ACTIVOS')?.mesesSuma[mesNum - 1]} />
				</div>
              </td>
            ))}
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
              		<NumberFormatMoney amount={41729.1} />
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
				<div className={`bg-porsiaca text-right px-2`}>
                	<NumberFormatMoney amount={totalPorMes[mesNum - 1]-prestamosGroup.mesesSuma[mesNum - 1]-gruposSinPrestamos.find(e=>e.grupo==='COMPRA PRODUCTOS/ACTIVOS')?.mesesSuma[mesNum - 1]} />
				</div>
              </td>
            ))}
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
              		<NumberFormatMoney amount={totalGeneral-prestamosGroup.totalAnual-41729.1} />
				</div>
            </td>
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
					100
				</div>
			</td>
          </tr>
		  
          <tr className={`${bgTotal}`}>
            <td className={`fw-bold fs-2`}>
				<div className='text-white'>
					TOTAL EGRESOS
				</div>
			</td>
            {mesesSeleccionadosNums.map(mesNum => (
              <td key={mesNum} className="text-center fs-2 fw-bold">
				<div className={`bg-porsiaca text-right text-white px-2`}>
                	<NumberFormatMoney amount={totalPorMes[mesNum - 1]-prestamosGroup.mesesSuma[mesNum - 1]} />
				</div>
              </td>
            ))}
            <td className="text-center fw-bolder fs-1">
				<div className='bg-porsiaca text-right text-white'>
              		<NumberFormatMoney amount={totalGeneral-prestamosGroup.totalAnual} />
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
