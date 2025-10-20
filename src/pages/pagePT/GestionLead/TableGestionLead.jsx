import { DateMask, NumberFormatMoney } from '@/components/CurrencyMask'
import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useGestionLeadStore } from './useGestionLeadStore'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { Button } from 'primereact/button'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'

export const TableGestionLead = ({onClickCustomLead, onDeleteItemLead, id_empresa=598}) => {
        const { obtenerLeads } = useGestionLeadStore()
        const { DataGeneral:dataRedesInvertidas, obtenerParametroPorEntidadyGrupo:obtenerRedesInvertidas } = useTerminoStore()
        const { dataView } = useSelector(e=>e.DATA)
        useEffect(() => {
            obtenerLeads(id_empresa)
            obtenerRedesInvertidas('inversion', 'redes')
        }, [])
        console.log({dataView});
        
  return (
    <>
                    <Button label='AGREGAR LEAD' onClick={()=>onClickCustomLead(0, id_empresa, {})}/>
        <div className=' d-flex justify-content-center'>
            <div  style={{width: '600px'}}>
                <Table striped>
                    <thead className='bg-primary'>
                        <tr>
                            <th className='text-white'>FECHA</th>
                            <th className='text-white'>RED</th>
                            <th className='text-white'>CANT. LEAD</th>
                            <th className='text-white'>COSTO POR LEAD</th>
                            <th className='text-white'>COSTO INVERTIDO</th>
                            <th className='text-white'></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            dataView?.map(m=>{
                                return (
                                    <tr>
                                        <td>
                                            {dayjs.utc(m.fecha).format('dddd DD [DE] MMMM [DEL] YYYY')}
                                        </td>
                                        <td>{dataRedesInvertidas.find(d=>d.value===m.id_red)?.label}</td>
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
                                                <span className='mr-3' onClick={()=>onClickCustomLead(m?.id, id_empresa, {fecha: dayjs.utc(m.fecha).format('YYYY-MM-DD'), cantidad: m.cantidad, monto: m.monto, id_red: m.id_red})}>
                                                    <i className='pi pi-pencil'></i>
                                                    {/* {JSON.stringify(m, null, 2)} */}
                                                </span>
                                                <span className='ml-3' onClick={()=>onDeleteItemLead(m?.id, id_empresa)}>
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
    </>
  )
}
