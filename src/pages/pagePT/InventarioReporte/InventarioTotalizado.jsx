import { PageBreadcrumb } from '@/components'
import { MoneyFormatter } from '@/components/CurrencyMask'
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

export const InventarioTotalizado = () => {
    const { obtenerArticulos, isLoading } = useInventarioStore()
    const {dataView} = useSelector(e=>e.DATA)
    const [valueFilter, setvalueFilter] = useState([])
    useEffect(() => {
        obtenerArticulos(599)
        // obtenerProveedoresUnicos()
    }, [])

    const groupedData = Object.values(dataView.reduce((acc, item) => {
        const label = item.parametro_nivel?.label_param;
      
        // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
        if (!acc[label]) {
          acc[label] = { nivel: label, valor_total_sumado: 0, items: [] };
        }
        
        // Sumamos el valor_total del item actual al grupo correspondiente
        acc[label].valor_total_sumado += item.valor_total;
        
        // Añadimos el item al array `items` del grupo correspondiente
        acc[label].items.push(item);
        
        return acc;
      }, {}));
      
      // Convertimos valor_total_sumado a cadena con dos decimales
      groupedData.forEach(group => {
        group.valor_total_sumado = group.valor_total_sumado.toFixed(2);
      });
      groupedData.sort((a, b) => a.nivel - b.nivel);
  return (
    <>
    <PageBreadcrumb title={'INVENTARIO VALORIZADO AL 31 DE OCTUBRE DEL 2024'} subName={'T'}/>
    
    <Row>
        {
            groupedData.map(g=>{
                
                return(
                <>
                <h3>
                    NIVEL {g.nivel}
                </h3>
                {
                    agruparDataxLugar(g.items).map(f=>(
                        <Col lg={3}>
                        <Card style={{height: '200px', display: 'block'}} className='m-1 border border-4'>
                            <Card.Header>
                                <Card.Title className='font-24'>
                                    {f.ubicacion}
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <ul className='text-decoration-none list-unstyled font-18'>
                                    <li ><span className='fw-bold'>CANTIDAD DE ITEMS:</span> {f.items.length}</li>
                                    <li ><span className='fw-bold'>inversión: </span><MoneyFormatter amount={f.valor_total_sumado}/></li>
                                </ul>
                     
                            </Card.Body>
                        </Card>
                    </Col>
                    ))
                }
                </>
                            
            )})
        }
                        </Row>
    </>
  )
}

function agruparDataxLugar(dataV) {
    
    const groupedData = Object.values(dataV.reduce((acc, item) => {
        const label = item.parametro_lugar_encuentro?.label_param;
      
        // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
        if (!acc[label]) {
          acc[label] = { ubicacion: label, valor_total_sumado: 0, items: [] };
        }
        
        // Sumamos el valor_total del item actual al grupo correspondiente
        acc[label].valor_total_sumado += item.valor_total;
        
        // Añadimos el item al array `items` del grupo correspondiente
        acc[label].items.push(item);
        
        return acc;
      }, {}));
      
      // Convertimos valor_total_sumado a cadena con dos decimales
      groupedData.forEach(group => {
        group.valor_total_sumado = group.valor_total_sumado.toFixed(2);
      });
      return groupedData;
}