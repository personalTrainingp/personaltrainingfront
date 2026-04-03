import React from 'react'
import { Card } from 'react-bootstrap'
import Select from 'react-select'
import DatosCliente from '../DatosCliente'

export const CardCliente = ({dataCliente}) => {
  // console.log(dataCliente);
  return (
    <>
              <DatosCliente dataCliente={dataCliente}/>
    </>
  )
}
