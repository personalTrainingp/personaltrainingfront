import React from 'react'
import { Card } from 'react-bootstrap'
import Select from 'react-select'
import DatosCliente from '../DatosCliente'

export const CardCliente = ({dataCliente}) => {
  // console.log(dataCliente);
  return (
    <Card>
        <Card.Header>
            <Card.Title>Datos socio</Card.Title>
        </Card.Header>
        <Card.Body>
            
            <DatosCliente dataCliente={dataCliente}/>
        </Card.Body>
    </Card>
  )
}
