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
    }},
    { id: 'nOperacion', header: 'N° Operacion', accessor: 'n_operacion'},
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
    { id: 'tipo-ingreso', header: 'TIPO DE INGRESO', render:(row)=>{
      return (
        <>
          {arrayFinanzas.find(e=>e.value===row?.tb_parametros_gasto?.id_tipoGasto)?.label}
        </>
      )
    }},
    { id: 'rubro', header: 'RUBRO', render:(row)=>{
      return (
        <>
          {row?.tb_parametros_gasto?.parametro_grupo?.param_label}
        </>
      )
    }},
    { id: 'concepto', header: 'CONCEPTO', render:(row)=>{
      return (
        <>
          {row?.tb_parametros_gasto?.nombre_gasto}
        </>
      )
    }},
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
            <Button icon="pi pi-copy" rounded outlined severity="danger"  className='mr-2'
            onClick={()=>onClickCopyModalCustomIngresos(row.id)} 
            />
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
            onClick={()=>onClickOpenModalCustomIngresos(row.id)} 
            />
            <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
            onClick={()=>confirmDeleteIngresosxID(row.id)} 
            />
            </>
        )
    } },
  ];
  const columnsExports=[
{
                id: 'id',
                exportHeader: 'ID',
                exportValue: (row) => row.id,
              },
              {
                id: 'nComprobante',
                exportHeader: 'N° COMPR',
                exportValue: (row) => row.n_comprabante,
              },
              {
                id: 'nOperacion',
                exportHeader: 'N° Operacion',
                exportValue: (row) => row.n_operacion,
              },
              {
                id: 'fechaPago',
                exportHeader: 'FECHA DE PAGO',
                exportValue: (row) => MaskDate(row.fec_pago, 'dddd DD [ DE ]  MMMM [DEL] YYYY'),
              },
              {
                id: 'fechaAporte',
                exportHeader: 'FECHA COMPROBANTE',
                exportValue: (row) => MaskDate(row.fec_comprobante, 'dddd DD [ DE ]  MMMM [DEL] YYYY'),
              },
              {
                id: 'tipo-ingreso',
                exportHeader: 'TIPO DE INGRESO',
                exportValue: (row) => arrayFinanzas.find(e=>e.value===row?.tb_parametros_gasto?.id_tipoGasto)?.label,
              },
              {
                id: 'rubro',
                exportHeader: 'RUBRO',
                exportValue: (row) => row?.tb_parametros_gasto?.parametro_grupo?.param_label,
              },
              {
                id: 'concepto',
                exportHeader: 'RUBRO',
                exportValue: (row) => row?.tb_parametros_gasto?.parametro_grupo?.param_label,
              },
  ]
  const onClickOpenModalCustomIngresos = (id)=>{
    onOpenModalCustomAporte(id, false)
  }
  const confirmDeleteIngresosxID = (id)=>{
    confirmDialog({
      message: '¿Estas seguro de eliminar esto?',
      accept: ()=>{
        onDeleteIngresos(id, idEmpresa)
      }
    })
  }
  const onClickCopyModalCustomIngresos = (id)=>{
    onOpenModalCustomAporte(id, true)
  }
  return (
    <div>
        <DataTableCR
            columns={columns}
            data={dataView}
            exportExtraColumns={columnsExports}
        />
    </div>
  )
}
