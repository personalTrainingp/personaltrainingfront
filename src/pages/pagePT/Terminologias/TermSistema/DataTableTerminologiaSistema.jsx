import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { ModalCustomTermSistema } from './ModalCustomTermSistema'
import { useTerminoSistema } from './useTerminoSistema'
import { useSelector } from 'react-redux'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTableTerminologiaSistema = ({onOpenModalTermSis}) => {
  const { obtenerTerminologiaSistema,  deleteTerminologia } = useTerminoSistema()
  const { dataViewTerm } = useSelector(e=>e.TERM)
  useEffect(() => {
    obtenerTerminologiaSistema()
  }, [])
  const columns = [
    {id: 0, header: 'ID', accesor: 'id_param', render:(row)=>{
      return (
        <>
        {row.id_param}
        </>
      )
    }},
    {id: 1, header: 'ENTIDAD', accesor: 'entidad_param', render:(row)=>{
      return (
        <>
        {row.entidad_param}
        </>
      )
    }},
    {id: 2, header: 'GRUPO', accesor: 'grupo_param', render:(row)=>{
      return (
        <>
        {row.grupo_param}
        </>
      )
    }},
    {id: 3, header: 'VALOR', accesor: 'label_param', render:(row)=>{
      return (
        <>
        {row.label_param}
        </>
      )
    }},
    {id: 4, header: '', render:(row)=>{
      return (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
            onClick={()=>onClickOpenModalCustomTermSis(row.id_param)} 
            />
            <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
            onClick={()=>confirmDeleteTSxID(row.id_param)} 
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
        deleteTerminologia(id);
      }
    })
  }
  return (
    <div>
      <DataTableCR
        data={dataViewTerm}
        columns={columns}
      />
    </div>
  )
}
