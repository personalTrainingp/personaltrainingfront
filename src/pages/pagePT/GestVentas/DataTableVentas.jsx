import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect, useState } from 'react'
import { useGestVentasStore } from './useGestVentasStore'
import { Button, Col, Row } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalViewObservacion } from './ModalViewObservacion'

export const DataTableVentas = ({id_empresa, vistaCliente}) => {
    const { obtenerVentasxEmpresa, dataVentasxEmpresa } = useGestVentasStore()
    const [dataVentaxID, setdataVentaxID] = useState({isOpen: false, id: 0})
      useEffect(() => {
        obtenerVentasxEmpresa(id_empresa)
      }, [id_empresa])
      const columns = [
        {id: 1, header: 'ID', accessor: 'id'},
        {id: 2, header: 'FECHA', render: (row)=>{
            return (
                <>
                {row.fecha_venta}
                </>
            )
        }},
        {id: 3, header: 'SOCIO', render:(row)=>{
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
            id: 4, header: 'ASESOR COMERCIAL', render:(row)=>{
                return (
                    <>
                    {row.nombre_empleado}
                    </>
                )
            }
        },
        {
            id: 5, header: 'COMPROBANTE', render:(row)=>{
                return (
                    <>
                    {row.comprobante}
                    </>
                )
            }
        },
        {
            id: 6, header: 'N° COMPR.', render:(row)=>{
                return (
                    <>
                    {row.n_comprobante}
                    </>
                )
            }
        },
        {
            id: 7, header: 'OBSERVACION', render:(row)=>{
                return (
                    <>
                    {row.observacion}
                    </>
                )
            }
        },
        {
            id: 7, header: 'TOTAL', render:(row)=>{
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
            id: 8, header: '', render:(row)=>{
                return (
                    <>
                    <Button onClick={()=>onOpenModalViewObservacion(row.id)}>DETALLE DE LA VENTA</Button>
                    </>
                )
            }
        }
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
        />
        <ModalViewObservacion id={dataVentaxID.id} show={dataVentaxID.isOpen} onHide={onCloseViewObservaciones}/>
    </div>
  )
}
