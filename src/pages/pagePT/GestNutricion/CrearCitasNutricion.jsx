import React from 'react'
import CalendarApp from './Calendar'
import App from './Calendar2/App'

export const CrearCitasNutricion = ({tipo_serv}) => {
  return (
    <>
      <CalendarApp tipo_serv={tipo_serv}/>
      {/* <App/> */}
    </>
  )
}
