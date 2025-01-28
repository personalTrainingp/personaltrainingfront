import React from 'react'

export const test2 = () => {
  return (
    
    <Row>
        {/* POR VENTAS */}
        <Col xxl={12}>
            <Row>
        <h1 className='pt-5' style={{fontSize: '60px'}}>comparativo VENTAS EN PROGRAMA</h1>
                    {
                        dataAlter.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                        
                                    </Card.Header>
                                    <Card.Body style={{paddingBottom: '1px !important'}}>
                                        <br/>
                                        <Table
                                                            // style={{tableLayout: 'fixed'}}
                                                            className="table-centered mb-0"
                                                            // hover
                                                            striped
                                                            responsive
                                                        >
                                                            <tbody>
                                                                        <tr>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>venta de <br/> membresias:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d.ventasSinCeros.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Venta <br/> acumulada:</span></li>
                                                                            </td>
                                                                            <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles}/>}/></span></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Ticket <br/> medio:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={(d.sumaDeVentasEnSoles/d.ventasSinCeros.length).toFixed(2)}/>}/></span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Sesiones <br/> vendidas:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><NumberFormatter amount={d.sumaDeSesiones}/></span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Costo <br/> por sesion:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles/d.sumaDeSesiones}/>}/></span>
                                                                            </td>
                                                                        </tr>
                                                                        
                                                            </tbody>
                                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                        }
                    )
                    }
                    
                    {
                        dataAlterIdPgmCero.map(d=>{
                            return (
                                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                    <Card>
        <h1 className='pt-5' style={{fontSize: '60px'}}>comparativo VENTAS TOTAL</h1>
                                        <Card.Header className=' d-flex align-self-center'>
                                            
                                            {
                                                d.avataresDeProgramas?.map((d, index)=>{
                
                                                    return(
                                                        <div>
                                                            <img className='m-4' src={`${config.API_IMG.LOGO}${d.name_image}`} height={d.height} width={d.width}/>
                                                            <span style={{fontSize: '50px'}}>{index===2?'':'+'}</span>
                                                        </div>
                                                    )
                                                }
                                            )
                                            }
                                            {/* <Card.Title>
                                                <h4>{d.name_pgm}</h4>
                                            </Card.Title> */}
                                            {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                            {/* <h2>TOTAL</h2> */}
                                        </Card.Header>
                                        <Card.Body style={{paddingBottom: '1px !important'}}>
                                            <br/>
                                            <Table
                                                                // style={{tableLayout: 'fixed'}}
                                                                className="table-centered mb-0"
                                                                // hover
                                                                striped
                                                                responsive
                                                            >
                                                                <tbody>
                                                                            <tr>
                                                                                    <td className=''>
                                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>venta de <br/> membresias:</span></li>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d?.ventasSinCeros?.length}</span>
                                                                                    </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Venta <br/> acumulada:</span></li>
                                                                                </td>
                                                                                <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles}/>}/></span></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Ticket <br/> medio:</span></li>
                                                                                </td>
                                                                                <td> 
                                                                                <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={(d.sumaDeVentasEnSoles/d.ventasSinCeros?.length).toFixed(2)}/>}/></span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Sesiones <br/> vendidas:</span></li>
                                                                                </td>
                                                                                <td> 
                                                                                <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><NumberFormatter amount={d.sumaDeSesiones}/></span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Costo <br/> por sesion:</span></li>
                                                                                </td>
                                                                                <td> 
                                                                                <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles/d.sumaDeSesiones}/>}/></span>
                                                                                </td>
                                                                            </tr>
                                                                            
                                                                </tbody>
                                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
            </Row>
        </Col>
        {/* POR ESTADO DEL CLIENTE */}
        <Col xxl={12}>
            <Row>
                
        <h1  className='pt-5' style={{fontSize: '60px'}}>comparativo INSCRITOS POR CATEGORIAS POR PROGRAMA</h1>
                    {
                        dataAlter.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                        
                                    </Card.Header>
                                    <Card.Body style={{paddingBottom: '1px !important'}}>
                                        <br/>
                                        <Table
                                                            // style={{tableLayout: 'fixed'}}
                                                            className="table-centered mb-0"
                                                            // hover
                                                            striped
                                                            responsive
                                                        >
                                                            <tbody>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasNuevas, d.avatarPrograma, `NUEVOS`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>NUEVOS:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d.membresiasNuevas.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasRenovadas, d.avatarPrograma, `RENOVACIONES`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>RENOVACIONES:</span></li>
                                                                            </td>
                                                                            <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.membresiasRenovadas.length}</span></td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasReinscritos, d.avatarPrograma, `REINSCRIPCIONES`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>REINSCRIPCIONES:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.membresiasReinscritos.length}</span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.TraspasosEnCero, d.avatarPrograma, `TRASPASOS`)}>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS PT:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.TraspasosEnCero.length}</span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.TransferenciasEnCeros, d.avatarPrograma, `TRANSFERENCIAS`)}>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRANSFERENCIAS <br/>(COSTO CERO):</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.TransferenciasEnCeros.length}</span>
                                                                            </td>
                                                                        </tr>
                                                                        
                                                            </tbody>
                                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                        }
                    )
                    }
                    {
                        dataAlterIdPgmCero.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <Card>
                                        <h1 className='pt-5' style={{fontSize: '60px'}}>
                                        comparativo INSCRITOS POR CATEGORIAS TOTAL
                                        </h1>
                                    <Card.Header className='d-flex align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                        {
                                                d.avataresDeProgramas?.map((d, index)=>{
                
                                                    return(
                                                        <div>
                                                            <img className='m-4' src={`${config.API_IMG.LOGO}${d.name_image}`} height={d.height} width={d.width}/>
                                                            <span style={{fontSize: '50px'}}>{index===2?'':'+'}</span>
                                                        </div>
                                                    )
                                                }
                                            )
                                            }
                                    </Card.Header>
                                    <Card.Body style={{paddingBottom: '1px !important'}}>
                                        <br/>
                                        <Table
                                                            // style={{tableLayout: 'fixed'}}
                                                            className="table-centered mb-0"
                                                            // hover
                                                            striped
                                                            responsive
                                                        >
                                                            <tbody>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasNuevas, d.avatarPrograma, `NUEVOS`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>NUEVOS:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d.membresiasNuevas?.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasRenovadas, d.avatarPrograma, `RENOVACIONES`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>RENOVACIONES:</span></li>
                                                                            </td>
                                                                            <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.membresiasRenovadas?.length}</span></td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasReinscritos, d.avatarPrograma, `REINSCRITOS`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>REINSCRITOS:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.membresiasReinscritos?.length}</span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.TraspasosEnCero, d.avatarPrograma, `TRASPASOS`)}>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS PT:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.TraspasosEnCero?.length}</span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.TransferenciasEnCeros, d.avatarPrograma, `TRANSFERENCIAS`)}>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRANSFERENCIAS <br/>(COSTO CERO):</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{1}</span>
                                                                            </td>
                                                                        </tr>
                                                                        
                                                            </tbody>
                                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                        }
                    )
                    }
            </Row>
        </Col>
        {/* POR SESIONES */}
        <Col xxl={12}>
            <Row>
            <h1 className='pt-5' style={{fontSize: '60px'}}>COMPARATIVO POR SESIONES POR PROGRAMA</h1>
                    {
                        dataAlter.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                        
                                    </Card.Header>
                                    <Card.Body style={{paddingBottom: '1px !important'}}>
                                        <br/>
                                        <Table
                                                            // style={{tableLayout: 'fixed'}}
                                                            className="table-centered mb-0"
                                                            // hover
                                                            striped
                                                            responsive
                                                        >
                                                            <tbody>
                                                                {
                                                                    d.agrupadoPorSesiones.map(p=>{
                                                                        return (
                                                                            <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `SESIONES - ${p.propiedad}`)}>
                                                                                    <td className=''>
                                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad} SESIONES</span></li>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                    </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            
                                                    <tr className='bg-primary'>
                                                                    <td>
                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                                                    </td>
                                                                    <td> 
                                                                    <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                        {d.agrupadoPorSesiones.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                        
                                                                    </span>
                                                                    </td>
                                                                </tr>
                                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                        }
                        )
                    }
                    {
                        dataAlterIdPgmCero.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal titleH1={'COMPARATIVO POR SESIONES TOTAL'} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'SESIONES'} tbImage={d.avataresDeProgramas} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorSesiones}/>
                            </Col>
                        )
                        }
                        )
                    }
            </Row>
        </Col>
            
        {/* POR TARIFAS */}
        {/* POR PROCEDENCIA */}
        {/* ------------------------------------------------------------------------------------------------------------------------------------- */}
        {/* --------------------------------------ESTADISTICAS DE CLIENTE(TODOS, VENTAS)------------------------------------------------------------------------ */}
        {/* ------------------------------------------------------------------------------------------------------------------------------------- */}
        <Col xxl={12}>
        <Row>
            <h1 className='pt-5' style={{fontSize: '60px'}}>COMPARATIVO POR HORARIO POR PROGRAMA</h1>
                {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        // style={{tableLayout: 'fixed'}}
                                                        className="table-centered mb-0"
                                                        // hover
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                            {
                                                                d.agrupadoPorHorario.map(p=>{
                                                                    return (
                                                                        <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `HORARIOS - ${p.propiedad}`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.porDistrito.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                    )
                }
                {
                    dataAlterIdPgmCero.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal titleH1={'COMPARATIVO POR HORARIO TOTAL'} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'HORARIO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorHorario}/>
                            </Col>
                        )
                        }
                    )
                }
        </Row>
        </Col>
        {/* POR DISTRITO */}
        <Col xxl={12}>
        <Row>
        <h1  className='pt-5' style={{fontSize: '60px'}}>COMPARATIVO PROGRAMAS POR DISTRITO</h1>
                {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        // style={{tableLayout: 'fixed'}}
                                                        className="table-centered mb-0"
                                                        // hover
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                            {
                                                                d.porDistrito.map(p=>{
                                                                    return (
                                                                        <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `DISTRITO - ${p.propiedad}`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.porDistrito.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                    )
                }
                {
                    dataAlterIdPgmCero.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal  titleH1={'COMPARATIVO TOTAL POR DISTRITO'}  avataresDeProgramas={d.avataresDeProgramas} labelTotal={'DISTRITO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porDistrito}/>
                            </Col>
                        )
                        }
                    )
                }
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
            <h1 className='pt-5' style={{fontSize: '60px'}}>comparativo RANGO DE EDAD/SEXO POR PROGRAMA</h1>
                {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        // style={{tableLayout: 'fixed'}}
                                                        className="table-centered mb-0"
                                                        // hover
                                                        striped
                                                        responsive
                                                    >
                                                        
                                                        <thead className='bg-primary fs-3'>
                                                            <tr>
                                                                <th className='text-white '>RANGO EDAD </th>
                                                                <th className='text-white '> SOCIOS </th>
                                                                <th className='text-white '>FEMENINO </th>
                                                                <th className='text-white '>MASCULINO </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                d.agruparPorRangoEdades.map(p=>{
                                                                    return (
                                                                        <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `RANGO DE EDAD - ${p.propiedad}`)}>
                                                                                <td className=''>
                                                                                    <div className='d-flex justify-content-end pr-5'>
                                                                                        <span className='fw-bold text-primary fs-1 text-center ml-4'>{p.propiedad}</span>
                                                                                    </div>

                                                                                </td>
                                                                                <td className=''>
                                                                                    <div className='d-flex justify-content-end' style={{width: '45px'}}>
                                                                                    <span style={{fontSize: '40px'}} className='fw-bold fs-1 ml-4 '>{p.items.length}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className='d-flex justify-content-end' style={{width: '120px'}}>
                                                                                        <span className='fw-bold fs-1 mr-5'>{p.sexo[0].items.length}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className=''>
                                                                                    <div className='d-flex justify-content-end' style={{width: '120px'}}>
                                                                                        <span style={{fontSize: '40px'}} className='fw-bold fs-1 mr-5'>{p.sexo[1].items.length}</span>
                                                                                    </div>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary text-white'>
                                                                <td className=''>
                                                                                        <span className='fw-bold fs-2 text-center ml-4 text-white'>TOTAL</span>
                                                                                </td>
                                                                                <td className=''>
                                                                                    <div className='bg-danger d-flex justify-content-end' style={{width: '85px'}}>
                                                                                    <span style={{fontSize: '40px'}} className='fw-bold fs-2 text-white'>{d.agruparPorRangoEdades.reduce((acc, curr) => acc + curr.items.length, 0)}</span>

                                                                                    </div>
                                                                                </td>
                                                                                <td className=''>
                                                                                    <div className='d-flex justify-content-end' style={{width: '85px'}}>
                                                                                        <span style={{fontSize: '40px'}} className='fw-bold fs-2 text-white ml-5'>{d.agruparPorRangoEdades.reduce((acc, curr) => acc + curr.sexo[0].items.length, 0)}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className=''>
                                                                                    <div className='d-flex justify-content-end' style={{width: '85px'}}>
                                                                                        <span style={{fontSize: '40px'}} className='fw-bold fs-2 text-white ml-5'>{d.agruparPorRangoEdades.reduce((acc, curr) => acc + curr.sexo[1].items.length, 0)}</span>
                                                                                    </div>

                                                                                </td>

                                                                {/* 
                                                                */}
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                    )
                }
                {
                    dataAlterIdPgmCero.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal titleH1={'COMPARATIVO RANGO DE EDAD TOTAL'} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'RANGO DE EDAD'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agruparPorRangoEdades}/>
                            </Col>
                        )
                        }
                    )
                }
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
            <h1 className='pt-5' style={{fontSize: '60px'}}>COMPARATIVO ESTADO CIVIL POR PROGRAMA</h1>
        {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        // style={{tableLayout: 'fixed'}}
                                                        className="table-centered mb-0"
                                                        // hover
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                            {
                                                                d.agrupadoPorEstadoCivil.map(p=>{
                                                                    return (
                                                                        <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `ESTADO CIVIL - ${p.propiedad}`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.agrupadoPorEstadoCivil.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                )
                }
                {
                            dataAlterIdPgmCero.map(d=>{
                                return (
                                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal titleH1={'COMPARATIVO TOTAL ESTADO CIVIL'} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ESTADO CIVIL'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorEstadoCivil}/>
                                    
                                </Col>
                            )
                            }
                        )
                        }
        </Row>
        </Col>
        
        <Col xxl={12}>
        <Row>
            <h1 className='pt-5' style={{fontSize: '60px'}}>COMPARATIVO PROMOCIONES POR PROGRAMA</h1>
        {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        className="table-centered mb-0"
                                                        striped
                                                        responsive
                                                    >
                                                        
                                                        <thead className='bg-primary fs-3'>
                                                            <tr>
                                                                <th className='text-white text-center' style={{width: '290px'}}>{''} </th>
                                                                <th className='text-white text-center'>SEMANAS </th>
                                                                <th className='text-white text-center'> <SymbolSoles isbottom={false} fontSizeS={'16px'}/> </th>
                                                                <th className='text-white text-center'> SOCIOS </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                d.agrupadoPorTarifas.map(p=>{
                                                                    console.log(p);
                                                                    
                                                                    return (
                                                                        <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `TARIFA - ${p.propiedad}`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'>
                                                                                        <div>
                                                                                            <span className='fw-bold text-primary fs-2'>{p.propiedad}</span>
                                                                                            <br/>
                                                                                            <span className='fw-bold fs-3'>SESIONES: {p.sesiones}</span>
                                                                                        </div>
                                                                                    </li>
                                                                                </td>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold fs-2'>{p.semanas}</span></li>
                                                                                </td>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold fs-2'><NumberFormatMoney amount={p.tarifaCash_tt}/></span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                                                </td>
                                                                <td></td>
                                                                <td></td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.agrupadoPorTarifas.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                )
                }
                    {
                                dataAlterIdPgmCero.map(d=>{
                                    return (
                                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal titleH1={'COMPARATIVO TOTAL DE PROMOCIONES'} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'TARIFAS'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorTarifas}/>
                                    </Col>
                                )
                                }
                            )
                            }
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
            <h1 className='pt-5' style={{fontSize: '60px'}}>COMPARATIVO ASESORES POR PROGRAMA</h1>
        {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        className="table-centered mb-0"
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                            {
                                                                d.agrupadoPorVendedores.map(p=>{
                                                                    return (
                                                                        <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `ASESOR - ${p.propiedad}`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.agrupadoPorVendedores.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                )
                }
                    {
                                dataAlterIdPgmCero.map(d=>{
                                    return (
                                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal titleH1={'COMPARATIVO TOTAL DE ASESORES'} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ASESORES'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorVendedores}/>
                                    </Col>
                                )
                                }
                            )
                            }
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
            <h1 className='pt-5' style={{fontSize: '60px'}}>COMPARATIVO SEXO POR PROGRAMA</h1>
            {
                        dataAlter.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                        
                                    </Card.Header>
                                    <Card.Body style={{paddingBottom: '1px !important'}}>
                                        <br/>
                                        <Table
                                                            // style={{tableLayout: 'fixed'}}
                                                            className="table-centered mb-0"
                                                            // hover
                                                            striped
                                                            responsive
                                                        >
                                                            <tbody>
                                                                {
                                                                    d.porSexo.map(p=>{
                                                                        return (
                                                                            <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `GENERO - ${p.propiedad}`)}>
                                                                                    <td>
                                                                                        <li  className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}</span></li>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items?.length}</span>
                                                                                    </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            
                                                    <tr className='bg-primary'>
                                                                    <td>
                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                                                    </td>
                                                                    <td> 
                                                                    <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                        {d.porSexo?.reduce((acc, curr) => acc + curr.items?.length, 0)}
                                                                        
                                                                    </span>
                                                                    </td>
                                                                </tr>
                                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                        }
                    )
                    }
                    {
                                dataAlterIdPgmCero.map(d=>{
                                    return (
                                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal titleH1={'COMPARATIVO TOTAL DE SEXO'} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'SEXO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porSexo}/>
                                    </Col>
                                )
                                }
                            )
                            }
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
        <h1 className='pt-5' style={{fontSize: '60px'}}>COMPARATIVO PROCEDENCIA POR PROGRAMA</h1>
            {
                        dataAlter.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                        
                                    </Card.Header>
                                    <Card.Body style={{paddingBottom: '1px !important'}}>
                                        <br/>
                                        <Table
                                                            // style={{tableLayout: 'fixed'}}
                                                            className="table-centered mb-0"
                                                            // hover
                                                            striped
                                                            responsive
                                                        >
                                                            <tbody>
                                                                {
                                                                    d.agrupadoPorProcedencia.map(p=>{
                                                                        return (
                                                                            <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `GENERO - ${p.propiedad}`)}>
                                                                                    <td>
                                                                                        <li  className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}</span></li>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items?.length}</span>
                                                                                    </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            
                                                    <tr className='bg-primary'>
                                                                    <td>
                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                                                    </td>
                                                                    <td> 
                                                                    <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                        {d.agrupadoPorProcedencia?.reduce((acc, curr) => acc + curr.items?.length, 0)}
                                                                        
                                                                    </span>
                                                                    </td>
                                                                </tr>
                                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                        }
                    )
                    }

                    {
                                dataAlterIdPgmCero.map(d=>{
                                    return (
                                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                        <TableTotal titleH1={'COMPARATIVO TOTAL DE PROCEDENCIA'} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'PROCEDENCIA'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorProcedencia}/>
                                    </Col>
                                )
                                }
                            )
                            }
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
        <h1 className='pt-5' style={{fontSize: '60px'}}>COMPARATIVO ACTIVOS POR SEMANA POR PROGRAMA</h1>
        {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        className="table-centered mb-0"
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                            {
                                                                d.activosDeVentasPorSemanaMarcacions.map(p=>{
                                                                    return (
                                                                        <tr>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>SEMANA {p.propiedad}</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.activosDeVentasPorSemanaMarcacions.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                )
                }
                    {
                                dataAlterIdPgmCero.map(d=>{
                                    return (
                                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal titleH1={'COMPARATIVO TOTAL DE ACTIVOS POR SEMANA'} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'SEXO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porSexo}/>
                                    </Col>
                                )
                                }
                            )
                            }
        </Row>
        </Col>
        {/* POR DISTRITO */}
        {/* POR HORARIOS */}
        {/* POR RANGO DE EDAD */}
        {/* POR ESTADO CIVIL */}
        {/* POR SEXO */}
        {/* POR MARCACIONES */}
        {/* <SimpleBar style={{ maxHeight: '100%'}} scrollbarMaxSize={300}>
            <div className='d-flex'>
                {
                    dataAlter.map(d=>{
                        return (
                        <Col className='mx-1' style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        className="table-centered mb-0"
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                            {
                                                                d.activosDeVentasPorSemanaMarcacions.map(p=>{
                                                                    return (
                                                                        <tr>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>SEMANA {p.propiedad}:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.activosDeVentasPorSemanaMarcacions.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                )
                }
                <Col className='mx-2' xxl={4}>
                    <Card>
                        <Card.Header>
                            <h1 className='text-center'>TOTAL</h1>
                        </Card.Header>
                    </Card>
                </Col>
            </div>
        </SimpleBar> */}
        
    </Row>
  )
}
