import React, { useEffect } from 'react'
import { useVentasPagosStore } from './useVentasPagosStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { DateMask, NumberFormatMoney } from '@/components/CurrencyMask'

export const AppReportePagosVentas = () => {
  const { dataPagosVentas, obtenerPagosVentas } = useVentasPagosStore()
  useEffect(() => {
    obtenerPagosVentas()
  }, [])
  
  const impuestos = [
    {id_forma_pago: 1389, id_tipo_tarjeta: 35, id_banco: 50, n_cuotas: 0, porcentaje: 3},
    {id_forma_pago: 1389, id_tipo_tarjeta: 37, id_banco: 50, n_cuotas: 3, porcentaje: 6.29},
    {id_forma_pago: 1389, id_tipo_tarjeta: 37, id_banco: 52, n_cuotas: 3, porcentaje: 6.29},
    {id_forma_pago: 1389, id_tipo_tarjeta: 37, id_banco: 52, n_cuotas: 6, porcentaje: 8.29},
    {id_forma_pago: 1389, id_tipo_tarjeta: 37, id_banco: 51, n_cuotas: 0, porcentaje: 3.29},
  ]
  const dataPagos = dataPagosVentas.flatMap(({ detalleVenta_pagoVenta, ...venta }) =>
    detalleVenta_pagoVenta.map(pago => {
      const identificador = `${pago?.id_forma_pago}|${pago?.id_tipo_tarjeta}|${pago?.id_banco}|${pago?.n_cuotas}`
      return {
        ...venta,
        pago,
        identificador,
        porcentaje: impuestos.find((f)=>`${f.id_forma_pago}|${f.id_tipo_tarjeta}|${f.id_banco}|${f.n_cuotas}`===identificador)?.porcentaje || 0
      }
      }
    )
  );
  const columns = [
    {id: 7, header: 'FECHA DE VENTA', render:(row)=>{
      return (
        <>
        <DateMask
          date={row.pago?.fecha_pago}
          format={'dddd DD [DE] MMMM [DEL] YYYY'}
        />
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
    {id: 1, header: 'N° OPERACION', render: (row)=>{
      return (
        <>
          {row.pago.n_operacion}
        </>
      )
    }},
    {id: 2, header: 'FORMA DE PAGO', render:(row)=>{
      return (
        <>
        {row.pago?.parametro_forma_pago?.id_param} | {row.pago?.parametro_forma_pago?.label_param}
        </>
      )
    }},
    {id: 3, header: 'TIPO DE TARJETA', render:(row)=>{
      return (
        <>
        {row.pago?.parametro_tipo_tarjeta?.id_param} | {row.pago?.parametro_tipo_tarjeta?.label_param}
        </>
      )
    }},
    {id: 4, header: 'BANCO', render:(row)=>{
      return (
        <>
          {row.pago?.parametro_banco?.id_param} | {row.pago?.parametro_banco?.label_param}
        </>
      )
    }},
    {id: 5, header: 'NUMERO DE CUOTAS', render:(row)=>{
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
    {id: 7, header: 'COMISION', accessor: 'porcentaje', sortable: true, render:(row)=>{
      return (
        <>
        <NumberFormatMoney amount=
        {row.pago?.parcial_monto*(row.porcentaje/100)}
        />
        </>
      )
    }},
    {id: 7, header: 'IGV', render:(row)=>{
      return (
        <>
        <NumberFormatMoney amount=
        {1.18}
        />
        </>
      )
    }},
    {id: 7, header: 'TOTAL', render:(row)=>{
      return (
        <>
        <NumberFormatMoney amount=
        {(row.pago?.parcial_monto*(row.porcentaje/100))*1.18}
        />
        </>
      )
    }},
  ]
  return (
    <div>
      <DataTableCR 
        columns={columns}
        data={dataPagos}
      />
    </div>
  )
}
