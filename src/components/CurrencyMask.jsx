import React from 'react'
import accounting from 'accounting'
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa el idioma español si no lo has hecho ya
// const customParseFormat = require('dayjs/plugin/customParseFormat');

import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat);
export const CurrencyMask = (e) => {
  let value = e.target.value;
  value = value.replace(/\D/g,"")
  value = value.replace(/(\d)(\d{2})$/,"$1.$2")
  value = value.replace(/(?=(\d{3})+(\D))\B/g,",")
  e.target.value = value
  return e
}
export const MoneyFormatter = ({ amount, symbol }) => {
  const formattedAmount = accounting.formatMoney(amount, {
    symbol: symbol?`${symbol} `:'S/. ',  // Símbolo de la moneda
    precision: 2, // Precisión de decimales
    thousand: ',', // Separador de miles
    decimal: '.',  // Separador decimal
    format: '%s%v' // "%s" es el símbolo de la moneda y "%v" es el valor numérico
  });
  
  return formattedAmount
}
export const NumberFormatMoney = ({ amount }) => {
  const formattedAmount = accounting.formatMoney(amount, {
    symbol: '',  // Símbolo de la moneda
    precision: 2, // Precisión de decimales
    thousand: ',', // Separador de miles
    decimal: '.',  // Separador decimal
    format: '%s%v' // "%s" es el símbolo de la moneda y "%v" es el valor numérico
  });
  
  return formattedAmount
}
export const NumberFormatter = ({ amount, splitCaracter }) => {
  const formattedAmount = accounting.formatMoney(amount, {
    symbol: '',  // Símbolo de la moneda
    precision: 2, // Precisión de decimales
    thousand: ',', // Separador de miles
    decimal: '.',  // Separador decimal
    format: '%s%v' // "%s" es el símbolo de la moneda y "%v" es el valor numérico
  });
  // console.log(formattedAmount.split('.')[0]);
  
  return formattedAmount.split(splitCaracter?splitCaracter:'.')[0]
}
export const FUNMoneyFormatter = (amount, moneda) => {
  const formattedAmount = accounting.formatMoney(amount, {
    symbol: ``,  // Símbolo de la moneda
    precision: 2, // Precisión de decimales
    thousand: ',', // Separador de miles
    decimal: '.',  // Separador decimal
    format: '%s%v' // "%s" es el símbolo de la moneda y "%v" es el valor numérico
  });
  return formattedAmount
}
export const FUNFormatterCom = (amount, splitCaracter) => {
  const formattedAmount = accounting.formatMoney(amount, {
    symbol: ``,  // Símbolo de la moneda
    precision: 2, // Precisión de decimales
    thousand: ',', // Separador de miles
    decimal: '.',  // Separador decimal
    format: '%s%v' // "%s" es el símbolo de la moneda y "%v" es el valor numérico
  });
  
  return formattedAmount.split(splitCaracter?splitCaracter:'.')[0]
}
export const formateo_Moneda = (current)=>{
  return <MoneyFormatter amount={current}/>
}


export const DateMask = ({date, format}) => {
  //'D [de] MMMM [del] YYYY'
  return dayjs.utc(date).locale('es').format(format)
}
export const DateMaskString = (date, format) => {
  //'D [de] MMMM [del] YYYY'
  return dayjs(date).locale('es').format(format)
}

export const FormatoDateMask = (date, format)=>{
  return (
    <span className='text-uppercase'>
        <DateMask date={date} format={format}/>
    </span>
  )
}
export const FormatoTimeMask = ({date, format})=>{
  return dayjs(date, 'HH:mm').locale("es").format(format)
}
export const DatexWeekMask = (date, format)=>{
  
}
export const FormatoDatexSemanaMask=(date, semana, format)=>{
  return <DateMask/>
}