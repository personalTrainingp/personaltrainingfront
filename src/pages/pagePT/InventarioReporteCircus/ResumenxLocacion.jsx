import React from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { ImagesGrids } from './ImagesGrids';

export const ResumenxLocacion = ({onOpenModalInventario, groupedData}) => {
  return (
    <Row>
            {
                groupedData.map(g=>{
                    return(
                    <>
                    <h1>
                        {g.nivel!=null && <>NIVEL {g.nivel}</>}
                        
                    </h1>
                    {
                        agruparDataxLugar(g.items).map(f=>(
                            <Col lg={4}>
                            <Card  onClick={()=>onOpenModalInventario(f.items, f.ubicacion)} className='m-1 border border-4'>
                                <Card.Header>
                                    <Card.Title className='fs-2 text-primary'>
                                        {f.ubicacion}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <ul className='text-decoration-none list-unstyled font-20'>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>ITEMS</span> <span className='fs-2'>{f.cantidad_sumado}</span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>inversión S/. </span><span className='fs-2'><NumberFormatMoney amount={f.valor_total_sumado_soles}/></span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2' style={{color: '#1E8727'}}>inversión <SymbolDolar fontSizeS={'20px'}/> </span><span className='fs-2 fw-bold' style={{color: '#1E8727'}}><NumberFormatMoney amount={(f.valor_total_sumado_dolares)}/></span></li>
                                        <br/>
                                    </ul>
                                    
                                    <div style={{width: '100%', height: 'auto'}} className='border border-gray-300'>
                                            <ImagesGrids images={f.tb_images}/>
                                          </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        ))
                    }
                    </>
                                
                )})
            }
        </Row>
  )
}

function agruparDataxLugar(dataV) {
    
  const groupedData = Object.values(dataV.reduce((acc, item) => {
      const label = item.parametro_lugar_encuentro?.label_param;
    
      // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
      if (!acc[label]) {
        acc[label] = { ubicacion: label, tb_images: item.parametro_lugar_encuentro?.tb_images, orden: item.parametro_lugar_encuentro?.orden_param, valor_total_sumado_soles: 0, valor_total_sumado_dolares: 0, cantidad_sumado: 0, items: [] };
      }
      
      // Sumamos el valor_total del item actual al grupo correspondiente
      acc[label].valor_total_sumado_soles += item.costo_total_soles;
      acc[label].valor_total_sumado_dolares += item.costo_total_dolares;
      acc[label].cantidad_sumado += item.cantidad;
      
      // Añadimos el item al array `items` del grupo correspondiente
      acc[label].items.push(item);
      
      return acc;
    }, {}));
    
    // Convertimos valor_total_sumado a cadena con dos decimales
    groupedData.forEach(group => {
      group.valor_total_sumado = group.valor_total_sumado;
    });
    return groupedData.sort((a, b) => a.orden-b.orden);
}