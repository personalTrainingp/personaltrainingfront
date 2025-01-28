{loading ?(
    <div className='text-center'>
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only"></span>
    </div>
  </div>

):(
    <>
    <br/>
    
    <Row>
        {/* POR VENTAS */}
        <Col xxl={12}>
            <Row>
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
                                        <Card.Header className=' align-self-center'>
                                            {/* <Card.Title>
                                                <h4>{d.name_pgm}</h4>
                                            </Card.Title> */}
                                            {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                            {/* <h2>TOTAL</h2> */}
                                        <div style={{fontSize: '120px'}}>TOTAL</div>
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
                        })
                    }
            </Row>
        </Col>
        {/* POR ESTADO DEL CLIENTE */}
        <Col xxl={12}>
            <Row>
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
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasReinscritos, d.avatarPrograma, `REINSCRITOS`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>REINSCRITOS:</span></li>
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
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                        <div style={{fontSize: '120px'}}>TOTAL</div>
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
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasReinscritos, d.avatarPrograma, `REINSCRITOS`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>REINSCRITOS:</span></li>
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
            </Row>
        </Col>
        {/* POR ASESORES */}
            
        {/* POR TARIFAS */}
        {/* POR PROCEDENCIA */}
        {/* ------------------------------------------------------------------------------------------------------------------------------------- */}
        {/* --------------------------------------ESTADISTICAS DE CLIENTE(TODOS, VENTAS)------------------------------------------------------------------------ */}
        {/* ------------------------------------------------------------------------------------------------------------------------------------- */}

        {/* POR SESIONES */}
        <Col xxl={12}>
        <Row>
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
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad} SESIONES:</span></li>
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
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                    {/* <h1>TOTAL</h1> */}
                                    <div style={{fontSize: '120px'}}>TOTAL</div>
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
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad} SESIONES:</span></li>
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
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
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
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
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
                                    <Card>
                                        <Card.Header className=' align-self-center'>
                                            {/* <Card.Title>
                                                <h4>{d.name_pgm}</h4>
                                            </Card.Title> */}
                                            {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                            {/* <h1>TOTAL</h1> */}
                                        <div style={{fontSize: '120px'}}>TOTAL</div>
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
                                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
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
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
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
                                                                d.agruparPorRangoEdades.map(p=>{
                                                                    return (
                                                                        <tr>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
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
                                                                    {d.agruparPorRangoEdades.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
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
                                    <Card>
                                        <Card.Header className=' align-self-center'>
                                            {/* <Card.Title>
                                                <h4>{d.name_pgm}</h4>
                                            </Card.Title> */}
                                            {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                            {/* <h1>TOTAL</h1> */}
                                        <div style={{fontSize: '120px'}}>TOTAL</div>
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
                                                                        d.agruparPorRangoEdades.map(p=>{
                                                                            return (
                                                                                <tr>
                                                                                        <td className=''>
                                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
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
                                                                            {d.agruparPorRangoEdades.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                            
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
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
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
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
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
                                    <Card>
                                        <Card.Header className=' align-self-center'>
                                            {/* <Card.Title>
                                                <h4>{d.name_pgm}</h4>
                                            </Card.Title> */}
                                            {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                            {/* <h1>TOTAL</h1> */}
                                        <div style={{fontSize: '120px'}}>TOTAL</div>
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
                                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
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
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
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
                                                                                        <li  className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
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
                                                                        {d.porSexo.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                        
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
                                        <Card>
                                            <Card.Header className=' align-self-center'>
                                                {/* <Card.Title>
                                                    <h4>{d.name_pgm}</h4>
                                                </Card.Title> */}
                                                {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                                {/* <h1>TOTAL</h1> */}
                                        <div style={{fontSize: '120px'}}>TOTAL</div>
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
                                                                                                <li  className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
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
                                                                                {d.porSexo.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                                
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
    </>
)
}