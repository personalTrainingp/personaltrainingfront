import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react'

export const DataTableArticulos = () => {



  const columns = [
    { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
    { id: 'nombre', header: 'Nombre', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'modelo', header: 'Modelo', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'descripcion', header: 'Descripcion', accessor: 'descripcion', width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'ubicacion', header: 'ubicacion', width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'cantidad', header: 'cantidad', width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'costo_unitario_soles', header: <div className='text-center'>costo <br/> unit. S/.</div>, width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'costo_unitario_dolares', header: <div className='text-center'>costo <br/> unit. $</div>, width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'costo_mano_obra_soles', header: <div className='text-center'>costo <br/> MANO OBRA S/.</div>, width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'costo_mano_obra_dolares', header: <div className='text-center'>costo <br/> MANO OBRA $</div>, width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'costo_total_soles', header: <div className='text-center'>costo <br/> TOTAL S/.</div>, width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'costo_total_dolares', header: <div className='text-center'>costo <br/> TOTAL $</div>, width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'action', header: '', width: 70, headerAlign: 'right', cellAlign: 'right', render: ()=>{
        return (
            <>
            <i className='pi pi-pencil p-2 border border-2 border-black my-2'></i>
            <i className='pi pi-box p-2 border border-2 border-black my-2'></i>
            </>
        )
    } },
  ];


  return (
    <>
        <DataTableCR
            columns={columns}
            data={[{}]}
        />
    </>
  )
}
