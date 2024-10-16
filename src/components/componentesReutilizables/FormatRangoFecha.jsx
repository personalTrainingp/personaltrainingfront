import React from 'react'
import { FormatoDateMask } from '../CurrencyMask'

export const FormatRangoFecha = ({rangoFechas}) => {
  return (
    <span className='m-2 font-24'>
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
      </span>
  )
}
