import { SymbolDolar } from '@/components/componentesReutilizables/SymbolSoles'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalDetalleTable = ({dae, header, show, onHide}) => {
  return (
    <Dialog
      header={header}
      visible={show}
      onHide={onHide}
    >
      
    <Table
                                                                // style={{tableLayout: 'fixed'}}
                                                                className="table-centered mb-0 fs-3"
                                                                // hover
                                                                striped
                                                                // responsive
                                                            >
                                                                <thead className="bg-primary">
                                                                    <tr>
                                                                        <th className='text-white p-2 py-2'>FECHA</th>
                                                                        <th className='text-white p-2 py-2' 
                                                                        >
                                                                            METODO DE PAGO
                                                                        </th>
                                                                        <th className='text-white p-2 py-2' 
                                                                        >
                                                                            DOLARES
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        dae?.map(d=>{
                                                                            return (
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className='text-primary fw-bold'>{dayjs(d.fecha, 'DD/MM/YYYY').format('dddd DD')}</span>
                                                                                        <span className='fw-boldd'>{dayjs(d.fecha, 'DD/MM/YYYY').format(' [DE] MMMM [DEL] YYYY')}</span>
                                                                                    </td>
                                                                                    <td>{d.metodo_pago}</td>
                                                                                    <td><SymbolDolar numero={<NumberFormatMoney amount={d.dolares}/>}/> </td>
                                                                                </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                </tbody>
                                                                        <tr className='bg-primary text-white'>
                                                                                    <td>
                                                                                        <div className='text-white p-3 fs-2 fw-bold'>
                                                                                            TOTAL
                                                                                        </div>
                                                                                    </td>
                                                                                    <td></td>
                                                                                    <td>
                                                                                        <span className='text-white fs-2 fw-bold'>
                                                                                        <SymbolDolar numero={<NumberFormatMoney amount={dae.reduce((total, item) => total + (item?.dolares || 0), 0)}/>}/> 
                                                                                        </span>
                                                                                        </td>
                                                                                </tr>
                                                            </Table>

    </Dialog>
  )
}
