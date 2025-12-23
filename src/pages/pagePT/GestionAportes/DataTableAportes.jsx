import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useGestionAportes } from './hook/useGestionAportes'
import { useSelector } from 'react-redux'
import { DateMask, DateMaskString, MaskDate, NumberFormatMoney } from '@/components/CurrencyMask'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTableAportes = ({idEmpresa, onOpenModalCustomAporte}) => {
  const { obtenerGestionAporte, onDeleteIngresos } = useGestionAportes()
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
          {row?.tb_parametros_gasto?.nombre_gasto}
        </>
      )
    }},
    { id: 'proveedor', header: 'Institucion o Aportante', width: 100, render:(row)=>{
      return (
        <>
        {row.tb_Proveedor?.razon_social_prov}
        </>
      )
    } },
    // { id: 'tipo_comprobante', header: 'Tipo de comprobante', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'monto', header: 'Monto', render:(row)=>{
      return(
        <>
        <NumberFormatMoney amount={row.monto}/>
        </>
      )
    } },
    { id: 'fechaAporte', header: 'Fecha comprobante', render:(row)=>{
      return (
        <>
        {
          MaskDate(row.fec_comprobante, 'dddd DD [ DE ]  MMMM [DEL] YYYY')
        }
        </>
      )
    } },
    { id: 'fechaPago', header: 'Fecha Pago', render:(row)=>{
      return (
        <>
        {
          MaskDate(row.fec_pago, 'dddd DD [ DE ]  MMMM [DEL] YYYY')
        }
        </>
      )
    } },
    { id: 'nOperacion', header: 'N° Operacion', accessor: 'n_operacion' },
    { id: 'nComprobante', header: 'N° comprobante', accessor: 'n_comprabante' },
    { id: 'descripcion', header: 'Descripcion', accessor: 'descripcion' },
    { id: '', header: '', render:(row)=>{
        return (
            <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
            onClick={()=>onClickOpenModalCustomIngresos(row.id)} 
            />
            <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
            onClick={()=>confirmDeleteIngresosxID(row.id)} 
            />
            {/* <Button icon="pi pi-copy" rounded outlined severity="danger" 
            onClick={onClickCopyModalIngresos} 
            /> */}
            </>
        )
    } },
  ];
  const onClickOpenModalCustomIngresos = (id)=>{
    onOpenModalCustomAporte(id)
  }
  const confirmDeleteIngresosxID = (id)=>{
    confirmDialog({
      message: '¿Estas seguro de eliminar esto?',
      accept: ()=>{
        onDeleteIngresos(id, idEmpresa)
      }
    })
  }
  const onClickCopyModalIngresos=()=>{

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
