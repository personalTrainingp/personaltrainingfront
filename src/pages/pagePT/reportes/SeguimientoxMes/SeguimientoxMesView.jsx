import { PageBreadcrumb } from '@/components'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
import { useComparativoAnualStore } from './useMembresiasStore'
import dayjs from 'dayjs'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalItemsClientes } from './ModalItemsClientes'

export const SeguimientoxMesView = () => {
    const { obtenerMembresiasClientes, viewDataMembresias } = useComparativoAnualStore()
    useEffect(() => {
        obtenerMembresiasClientes()
    }, [])
    const [isOpenModalItems, setisOpenModalItems] = useState(false)
    const [dataItemsxClick, setdataItemsxClick] = useState([])
    const [headModal, setheadModal] = useState('')
    const onOpenModalItem = (me, strHead)=>{
        console.log(me.items, "aggg");
        setisOpenModalItems(true)
        setdataItemsxClick(me.items)
        setheadModal(strHead)
    }
    const onCloseModalItems = ()=>{
        setisOpenModalItems(false)
    }
    console.log(viewDataMembresias, "veee");
    
    // console.log(viewDataMembresias.find(f=>f.id_pgm===2));
    // const dataIdsPgms = [{}]
  return (
    <>
        <PageBreadcrumb title={'COMPARATIVO SOCIOS ACTIVOS POR MES'}/>
        <br/>
        <Row>
            <Col xxl={3}>
            <Card>
                <Card.Header className='d-flex justify-content-center'>
                    <img src={`https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png`} width={350} height={100}/>
                </Card.Header>
                <Card.Body>
                <Table striped className="table-centered table-nowrap mb-0">
                    
                <thead className='bg-primary fs-2'>
                                                    <tr>
                                                        <th className={`text-white`}>
                                                            {'MES / AÑO'}{' '}
                                                        </th>
                                                        <th className={`text-white`}>
                                                            {'SOCIOS'}{' '}
                                                        </th>
                                                        <th className={`text-white`}>
                                                            {'% VAR.'}{' '}
                                                        </th>
                                                    </tr>
                                                </thead>
					<tbody>
                    {
                        viewDataMembresias.find(f=>f.id_pgm===2)?.items.map(m=>{
                            // console.log(m.mes, dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM'));
                            
                            return(
                                <>
                                {/* {<div className='text-center fs-2'><NumberFormatMoney amount={m.variacion_porcent}/>%</div>} */}
                                
                                <tr className="" onClick={()=>onOpenModalItem(m, `${dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM')} ${m.anio}`)}>
                                    <td className='bg-danger text-primary fw-bold fs-3'>
                                        {dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM')} / {m.anio} 
                                    </td>
                                    <td className='bg-danger fs-3'>
                                        {m.items.length} 
                                    </td>
                                    <td className='fs-3'>
                                        <div className={`float-end ${m.variacion_porcent<0&&'text-primary'}`}>
                                        {m.variacion_porcent>=0&& m.variacion_porcent!==100&& '+'} <NumberFormatMoney amount={m.variacion_porcent}/>%
                                        </div>
                                    </td>
                                </tr>
                                
                                </>
                            )
                        })
                    }
					</tbody>
				</Table>
                </Card.Body>
            </Card>
            </Col>
            <Col xxl={3}>
            <Card>
                <Card.Header className='d-flex justify-content-center'>
                    <img src={`https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png`} width={180} height={100}/>
                </Card.Header>
                <Card.Body>
                
                <Table striped className="table-centered table-nowrap mb-0">
                    
                <thead className='bg-primary fs-2'>
                                                    <tr>
                                                        <th className={`text-white`}>
                                                            {'MES / AÑO'}{' '}
                                                        </th>
                                                        <th className={`text-white`}>
                                                            {'SOCIOS'}{' '}
                                                        </th>
                                                        <th className={`text-white`}>
                                                            {'% VAR.'}{' '}
                                                        </th>
                                                    </tr>
                                                </thead>
					<tbody>
                    {
                        viewDataMembresias.find(f=>f.id_pgm===3)?.items.map(m=>{
                            // console.log(m.mes, dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM'));
                            
                            return(
                                <>
                                {/* {<div className='text-center fs-2'><NumberFormatMoney amount={m.variacion_porcent}/>%</div>} */}
                                
                                <tr className="" onClick={()=>onOpenModalItem(m, `${dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM')} ${m.anio}`)}>
                                    <td className='bg-danger text-primary fw-bold fs-3'>
                                        {dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM')} / {m.anio} 
                                    </td>
                                    <td className='bg-danger fs-3'>
                                        {m.items.length} 
                                    </td>
                                    <td className='fs-3'>
                                        
                                    <div className={`float-end ${m.variacion_porcent<0&&'text-primary'}`}>
                                        {m.variacion_porcent>=0&& m.variacion_porcent!==100&& '+'} <NumberFormatMoney amount={m.variacion_porcent}/>%
                                        </div>
                                    </td>
                                </tr>
                                
                                </>
                            )
                        })
                    }
					</tbody>
				</Table>
                </Card.Body>
            </Card>
            </Col>
            <Col xxl={3}>
            <Card>
                <Card.Header className='d-flex justify-content-center'>
                    <img src={`https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png`}  width={300} height={100}/>
                </Card.Header>
                <Card.Body>
                <Table responsive striped className="table-centered table-nowrap mb-0">
                    
                <thead className='bg-primary fs-2'>
                                                    <tr>
                                                        <th className={`text-white`}>
                                                            {'MES / AÑO'}{' '}
                                                        </th>
                                                        <th className={`text-white`}>
                                                            {'SOCIOS'}{' '}
                                                        </th>
                                                        <th className={`text-white`}>
                                                            {'% VAR.'}{' '}
                                                        </th>
                                                    </tr>
                                                </thead>
					<tbody>
                    {
                        viewDataMembresias.find(f=>f.id_pgm===4)?.items.map(m=>{
                            // console.log(m.mes, dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM'));
                            
                            return(
                                <>
                                {/* {<div className='text-center fs-2'><NumberFormatMoney amount={m.variacion_porcent}/>%</div>} */}
                                
                                <tr className="" onClick={()=>onOpenModalItem(m, `${dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM')} ${m.anio}`)}>
                                    <td className='bg-danger text-primary fw-bold fs-3'>
                                        {dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM')} / {m.anio} 
                                    </td>
                                    <td className='bg-danger fs-3'>
                                        {m.items.length} 
                                    </td>
                                    <td className='fs-3'>
                                        
                                    <div className={`float-end ${m.variacion_porcent<0&&'text-primary'}`}>
                                        {m.variacion_porcent>=0&& m.variacion_porcent!==100&& '+'} <NumberFormatMoney amount={m.variacion_porcent}/>%
                                        </div>
                                    </td>
                                </tr>
                                
                                </>
                            )
                        })
                    }
					</tbody>
                    
				</Table>
                </Card.Body>
            </Card>
            </Col>
            <Col xxl={3}>
            <Card>
                <Card.Header className='d-flex justify-content-center'>
                    <div style={{fontSize: '70px'}}>
                        AFORO TOTAL
                    </div>
                </Card.Header>
                <Card.Body>
                <Table responsive striped className="table-centered table-nowrap mb-0">
                    
                <thead className='bg-primary fs-2'>
                                                    <tr>
                                                        <th className={`text-white`}>
                                                            {'MES / AÑO'}{' '}
                                                        </th>
                                                        <th className={`text-white`}>
                                                            {'SOCIOS'}{' '}
                                                        </th>
                                                        <th className={`text-white`}>
                                                            {'% VAR.'}{' '}
                                                        </th>
                                                    </tr>
                                                </thead>
					<tbody>
                    {
                        viewDataMembresias.find(f=>f.id_pgm===0)?.items.map(m=>{
                            // console.log(m.mes, dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM'));
                            
                            return(
                                <>
                                {/* {<div className='text-center fs-2'><NumberFormatMoney amount={m.variacion_porcent}/>%</div>} */}
                                
                                <tr className="" onClick={()=>onOpenModalItem(m, `${dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM')} ${m.anio}`)}>
                                    <td className='bg-danger text-primary fw-bold fs-3'>
                                        {dayjs(String(m.mes).padStart(2, '0'), 'MM').format('MMMM')} / {m.anio} 
                                    </td>
                                    <td className='bg-danger fs-3'>
                                        {m.items?.length} 
                                    </td>
                                    <td className='fs-3'>
                                        
                                    <div className={`float-end ${m.variacion_porcent<0&&'text-primary'}`}>
                                        {m.variacion_porcent>=0&& m.variacion_porcent!==100&& '+'} <NumberFormatMoney amount={m.variacion_porcent}/>%
                                        </div>
                                    </td>
                                </tr>
                                
                                </>
                            )
                        })
                    }
					</tbody>
				</Table>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        <ModalItemsClientes show={isOpenModalItems} data={dataItemsxClick} headModal={headModal} onHide={onCloseModalItems}/>
    </>
  )
}
