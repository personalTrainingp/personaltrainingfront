import { DataTableCR } from '@/components/DataView/DataTableCR'
import React from 'react'

export const DataTableMembresiasAgrupadas = ({data}) => {

const columns =[
    {id: 1, header: 'NOMBRES DEL CLIENTE', render: (row)=>{
        return (
            <>
            {row.label}
            </>
        )
    }},
    {id: 2, header: 'CHANGE 45', sortable: true, accessor: (r)=>r.change?.length, render: (row)=>{
        return (
            <>
            {row.change?.length}
            </>
        )
    }},
    {id: 3, header: 'FS 45', sortable: true, accessor: (r)=>r.fs?.length, render: (row)=>{
        return (
            <>
            {row.fs?.length}
            </>
        )
    }},
    {id: 4, header: 'FISIO MUSCLE', sortable: true, accessor: (r)=>r.fisioMuscle?.length, render: (row)=>{
        return (
            <>
            {row.fisioMuscle?.length}
            </>
        )
    }},
]
  return (
    <>
    <DataTableCR
        columns={columns}
        data={data}
    />
    </>
  )
}
