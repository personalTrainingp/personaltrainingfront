import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { FUNMoneyFormatter, MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const ItemProdServ = ({dataGen, Icantidad, Itotal, Inombre, Iabrev, icono, icowid, icohe}) => {
    console.log(dataGen);
    
  return (
                <Row>
                    <Col className='' style={{height: '360px'}}>
										<Card className="mb-0 h-100 d-flex justify-content-center align-items-center">
													<Link
														to=""
														className=" text-black d-flex flex-column justify-content-between  align-items-center"
                                                        // style={{backgroundImage:  `url(${icono})`, position: 'absolute', bottom: '0px', backgroundPosition: 'center', backgroundSize: '70%', width: icowid, height: icohe, backgroundRepeat: 'no-repeat'}}
														data-bs-toggle="modal"
														data-bs-target="#exampleModal"
                            style={{ position: 'relative', height: '100%', width: '100%' }} // Para que el contenido dentro del Link se posicione relativamente
													>
                            {/* <div 
                                style={{
                                                backgroundImage: `url(${icono})`,
                                                opacity: '.6',
                                                // position: 'absolute', // Para que el fondo se posicione de forma absoluta
                                                zIndex: 1, // Fondo detrás
                                                top: 0,
                                                width: '140px', // Tamaño completo del contenedor
                                                height: '220px', 
                                                backgroundSize: 'cover', // Asegura que el fondo cubra el área sin deformarse
                                                backgroundPosition: 'center'
                                }}></div> */}
                                <div className='m-0 d-flex justify-content-end align-items-end' style={{height: '140px'}}>
                                  <img src={icono} width={icowid} height={icohe} className='m-0'/>
                                </div>
                                                        <span style={{height: '200px', marginTop: '10px'}}>
                                                            <h4 
                                                              // style={{fontSize: '15px'}} 
                                                              className="fs-1 text-center mt-1 mb-0 d-block text-primary font-bolder">
                                                                {Inombre}
                                                            </h4>
                                                            <h4 className="fs-2 mt-1 mb-0 d-block">SOCIOS: 
                                                              <span className='ml-3'>
                                                                {Icantidad}
                                                              </span>
                                                            </h4>
                                                            <h4 className="fs-2 mt-1 mb-0 d-block">
                                                              VENTAS:
                                                              <span className='ml-3'>
                                                                    <SymbolSoles isbottom={true} numero={
                                                                    <NumberFormatMoney amount={Itotal}/>
                                                                    }/>
                                                              </span>
                                                            </h4>
                                                            <h4 className="fs-1 mt-1 mb-0 text-center text-primary d-block">
                                                              {((Itotal/dataGen)*100).toFixed(2)} %
                                                            </h4>

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