import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useVentasPagosStore } from './useVentasPagosStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { NumberFormatMoney } from '@/components/CurrencyMask'

export const ModalReportePago = ({onHide, show, data}) => {
      const { obtenerPagosVentas } = useVentasPagosStore()
  useEffect(() => {
    obtenerPagosVentas()
  }, [])
  const columns = [
    {
      id: 15, header: 'ID VENTA', accessor: 'id', render: (row)=>{
      return (
        <>
        {row.id}
        </>
      )
    }
    },
    {id: 7, header: 'DIA / FECHA / HORA', accessor: 'fecha_pago_1', render:(row)=>{
      return (
        <>
        {row.fecha_pago_1}
        </>
      )
    }},
    {id: 14, header: 'NOMBRE DEL CLIENTE', render: (row)=>{
      return (
        <>
        {`
        ${row.tb_cliente?.nombre_cli} ${row.tb_cliente?.apPaterno_cli} ${row.tb_cliente?.apMaterno_cli}
        `}
        </>
      )
    }},
    {id: 13, header: 'COMPROBANTE', accessor: 'numero_transac', render: (row)=>{
      return (
        <>
          boleta
          <br/>
          {row.numero_transac}
        </>
      )
    }},
    {id: 0, header: 'VENTA', accessor: '', render:(row)=>{
      return (
        <>
        <NumberFormatMoney
          amount=
          {row.pago?.parcial_monto}
        />
        </>
      )
    }},
    {id: 1, header: 'OPERACION', accessor: 'n_operacion', render: (row)=>{
      return (
        <div className='text-change fs-2'>
          {row.n_operacion}
        </div>
      )
    }},
    {id: 5, header: 'CUOTAS', render:(row)=>{
      return (
        <>
        <div className='text-center'>
          <span className='fs-2'>
            {row.pago?.n_cuotas}
          </span>
        </div>
        </>
      )
    }},
    {id: 6, header: <div className='text-center'>OPERADOR<br/><span className='fs-1'>%</span> </div>, accessor: 'porcentaje', sortable: true, render:(row)=>{
      return (
        <>
        <div className='text-center'>
        <span className='fs-2'>
          {row.porcentaje.toFixed(2)}
          </span>
        </div>
        </>
      )
    }},
    {id: 8, header: 'COMISION', accessor: 'porcentaje', sortable: true, render:(row)=>{
      return (
        <>
        <div className='text-center'>
          <NumberFormatMoney amount=
          {row.pago?.parcial_monto*(row.porcentaje/100)}
          />
        </div>
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
    {id: 15, header: 'OPERADORES', accessor: 'label_operador', render:(row)=>{
      return (
        <>
        {/* {row.pago.id_forma_pago} |  */}
        {row.pago?.parametro_operador?.label_param}
        </>
      )
    }},
    {id: 2, header: <>FORMA DE <br/> PAGO</>, accessor: 'label_forma_pago', render:(row)=>{
      return (
        <>
        {/* {row.pago.id_forma_pago} |  */}
        {row.pago?.parametro_forma_pago?.label_param}
        </>
      )
    }},
    {id: 3, header: <>TIPO DE <br/> TARJETA</>, accessor: 'label_tipo_tarjeta', render:(row)=>{
      return (
        <>
        {/* {row.pago.id_tipo_tarjeta} |  */}
        {row.pago?.parametro_tipo_tarjeta?.label_param}
        </>
      )
    }},
    {id: 4, header: 'BANCO', accessor: 'label_banco', render:(row)=>{
      const id_banco = row.pago?.parametro_banco?.id_param
      return (
        <>
          {row.pago?.parametro_banco?.label_param}  
          <br/>
          <span className='text-change'>
          {(id_banco!==259 || id_banco==0)?( row.pago?.es_nacional?'NACIONAL':'INTERNACIONAL'):''}
          </span>
        </>
      )
    }},
  ]
  return (
    <Modal show={show} onHide={onHide} fullscreen>
        <Modal.Body>
            <DataTableCR
                data={data}
                columns={columns}
            />
        </Modal.Body>
    </Modal>
  )
}
