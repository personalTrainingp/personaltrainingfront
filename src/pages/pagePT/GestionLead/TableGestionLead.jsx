import { DateMask, NumberFormatMoney } from '@/components/CurrencyMask'
import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useGestionLeadStore } from './useGestionLeadStore'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { Button } from 'primereact/button'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'

export const TableGestionLead = ({ onClickCustomLead, onDeleteItemLead, id_empresa = 598 }) => {
    const { obtenerLeads } = useGestionLeadStore()
    const { DataGeneral: dataRedesInvertidas, obtenerParametroPorEntidadyGrupo: obtenerRedesInvertidas } = useTerminoStore()
    const { dataView } = useSelector(e => e.DATA)

    useEffect(() => {
        obtenerLeads(id_empresa)
        obtenerRedesInvertidas('inversion', 'redes')
    }, [])

    return (
        <>
            <Button label='AGREGAR LEAD' onClick={() => onClickCustomLead(0, id_empresa, {})} />
            <div className=' d-flex justify-content-center'>
                <div >
                    <Table striped>
                        <thead className='bg-primary'>
                            <tr>
                                <th className='text-white'>FECHA</th>
                                <th className='text-white'>RED</th>
                                <th className='text-white'>CANT. LEAD</th>
                                <th className='text-white'>COSTO POR LEAD(SIN IGV)</th>
                                <th className='text-white'>COSTO POR LEAD(CON IGV)</th>
                                <th className='text-white'>COSTO INVERTIDO(CON IGV)</th>
                                <th className='text-white'>COSTO INVERTIDO(SIN IGV)</th>
                                <th className='text-white'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataView?.map(m => {
                                    // 1. Determinamos el nombre de la red
                                    const nombreRed = dataRedesInvertidas.find(d => d.value === m.id_red)?.label || '';
                                    
                                    // 2. Determinamos el símbolo: $ para META ADS, S/. para el resto
                                    const simbolo = nombreRed === 'META ADS' ? '$' : 'S/.';

                                    return (
                                        <tr key={m.id}>
                                            <td>
                                                {dayjs.utc(m.fecha).format('dddd DD [DE] MMMM [DEL] YYYY')}
                                            </td>
                                            <td>{nombreRed}</td>
                                            <td>
                                                <div>
                                                    <p className='text-muted'>CANT. LEAD</p>
                                                    {m.cantidad}
                                                </div>
                                            </td>
                                            <td>
                                                <div className=''>
                                                    <p className='text-muted'>COSTO POR LEAD(SIN IGV)</p>
                                                    {/* Agregamos el símbolo al costado */}
                                                    <span className="mr-1 font-weight-bold">{simbolo}</span>
                                                    <NumberFormatMoney amount={m.monto !== 0 && m.monto / m.cantidad} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className=''>
                                                    <p className='text-muted'>COSTO POR LEAD(CON IGV)</p>
                                                    <span className="mr-1 font-weight-bold">{simbolo}</span>
                                                    <NumberFormatMoney amount={m.monto !== 0 && (m.monto / 1.18) / m.cantidad} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className=''>
                                                    <p className='text-muted'>COSTO INVERTIDO(CON IGV)</p>
                                                    <span className="mr-1 font-weight-bold">{simbolo}</span>
                                                    <NumberFormatMoney amount={m.monto} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className=''>
                                                    <p className='text-muted'>COSTO INVERTIDO(SIN IGV)</p>
                                                    <span className="mr-1 font-weight-bold">{simbolo}</span>
                                                    <NumberFormatMoney amount={m.monto / 1.18} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='d-flex'>
                                                    <span className='mr-3' onClick={() => onClickCustomLead(m?.id, id_empresa, { fecha: dayjs.utc(m.fecha).format('YYYY-MM-DD'), cantidad: m.cantidad, monto: m.monto, id_red: m.id_red })}>
                                                        <i className='pi pi-pencil'></i>
                                                    </span>
                                                    <span className='ml-3' onClick={() => onDeleteItemLead(m?.id, id_empresa)}>
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