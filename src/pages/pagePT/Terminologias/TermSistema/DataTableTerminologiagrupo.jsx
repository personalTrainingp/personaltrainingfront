import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { ModalCustomTermSistema } from './ModalCustomTermSistema'
import { useTerminoSistema } from './useTerminoSistema'
import { useSelector } from 'react-redux'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTableTerminologiagrupo = ({onOpenModalTermSis, titulo, id_empresa}) => {
  const { obtenerGruposxEmpresa, deleteTerminoGrupoxID } = useTerminoSistema()
  const { dataViewTerm4 } = useSelector(e=>e.TERM)
  useEffect(() => {
    obtenerGruposxEmpresa(id_empresa)
  }, [id_empresa])
  const columns = [
    {id: 0, header: 'ID', accessor: 'id', render:(row)=>{
      return (
        <>
        {row.id}
        </>
      )
    }},
    {id: 3, header: `${titulo}`, accessor: 'param_label', render:(row)=>{
      return (
        <>
        {row.param_label}
        </>
      )
    }},
    {id: 3, header: `ORDEN`, accessor: 'orden', render:(row)=>{
      return (
        <>
        {row.orden}
        </>
      )
    }},
    {id: 4, header: '', render:(row)=>{
      return (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
            onClick={()=>onClickOpenModalCustomTermSis(row.id)} 
            />
            <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
            onClick={()=>confirmDeleteTSxID(row.id)} 
            />
        </>
      )
    }},
  ]
  const onClickOpenModalCustomTermSis=(id)=>{
    onOpenModalTermSis(id)
  }
  const confirmDeleteTSxID=(id)=>{
    confirmDialog({
      message: '¿QUIERES ELIMINAR ESTE CONCEPTO?',
      accept: ()=>{
        deleteTerminoGrupoxID(id, id_empresa);
      }
    })
  }
  return (
    <div>
      <DataTableCR
        data={dataViewTerm4}
        columns={columns}
      />
    </div>
  )
}
