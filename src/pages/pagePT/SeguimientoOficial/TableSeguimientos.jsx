import React, { useEffect } from 'react'
import { useSeguimientoStore } from './useSeguimientoStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { DateMaskStr } from '@/components/CurrencyMask'

export const TableSeguimientos = ({rangeDate, title='SEG'}) => {
    
        const { obtenerSeguimientoxFecha, dataSeguimientoxFecha } = useSeguimientoStore()
        useEffect(() => {
            obtenerSeguimientoxFecha([rangeDate[0], rangeDate[1]])
        }, [])
        console.log({dataSeguimientoxFecha, rangeDate});
        const columns=[
            {id: 0, header: 'id', render: (row, index)=>{
                return (
                    <>
                    <span>
                        {index+1}
                    </span>
                    </>
                )
            }},
            {id: 1, header: 'SOCIO', render: (row)=>{
                return (
                    <>
                    <span>
                        {row.cli?.nombre_cli} {row.cli?.apPaterno_cli} {row.cli?.apMaterno_cli}
                    </span>
                    </>
                )
            }},
            {id: 2, header: <>PROGRAMA/SESIONES/<br/>HORARIO</>},
            {id: 3, header: <>DIAS <br/> VENCIDOS</>, render: (row)=>{
                return (
                    <>
                    <span>
                        {DateMaskStr(row?.fecha_vencimiento, 'dddd DD [DE] MMMM [DEL] YYYY')}
                    </span>
                    </>
                )
            }},
            {id: 4, header: <>fecha de <br/> vencimiento</>, render: (row)=>{
                return (
                    <>
                    <span>
                        {DateMaskStr(row?.fecha_vencimiento, 'dddd DD [DE] MMMM [DEL] YYYY')}
                    </span>
                    </>
                )
            }},
            {id: 5, header: <>sesiones<br/> congelamiento/ <br/> regalo</>},
        ]
  return (
    <div>
        <span>
            {title} TOTAL {dataSeguimientoxFecha.length}
        </span>
        <DataTableCR
            columns={columns}
            data={dataSeguimientoxFecha}
        />
    </div>
  )
}
