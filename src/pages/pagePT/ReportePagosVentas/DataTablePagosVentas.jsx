import React, { useEffect } from 'react'
import { useVentasPagosStore } from './useVentasPagosStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { DateMask, DateMaskStr1, MaskDate, NumberFormatMoney } from '@/components/CurrencyMask'
import { Button } from 'primereact/button'
import { useSelector } from 'react-redux'

export const DataTablePagosVentas = ({onOpenModalCustomPagos}) => {
  const { obtenerPagosVentas } = useVentasPagosStore()
  useEffect(() => {
    obtenerPagosVentas()
  }, [])
  const { dataView } = useSelector(e=>e.PAGOSVENTAS)

  const onClickEdit = (id)=>{
    onOpenModalCustomPagos(id)
  }
  
  const columns = [
    {id: 7, header: 'FECHA DE VENTA', render:(row)=>{
      return (
        <>

        {row.fecha_pago_1}
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
        {row.tb_cliente?.nombre_cli} {row.tb_cliente?.apPaterno_cli} {row.tb_cliente?.apMaterno_cli}
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
    {id: 15, header: 'OPERADORES', render:(row)=>{
      return (
        <>
        {/* {row.pago.id_forma_pago} |  */}
        {row.pago?.parametro_operador?.label_param}
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
      const id_banco = row.pago?.parametro_banco?.id_param
      // 259 
      return (
        <>
          {/* {row.pago.id_banco} |  */}
          {row.pago?.parametro_banco?.label_param}  
          <br/>
          <span className='text-change'>
          {(id_banco!==259 || id_banco==0)?( row.pago?.es_nacional?'NACIONAL':'INTERNACIONAL'):''}
          </span>
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
        
        {row.porcentaje.toFixed(2)}
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
    {id: 10, header: <>COMISION <br/> TOTAL</>, render:(row)=>{
      return (
        <div className='text-change'>
        <NumberFormatMoney className='fs-2' amount=
        {(row.pago?.parcial_monto*(row.porcentaje/100))*1.18}
        />
        </div>
      )
    }},
    {id: 11, header: 'EDITAR', render:(row)=>{
      return (
        <>
        <Button icon={'pi pi-pencil'} onClick={()=>onClickEdit(row.pago?.id)}/>
        </>
      )
    }},
  ]
    const columnsExports = [
      {
        id: 'id',
        exportHeader: 'ID',
        exportValue: (row) => row.id,
      },
      {
        id: 'fechaPago',
        exportHeader: 'FECHA DE PAGO',
        exportValue: (row) => row.fecha_pago_1,
      },
      {
        id: 'id_venta',
        exportHeader: 'id venta',
        exportValue: (row) => row.id_venta,
      },
      {
        id: 'nombres_apellidos',
        exportHeader: 'nombres y apellidos del cliente',
        exportValue: (row) => `${row.tb_cliente.nombre_cli} ${row.tb_cliente.apPaterno_cli} ${row.tb_cliente.apMaterno_cli}`,
      },
      {
        id: 'comprobante',
        exportHeader: 'numero de comprobante',
        exportValue: (row) =>
          row.numero_transac,
      },
      {
        id: 'PARCIAL PAGO',
        exportHeader: 'MONTO PARCIAL',
        exportValue: (row) => row.pago.parcial_monto,
      },
      {
        id: 'operacion',
        exportHeader: 'OPERACION',
        exportValue: (row) => row?.pago.n_operacion,
      },
      {
        id: 'forma_pago',
        exportHeader: 'FORMA DE PAGO',
        exportValue: (row) => row?.pago?.parametro_forma_pago?.label_param,
      },
      {
        id: 'tipo_tarjeta',
        exportHeader: 'TIPO DE TARJETA',
        exportValue: (row) => row.pago?.parametro_tipo_tarjeta?.label_param,
      },
      {
        id: 'banco',
        exportHeader: 'BANCO',
        exportValue: (row) => row.pago?.parametro_banco?.label_param,
      },
      {
        id: 'n_cuotas',
        exportHeader: 'CUOTAS',
        exportValue: (row) => row.pago?.n_cuotas,
      },
      {
        id: 'porcentaje',
        exportHeader: 'PORCENTAJE',
        exportValue: (row) => row.porcentaje,
      },
      {
        id: 'comision',
        exportHeader: 'COMISION',
        exportValue: (row)=>row.pago?.parcial_monto*(row.porcentaje/100)
      },
      {
        id: 'igv',
        exportHeader: 'IGV',
        exportValue: (row)=>row.pago?.parcial_monto*(row.porcentaje/100)*1.18-row.pago?.parcial_monto*(row.porcentaje/100)
      },
      {
        id: 'total',
        exportHeader: 'TOTAL',
        exportValue: (row)=>(row.pago?.parcial_monto*(row.porcentaje/100))*1.18
      }
    ];
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
