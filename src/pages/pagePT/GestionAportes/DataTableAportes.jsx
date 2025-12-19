import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useGestionAportes } from './hook/useGestionAportes'
import { useSelector } from 'react-redux'

export const DataTableAportes = ({idEmpresa, onOpenModalCustomAporte}) => {
  const { obtenerGestionAporte } = useGestionAportes()
  const {dataView} = useSelector(e=>e.APORTE)
  useEffect(() => {
    obtenerGestionAporte(idEmpresa)
  }, [idEmpresa])
  console.log({dataView});
  
  const columns = [
    { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
    { id: 'fechaRegistro', header: 'Concepto', render:(row)=>{
      return (
        <>
          {row?.concepto?.label_param}
        </>
      )
    }},
    { id: 'proveedor', header: 'Institucion o Aportante', width: 100, headerAlign: 'right', cellAlign: 'left' },
    // { id: 'tipo_comprobante', header: 'Tipo de comprobante', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'monto', header: 'Monto', render:(row)=>{
      return(
        <>
          {row.monto}
        </>
      )
    } },
    { id: 'fechaAporte', header: 'Fecha comprobante', render:(row)=>{
      return (
        <>
          {row.fecha_comprobante}
        </>
      )
    } },
    { id: 'formaPago', header: 'Forma Pago', render:(row)=>{
      return (
        <>
          {row.fecha_comprobante}
        </>
      )
    } },
    { id: 'fechaPago', header: 'Fecha Pago', render:(row)=>{
      return (
        <>
          {row.fecha_pago}
        </>
      )
    } },
    { id: 'nOperacion', header: 'N° Operacion', accessor: 'n_operacion' },
    { id: 'nComprobante', header: 'N° comprobante', accessor: 'n_comprobante' },
    { id: 'descripcion', header: 'Descripcion', accessor: 'descripcion' },
    { id: '', header: '', render:()=>{
        return (
            <>
            <i className='pi pi-trash'></i>
            <i className='pi pi-box'></i>
            </>
        )
    } },
  ];
  const onClickOpenModalCustomAportes = ()=>{
    // onOpenModalCustomAporte()
  }
  return (
    <div>
        <DataTableCR
            columns={columns}
            data={dataView}
        />
    </div>
  )
}
