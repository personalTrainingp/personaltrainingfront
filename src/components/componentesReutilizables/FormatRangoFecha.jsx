import React from 'react'
import { FormatoDateMask } from '../CurrencyMask'

export const FormatRangoFecha = ({rangoFechas}) => {
  console.log(rangoFechas);
  
  return (
    <div className='fs-1'>
        <strong>
          {rangoFechas[0]&&FormatoDateMask(rangoFechas[0], "dddd D [de] MMMM [del] YYYY ")} 
        </strong>
          {
            rangoFechas[1]&& "-"
          }
        <strong>
          {
          rangoFechas[1]&&FormatoDateMask(rangoFechas[1], " dddd D [de] MMMM [del] YYYY ")
          }
        </strong>
      </div>
  )
}
