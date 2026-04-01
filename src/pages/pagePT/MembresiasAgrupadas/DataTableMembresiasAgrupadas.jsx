import { DataTableCR } from '@/components/DataView/DataTableCR'
import React from 'react'

export const DataTableMembresiasAgrupadas = ({data, onOpenModalDetalle}) => {

const columns =[
    {id: 0, header: '', render: (row, i)=>{
        return (
            <>
            {i+1}
            </>
        )
    }},
    {id: 1, header: <div className='fs-2' >SOCIO</div>, render: (row)=>{
        return (
            <div style={{width: '550px'}}>
            {row.label}
            </div>
        )
    }},
    {id: 5, header:  <div style={{width: '80px'}} className='fs-3'>TOTAL</div>, sortable: true, accessor: (r)=>r.items?.length, render: (row)=>{
        return (
            <div className='text-change text-center' onClick={()=>onOpenModalDetalleClick(row.items)}>
            {row.items?.length}
            </div>
        )
    }},
    {id: 2, header: <div style={{width: '110px'}} className='fs-3'>CHANGE <br/> 45</div>, sortable: true, accessor: (r)=>r.change?.length, render: (row)=>{
        return (
            <div className='text-center' onClick={()=>onOpenModalDetalleClick(row.change)}>
            {row.change?.length}    
            </div>
        )
    }},
    {id: 3, header:  <div style={{width: '40px'}} className='fs-3'>FS <br/> 45</div>, sortable: true, accessor: (r)=>r.fs?.length, render: (row)=>{
        return (
            <div className='text-center'  onClick={()=>onOpenModalDetalleClick(row.fs)}>
            {row.fs?.length}
            </div>
        )
    }},
    {id: 4, header:  <div style={{width: '100px'}} className='fs-3'>FISIO <br/> MUSCLE</div>, sortable: true, accessor: (r)=>r.fisioMuscle?.length, render: (row)=>{
        return (
            <div className='text-center'  onClick={()=>onOpenModalDetalleClick(row.fisioMuscle)}>
            {row.fisioMuscle?.length}
            </div>
        )
    }},
]
const onOpenModalDetalleClick = (detalle)=>{
    onOpenModalDetalle(detalle)
}
  return (
    <div className='d-flex' style={{width: '1300px'}}>
    <DataTableCR
        columns={columns}
        data={data}
    />
    </div>
  )
}
