import { PageBreadcrumb } from '@/components'
import React from 'react'
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import Tarjetas from './Tarjetas'
import { FormasPago, tarjetasCredito, tarjetasDebito } from '../../data'
import { TarjetasPago } from './TarjetasPago'
import { CardTotal } from './CardTotal'
import { CardProdServ } from './CardProdServ'
import { Calendar } from 'primereact/calendar'
import { useForm } from '@/hooks/useForm'

const filtrarCalendario={
dates:[]
}
export const TotalVentas = () => {
  const {onInputChange, onResetForm, formState, onInputChangeReact, dates} = useForm(filtrarCalendario)
  return (
    <>
    <PageBreadcrumb title="Total de ventas" subName="Ventas" />
    <Row className='mb-4'>
      <Col xxl={2} md={4} xs={6}>
      <Calendar value={dates} onChange={onInputChange} selectionMode="range" readOnlyInput hideOnRangeSelection placeholder='dd/mm/yyyy' />

      </Col>
    </Row>
    <Row>
      <Col xxl={3}>
        <CardTotal title={'Total de venta'} body={'S/ 1,589,586.00'} span={'30 ventas | 6 free | 2 Canjes'}/>
      </Col>
      <Col xxl={9}>
        <CardProdServ/>
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
