import React, { useEffect } from 'react'
import { useMovimientoArticulosStore } from './useMovimientoArticulosStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTableMovimientoArticulo = ({accion, idArticulo, onOpenModalCustomMovimientoArticulo}) => {
  const { obtenerMovimientoArticuloxIdArticulo, deleteMovimientoArticulo } = useMovimientoArticulosStore()
	const { dataView } = useSelector((e) => e.MOVIMIENTO);
  useEffect(() => {
    
    obtenerMovimientoArticuloxIdArticulo(accion, idArticulo)
  }, [accion, idArticulo])

  
        const columns = [
    { id: 'id', header: 'ID', accessor: 'id', sortable: true, render: (row)=>{
        return (
            <div style={{width: '70px'}}>
                {row.id}
            </div>
        )
    } },
    
    { id: 'observacion', header: 'Observacion', accessor: 'observacion', render: (row)=>{
        return (
            <div style={{width: '400px'}}>
              {row.observacion}
            </div>
        )
    } },
    { id: 'fecha_cambio', header: 'FECHA', render: (row)=>{
        return (
            <>
            {
                dayjs(row.fechaCambio).format('dddd DD [DE] MMMM [DEL] YYYY')
            }
            </>
        )
    }  },
    
    {
        id: 'empresa', header: 'Empresa', accessor: 'empresa', render: (row)=>{
        return (
            <>
            <div className='' style={{width: '100px'}}>
                {row?.id_empresa}
            </div>
            </>
        )
    } 
    },
    {
        id: 'zona', header: 'zona', accessor: 'zona', render: (row)=>{
        return (
            <>
            <div className='' style={{width: '100px'}}>
                {row?.id_lugar_destino}
            </div>
            </>
        )
    } 
    },
    {
        id: 'motivo', header: 'Motivo', accessor: 'motivo', render: (row)=>{
        return (
            <>
            <div className='' style={{width: '100px'}}>
                {row?.id_motivo}
            </div>
            </>
        )
    } 
    },
    { id: 'accion', header: '', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right', render: (row)=>{
        return (
            <>
            <i className='pi pi-pencil p-2 border border-2 border-black my-2 '  onClick={()=>onOpenModalCustomMovimientoArticulo(row?.id, accion, idArticulo)}></i>
            <i className='pi pi-trash p-2 border border-2 border-black my-2' onClick={()=>onDeleteMovimientoArticulo(row?.id)}></i>
            </>
        )
    }  },
  ];
  const onDeleteMovimientoArticulo = (id)=>{
    confirmDialog(
        {
            header: 'Confirmar eliminación',
            message: '¿Está seguro de eliminar este movimiento?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                deleteMovimientoArticulo(id, accion, idArticulo)
            },
            reject: () => {
                // nothing to do
            }
        }
    )
  }
  return (
    <div>
      <DataTableCR
        data={dataView}
        columns={columns}
      />
    </div>
  )
}
