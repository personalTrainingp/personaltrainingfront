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

    const totalMonto = dataView?.reduce((acc, m) => acc + m.monto, 0) || 0;
    const totalBase = totalMonto / 1.18;
    const totalIGV = totalMonto - totalBase;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Button label='AGREGAR LEAD' onClick={() => onClickCustomLead(0, id_empresa, {})} />
                <div className="p-3 bg-light rounded shadow-sm">
                    <span className="fw-bold mr-2">TOTAL IGV:</span>
                    <span className="text-danger fw-bold" style={{ fontSize: '1.2em' }}>
                        <NumberFormatMoney amount={totalIGV} />
                    </span>
                </div>
            </div>

            <div className=' d-flex justify-content-center'>
                <div >
                    <Table striped bordered>
                        <thead className='bg-primary'>
                            <tr>
                                <th className='text-white'>FECHA</th>
                                <th className='text-white'>RED</th>
                                <th className='text-white'>CANT. LEAD</th>
                                <th className='text-white'>COSTO POR LEAD(SIN IGV)</th>
                                <th className='text-white'>COSTO POR LEAD(CON IGV)</th>
                                <th className='text-white'>COSTO INVERTIDO(SIN IGV)</th>
                                <th className='text-white'>COSTO INVERTIDO(CON IGV)</th>
                                <th className='text-white'>IGV (18%)</th>
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

                                    const montoTotal = m.monto || 0;
                                    const montoBase = montoTotal / 1.18;
                                    const igv = montoTotal - montoBase;
                                    const cant = m.cantidad || 1;

                                    return (
                                        <tr key={m.id}>
                                            <td>
                                                {dayjs.utc(m.fecha).format('dddd DD [DE] MMMM [DEL] YYYY')}
                                            </td>
                                            <td>{nombreRed}</td>
                                            <td>
                                                <div>
                                                    <p className='text-muted small mb-0'>CANT. LEAD</p>
                                                    {m.cantidad}
                                                </div>
                                            </td>
                                            <td>
                                                <div className=''>
                                                    <p className='text-muted small mb-0'>COSTO POR LEAD(SIN IGV)</p>
                                                    <span className="mr-1 font-weight-bold">{simbolo}</span>
                                                    <NumberFormatMoney amount={montoBase / cant} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className=''>
                                                    <p className='text-muted small mb-0'>COSTO POR LEAD(CON IGV)</p>
                                                    <span className="mr-1 font-weight-bold">{simbolo}</span>
                                                    <NumberFormatMoney amount={montoTotal / cant} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className=''>
                                                    <p className='text-muted small mb-0'>COSTO INVERTIDO(SIN IGV)</p>
                                                    <span className="mr-1 font-weight-bold">{simbolo}</span>
                                                    <NumberFormatMoney amount={montoBase} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className=''>
                                                    <p className='text-muted small mb-0'>COSTO INVERTIDO(CON IGV)</p>
                                                    <span className="mr-1 font-weight-bold">{simbolo}</span>
                                                    <NumberFormatMoney amount={montoTotal} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='text-danger font-weight-bold'>
                                                    <p className='text-muted small mb-0'>IGV</p>
                                                    <span className="mr-1">{simbolo}</span>
                                                    <NumberFormatMoney amount={igv} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='d-flex'>
                                                    <span className='mr-3 cursor-pointer' style={{ cursor: 'pointer' }} onClick={() => onClickCustomLead(m?.id, id_empresa, { fecha: dayjs.utc(m.fecha).format('YYYY-MM-DD'), cantidad: m.cantidad, monto: m.monto, id_red: m.id_red })}>
                                                        <i className='pi pi-pencil'></i>
                                                    </span>
                                                    <span className='ml-3 cursor-pointer' style={{ cursor: 'pointer' }} onClick={() => onDeleteItemLead(m?.id, id_empresa)}>
                                                        <i className='pi pi-trash'></i>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot className="fw-bold bg-light">
                            <tr>
                                <td colSpan={3} className="text-right">TOTALES:</td>
                                <td></td>
                                <td></td>
                                <td><NumberFormatMoney amount={totalBase} /></td>
                                <td><NumberFormatMoney amount={totalMonto} /></td>
                                <td className="text-danger"><NumberFormatMoney amount={totalIGV} /></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        </>
    )
}