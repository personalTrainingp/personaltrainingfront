import { PageBreadcrumb } from '@/components'
import React from 'react'
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import Tarjetas from './Tarjetas'
import { FormasPago, tarjetasCredito, tarjetasDebito } from '../../data'
import { TarjetasPago } from './TarjetasPago'
import { CardTotal } from './CardTotal'

export const TotalVentas = () => {
  return (
    <>
    <PageBreadcrumb title="Total de ventas" subName="Ventas" />
    <Row className='mb-4'>
      <Col xxl={2} md={4} xs={6}>
      <FloatingLabel controlId="floatingSelect" label="Año">
							<Form.Select aria-label="Seleccionar el año">
								<option value="0">2024</option>
								<option value="1">2023</option>
								<option value="2">2022</option>
								<option value="3">2021</option>
								<option value="4">2020</option>
								<option value="5">2019</option>
							</Form.Select>
						</FloatingLabel>
      </Col>
      <Col xxl={2} md={4} xs={6}>
      <FloatingLabel controlId="floatingSelect" label="Meses">
							<Form.Select aria-label="Floating label select example">
								<option value="1">Enero</option>
								<option value="2">Febrero</option>
								<option value="3">Marzo</option>
								<option value="4">Abril</option>
								<option value="5">Mayo</option>
								<option value="6">Junio</option>
								<option value="7">Julio</option>
								<option value="8">Agosto</option>
								<option value="9">Setiembre</option>
								<option value="10">Octubre</option>
								<option value="11">Noviembre</option>
								<option value="12">Diciembre</option>
							</Form.Select>
						</FloatingLabel>
      </Col>
      <Col xxl={2} md={4} xs={6}>
      <FloatingLabel controlId="floatingSelect" label="Tipo">
							<Form.Select aria-label="Floating label select example">
								<option value="1">Todos</option>
								<option value="2">Programas</option>
								<option value="3">Suplementos</option>
								<option value="4">Fitology</option>
								<option value="5">Transferencias / Membresias</option>
							</Form.Select>
						</FloatingLabel>
      </Col>
    </Row>
    <Row>
      <Col xxl={3}>
      <CardTotal title={'Total de venta'} body={'S/ 1,589,586.00'} span={'30 ventas | 6 free | 2 Canjes'}/>
      </Col>
      <Col xxl={3}>
      </Col>
    </Row>
    <Row>
      <Col xxl={4} md={6}>
      <Tarjetas tasks={FormasPago} title={'Formas de pago'}/>
      </Col>
      <Col xxl={4} md={6}>
        <TarjetasPago tasks={tarjetasCredito} title={'Tarjetas'}/>
      </Col>
      <Col xxl={4} md={6}>
        <TarjetasPago tasks={tarjetasCredito} title={'Ranking de vendedores'}/>
      </Col>
    </Row>
    </>
  )
}
