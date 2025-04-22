import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import config from '@/config';
import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react'
import { Card } from 'react-bootstrap';

export const ModalItemAgrupadoxEtiquetas = ({show, onHide, data, etiquetaNombre}) => {
    // const [dataEti, setdataEti] = useState([])
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
  return (
    <Dialog header={etiquetaNombre} style={{width: '50rem'}} visible={show} onHide={onHide}>
        {
                                data.map(i=>{
                                    const costo_total_soles = (i.cantidad*i.costo_unitario_soles)+i.mano_obra_soles
                                    const costo_total_dolares = (i.cantidad*i.costo_unitario_dolares)+i.mano_obra_dolares
                                    return (
                                        <Card style={{ width: '100%' }}>
                                        <Card.Body>
                                            <div className='d-flex flex-row'>
                                                <div className='' style={{width: '30%'}}>
                                                    {
                                                        imagenBodyTemplate(i?.tb_images)
                                                    }
                                                </div>
                                                <div className='' style={{width: '70%'}}>
                                                    <Card.Text>
                                                        <span className='fw-bold fs-3'>{i.producto}</span>
                                                        <br/>
                                                        <span className='text-black underline'>DESCRIPCION</span>
                                                        <br/>
                                                        {i.descripcion}
                                                    </Card.Text>
                                                    <Card.Link href="#"><span className='text-black underline'>UBICACION:</span> <span className='fw-bold text-primary'>{i.parametro_lugar_encuentro?.label_param} - NIVEL <span className='fs-4'>{i.parametro_lugar_encuentro?.nivel?.split(' ')[0]}</span> <span className='fs-6'>{i.parametro_lugar_encuentro?.nivel?.split(' ')[1]}</span></span></Card.Link>
                                                    <br/>
                                                    <Card.Link href="#"><span className='text-black underline'>MARCA:</span> <span className='fw-bold text-primary'>{i.parametro_marca?.label_param}</span></Card.Link>
                                                    <br/>
                                                    <Card.Link href="#"><span className='text-black underline'>CANTIDAD:</span> <span className='fw-bold text-primary'>{i.cantidad}</span></Card.Link>
                                                    <br/>
                                                    <Card.Link href="#"><span className='text-black underline'>COSTO UNITARIO SOLES:</span> <span className='fw-bold text-primary'><SymbolSoles numero={<NumberFormatMoney amount={i.costo_unitario_soles}/>} fontSizeS={'10'} bottomClasss={'7'}/></span></Card.Link>
                                                    <br/>
                                                    <Card.Link href="#"><span className='text-black underline'>MANO DE OBRA SOLES:</span> <span className='fw-bold text-primary'><SymbolSoles numero={<NumberFormatMoney amount={i.mano_obra_soles}/>} fontSizeS={'10'} bottomClasss={'7'}/></span></Card.Link>
                                                    <br/>
                                                    <Card.Link href="#"><span className='text-black underline'>COSTO TOTAL SOLES:</span> <span className='fw-bold text-primary'><SymbolSoles numero={<NumberFormatMoney amount={costo_total_soles}/>} fontSizeS={'10'} bottomClasss={'7'}/></span></Card.Link>
                                                    <br/>
                                                    <Card.Link href="#"><span className='text-color-dolar underline'>COSTO UNITARIO DOLARES:</span> <span className='fw-bold text-color-dolar'><SymbolDolar numero={<NumberFormatMoney amount={i.costo_unitario_dolares}/>} fontSizeS={'10'} bottomClasss={'7'}/></span></Card.Link>
                                                    <br/>
                                                    <Card.Link href="#"><span className='text-color-dolar underline'>MANO DE OBRA DOLARES:</span> <span className='fw-bold text-color-dolar'><SymbolDolar numero={<NumberFormatMoney amount={i.mano_obra_dolares}/>} fontSizeS={'10'} bottomClasss={'7'}/></span></Card.Link>
                                                    <br/>
                                                    <Card.Link href="#"><span className='text-color-dolar underline'>COSTO TOTAL DOLARES:</span> <span className='fw-bold text-color-dolar'><SymbolDolar numero={<NumberFormatMoney amount={costo_total_dolares}/>} fontSizeS={'10'} bottomClasss={'7'}/></span></Card.Link>
                                                    <br/>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    )
                                })
                            }
                            {
                                footerAgrupadoxEtiquetas(data)
                            }
    </Dialog>
  )
}
