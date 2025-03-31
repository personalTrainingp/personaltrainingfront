import { PageBreadcrumb } from '@/components'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { ModalTableInventario } from './ModalTableInventario'
import sinImage from '@/assets/images/image_prueba_inventario.jpeg'
import { Image } from 'primereact/image'
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { TabPanel, TabView } from 'primereact/tabview'
import { Button } from 'primereact/button'
import { ModalResumenInventarioValorizado } from './ModalResumenInventarioValorizado'
import { ImagesGrids } from './ImagesGrids'

export const DataView = ({id_empresa, label_empresa, isResumenxZonaLoc}) => {
    const { obtenerArticulos, isLoading } = useInventarioStore()
    const {dataView} = useSelector(e=>e.DATA)
    const [valueFilter, setvalueFilter] = useState([])
    const [dataFilter, setdataFilter] = useState([])
    const [ubicacion, setubicacion] = useState('')
    const [isOpenModalInventarioFiltered, setisOpenModalInventarioFiltered] = useState(false)
    useEffect(() => {
        obtenerArticulos(id_empresa, true)
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
      console.log(groupedData);
      
  return (
    <>
    <Button label={<span className='fs-2'>RESUMEN VALORIZADO</span>} onClick={onOpenModalResumenValorizado} text/>

        <Row>
            {isResumenxZonaLoc &&
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
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>MANO DE OBRA S/.</span> <span className='fs-2'><NumberFormatMoney amount={f.valor_mano_obra_sumado_soles}/></span></li>
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
            <Col lg={8}>
          <ModalResumenInventarioValorizado label_empresa={label_empresa} data={dataView} show={isOpenModalResumenValorizado} onHide={onCloseModalResumenValorizado}/>

            </Col>
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
          acc[label] = { 
              ubicacion: label, 
              tb_images: item.parametro_lugar_encuentro?.tb_images, 
              orden: item.parametro_lugar_encuentro?.orden_param, 
              valor_total_sumado_soles: 0, 
              valor_mano_obra_sumado_soles: 0, 
              valor_total_sumado_dolares: 0, 
              cantidad_sumado: 0, 
              items: [] 
            };
        }
        
        // Sumamos el valor_total del item actual al grupo correspondiente
        acc[label].valor_total_sumado_soles += item.costo_total_soles;
        acc[label].valor_mano_obra_sumado_soles += item.mano_obra_soles;
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