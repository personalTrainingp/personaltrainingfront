import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useGestionAportes } from './hook/useGestionAportes'
import { useSelector } from 'react-redux'
import { DateMask, DateMaskString, MaskDate, NumberFormatMoney } from '@/components/CurrencyMask'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { arrayFinanzas } from '@/types/type'

export const DataTableAportes = ({idEmpresa, onOpenModalCustomAporte}) => {
  const { obtenerGestionAporte, onDeleteIngresos } = useGestionAportes()
  const {dataView} = useSelector(e=>e.APORTE)
  useEffect(() => {
    obtenerGestionAporte(idEmpresa)
  }, [idEmpresa])
  console.log({dataView});
  
  const columns = [
    { id: 'id', header: <div className=''>ID</div>, accessor: 'id', sortable: true, render:(row)=>{
      return (
        <div style={{width: '30px'}}>
        {row.id}
        </div>
      )
    }},
    { id: 'nComprobante', header: <div className=''>N° COMPR.</div>,  render:(row)=>{
      return (
        <div style={{width: '50px'}}>
        {row.n_comprabante}
        </div>
      )
    } },
    { id: 'nOperacion', header: 'N° Operacion', accessor: 'n_operacion' },
    { id: 'fechaPago', header: 'Fecha Pago', sortable: true, accessor: row => new Date(row.fec_pago).getTime(), render:(row)=>{
      return (
        <>
        {
          MaskDate(row.fec_pago, 'dddd DD [ DE ]  MMMM [DEL] YYYY')
        }
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
    { id: 'grupo', header: 'TIPO DE INGRESO', render:(row)=>{
      return (
        <>
          {arrayFinanzas.find(e=>e.value===row?.tb_parametros_gasto?.id_tipoGasto)?.label}
        </>
      )
    }},
    { id: 'grupo', header: 'RUBRO', render:(row)=>{
      return (
        <>
          {row?.tb_parametros_gasto?.parametro_grupo?.param_label}
        </>
      )
    }},
    { id: 'concepto', header: 'Concepto', render:(row)=>{
      return (
        <>
          {row?.tb_parametros_gasto?.nombre_gasto}
        </>
      )
    }},
    // TIPO DE GASTO
    // RUBRO
    // GASTO
    { id: 'monto', header: 'Monto', render:(row)=>{
      return(
        <div style={{width: '150px'}}>
        <NumberFormatMoney amount={row?.monto}/>
        </div>
      )
    } },
    { id: 'descripcion', header: 'Descripcion', render:(row)=>{
      return (
        <div className='' style={{width: '350px'}}>
        {row.descripcion}
        </div>
      )
    }  },
    { id: 'proveedor', header: <>EMPRESA / PERSONA</>, width: 100, render:(row)=>{
      return (
        <>
        {row.tb_Proveedor?.razon_social_prov}
        </>
      )
    } },
    // { id: 'tipo_comprobante', header: 'Tipo de comprobante', width: 100, headerAlign: 'right', cellAlign: 'left' },
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
