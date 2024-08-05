import { MoneyFormatter } from '@/components/CurrencyMask'
import { ScrollPanel } from 'primereact/scrollpanel'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const CardProdServ = ({data}) => {
  return (
    <Card>
          <Row className="mx-n1 ">
              <ScrollPanel style={{ width: '100%' }}>
                <div className='d-flex'>
                  <Col xxl={2} lg={6}>
                    <Card className="m-1 shadow-none border">
                      <div className="pl-2">
                        <Row>
                          <Col>
                            <Link to="" className="text-muted fw-bold fs-4">
                              {/* {f.name} */}
                              ACCESORIOS
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: {data?.cantidad_accesorio}
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: {<MoneyFormatter amount={data?.suma_tarifa_monto_accesorio}/>}
                            </p>
                            {/* <a style={{color: 'blue'}}>Ver todo</a> */}
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  </Col>
                  <Col xxl={3} lg={6}>
                    <Card className="m-1 shadow-none border">
                      <div className="pl-2">
                        <Row>
                          <Col>
                            <Link to="" className="text-muted fw-bold fs-4">
                              {/* {f.name} */}
                              SUPLEMENTOS
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: {data?.cantidad_suplementos}
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: {<MoneyFormatter amount={data?.suma_tarifa_monto_suplementos}/>}
                            </p>
                            {/* <a style={{color: 'blue'}}>Ver todo</a> */}
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  </Col>
                  <Col xxl={3} lg={6}>
                    <Card className="m-1 shadow-none border">
                      <div className="pl-2">
                        <Row>
                          <Col>
                            <Link to="" className="text-muted fw-bold fs-4">
                              {/* {f.name} */}
                              MEMBRESIAS
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: {data?.cantidad_membresia}
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: {<MoneyFormatter amount={data?.suma_tarifa_monto_membresia}/>}
                            </p>
                            {/* <a style={{color: 'blue'}}>Ver todo</a> */}
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  </Col>
                  <Col xxl={3} lg={6}>
                    <Card className="m-1 shadow-none border">
                      <div className="pl-2">
                        <Row>
                          <Col>
                            <Link to="" className="text-muted fw-bold fs-4">
                              {/* {f.name} */}
                              FITOLOGY
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: {data?.cantidad_citas_FITOL}
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: {<MoneyFormatter amount={data?.suma_tarifa_monto_citas_FITOL}/>}
                            </p>
                            {/* <a style={{color: 'blue'}}>Ver todo</a> */}
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  </Col>
                  <Col xxl={3} lg={6}>
                    <Card className="m-1 shadow-none border">
                      <div className="pl-2">
                        <Row>
                          <Col>
                            <Link to="" className="text-muted fw-bold fs-4">
                              {/* {f.name} */}
                              NUTRICIONISTA
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: {data?.cantidad_citas_NUTRI}
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: {<MoneyFormatter amount={data?.suma_tarifa_monto_citas_NUTRI}/>}
                            </p>
                            {/* <a style={{color: 'blue'}}>Ver todo</a> */}
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  </Col>
                </div>
              </ScrollPanel>

          </Row>
    </Card>
  )
}
