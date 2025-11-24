import { InputSelect, InputText } from '@/components/InputText'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { PerfilCliente } from './PerfilCliente'
import { useForm } from '@/hooks/useForm'
import { TerminosOnShow } from '@/hooks/usePropiedadesStore'
const customDatosVenta = {
  id_cli: 0,
  id_empl: 0,
  id_origen: 0,
  id_subOrigen: 0
}
export const DatosCliente = () => {
  const { formState, id_cli, id_empl, id_origen, id_subOrigen, onInputChange, onResetForm } = useForm(customDatosVenta)
  const { dataVendedores, dataOrigen, dataSubOrigen, dataClientesChange } = TerminosOnShow(true)
  
  return (
    <div>
      <Row>
        <Col lg={4}>
          <div className='mb-3'>
            <InputSelect label={'Cliente'} options={dataClientesChange} nameInput={'id_cli'} value={id_cli} onChange={onInputChange} required/>
          </div>
          <div className='mb-3'>
            <InputSelect label={'Vendedor'} options={dataVendedores}/>
          </div>
          <div className='mb-3'>
            <InputSelect label={'Origen'} options={dataOrigen}/>
          </div>
          <div className='mb-3'>
            <InputSelect label={'SubOrigen'}  options={dataSubOrigen}/>
          </div>
        </Col>
        <Col lg={8}>
          <PerfilCliente />
        </Col>
      </Row>
    </div>
  )
}
