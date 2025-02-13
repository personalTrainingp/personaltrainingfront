import { PageBreadcrumb } from '@/components'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { ModalTableInventario } from './ModalTableInventario'
import sinImage from '@/assets/images/image_prueba_inventario.jpeg'
import { Image } from 'primereact/image'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { TabPanel, TabView } from 'primereact/tabview'
import { Button } from 'primereact/button'
import { ModalResumenInventarioValorizado } from './ModalResumenInventarioValorizado'

export const DataView = ({id_empresa, label_empresa}) => {
    const { obtenerArticulos, isLoading } = useInventarioStore()
    const {dataView} = useSelector(e=>e.DATA)
    const [valueFilter, setvalueFilter] = useState([])
    const [dataFilter, setdataFilter] = useState([])
    const [ubicacion, setubicacion] = useState('')
    const [isOpenModalInventarioFiltered, setisOpenModalInventarioFiltered] = useState(false)
    useEffect(() => {
        obtenerArticulos(id_empresa)
        // obtenerProveedoresUnicos()
    }, [id_empresa])
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
          acc[label] = { nivel: label, valor_total_sumado_soles: 0, valor_total_sumado_dolares: 0, cantidad_sumado: 0, items: [] };
        }
        
        // Sumamos el valor_total del item actual al grupo correspondiente
        acc[label].valor_total_sumado_soles += item.costo_total_soles;
        acc[label].valor_total_sumado_dolares += item.costo_total_soles;
        acc[label].cantidad_sumado += item.costo_total_soles;
        
        // Añadimos el item al array `items` del grupo correspondiente
        acc[label].items.push(item);
        
        return acc;
      }, {}));
    //   console.log(groupedData);
      
      // Convertimos valor_total_sumado a cadena con dos decimales
      groupedData.forEach(group => {
        group.valor_total_sumado_soles = group.valor_total_sumado_soles
      });
      groupedData.sort((a, b) => a.nivel - b.nivel);
      
      const [isOpenModalResumenValorizado, setisOpenModalResumenValorizado] = useState(false)
      const onOpenModalResumenValorizado = ()=>{
        setisOpenModalResumenValorizado(true)
      }
      const onCloseModalResumenValorizado = ()=>{
        setisOpenModalResumenValorizado(false)
      }
      console.log(groupedData, "ggg");
      
  return (
    <>
    <Button label='RESUMEN VALORIZADO' onClick={onOpenModalResumenValorizado} text/>
    <Row>
            {
                groupedData.map(g=>{
                    console.log(agruparDataxLugar(g.items), "agrupada");
                    
                    return(
                    <>
                    <h1>
                        {g.nivel!=null && <>NIVEL {g.nivel}</>}
                        
                    </h1>
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
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>ITEMS:</span> <span className='fs-2'>{f.cantidad_sumado}</span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>inversión <SymbolSoles isbottom={false}/>: </span><span className='fs-2'><NumberFormatMoney amount={f.valor_total_sumado_soles}/></span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>inversión $ : </span><span className='fs-2'><NumberFormatMoney amount={(f.valor_total_sumado_dolares)}/></span></li>
                                        <br/>
                                        <li className='d-flex justify-content-center'>
                                            <Image src={sinImage}  className='rounded-circle m-2' indicatorIcon={<i className="pi pi-search"></i>} alt={f.ubicacion} preview  height='250' ></Image>
                                            <Image src={sinImage}  className='rounded-circle m-2' indicatorIcon={<i className="pi pi-search"></i>} alt={f.ubicacion} preview  height='250' ></Image>
                                            <Image src={sinImage}  className='rounded-circle m-2' indicatorIcon={<i className="pi pi-search"></i>} alt={f.ubicacion} preview  height='250' ></Image>
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
        <ModalResumenInventarioValorizado label_empresa={label_empresa} data={dataView} show={isOpenModalResumenValorizado} onHide={onCloseModalResumenValorizado}/>
        <ModalTableInventario ubicacion={ubicacion} show={isOpenModalInventarioFiltered} onHide={onCloseModalInventario} data={dataFilter}/>
    </>
  )
}


function agruparDataxLugar(dataV) {
    
    const groupedData = Object.values(dataV.reduce((acc, item) => {
        const label = item.parametro_lugar_encuentro?.label_param;
      
        // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
        if (!acc[label]) {
          acc[label] = { ubicacion: label, orden: item.parametro_lugar_encuentro?.orden_param, valor_total_sumado_soles: 0, valor_total_sumado_dolares: 0, cantidad_sumado: 0, items: [] };
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