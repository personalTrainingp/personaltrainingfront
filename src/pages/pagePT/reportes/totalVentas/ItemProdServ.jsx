import { MoneyFormatter } from '@/components/CurrencyMask'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const ItemProdServ = ({Icantidad, Itotal, Inombre, Iabrev}) => {
    
  return (
        <Card className="m-1 shadow-none border">
            <div className="pl-2">
                <Row>
                    <Col>
                    <Link to="" className="text-muted fw-bold fs-4">
                        {Inombre}
                    </Link>
                    <p className="mb-0 font-15 fw-bold">
                        CANTIDAD: {Icantidad}
                    </p>
                    <p className="mb-0 font-15 fw-bold">
                        TOTAL: {<MoneyFormatter amount={Itotal}/>}
                    </p>
                    </Col>
                </Row>
            </div>
        </Card>
  )
}
