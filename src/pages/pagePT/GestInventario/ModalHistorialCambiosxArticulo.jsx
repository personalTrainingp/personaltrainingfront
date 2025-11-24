import { DataTableCR } from '@/components/DataView/DataTableCR'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { useInventarioStore } from './hook/useInventarioStore'
import dayjs from 'dayjs'
import { typesCRUD } from '@/types/type'

export const ModalHistorialCambiosxArticulo = ({show, onHide, id}) => {
  const { obtenerInventarioHistorialCambiosxIDARTICULO, dataHistorialCambiosxIDArticulo } = useInventarioStore()
  useEffect(() => {
    if(id!==0){
      obtenerInventarioHistorialCambiosxIDARTICULO(id)
    }
  }, [id, show])
  
  const columns = [
    { id: 'id', header: 'Id', accessor: 'id_hc', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left', render:(row)=>{
      return row.id_hc
    } },
    { id: 'fecha', header: 'fecha', accessor: 'createdAt', width: 100, headerAlign: 'right', cellAlign: 'left', render:(row)=>{
      return dayjs.utc(row.updatedAt).format('dddd DD [DEL] MMMM [DE] YYYY [A LAS] HH:mm A')
    } },
    // { id: 'nombre', header: 'campos actualizados', accessor: 'nombre', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'usuario', header: 'Usuario', accessor: 'id_usuario', width: 100, headerAlign: 'right', cellAlign: 'left', render:(row)=>{
      return row.usuario?.usuario_user
    } },
    { id: 'accion', header: 'accion', accessor: 'id_accion', width: 100, headerAlign: 'right', cellAlign: 'left', render:(row)=>{
      return (
        <>
        {typesCRUD.find(e=>e.id===row.id_accion)?.method}
        </>
      )
    } },
  ];
  return (
    <Dialog visible={show} onHide={onHide} header='HISTORIAL DE CAMBIOS'>
            <DataTableCR
              columns={columns}
              data={dataHistorialCambiosxIDArticulo}
              defaultPageSize={25}
              pageSizeOptions={[10, 25, 50, 100]}
              striped={false}
              small
              responsive
              syncUrl
              pageParam="page"          // opcional (default: "page")
              pageSizeParam="pageSize"  // opcional (default: "pageSize")
              verticalBorders
              resizableColumns
            />
    </Dialog>
  )
}
