import React from 'react'
import accounting from 'accounting'
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa el idioma español si no lo has hecho ya
export const CurrencyMask = (e) => {
  let value = e.target.value;
  value = value.replace(/\D/g,"")
  value = value.replace(/(\d)(\d{2})$/,"$1.$2")
  value = value.replace(/(?=(\d{3})+(\D))\B/g,",")
  e.target.value = value
  return e
}
export const MoneyFormatter = ({ amount }) => {
  const formattedAmount = accounting.formatMoney(amount, {
    symbol: 'S/ ',  // Símbolo de la moneda
    precision: 2, // Precisión de decimales
    thousand: ',', // Separador de miles
    decimal: '.',  // Separador decimal
    format: '%s%v' // "%s" es el símbolo de la moneda y "%v" es el valor numérico
  });
  return formattedAmount
}
export const FUNMoneyFormatter = (amount) => {
  const formattedAmount = accounting.formatMoney(amount, {
    symbol: 'S/ ',  // Símbolo de la moneda
    precision: 2, // Precisión de decimales
    thousand: ',', // Separador de miles
    decimal: '.',  // Separador decimal
    format: '%s%v' // "%s" es el símbolo de la moneda y "%v" es el valor numérico
  });
  return formattedAmount
}
export const formateo_Moneda = (current)=>{
  return <MoneyFormatter amount={current}/>
}


export const DateMask = ({date, format}) => {
  //'D [de] MMMM [de] YYYY'
  return dayjs(date).locale('es').format(format)
}

export const FormatoDateMask = (date, format)=>{
  return <DateMask date={date} format={format}/>
}
export const DatexWeekMask = (date, format)=>{
  
}
export const FormatoDatexSemanaMask=(date, semana, format)=>{
  return <DateMask/>
}