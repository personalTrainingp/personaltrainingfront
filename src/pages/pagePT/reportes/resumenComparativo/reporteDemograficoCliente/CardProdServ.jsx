import { MoneyFormatter } from '@/components/CurrencyMask'
import { ScrollPanel } from 'primereact/scrollpanel'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ItemProdServ } from './ItemProdServ'
import SimpleBar from 'simplebar-react'
import icoMem from '@/assets/images/PT-images/iconos/mem_logo.png'
import icoAcc from '@/assets/images/PT-images/iconos/acc.png'
import icoEst from '@/assets/images/PT-images/iconos/estetica.png'
import icoSupl from '@/assets/images/PT-images/iconos/supl.png'
import icoNut from '@/assets/images/PT-images/iconos/nutri.png'

//membresia: 1, accesorios:2, tratamientos esteticos: 3, suplementos: 4, nutricionista:5
export const CardProdServ = ({data, dataGen, setclickServProd, clickServProd}) => {
  const onClickBox = (e)=>{

  }
  const clickedItemProdServ = (e)=>{
    setclickServProd(e)  
  }
  return (
    <Card>
      
				<SimpleBar style={{ maxHeight: '100%'}} scrollbarMaxSize={320}>
                <div className='d-flex'>
                  <Col xxl={4} lg={4} onClick={()=>clickedItemProdServ("mem")}>
                    <ItemProdServ data={data} Inombre={"MEMBRESIAS"} icono={icoMem} icowid={250} icohe={70} Iabrev={"mem"} Icantidad={data?.cantidad_membresia} Itotal={data?.suma_tarifa_monto_membresia}/>
                  </Col>
                  <Col xxl={4} lg={4} onClick={()=>clickedItemProdServ("acc")}>
                    <ItemProdServ Inombre={"ACCESORIOS"} Iabrev={"acc"} icono={icoAcc} icowid={90} icohe={100} Icantidad={data?.cantidad_accesorio} Itotal={data?.suma_tarifa_monto_accesorio}/>
                  </Col>
                  <Col xxl={4} lg={4} onClick={()=>clickedItemProdServ("sup")}>
                    <ItemProdServ Inombre={"SUPLEMENTOS"} Iabrev={"sup"} icono={icoSupl} icowid={80} icohe={100} Icantidad={data?.cantidad_suplementos} Itotal={data?.suma_tarifa_monto_suplementos}/>
                  </Col>
                  <Col xxl={4} lg={4} onClick={()=>clickedItemProdServ("nut")}>
                    <ItemProdServ Inombre={"NUTRICION"} Iabrev={"nut"} icono={icoNut} icowid={150} icohe={100} Icantidad={data?.cantidad_citas_NUTRI} Itotal={data?.suma_tarifa_monto_citas_NUTRI}/>
                  </Col>
                  <Col xxl={4} lg={4} onClick={()=>clickedItemProdServ("tra")}>
                    <ItemProdServ Inombre={"TRATAMIENTOS ESTETICOS"} icono={icoEst} icowid={140} icohe={100} Iabrev={"tra"} Icantidad={data?.cantidad_citas_FITOL} Itotal={data?.suma_tarifa_monto_citas_FITOL}/>
                  </Col>
                </div>
				</SimpleBar>
    </Card>
  )
}
