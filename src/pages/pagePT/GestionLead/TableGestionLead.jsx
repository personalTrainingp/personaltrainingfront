import { DateMask, NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'
import { Table } from 'react-bootstrap'

export const TableGestionLead = ({data, onClickCustomLead, onDeleteItemLead}) => {
  return (
    <div className=' d-flex justify-content-center'>
        <div  style={{width: '600px'}}>
            <Table striped>
                <thead className='bg-primary'>
                    <tr>
                        <th className='text-white'>FECHA</th>
                        <th className='text-white'>CANT. LEAD</th>
                        <th className='text-white'>COSTO POR LEAD</th>
                        <th className='text-white'>COSTO INVERTIDO</th>
                        <th className='text-white'></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data?.map(m=>{
                            return (
                                <tr>
                                    <td>
                                        <DateMask date={m.fecha} format={'dddd DD [DE] MMMM [DEL] YYYY'}/>
                                    </td>
                                    <td>{m.cantidad}</td>
                                    <td>
                                        <div className=''>
                                            <NumberFormatMoney amount={m.monto!==0 && m.monto/m.cantidad}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className=''>
                                            <NumberFormatMoney amount={m.monto}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='d-flex'>
                                            <span className='mr-3' onClick={()=>onClickCustomLead(m?.id)}>
                                                <i className='pi pi-pencil'></i>
                                                {/* {JSON.stringify(m, null, 2)} */}
                                            </span>
                                            <span className='ml-3' onClick={()=>onDeleteItemLead(m?.id)}>
                                                <i className='pi pi-trash'></i>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </div>
    </div>
  )
}
