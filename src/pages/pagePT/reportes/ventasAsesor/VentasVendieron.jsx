import { ScrollPanel } from 'primereact/scrollpanel'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const VentasVendieron = () => {
  return (
    <Card>
            <Card.Body>
                <ScrollPanel style={{ width: '100%' }}>
                <div className='d-flex'>
                  <Col xxl={3} lg={6}>
                    <Card className="m-1 shadow-none border">
                      <div className="pl-2">
                        <Row>
                          <Col>
                            <Link to="" className="text-muted fw-bold fs-3">
                              {/* {f.name} */}
                              ACCESORIOS
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: 30
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: S/140.00
                            </p>
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
                            <Link to="" className="text-muted fw-bold fs-3">
                              {/* {f.name} */}
                              SUPLEMENTOS
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: 30
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: S/140.00
                            </p>
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
                            <Link to="" className="text-muted fw-bold fs-3">
                              {/* {f.name} */}
                              MEMBRESIAS
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: 30
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: S/140.00
                            </p>
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
                            <Link to="" className="text-muted fw-bold fs-3">
                              {/* {f.name} */}
                              FITOLOGY
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: 30
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: S/140.00
                            </p>
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
                            <Link to="" className="text-muted fw-bold fs-3">
                              {/* {f.name} */}
                              NUTRICIONISTA
                            </Link>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              CANTIDAD: 30
                            </p>
                            <p className="mb-0 font-15 fw-bold">
                              {/* {f.size} */}
                              TOTAL: S/140.00
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  </Col>
                </div>
              </ScrollPanel>
            </Card.Body>
    </Card>
  )
}
