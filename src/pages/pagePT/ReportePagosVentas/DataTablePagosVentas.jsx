import React, { useEffect } from 'react'
import { useVentasPagosStore } from './useVentasPagosStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { DateMask, NumberFormatMoney } from '@/components/CurrencyMask'
import { Button } from 'primereact/button'
import { useSelector } from 'react-redux'

export const DataTablePagosVentas = ({onOpenModalCustomPagos}) => {
  const { obtenerPagosVentas } = useVentasPagosStore()
  useEffect(() => {
    obtenerPagosVentas()
  }, [])
  const { dataView } = useSelector(e=>e.PAGOSVENTAS)

  const columns = [
    {id: 7, header: 'FECHA DE VENTA', render:(row)=>{
      return (
        <>
        {row.fecha_pago_1}
        {/* <DateMask
          date={row.pago?.fecha_pago}
          format={'dddd DD [DE] MMMM [DEL] YYYY'}
        /> */}
        </>
      )
    }},
    {
      id: 15, header: 'ID VENTA', render: (row)=>{
      return (
        <>
        {row.id}
        </>
      )
    }
    },
    {id: 14, header: 'NOMBRE DEL CLIENTE', render: (row)=>{
      return (
        <>
        {row.tb_cliente.nombre_cli} {row.tb_cliente.apPaterno_cli} {row.tb_cliente.apMaterno_cli}
        </>
      )
    }},
    {id: 13, header: 'COMPROBANTE', render: (row)=>{
      return (
        <>
          boleta
          <br/>
          {row.numero_transac}
        </>
      )
    }},
    {id: 0, header: 'VENTA', render:(row)=>{
      return (
        <>
        <NumberFormatMoney
          amount=
          {row.pago?.parcial_monto}
        />
        </>
      )
    }},
    {id: 1, header: 'OPERACION', render: (row)=>{
      return (
        <>
          {row.pago.n_operacion}
        </>
      )
    }},
    {id: 2, header: 'FORMA DE PAGO', render:(row)=>{
      return (
        <>
        {/* {row.pago.id_forma_pago} |  */}
        {row.pago?.parametro_forma_pago?.label_param}
        </>
      )
    }},
    {id: 3, header: 'TIPO DE TARJETA', render:(row)=>{
      return (
        <>
        {/* {row.pago.id_tipo_tarjeta} |  */}
        {row.pago?.parametro_tipo_tarjeta?.label_param}
        </>
      )
    }},
    {id: 4, header: 'BANCO', render:(row)=>{
      return (
        <>
          {/* {row.pago.id_banco} |  */}
          {row.pago?.parametro_banco?.label_param}
        </>
      )
    }},
    {id: 5, header: 'CUOTAS', render:(row)=>{
      return (
        <>
        {row.pago?.n_cuotas}
        </>
      )
    }},
    {id: 6, header: '%', accessor: 'porcentaje', sortable: true, render:(row)=>{
      return (
        <>
        
        {row.porcentaje}
        </>
      )
    }},
    {id: 8, header: 'COMISION', accessor: 'porcentaje', sortable: true, render:(row)=>{
      return (
        <>
        <NumberFormatMoney amount=
        {row.pago?.parcial_monto*(row.porcentaje/100)}
        />
        </>
      )
    }},
    {id: 9, header: 'IGV', render:(row)=>{
      return (
        <>
        <NumberFormatMoney amount=
        {row.pago?.parcial_monto*(row.porcentaje/100)*1.18-row.pago?.parcial_monto*(row.porcentaje/100)}
        />
        </>
      )
    }},
    {id: 10, header: 'TOTAL', render:(row)=>{
      return (
        <>
        <NumberFormatMoney amount=
        {(row.pago?.parcial_monto*(row.porcentaje/100))*1.18}
        />
        </>
      )
    }},
    {id: 11, header: '', render:(row)=>{
      return (
        <>
        <Button icon={'p'} onClick={()=>onClickEdit(row.pago?.id)}/>
        </>
      )
    }},
  ]
  const onClickEdit = (id)=>{
    onOpenModalCustomPagos(id)
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
