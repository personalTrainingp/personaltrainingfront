import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap';

export const FormatTable3 = ({header, value, flattened1, classNameTHEAD, classNameTH}) => {
    const sumarTarifaMonto = (items)=>{
      const ventas = items?.reduce((accum, item) => accum + (item.detalle_ventaMembresium?.tarifa_monto || 0), 0)
    return ventas
    }
    const numero_cierre = flattened1?.length
    const ventas = sumarTarifaMonto(flattened1)
    const ticket_medio = ventas / numero_cierre || 0
    const data = [
      {
      label: 'socios',
      value: numero_cierre
      },
      {
        label: 'VENTAS',
        value: <SymbolSoles numero={<NumberFormatMoney amount={ventas}/>}/>
        },
        {
          label: 'TICKET MEDIO',
          value: <SymbolSoles numero={<NumberFormatMoney amount={ticket_medio}/>}/>
          },
    ]
  return (
    <Table striped>
      <thead  className={classNameTHEAD || 'bg-primary'}>
        <tr>
          
        <th colSpan={2} className={`${classNameTH || 'text-white'} fs-3 pl-5 text-center`}>
          {header}
        {/*  */}
        </th>
        </tr>
      </thead>
                                <tbody>
                                  {
                                    data.map(g=>{
                                      return (
                                        <tr>
                                          <td className='fs-2'>{g.label}</td>
                                          <td className='fs-2'> <div className='text-end fw-bold'>{g.value}</div></td>
                                        </tr>
                                      )
                                    })
                                  }
                                </tbody>
    </Table>
  )
}
