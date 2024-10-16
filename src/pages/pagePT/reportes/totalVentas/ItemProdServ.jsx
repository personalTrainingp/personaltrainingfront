import { FUNMoneyFormatter, MoneyFormatter } from '@/components/CurrencyMask'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const ItemProdServ = ({Icantidad, Itotal, Inombre, Iabrev, icono, icowid, icohe}) => {
    
  return (
                <Row>
                    <Col style={{height: '150px', margin: '5px'}}>
										<Card className="mb-0 h-100 text-center d-flex justify-content-center align-items-center">
													<Link
														to=""
														className="text-center text-muted d-flex flex-column justify-content-center align-items-center"
                                                        // style={{backgroundImage:  `url(${icono})`, position: 'absolute', bottom: '0px', backgroundPosition: 'center', backgroundSize: '70%', width: icowid, height: icohe, backgroundRepeat: 'no-repeat'}}
														data-bs-toggle="modal"
														data-bs-target="#exampleModal"
                            style={{ position: 'relative', height: '100%', width: '100%' }} // Para que el contenido dentro del Link se posicione relativamente
													>
                            <div 
                                style={{
                                                backgroundImage: `url(${icono})`,
                                                opacity: '.5',
                                                // position: 'absolute', // Para que el fondo se posicione de forma absoluta
                                                zIndex: 1, // Fondo detrás
                                                top: 0,
                                                width: '100px', // Tamaño completo del contenedor
                                                height: '100px', 
                                                backgroundSize: 'cover', // Asegura que el fondo cubra el área sin deformarse
                                                backgroundPosition: 'center'
                                }}></div>
                                                        <span>
                                                            <h4 
                                                              style={{fontSize: '15px'}} 
                                                              className="mt-1 mb-0 d-block text-primary font-bolder">
                                                                {Inombre}
                                                            </h4>
                                                            <h4 className="font-12 mt-1 mb-0 d-block">{Icantidad?`Cantidad: ${Icantidad}`: ''}</h4>
                                                            <h4 className="font-12 mt-1 mb-0 d-block">
                                                              {
                                                              Itotal?
                                                              `Total: ${ FUNMoneyFormatter(Itotal, 'S/') }`
                                                              :
                                                              ''
                                                              }</h4>
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

{/* <h4 className="font-12 mt-1 mb-0 d-block">{Icantidad?`Cantidad: ${Icantidad}`: ''}</h4>
<h4 className="font-12 mt-1 mb-0 d-block">
  {
  Itotal?
  `Total: ${ FUNMoneyFormatter(Itotal, 'S/') }`
  :
  ''
  }</h4> */}








  // <Row>
  // <Col style={{height: '130px', margin: '5px'}}>
  // <Card className="mb-0 h-100 text-center d-flex justify-content-center align-items-center">
  //       <Link
  //         to=""
  //         className="text-center text-muted d-flex flex-row justify-content-center align-items-center"
  //         data-bs-toggle="modal"
  //         data-bs-target="#exampleModal"
  //         style={{ position: 'relative' }}
  //       >
  //                                     <img 
  //                                       src={icono} 
  //                                       width={icowid} 
  //                                       height={icohe} 
  //                                       style={{
  //                                         opacity: '.5',
  //                                         position: 'absolute',
  //                                         zIndex: 1,
  //                                         top: 0,
  //                                         left: 0,
  //                                         width: '100%',
  //                                         height: '100%',
  //                                         objectFit: 'cover'
  //                                         }}>
  //                                     </img>
  //                                     <span style={{ position: 'relative', zIndex: 2 }}>
  //                                         <h4 className="font-15 mt-1 mb-0 d-block">{Inombre}</h4>
  //                                     </span>
          {/* <h4 className="font-15 mt-1 mb-0 d-block">{Inombre}</h4> */}
        // </Link>
    {/* <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
    </Card.Body> */}
  {/* </Card>
</Col>
</Row> */}