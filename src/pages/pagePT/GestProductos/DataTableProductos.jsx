import { DataTableCR } from '@/components/DataView/DataTableCR'
import { useProductoStore } from './hook/useProductosStore'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NumberFormatMoney } from '@/components/CurrencyMask'

export const DataTableProductos = ({idEmpresa}) => {
  const { obtenerProductos } = useProductoStore()
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
    { id: 'categoria', header: 'Categoria', sortable: true, width: 50 },
    { id: 'proveedor', header: 'Proveedor', sortable: true, width: 50 },
    { id: 'stock', header: <div >stock</div>, accessor: 'fechaDesde', render: (row)=>{
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
    { id: 'prec_compra', header: 'Precio de compra', render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.prec_compra}/>
        </>
      )
    } },
    { id: 'prec_venta', header: 'Precio de venta', accessor: 'prec_venta',render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.prec_venta}/>
        </>
      )
    } },
    { id: 'estado', header: 'estado', render: (row)=>{
      return (
        <>
        {row.estado_product}
        </>
      )
    } },
    { id: 'action', header: '', render:()=>{
      return (
        <>
        
        </>
      )
    } },
  ];
  useEffect(() => {
    obtenerProductos(idEmpresa)
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
