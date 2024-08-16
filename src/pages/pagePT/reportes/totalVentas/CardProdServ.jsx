import { MoneyFormatter } from '@/components/CurrencyMask'
import { ScrollPanel } from 'primereact/scrollpanel'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ItemProdServ } from './ItemProdServ'

//membresia: 1, accesorios:2, tratamientos esteticos: 3, suplementos: 4, nutricionista:5
export const CardProdServ = ({data, dataGen}) => {
  const onClickBox = (e)=>{

  }
  console.log(dataGen);
  
  return (
    <Card>
          <Row className="mx-n1 ">
              <ScrollPanel style={{ width: '100%' }}>
                <div className='d-flex'>
                  <Col xxl={3} lg={6}>
                    <ItemProdServ data={data} Inombre={"MEMBRESIA"} Iabrev={"mem"} Icantidad={data?.cantidad_membresia} Itotal={data?.suma_tarifa_monto_membresia}/>
                  </Col>
                  <Col xxl={3} lg={6}>
                    <ItemProdServ Inombre={"ACCESORIOS"} Iabrev={"acc"} Icantidad={data?.cantidad_accesorio} Itotal={data?.suma_tarifa_monto_accesorio}/>
                  </Col>
                  <Col xxl={3} lg={6}>
                    <ItemProdServ Inombre={"TRATAMIENTOS ESTETICOS"} Iabrev={"tra"} Icantidad={data?.cantidad_citas_FITOL} Itotal={data?.suma_tarifa_monto_citas_FITOL}/>
                  </Col>
                  <Col xxl={3} lg={6}>
                    <ItemProdServ Inombre={"SUPLEMENTOS"} Iabrev={"sup"} Icantidad={data?.cantidad_suplementos} Itotal={data?.suma_tarifa_monto_suplementos}/>
                  </Col>
                  <Col xxl={3} lg={6}>
                    <ItemProdServ Inombre={"NUTRICION"} Iabrev={"nut"} Icantidad={data?.cantidad_citas_NUTRI} Itotal={data?.suma_tarifa_monto_citas_NUTRI}/>
                  </Col>
                </div>
              </ScrollPanel>

          </Row>
    </Card>
  )
}
