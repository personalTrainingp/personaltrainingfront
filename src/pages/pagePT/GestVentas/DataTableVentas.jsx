import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect, useState } from 'react'
import { useGestVentasStore } from './useGestVentasStore'
import { Button, Col, Row } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalViewObservacion } from './ModalViewObservacion'
import dayjs from 'dayjs'

export const DataTableVentas = ({id_empresa, vistaCliente}) => {
    const { obtenerVentasxEmpresa, dataVentasxEmpresa } = useGestVentasStore()
    const [dataVentaxID, setdataVentaxID] = useState({isOpen: false, id: 0})
      useEffect(() => {
        obtenerVentasxEmpresa(id_empresa)
      }, [id_empresa])
      const columns = [
        {id: 1, header: 'ID', accessor: 'id', render: (row)=>{
            return (
                <>
                {row.id}
                </>
            )
        }},
        {id: 2, header: 'FECHA', accessor: 'fecha_venta', render: (row)=>{
            return (
                <>
                {row.fecha_venta}
                </>
            )
        }},
        {id: 3, header: 'SOCIO', accessor: 'nombres_cliente', render:(row)=>{
            return (
                <>
                    {
                        vistaCliente?(
                <Row className='m-0'>
                    <Col xxl={12}>
                        <div className='d-flex justify-content-between align-items-center'>
                            <img width={90} height={80} className='border-circle' src={`${row.tb_cliente?.urlAvatar}`}></img>
                            <span style={{width: '190px'}}>{row.tb_cliente.nombres_cliente}</span>
                        </div>
                    </Col>
                </Row>
                        ): (
                            <>
                                CLIENTE DE ID {row.id_cli}
                            </>
                        )
                    }
                </>
            )
        }},
        {
            id: 4, header: 'ASESOR COMERCIAL', accessor: 'nombre_empleado', render:(row)=>{
                return (
                    <>
                    {row.nombre_empleado}
                    </>
                )
            }
        },
        {
            id: 5, header: 'COMPROBANTE' , accessor: 'comprobante', render:(row)=>{
                return (
                    <>
                    {row.comprobante}
                    </>
                )
            }
        },
        {
            id: 6, header: 'N° COMPR.', accessor: 'n_comprobante', render:(row)=>{
                return (
                    <>
                    {row.n_comprobante}
                    </>
                )
            }
        },
        {
            id: 7, header: 'OBSERV. / TARJETA', accessor: 'observacion', render:(row)=>{
                return (
                    <>
                    {row.observacion}
                    </>
                )
            }
        },
        {
            id: 7, header: 'TOTAL', accessor: 'montoTotal', render:(row)=>{
                return (
                    <>
                    S/.
                    <NumberFormatMoney
                        amount={
                            row.montoTotal
                        }
                    />
                    </>
                )
            }
        },
        {
            id: 8, header: 'TOTAL PAGO', accessor: 'montoTotal_pago', render:(row)=>{
                return (
                    <>
                    S/.
                    <NumberFormatMoney
                        amount={
                            row.montoTotal_pago
                        }
                    />
                    </>
                )
            }
        },
        {
            id: 9, header: 'es igual', accessor: 'is_igual', sortable: true, render:(row)=>{
                return (
                    <>

                    {row.is_igual}
                    </>
                )
            }
        },
        {
            id: 10, header: '', render:(row)=>{
                return (
                    <>
                    <Button onClick={()=>onOpenModalViewObservacion(row.id)}>DETALLE DE LA VENTA</Button>
                    </>
                )
            }
        }
      ]
      // columnas del "Descargar Excel": DataTableCR solo exporta estas (sin ellas el boton no hace nada)
      const numero = (v)=>v === null || v === undefined || v === '' ? '' : Number(v)
      const columnsExports = [
        { id: 'id', exportHeader: 'ID', width: 10, exportValue: (row)=>row.id },
        { id: 'fecha_venta', exportHeader: 'FECHA', width: 22, exportValue: (row)=>row.fecha_venta ?? '' },
        { id: 'socio', exportHeader: 'SOCIO', width: 35, exportValue: (row)=>vistaCliente ? (row.tb_cliente?.nombres_cliente ?? '') : `CLIENTE DE ID ${row.id_cli}` },
        { id: 'nombre_empleado', exportHeader: 'ASESOR COMERCIAL', width: 30, exportValue: (row)=>row.nombre_empleado ?? '' },
        { id: 'comprobante', exportHeader: 'COMPROBANTE', width: 18, exportValue: (row)=>row.comprobante ?? '' },
        { id: 'n_comprobante', exportHeader: 'N° COMPR.', width: 16, exportValue: (row)=>row.n_comprobante ?? '' },
        { id: 'observacion', exportHeader: 'OBSERV. / TARJETA', width: 40, exportValue: (row)=>row.observacion ?? '' },
        { id: 'montoTotal', exportHeader: 'TOTAL (S/.)', width: 14, exportValue: (row)=>numero(row.montoTotal) },
        { id: 'montoTotal_pago', exportHeader: 'TOTAL PAGO (S/.)', width: 16, exportValue: (row)=>numero(row.montoTotal_pago) },
        { id: 'is_igual', exportHeader: 'ES IGUAL', width: 10, exportValue: (row)=>row.is_igual ?? '' },
      ]
      const onCloseViewObservaciones = ()=>{
        setdataVentaxID({isOpen: false, id: 0})
      }
      const onOpenModalViewObservacion = (id)=>{
        setdataVentaxID({isOpen: true, id})
      }
  return (
    <div>
        <DataTableCR 
            data={dataVentasxEmpresa}
            columns={columns}
            exportable={true}
            exportExtraColumns={columnsExports}
            exportFileName={`ventas_${dayjs().format('DDMMYYYY')}`}
        />
        <ModalViewObservacion id={dataVentaxID.id} show={dataVentaxID.isOpen} onHide={onCloseViewObservaciones}/>
    </div>
  )
}
