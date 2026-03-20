import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { usePlanillaStore } from './usePlanillaStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'

export const TablePlanilla = () => {
    const { obtenerSemana, dataPlanilla } = usePlanillaStore()
    useEffect(() => {
        obtenerSemana(598)
    }, [])
    console.log({dataPlanilla});
    
  return (
    <div>
        <Table className='bg-change' striped>
            <thead>
                <tr>
                    <th className='text-white fs-3 text-center' colSpan={10}>
                        PLANILLA
                    </th>
                </tr>
                <tr>
                    <th className='text-white fs-5'>N°</th>
                    <th className='text-white fs-5'>CARGO</th>
                    <th className='text-white fs-5'>COLABORADOR</th>
                    <th className='text-white fs-5'>SUELDO</th>
                    <th className='text-white fs-5'>DIAS ASISTIDAS</th>
                    <th className='text-white fs-5'>TARDANZAS <br/> MIN/DIA</th>
                    <th className='text-white fs-5'>SALDO ASISTIDO </th>
                    <th className='text-white fs-5'>DESCUENTO </th>
                    <th className='text-white fs-5'>MONTO A PAGAR</th>
                </tr>
            </thead>
            <tbody>
                {
                    dataPlanilla?.map((p, i)=>{
                        const sumaMinTardanzas = p.dias_tardanzas?.reduce((total, item) =>item?.jornada?.minutosAsistidos+total,0)
                        
                        return (
                            <tr>
                                <td className='fs-6'>{i+1}</td>
                                <td className='fs-6'>{p.cargo}</td>
                                <td className='fs-6'>{p.colaborador}</td>
                                <td className='fs-6'><NumberFormatMoney amount={p.sueldo}/></td>
                                <td className='fs-6'>{p.dias_pendientes.length}</td>
                                <td className='fs-6'>10/{sumaMinTardanzas}</td>
                                <td className='fs-6'>2,200.00 </td>
                                <td className='fs-6'>120.00 </td>
                                <td className='fs-6'>MONTO A PAGAR</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    </div>
  )
}
