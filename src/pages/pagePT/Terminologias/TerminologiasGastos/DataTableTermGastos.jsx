import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useTerminosStore } from '../useTerminosStore'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { useSelector } from 'react-redux'
import { DateMaskStr, DateMaskStr1, DateMaskStr2, NumberFormatMoney } from '@/components/CurrencyMask'

export const DataTableTermGastos = ({id_empresa, tipo, onOpenModalCustomTermGastos}) => {
  const { obtenerTerms2xEmpresaxTipo, deleteTerm2xID, isLoading } = useTerminosStore()
  const {dataViewTerm2} = useSelector(e=>e.TERM)
  console.log({dataViewTerm2});
  
  useEffect(() => {
    obtenerTerms2xEmpresaxTipo(id_empresa, tipo)
  }, [id_empresa, tipo])
  
  const columns = [
    {id: 'id', header: 'ID', accessor: 'id', render: (row)=>{
      return (
        <>
        {row.id}
        </>
      )
    },  exportHeader: 'id',
  exportValue: (row) => row.id},
    {id: 'grupo', header: 'GRUPO', accessor: 'label_grupo',  render: (row)=>{
      return (
        <>
        {row?.parametro_grupo?.param_label}
        </>
      )
    },  exportHeader: 'grupo',
  exportValue: (row) => row.parametro_grupo?.param_label},
    {
      id: 'concepto', header: 'CONCEPTO', accessor: 'nombre_gasto', render:(row)=>{
        return (
          <>
          {row.nombre_gasto}
          </>
        )
      },  exportHeader: 'CONCEPTO',
  exportValue: (row) => row.nombre_gasto
    },
    {
      id: 'monto_proyectado', header: 'MONTO PROYECTADO', accessor: 'monto_proyectado', render:(row)=>{
        return (
          <>
          <NumberFormatMoney
            amount=
            {row.monto_proyectado}
          />
          </>
        )
      },  exportHeader: 'CONCEPTO',
  exportValue: (row) => row.nombre_gasto
    },
    {
      id: 'fecha_inicio', header: 'FECHA DE INICIO', accessor: 'fecha_inicio', render:(row)=>{
        return (
          <>
          {DateMaskStr(row.fecha_inicio, 'MMMM YYYY')}
          </>
        )
      },  exportHeader: 'CONCEPTO',
  exportValue: (row) => row.nombre_gasto
    },
    {
      id: 'fecha_fin', header: 'FECHA DE FIN', accessor: 'fecha_fin', render:(row)=>{
        return (
          <>
          {
            row.sin_limite?('SIN LIMITE'):(
              <>
                {DateMaskStr(row.fecha_fin, 'MMMM YYYY')}
              </>
            )
          }
          </>
        )
      },  exportHeader: 'CONCEPTO',
  exportValue: (row) => row.nombre_gasto
    },
    {
      id: 'orden', header: 'ORDEN',sortable: true, accessor: 'orden', render:(row)=>{
        return (
          <>
          {row.orden}
          </>
        )
      },  exportHeader: 'orden',
  exportValue: (row) => row.orden
    },
    {
      id: 'tipogasto', accessor: 'id_tipoGasto', header: 'TIPO GASTO', render:(row)=>{
        return (
          <>
          
          {row.id_tipoGasto}
          </>
        )
      },  exportHeader: 'id_tipoGasto',
  exportValue: (row) => row.id_tipoGasto
    },
    {
      id: 'ACTION', header: '', render:(row)=>{
        return (
          <>
          
                      <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
                      onClick={()=>onClickOpenModalCustomIngresos(row.id)} 
                      />
                      <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
                      onClick={()=>confirmDeleteIngresosxID(row.id)} 
                      />
          </>
        )
      }
    }
  ]
  const onClickOpenModalCustomIngresos=(id)=>{
    onOpenModalCustomTermGastos(id)
  }
  const confirmDeleteIngresosxID=(id)=>{
    confirmDialog({
      message: '¿QUIERES ELIMINAR ESTE CONCEPTO?',
      accept: ()=>{
        deleteTerm2xID(id, id_empresa, tipo);
      }
    })
  }
  
  return (
    <div  style={{width: '100%'}}>
      <DataTableCR
        columns={columns}
        data={dataViewTerm2}
        loading={isLoading}
      />
    </div>
  )
}
