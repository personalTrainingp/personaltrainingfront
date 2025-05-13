import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap';

export const FormatTable3 = ({header, value, rangeFecStr, flattened1, flattened2, classNameTHEAD, classNameTH}) => {
    const sumarTarifaMonto = (items)=>{
      const ventas = items?.reduce((accum, item) => accum + (item.detalle_ventaMembresium?.tarifa_monto || 0), 0)
    return ventas
    }
    const numero_cierre = flattened1?.length
    const numero_cierre_total = flattened2?.length
    const ventas = sumarTarifaMonto(flattened1)
    const ventas_total = sumarTarifaMonto(flattened2)
    const ticket_medio = ventas / numero_cierre || 0
    const ticket_medio_total = ventas_total / numero_cierre_total || 0
    const data = [
      {
      label: 'socios',
      value: numero_cierre,
      total: numero_cierre_total
      },
      {
        label: 'VENTAS',
        value: <SymbolSoles numero={<NumberFormatMoney amount={ventas}/>}/>,
        total: <SymbolSoles numero={<NumberFormatMoney amount={ventas_total}/>}/>
        },
        {
          label: <>TICKET <br/> MEDIO</>,
          value: <SymbolSoles numero={<NumberFormatMoney amount={ticket_medio}/>}/>,
          total: <SymbolSoles numero={<NumberFormatMoney amount={ticket_medio_total}/>}/>
          },
    ]
  return (
    // <>
    // </>
    <Table striped>
      <thead  className={classNameTHEAD || 'bg-primary'}>
        <tr>
        <th colSpan={3} className={`${classNameTH || 'text-white'} fs-3 pl-5 text-center`}>
          {header}
        </th>
        </tr>
        <tr>
        <th colSpan={1} className={`${classNameTH || 'text-white'} fs-3 pl-5 text-center`}>
        </th>
        <th colSpan={1} className={`${classNameTH || 'text-white'} fs-3 pl-5 text-center`}>
          {rangeFecStr}
        </th>
        <th colSpan={1} className={`${classNameTH || 'text-white'} fs-3 pl-5 text-center`}>
            TOTAL MES
        </th>
        </tr>
        
    {/* <tr>
      <th className='text-white'></th>
      <th className='text-white text-end'></th>
      <th className='text-white text-end'>TOTAL</th>
    </tr> */}
      </thead>
                                <tbody>
                                  {
                                    data.map(g=>{
                                      return (
                                        <tr>
                                          <td className='fs-2'>{g.label}</td>
                                          <td className='fs-2'> <div className='text-end fw-bold'>{g.value}</div></td>
                                          <td className='fs-2'> <div className='text-end fw-bold'>{g.total}</div></td>
                                        </tr>
                                      )
                                    })
                                  }
                                </tbody>
    </Table>
  )
}
