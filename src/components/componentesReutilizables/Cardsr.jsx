import React from 'react'
import { Card } from 'react-bootstrap'

export const Cardsr = () => {
  return (
    <Card style={{display: 'block', height: '530px'}} onClick={()=>onOpenModalInventario(f.items, f.ubicacion)} className='m-1 border border-4'>
                                <Card.Header>
                                    <Card.Title className='fs-2 text-primary'>
                                        {f.ubicacion}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <ul className='text-decoration-none list-unstyled font-20'>
                                        <li ><span className='fw-bold fs-2'>ITEMS:</span> <span className='fs-2'>{f.items.length}</span></li>
                                        <li ><span className='fw-bold fs-2'>inversión S/: </span><span className='fs-2'><NumberFormatMoney amount={f.valor_total_sumado}/></span></li>
                                        <li ><span className='fw-bold fs-2'>inversión $ : </span><span className='fs-2'><NumberFormatMoney amount={(f.valor_total_sumado/3.8).toFixed(2)}/></span></li>
                                        <li className='d-flex justify-content-center'>
                                            <Image src={sinImage}  className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt={f.ubicacion} preview  height='250' ></Image>
                                        </li>
                                    </ul>
                                </Card.Body>
                            </Card>
  )
}
