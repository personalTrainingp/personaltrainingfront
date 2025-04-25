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

export const DataView = ({id_empresa, dvi, label_empresa, isResumenxZonaLoc, kardexSalida, kardexEntrada, transferencias}) => {
    const {dataView} = useSelector(e=>e.DATA)
    const [valueFilter, setvalueFilter] = useState([])
    const [dataFilter, setdataFilter] = useState([])
    const [ubicacion, setubicacion] = useState('')
    const [isOpenModalInventarioFiltered, setisOpenModalInventarioFiltered] = useState(false)
    // useEffect(() => {
        // obtenerFechasInventario(id_empresa)
        // obtenerProveedoresUnicos()
    // }, [id_empresa])
    const onOpenModalInventario = (items, ubicacion)=>{
        setisOpenModalInventarioFiltered(true)
        setdataFilter(items)
        setubicacion(ubicacion)
    }
    const onCloseModalInventario = ()=>{
        setisOpenModalInventarioFiltered(false)
    }
    const groupedData = Object.values(dvi.reduce((acc, item) => {
        const label = item.parametro_nivel?.label_param;
        console.log({item});
        
        // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
        if (!acc[label]) {
          acc[label] = { nivel: label, valor_total_sumado_soles: 0, valor_total_sumado_dolares: 0, cantidad_sumado: 0, items: [] };
        }
        // Sumamos el valor_total del item actual al grupo correspondiente
        acc[label].valor_total_sumado_soles += (item.costo_unitario_soles*item.cantidad)+item.mano_obra_soles;
        acc[label].valor_total_sumado_dolares += (item.costo_unitario_dolares*item.cantidad)+item.mano_obra_dolares;
        acc[label].cantidad_sumado += item.cantidad;
        
        // Añadimos el item al array `items` del grupo correspondiente
        acc[label].items.push(item);
        
        return acc;
      }, {}));
    //   console.log(groupedData);
      
      // Convertimos valor_total_sumado a cadena con dos decimales
      groupedData.forEach(group => {
        group.valor_total_sumado_soles = group.valor_total_sumado_soles
      });
      groupedData.sort((a, b) => a.orden_zona - b.orden_zona);
      
      const [isOpenModalResumenValorizado, setisOpenModalResumenValorizado] = useState(false)
      const onOpenModalResumenValorizado = ()=>{
        setisOpenModalResumenValorizado(true)
      }
      const onCloseModalResumenValorizado = ()=>{
        setisOpenModalResumenValorizado(false)
      }
  return (
    <>
    <Row>
      {/* <Col lg={3}>
        <Card>
            <Card.Header>
                  <Card.Title className='fs-2 text-primary'>
                    ARTICULOS NUEVOS
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <table className="table font-14">
                              <thead>
                                  <tr>
                                      <th className="bg-light p-1">
                                          <span className=" text-uppercase">PRODUCTO</span>
                                      </th>
                                      <th className="bg-light p-1">
                                          <span className=" text-uppercase">CANTIDAD</span>
                                      </th>
                                  </tr>
                              </thead>
                              <tbody>
                                {
                                  [].map(k=>{
                                    return (

                                      <tr>
                                      <td className="border-0">
                                        {k.articulos_kardex.producto}
                                      </td>
                                      <td className="border-0">
                                        {k.cantidad                                        }
                                      </td>
                                  </tr>
                                    )
                                  })
                                }
                              </tbody>
                          </table>
                </Card.Body>
          </Card>
      </Col>
      <Col lg={3}>
        <Card>
          <Card.Header>
                <Card.Title className='fs-2 text-primary'>
                  ENTRADAS
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className='text-center'>
                </div>
              </Card.Body>
        </Card>
      </Col>
      <Col lg={3}>
        <Card>
            <Card.Header>
                  <Card.Title className='fs-2 text-primary'>
                    SALIDAS
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  
                <table className="table font-14">
                              <thead>
                                  <tr>
                                      <th className="bg-light p-1">
                                          <span className=" text-uppercase">PRODUCTO</span>
                                      </th>
                                      <th className="bg-light p-1">
                                          <span className=" text-uppercase">CANTIDAD</span>
                                      </th>
                                  </tr>
                              </thead>
                              <tbody>
                                {
                                  kardexSalida?.map(k=>{
                                    return (

                                      <tr>
                                      <td className="border-0">
                                        {k.articulos_kardex.producto}
                                      </td>
                                      <td className="border-0">
                                        {k.cantidad                                        }
                                      </td>
                                  </tr>
                                    )
                                  })
                                }
                              </tbody>
                          </table>
                </Card.Body>
        </Card>
      </Col>
      <Col lg={3}>
        <Card>
            <Card.Header>
                  <Card.Title className='fs-2 text-primary'>
                    TRANSFERENCIAS
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className='text-center'>
                  </div>
                </Card.Body>
          </Card>
      </Col> */}
    </Row>
    <Button label={<span className='fs-2'>RESUMEN VALORIZADO</span>} onClick={onOpenModalResumenValorizado} text/>
        <Row>
            {groupedData.map(g=>{
                    return(
                    <>
                    <h1>
                        {g.nivel!=null && <>NIVEL {g.nivel}</>}
                    </h1>
                    {
                        agruparDataxLugar(g.items).map(f=>{
                            const nivel = f.items[0].parametro_lugar_encuentro.label_nivel
                          return (
                            <Col lg={4}>
                            <Card  onClick={()=>onOpenModalInventario(f.items, f.ubicacion)} className='m-1 border border-4'>
                                <Card.Header>
                                    <Card.Title className='fs-2 text-primary'>
                                      <span></span>
                                    NIVEL {nivel?.split(' ')[0]}<span className='ml-2 font-24'>{nivel?.split(' ')[1]}</span> <br/> {f.ubicacion}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <ul className='text-decoration-none list-unstyled font-20'>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>ITEMS</span> <span className='fs-2'>{f.cantidad_sumado}</span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>ACTIVOS(+M.O) S/. </span><span className='fs-2'><NumberFormatMoney amount={f.valor_total_sumado_soles-f.valor_mano_obra_sumado_soles}/></span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2' style={{color: '#1E8727'}}>ACTIVOS(+M.O) <SymbolDolar fontSizeS={'20px'}/> </span><span className='fs-2 fw-bold' style={{color: '#1E8727'}}><NumberFormatMoney amount={(f.valor_total_sumado_dolares-f.valor_mano_obra_sumado_dolares)}/></span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>MANO DE OBRA S/.</span> <span className='fs-2'><NumberFormatMoney amount={f.valor_mano_obra_sumado_soles}/></span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2' style={{color: '#1E8727'}}>MANO DE OBRA <SymbolDolar fontSizeS={'20px'}/></span> <span className='fs-2 fw-bold' style={{color: '#1E8727'}}><NumberFormatMoney amount={f.valor_mano_obra_sumado_dolares}/></span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2'>inversión total S/. </span><span className='fs-2'><NumberFormatMoney amount={f.valor_total_sumado_soles}/></span></li>
                                        <li className='d-flex justify-content-between '><span className='fw-bold fs-2' style={{color: '#1E8727'}}>inversión total <SymbolDolar fontSizeS={'20px'}/> </span><span className='fs-2 fw-bold' style={{color: '#1E8727'}}><NumberFormatMoney amount={(f.valor_total_sumado_dolares)}/></span></li>
                                        <br/>
                                    </ul>
                                    
                                    <div style={{width: '100%', height: 'auto'}} className='border border-gray-300'>
                                            <ImagesGrids images={f.tb_images}/>
                                          </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        )
                        }
                      )
                    }
                    </>
                                
                )})
            }
          <ModalResumenInventarioValorizado label_empresa={label_empresa} data={dvi} show={isOpenModalResumenValorizado} onHide={onCloseModalResumenValorizado}/>
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
              valor_mano_obra_sumado_dolares: 0,
              valor_total_sumado_dolares: 0, 
              cantidad_sumado: 0, 
              items: [] 
            };
        }
        // Sumamos el valor_total del item actual al grupo correspondiente
        acc[label].valor_total_sumado_soles += (item.cantidad*item.costo_unitario_soles)+item.mano_obra_soles;
        acc[label].valor_mano_obra_sumado_soles += item.mano_obra_soles;
        acc[label].valor_mano_obra_sumado_dolares += item.mano_obra_dolares;
        acc[label].valor_total_sumado_dolares += (item.costo_unitario_dolares*item.cantidad)+item.mano_obra_dolares;
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