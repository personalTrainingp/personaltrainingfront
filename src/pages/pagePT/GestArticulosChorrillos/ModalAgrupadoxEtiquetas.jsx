import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import config from '@/config';
import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import { ModalItemAgrupadoxEtiquetas } from './ModalItemAgrupadoxEtiquetas';

export const ModalAgrupadoxEtiquetas = ({show, onHide, data}) => {
    const [dataEtiquetaxItem, setdataEtiquetaxItem] = useState([])
    const [nombreEtiquetaSelectionada, setnombreEtiquetaSelectionada] = useState('')
    const [isOpenModalEtiquetaxItem, setisOpenModalEtiquetaxItem] = useState(false)
    const [filtroProducto, setFiltroProducto] = useState('');
    const imagenBodyTemplate = (tb_images)=>{    
        const images = [...(tb_images || [])];

    // Ordenamos por ID descendente
    const sortedImages = images.sort((a, b) => b.id - a.id);
    const latestImage = sortedImages[0]?.name_image;

    const imageUrl = latestImage
        ? `${config.API_IMG.AVATAR_ARTICULO}${latestImage}`
        : sinImage;
        return (
            <div className="flex align-items-center justify-content-center w-100 h-100 gap-2">
                        <Image src={tb_images.length===0?sinImage:`${imageUrl}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview height="150" width='150' />
            </div>
        );
    }
    const footerAgrupadoxEtiquetas = (d)=>{
        const sumaDeCantidades=d?.reduce((acumulador, item) => acumulador + item.cantidad, 0)
        const sumaDeCostoTotalSoles=d?.reduce((acc, g)=>acc+g.costo_total_soles, 0)
        const sumaDeCostoTotalDolares=d?.reduce((acc, g)=>acc+g.costo_total_dolares, 0)
        // const arrayDeCostos = d?.map(g => (g.cantidad * g.costo_unitario_soles) + g.mano_obra_soles);
        // const sumaArrayDeCosto = arrayDeCostos.reduce((acc, item)=>acc+item, 0)
        // console.log(sumaArrayDeCosto, "hooo");
        return (
            <div className='d-flex fs-3 fw-bold'>
                <span>
                    CANTIDAD TOTAL: <span className='text-primary ml-2'> {sumaDeCantidades}</span>
                </span>
                <br/>
                <span>
                    COSTO TOTAL EN SOLES: <span className='text-primary ml-2'> <SymbolSoles numero={<NumberFormatMoney amount={sumaDeCostoTotalSoles}/>}/></span>
                </span>
                <br/>
                <span className='text-color-dolar'>
                    COSTO TOTAL EN DOLARES: <span className='ml-2'> <SymbolDolar numero={<NumberFormatMoney amount={sumaDeCostoTotalDolares}/>}/></span>
                </span>
            </div>
        )
    }
    const onOpenModalEtiquetaxItem = (data, nombre_etiqueta)=>{
        setdataEtiquetaxItem(data)
        setnombreEtiquetaSelectionada(nombre_etiqueta)
        setisOpenModalEtiquetaxItem(true)
    }
    const onCloseModalEtiquetaxItem = ()=>{
        setisOpenModalEtiquetaxItem(false)
    }



  return (
    <>
    <Dialog header='Agrupado por etiquetas' style={{width: '70rem', height: '100rem'}} visible={show} onHide={onHide}>
        {/* <div className=''>

        </div> */}
        <Row>
            <Col lg={12}>
                <input
                    type="text"
                    placeholder="Buscar ETIQUETA..."
                    className="form-control mb-3"
                    value={filtroProducto}
                    onChange={(e) => setFiltroProducto(e.target.value.toLowerCase())}
                />
                <SimpleBar style={{maxHeight: '31rem'}}>
                    <Row>
                    {
                        data.filter(d => d.etiqueta_busqueda?.toLowerCase().includes(filtroProducto)).map(d=>{
                            const sumation = sumarTotales(d.items)
                            return (
                                <Col lg={4}>
                                        <Card onClick={()=>onOpenModalEtiquetaxItem(d.items, d.etiqueta_busqueda)} style={{height: '90%'}} className='p-2 d-flex justify-content-around flex-column hover-card cursor-pointer'>
                                            <h4>{d.etiqueta_busqueda}</h4>
                                            <span className='text-primary fw-bold'>CANTIDAD: {sumation.cantidad}</span>
                                            <span>COSTO TOTAL SOLES: <SymbolSoles fontSizeS={'font-15'} bottomClasss={8} numero={<NumberFormatMoney amount={sumation.costo_total_soles}/>}/></span>
                                            <span className='text-color-dolar'>COSTO TOTAL DOLARES: <SymbolDolar fontSizeS={'font-17'} numero={<NumberFormatMoney amount={sumation.costo_total_dolares}/>}/></span>
                                            <span>MANO DE OBRA SOLES: <SymbolSoles fontSizeS={'font-15'} bottomClasss={8} numero={<NumberFormatMoney amount={sumation.mano_obra_soles}/>}/></span>
                                            <span className='text-color-dolar'>MANO DE OBRA DOLARES: <SymbolDolar fontSizeS={'font-17'} numero={<NumberFormatMoney amount={sumation.mano_obra_dolares}/>}/></span>
                                        </Card>
                                </Col>
                            )
                        })
                    }
                    </Row>

                </SimpleBar>
            </Col>
        </Row>
    </Dialog>
    <ModalItemAgrupadoxEtiquetas show={isOpenModalEtiquetaxItem} onHide={onCloseModalEtiquetaxItem} data={dataEtiquetaxItem} etiquetaNombre={nombreEtiquetaSelectionada}/>
    </>
  )
}
function sumarTotales(data) {
    return data.reduce(
        (acc, item) => {
          acc.cantidad += item.cantidad || 0;
          acc.costo_unitario_soles += item.costo_unitario_soles || 0;
          acc.costo_total_soles += ((item.cantidad || 0) * (item.costo_unitario_soles || 0))+(item.mano_obra_soles || 0);
          acc.costo_total_dolares += ((item.cantidad || 0) * (item.costo_unitario_dolares || 0))+(item.mano_obra_dolares || 0);
          acc.mano_obra_soles += (item.mano_obra_soles || 0);
          acc.mano_obra_dolares += (item.mano_obra_dolares || 0);
          return acc;
        },
        { cantidad: 0, costo_unitario_soles: 0, costo_total_soles: 0, costo_total_dolares: 0, mano_obra_dolares: 0, mano_obra_soles: 0 }
      );
  }