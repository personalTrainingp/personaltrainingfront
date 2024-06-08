import { MoneyFormatter } from '@/components/CurrencyMask'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'

export const ItemPago = ({deletePay, id, formaPay, fechaPay, observacionPay, montoPay, id_forma_pago, id_tarjeta, id_tipo_tarjeta, id_banco}) => {
    
  return (
        <div className="border border-4 shadow rounded p-2 mb-2" key={id}>
            <Col lg={12}>
                <div className='text-muted'>
                    <span className='fw-bold'>
                        {id_forma_pago}{id_tarjeta?`/${id_tarjeta}`:''}{id_tipo_tarjeta?`/${id_tipo_tarjeta}`:''}{id_banco?`/${id_banco}`:''}
                    </span>
                    <span className='float-end d-flex align-items-center text-break'>
                        {fechaPay}
                            <i className='mdi mdi-delete-forever-outline text-danger fs-3 ms-2' onClick={()=>deletePay()}></i>
                    </span>
                </div>
            </Col>
            <Col lg={12}>
                <div>
                    <MoneyFormatter amount={montoPay}/>
                    <div>
                        {observacionPay}
                    </div>
                </div>
            </Col>
            {/* <Row className="mb-2">
                <Col lg={6} className="font-16 fw-semibold">
                    <span className='fw-bold'>
                        Groupon/Interbank
                    </span>
                    <p>
                    </p>
                    <p className="text-muted mb-0 fs-6">Hizo un Pago parcial</p>
                </Col>
                <Col lg={6} className="font-15 fw-semibold text-muted d-flex justify-content-end">
                    <div>
                        <span className='fs-5'>
                        29/39/2020
                        </span>
                        <span className='ms-3' onClick={()=>deletePay()} style={{cursor: 'pointer'}}>
                            <i className='mdi mdi-delete-forever-outline fs-3 text-danger'></i>
                        </span>
                    </div>
                </Col>
            </Row> */}
        </div>
  )
}
