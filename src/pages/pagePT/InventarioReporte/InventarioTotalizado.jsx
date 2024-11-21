import { PageBreadcrumb } from '@/components'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { ModalTableInventario } from './ModalTableInventario'
import sinImage from '@/assets/images/SinImage.jpg'
import { Image } from 'primereact/image'

export const InventarioTotalizado = () => {
    const { obtenerArticulos, isLoading } = useInventarioStore()
    const {dataView} = useSelector(e=>e.DATA)
    const [valueFilter, setvalueFilter] = useState([])
    const [dataFilter, setdataFilter] = useState([])
    const [ubicacion, setubicacion] = useState('')
    const [isOpenModalInventarioFiltered, setisOpenModalInventarioFiltered] = useState(false)
    useEffect(() => {
        obtenerArticulos(599)
        // obtenerProveedoresUnicos()
    }, [])
    const onOpenModalInventario = (items, ubicacion)=>{
        setisOpenModalInventarioFiltered(true)
        setdataFilter(items)
        setubicacion(ubicacion)
    }
    const onCloseModalInventario = ()=>{
        setisOpenModalInventarioFiltered(false)
    }

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
    <PageBreadcrumb title={'INVENTARIO VALORIZADO'} subName={'T'}/>
        <Row>
            {
                groupedData.map(g=>{
                    
                    return(
                    <>
                    <h1>
                        NIVEL {g.nivel}
                    </h1>
                    {
                    }
                    {
                        agruparDataxLugar(g.items).map(f=>(
                            <Col lg={4}>
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
                        </Col>
                        ))
                    }
                    </>
                                
                )})
            }
        </Row>
        <ModalTableInventario ubicacion={ubicacion} show={isOpenModalInventarioFiltered} onHide={onCloseModalInventario} data={dataFilter}/>
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