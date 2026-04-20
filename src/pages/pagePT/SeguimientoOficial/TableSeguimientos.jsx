import React, { useEffect, useMemo, useState } from 'react'
import { useSeguimientoStore } from './useSeguimientoStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { DateMaskStr } from '@/components/CurrencyMask'

export const TableSeguimientos = ({rangeDate=[], title='SEG', dataSeguimientoxFecha}) => {

        console.log({dataSeguimientoxFecha, rangeDate});
        const [data, setdata] = useState([])
        useEffect(() => {
            setdata(
                dataSeguimientoxFecha.filter(f => {
                    const fecha = new Date(f.fecha_vencimiento);
                    return fecha >= new Date(rangeDate[0]) && fecha <= new Date(rangeDate[1]);
                })
            )
        }, [rangeDate])
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
        const columnsExports = [
            {
                id: 'id',
                exportHeader: 'ID',
                exportValue: (row) => row.id,
		    },
            {
                id: 'cliente',
                exportHeader: 'CLIENTE',
                exportValue: (row)=>`${row.cli?.nombre_cli} ${row.cli?.apPaterno_cli} ${row.cli?.apMaterno_cli}`
            },
            {
                id: 'diasvencidos',
                exportHeader: 'FECHA DE VENCIMIENTO',
                exportValue: (row)=>`${DateMaskStr(row.fecha_vencimiento, 'YYYY-MM-DD')}`
            },
        ]
  return (
    <div>ss
        <span>
            {title} TOTAL 
            
        </span>
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        <DataTableCR
            exportExtraColumns={columnsExports}
            columns={columns}
            data={data}
        />
    </div>
  )
}
