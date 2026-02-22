import { DataTableCR } from '@/components/DataView/DataTableCR'
import React from 'react'
import { useGestionProveedoresStore } from './useGestionProveedoresStore'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { Link } from 'react-router-dom'

export const DataTableGestionProveedores = ({id_empresa, tipo, estado, onOpenModalCustomProv}) => {
    const {dataProveedores} = useSelector(e=>e.prov)
    const { obtenerProveedoresxEmpresaxTipoxEstado } = useGestionProveedoresStore()
    useEffect(() => {
      obtenerProveedoresxEmpresaxTipoxEstado(id_empresa, tipo, estado)
    }, [])
    
    const columns = [
        {id: 0, header: 'ID', accessor: 'id'},
        {id: 1, header: 'SERVICIO Y/O PRODUCTO', render:(row)=>{
          return (
            <>
            {row.servicio}
            </>
          )
        }},
        {id: 2, header: 'MARCA', render:(row)=>{
          return (
            <>
            {row.marca}
            </>
          )
        }},
        {id: 3, header: 'NOMBRE DEL CONTACTO', render:(row)=>{
          return (
            <>
            {row.nombre_vend_prov}
            </>
          )
        }},
        {id: 4, header: 'RAZON SOCIAL', render:(row)=>{
          return (
            <>
            {row.razon_social_prov}
            </>
          )
        }},
        {id: 5, header: 'CELULAR DEL CONTACTO', render:(row)=>{
          return (
            <>
            {row.cel_prov}
            </>
          )
        }},
        {id: 'action', header: '', render:(row)=>{
          return (
            <div className='d-flex align-items-center'>
              <Link to={`/perfil-proveedor/${row.uid}`} className="action-icon text-primary" style={{fontSize: '14px', color: 'blue', textDecoration: 'underline'}}>
                              Ver Perfil
                          </Link>
            <Button icon="pi pi-copy" onClick={()=>onCopyData(row?.id)} rounded outlined severity="danger" />
            </div>
          )
        }},
    ]
    const columnsExports=[

    ]
    const onCopyData = (id)=>{
      onOpenModalCustomProv(id, true)
    }
  return (
    <>
      <DataTableCR
          data={dataProveedores}
          columns={columns}
          exportExtraColumns={columnsExports}
      />
    </>
  )
}
