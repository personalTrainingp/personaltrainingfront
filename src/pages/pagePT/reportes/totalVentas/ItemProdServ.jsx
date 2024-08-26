import { MoneyFormatter } from '@/components/CurrencyMask'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const ItemProdServ = ({Icantidad, Itotal, Inombre, Iabrev, icono, icowid, icohe}) => {
    
  return (
                <Row>
                    <Col style={{height: '130px', margin: '5px'}}>
										<Card className="mb-0 h-100 text-center d-flex justify-content-center align-items-center">
													<Link
														to=""
														className="text-center text-muted d-flex flex-row justify-content-center align-items-center"
                                                        // style={{backgroundImage:  `url(${icono})`, position: 'absolute', bottom: '0px', backgroundPosition: 'center', backgroundSize: '70%', width: icowid, height: icohe, backgroundRepeat: 'no-repeat'}}
														data-bs-toggle="modal"
														data-bs-target="#exampleModal"
													>
                                                        <img src={icono} width={icowid} height={icohe} style={{opacity: '.5'}}>
                                                        </img>
                                                        <span>
                                                            <h4 className="font-15 mt-1 mb-0 d-block">{Inombre}</h4>
                                                            <h4 className="font-12 mt-1 mb-0 d-block">{Icantidad?`Cantidad: ${Icantidad}`: ''}</h4>
                                                            <h4 className="font-12 mt-1 mb-0 d-block">{Itotal?`Total: ${ <MoneyFormatter amount={Itotal}/> }`:''}</h4>
                                                        </span>
														{/* <h4 className="font-15 mt-1 mb-0 d-block">{Inombre}</h4> */}
													</Link>
											{/* <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
											</Card.Body> */}
										</Card>
									</Col>
                </Row>
  )
}
