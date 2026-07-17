import { NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'
import React from 'react'
import { Table } from 'react-bootstrap'
const fecha = new Date()
const mesActual = fecha.getMonth()+1
export const TableConceptoAnio = ({id_empresa=598, fechas=[], bgTotal, data=[], bgPastel, nombreGrupo=''}) => {
    const dataAlter = fechas.map(f=>{
        const anio2026 = data.filter(m=>m.fechaP.anioP===2026 && m.fechaP.mesP===f.mes)
        const anio2025 = data.filter(m=>m.fechaP.anioP===2025 && m.fechaP.mesP===f.mes)
        const anio2024 = data.filter(m=>m.fechaP.anioP===2024 && m.fechaP.mesP===f.mes)
        return {
            ...f,
            anio2024,
            anio2025,
            anio2026,
        }
    })
  return (
    <div>
        {/* <pre>
            {
                JSON.stringify(dataAlter, null, 2)
            }
        </pre> */}
    <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
        <thead>
            <tr>
                <th style={{width: '450px'}} className={` text-break fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black text-center`}>{nombreGrupo}</th>
                {
                    dataAlter.map(f=>{
                        return (
                            <React.Fragment key={`${f.mes}`}>
                        <td className={`text-center border-top-10 border-black ${bgTotal}`} style={{width: '180px'}}>{dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMMM')}</td>
                        </React.Fragment>
                    )
                    })
                }
            <th className='text-center border-top-10 border-left-10 border-bottom-10' style={{width: '200px'}}>TOTAL</th>
            <th className='text-center border-top-10 border-left-10 border-bottom-10' style={{width: '200px'}}>PROMEDIO</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 text-white fs-1 text-center ${bgTotal}`}>2026</td>
                {
                    dataAlter.map(f=>{
                        const gastosPagados = f.anio2026.filter(f=>f.id_estado_gasto===1423)
                        const gastosNoPagados = f.anio2026.filter(f=>f.id_estado_gasto===1424)
                        return (
                            <React.Fragment key={`${f.mes}`}>
                        <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>
                            {
                                gastosPagados.length!==0? (
                                    <div>
                                        <NumberFormatMoney amount={gastosPagados.reduce((a,b)=>a+b.monto, 0)}/>
                                    </div>
                                ):(
                                        <div className='text-change'>
                                            <NumberFormatMoney amount={gastosNoPagados.reduce((a,b)=>a+b.monto, 0)}/>
                                        </div>
                                )
                            }
                            </td>
                        </React.Fragment>
                    )
                    })
                }
                {/* dataAlter.filter(m=>m.anio===2026 && m.anio2026.length!==0)?.length */}
                <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>
                    <div className={`${dataAlter.filter(m=> m.anio2026.length!==0)?.length===dataAlter.filter(m=> m.anio2026.filter(f=>f.id_estado_gasto===1424).length!==0)?.length?'text-change':'text-black'}`}>
                        <NumberFormatMoney amount={data.filter(m=>m.fechaP.anioP===2026).reduce((a,b)=>a+b.monto,0)}/>
                    </div>
                </td>
                <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>
                    <div className={`${dataAlter.filter(m=> m.anio2026.length!==0)?.length===dataAlter.filter(m=> m.anio2026.filter(f=>f.id_estado_gasto===1424).length!==0)?.length?'text-change':'text-black'}`}>
                        <NumberFormatMoney amount={data.filter(m=>m.fechaP.anioP===2026).reduce((a,b)=>a+b.monto,0)/mesActual}/>
                    </div>
                </td>
            </tr>
            <tr>
                <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 text-white fs-1 text-center ${bgTotal}`}>2025</td>
                {
                    dataAlter.map(f=>{
                        const gastosPagados = f.anio2025.filter(f=>f.id_estado_gasto===1423)
                        const gastosNoPagados = f.anio2025.filter(f=>f.id_estado_gasto===1424)
                        return (
                            <React.Fragment key={`${f.mes}`}>
                            <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>
                                {
                                    gastosPagados.length!==0? (
                                        <div>
                                            <NumberFormatMoney amount={gastosPagados.reduce((a,b)=>a+b.monto, 0)}/>
                                        </div>
                                    ):(
                                            <div className='text-change'>
                                                <NumberFormatMoney amount={gastosNoPagados.reduce((a,b)=>a+b.monto, 0)}/>
                                            </div>
                                    )
                                }
                            </td>
                        </React.Fragment>
                    )
                    })
                }
                <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>
                    <div className={`${dataAlter.filter(m=> m.anio2025.length!==0)?.length===dataAlter.filter(m=> m.anio2025.filter(f=>f.id_estado_gasto===1424).length!==0)?.length?'text-change':'text-black'}`}>
                        <NumberFormatMoney amount={data.filter(m=>m.fechaP.anioP===2025).reduce((a,b)=>a+b.monto,0)}/>
                    </div>
                </td>
                <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>
                    <div className={`${dataAlter.filter(m=> m.anio2025.length!==0)?.length===dataAlter.filter(m=> m.anio2025.filter(f=>f.id_estado_gasto===1424).length!==0)?.length?'text-change':'text-black'}`}>
                        <NumberFormatMoney amount={data.filter(m=>m.fechaP.anioP===2025).reduce((a,b)=>a+b.monto,0)/12}/>
                    </div>
                    </td>
            </tr>
            <tr>
                <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 text-white fs-1 text-center ${bgTotal}`}>2024</td>
                {
                    dataAlter.map(f=>{
                        const gastosPagados = f.anio2024.filter(f=>f.id_estado_gasto===1423)
                        const gastosNoPagados = f.anio2024.filter(f=>f.id_estado_gasto===1424)
                        return (
                        <React.Fragment key={`${f.mes}`}>
                            <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>
                                {
                                    gastosPagados.length!==0? (
                                        <div>
                                            <NumberFormatMoney amount={gastosPagados.reduce((a,b)=>a+b.monto, 0)}/>
                                        </div>
                                    ):(
                                            <div className='text-change'>
                                                <NumberFormatMoney amount={gastosNoPagados.reduce((a,b)=>a+b.monto, 0)}/>
                                            </div>
                                    )
                                }
                            </td>
                        </React.Fragment>
                    )
                    })
                }
                <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>
                    <div className={`${dataAlter.filter(m=> m.anio2024.length!==0)?.length===dataAlter.filter(m=> m.anio2024.filter(f=>f.id_estado_gasto===1424).length!==0)?.length?'text-change':'text-black'}`}>
                        <NumberFormatMoney amount={data.filter(m=>m.fechaP.anioP===2024).reduce((a,b)=>a+b.monto,0)}/>
                    </div>
                </td>
                <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>
                    <div className={`${dataAlter.filter(m=> m.anio2024.length!==0)?.length===dataAlter.filter(m=> m.anio2024.filter(f=>f.id_estado_gasto===1424).length!==0)?.length?'text-change':'text-black'}`}>
                        <NumberFormatMoney amount={data.filter(m=>m.fechaP.anioP===2024).reduce((a,b)=>a+b.monto,0)/dataAlter.filter(m=> m.anio2024.length!==0)?.length}/>
                    </div>
                </td>
            </tr>
        </tbody>
    </Table>
</div>
  )
}
