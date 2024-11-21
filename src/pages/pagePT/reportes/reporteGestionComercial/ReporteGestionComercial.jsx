import { PageBreadcrumb } from '@/components'
import { useProspectoLeadsStore } from '@/hooks/hookApi/useProspectoLeadsStore'
import { Badge } from 'primereact/badge'
import { TabPanel, TabView } from 'primereact/tabview'
import React, { useEffect } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

export const ReporteGestionComercial = () => {
    
    const  { obtenerProspectosLeads } = useProspectoLeadsStore()
	const { dataView } = useSelector(e=>e.DATA)
    useEffect(() => {
        obtenerProspectosLeads()
    }, [])
    console.log(agruparPorEstados(dataView));
    
  return (
		<>
			<PageBreadcrumb title={'REPORTE DE GESTION COMERCIAL'} subName={'T'} />

			<Row>
                <TabView>
                    {agruparPorEstados(dataView).map((d) => (
                        <TabPanel header={<> <Badge value={d.items.length} size="large" severity="danger"></Badge> {d.label_estado}</>}>
                            <Col lg={12}>
                                <div className="flex-auto">
                                    <label htmlFor="buttondisplay" className="font-bold block mb-2">
                                        MES
                                    </label>
                                </div>
                            </Col>
                            <TabView>
                                <TabPanel header={<><Badge value={agruparPorCanales(d.items).length} size="large" severity="danger"></Badge> CANALES</>} >
                            <Row>
                                {
                                    agruparPorCanales(d.items).map(c=>(
                                        <Col lg={3}>
                                            <Card style={{height: '200px', display: 'block'}} className='m-1 border border-4'>
                                                <Card.Header>
                                                    <Card.Title className='fs-2'>
                                                        {c.label_param}
                                                    </Card.Title>
                                                </Card.Header>
                                                <Card.Body>
                                                    <ul className='text-decoration-none list-unstyled font-22'>
                                                        <li ><span className='fw-bold fs-2'>ITEMS:</span> <span className='fw-bold fs-2 ml-2'>{c.items.length}</span></li>
                                                    </ul>
                                        
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                }
                            </Row>
                                </TabPanel>
                                <TabPanel header={<><Badge value={agruparPorCompania(d.items).length} size="large" severity="danger"></Badge> CAMPAÑAS</>}>

                                <Row>
                                {
                                    agruparPorCompania(d.items).map(c=>(
                                        <Col lg={4}>
                                            <Card style={{height: '280px', display: 'block'}} className='m-1 border border-4'>
                                                {/* <Card.Header>
                                                    <Card.Title className='fs-2 text-primary'>
                                                        {c.label_param}
                                                    </Card.Title>
                                                </Card.Header> */}
                                                <Card.Body className='d-flex flex-column h-100'>
                                                    <div className='fw-bold fs-2 text-primary' style={{height: '100%'}}>
                                                        {c.label_param}
                                                    </div>
                                                    <p className='fs-4'>{c.items[0].parametro_campania.descripcion_param}</p>
                                                    <div className=' d-flex align-items-end' style={{height: '100%'}}>
                                                        <ul className='text-decoration-none list-unstyled font-22 m-0' style={{height: 'fit-content'}}>
                                                            <li ><span className='fw-bold fs-2'>ITEMS:</span> <span className='fw-bold fs-2 ml-2'>{c.items.length}</span></li>
                                                        </ul>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                }
                            </Row>
                                </TabPanel>
                            </TabView>
                        </TabPanel>
                    ))}
                </TabView>
			</Row>
		</>
  );
}

const agruparPorEstados = (data) => {
    return data.reduce((result, item) => {
      const labelEstado = item.parametro_estado_lead?.label_param;
      
      // Encuentra el canal en el resultado
      let canal = result.find(group => group.label_estado === labelEstado);
      
      // Si no existe, lo crea
      if (!canal) {
        canal = { label_estado: labelEstado, items: [] };
        result.push(canal);
      }
      
      // Agrega el item al canal correspondiente
      canal.items.push(item);
      
      return result;
    }, []);
  };

  const agruparPorCanales = (data) => {
    return data.reduce((result, item) => {
      const labelcanal = item.parametro_canal?.label_param;
      
      // Encuentra el canal en el resultado
      let canal = result.find(group => group.label_param === labelcanal);
      
      // Si no existe, lo crea
      if (!canal) {
        canal = { label_param: labelcanal, items: [] };
        result.push(canal);
      }
      
      // Agrega el item al canal correspondiente
      canal.items.push(item);
      
      return result;
    }, []);
  };
  const agruparPorCompania = (data) => {
    return data.reduce((result, item) => {
      const labelcompania = item.parametro_campania?.label_param;
      
      // Encuentra el canal en el resultado
      let compania = result.find(group => group.label_param === labelcompania);
      
      
      // Si no existe, lo crea
      if (!compania) {
        compania = { label_param: labelcompania, descripcion: '', items: [] };
        result.push(compania);
      }
      
      // Agrega el item al canal correspondiente
      compania.items.push(item);
      
      return result;
    }, []);
  };