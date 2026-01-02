import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { useProductosStore } from './hook/useProductosStore'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { arrayEstados } from '@/types/type'
import { Badge } from 'react-bootstrap'

export const DataTableProductos = ({idEmpresa, onOpenModalCustomProducto}) => {
  const { obtenerProductosxEmpresa, startDeleteProductoxIdProducto } = useProductosStore()
  const { dataView } = useSelector(e=>e.PRODUCTO)
  const columns = [
    { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 50 },
    { id: 'producto', header: 'Producto',  render: (row)=>{
      return (
        <div style={{width: '140px'}}>
        {row.nombre_producto}
        </div>
      )
    }  },
    { id: 'categoria', header: 'Categoria', render: (row)=>{
      return (
        <div className='' style={{width: '150px'}}>
        {row.objCategoria?.label_param}
        </div>
      )
    } },
    { id: 'proveedor', header: 'Proveedor', sortable: true, render: (row)=>{
      return (
        <div className='' style={{width: '30px'}}>
        {row.objProveedor?.razon_social_prov}
        </div>
      )
    } },
    { id: 'stock', header: <div >stock</div>, sortable: true, accessor: 'stock_producto', render: (row)=>{
      return (
        <div className='' style={{width: '30px'}}>
        {row.stock_producto}
        </div>
      )
    } },
    { id: 'stock_minimo', header: <div >stock minimo</div>, accessor: 'fechaDesde', render: (row)=>{
      return (
        <div className='' style={{width: '30px'}}>
        {row.stock_producto}
        </div>
      )
    } },
    { id: 'prec_compra', header: 'Precio de compra', sortable: true, accessor: 'prec_compra', render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.prec_compra}/>
        </>
      )
    } },
    { id: 'prec_venta', header: 'Precio de venta', sortable: true, accessor: 'prec_venta',render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.prec_venta}/>
        </>
      )
    } },
    { id: 'estado', header: 'estado', render: (row)=>{
      return (
        <>
            <Badge bg={arrayEstados.find(e=>e.value===row.estado_product)?.severity}>{arrayEstados.find(e=>e.value===row.estado_product)?.label}</Badge>
        </>
      )
    } },
    { id: 'action', header: '', render:(row)=>{
      return (
        <>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
          onClick={()=>onClickOpenModalCustomProducto(row.id)} 
          />
        <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
        onClick={()=>confirmDeleteProductoxID(row.id)} 
          />
        </>
      )
    } },
  ];
  const onClickOpenModalCustomProducto = (id)=>{
    onOpenModalCustomProducto(id)
  }
  const confirmDeleteProductoxID = (id)=>{
    confirmDialog({
      message: '¿Quieres eliminar este producto?',
      accept: ()=>{
        startDeleteProductoxIdProducto(id)
      }
    })
  }
  useEffect(() => {
    obtenerProductosxEmpresa(idEmpresa)
  }, [idEmpresa])
  return (
    <div>
        <DataTableCR
          columns={columns}
          data={dataView}
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
    </div>
  )
}
