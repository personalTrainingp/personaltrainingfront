// import React from 'react'
// import { FormatTable3 } from './FormatTable3'
// import dayjs from 'dayjs'

// export const ItemsxFecha = ({i}) => {
//     const itemsDia = i.items_filters.map(f=>{
//       return {
//         items: f.items
//       }
//     })
//     console.log({i});
    
//     //Opción 1: flatMap (ES2020+)
//     const flattened1 = itemsDia.flatMap(obj => obj.items);
    
//     const cartera_renovacion = flattened1.filter(f => f.detalle_ventaMembresium.tb_ventum.id_origen === 691)
//     const cartera_reinscripciones = flattened1.filter(f => f.detalle_ventaMembresium.tb_ventum.id_origen === 692)
//     const nuevos = flattened1.filter(f => f.detalle_ventaMembresium.tb_ventum.id_origen !== 692 && f.detalle_ventaMembresium.tb_ventum.id_origen !== 691)
//     const fechaInicio = dayjs(i.fechas.fecha_desde).format('dddd DD [de] MMMM [DEL] YYYY')
//     const fechaFin = dayjs(i.fechas.fecha_hasta).format('dddd DD [de] MMMM [DEL] YYYY')
//   return (
//     <>
//     <FormatTable3 value={'todo'} classNameTH={'text-white'} classNameTHEAD={'bg-secondary'} flattened1={flattened1} header={<>  {dayjs(i.fechas.fecha_desde).format('dddd ')}<span className='text-primary'>{dayjs(i.fechas.fecha_desde).format('DD [de] MMMM ')}</span>{dayjs(i.fechas.fecha_desde).format('[DEL] YYYY')} al {dayjs(i.fechas.fecha_hasta).format('dddd ')}<span className='text-primary'>{dayjs(i.fechas.fecha_hasta).format('DD [de] MMMM ')}</span>{dayjs(i.fechas.fecha_hasta).format('[DEL] YYYY')}<div className='fs-1 bg-primary'>TOTAL</div></>}/>
//     <FormatTable3 value={'nuevos'} flattened1={nuevos} header={<div className='fs-1'>NUEVOS</div>}/>
//     <FormatTable3 value={'reno'} flattened1={cartera_renovacion} header={<div className='fs-1'>RENOVACIONES</div>}/>
//     <FormatTable3 value={'rei'} flattened1={cartera_reinscripciones} header={<div className='fs-1'>REINSCRIPCIONES</div>}/>
//     </>
//   )
// }

// const mesesMap = {
//   enero:      1,
//   febrero:    2,
//   marzo:      3,
//   abril:      4,
//   mayo:       5,
//   junio:      6,
//   julio:      7,
//   agosto:     8,
//   septiembre: 9,
//   octubre:   10,
//   noviembre: 11,
//   diciembre: 12,
// };

// function fechaSegura(dia, mesTexto, anio) {
//   const mes = mesesMap[ mesTexto.toLowerCase() ];
//   if (!mes) throw new Error(`Mes inválido: "${mesTexto}"`);
  
//   // Día 0 del mes siguiente = último día del mes actual
//   const maxDia = new Date(anio, mes, 0).getDate();
//   const diaClampeado = Math.min(dia, maxDia);

//   return new Date(anio, mes - 1, diaClampeado);
// }

import React from 'react'
import { FormatTable3 } from './FormatTable3'
import dayjs from 'dayjs'

export const ItemsxFecha = ({i, arrayTotal}) => {
  
  const itemsDia = i.itemsDia.map(f=>{
    return {
      items: f.items
    }
  })
    const itemsDiaTotal = arrayTotal.map(f=>{
    return {
      items: f.items
    }
  })
  console.log({arrayTotal, itemsDiaTotal, itemsDia, i});
    //Opción 1: flatMap (ES2020+)
    const flattened1 = itemsDia.flatMap(obj => obj.items);
    const flattened2 = itemsDiaTotal.flatMap(obj => obj.items);
    const fechaInicio = dayjs(fechaSegura(i.itemsDia[0]?.dia, i.mes, i.anio)).format('dddd DD')
    const fechaFin = dayjs(fechaSegura(i.itemsDia[i.itemsDia.length-1].dia, i.mes, i.anio)).format('dddd DD')
    const dataFlat1 = resumenCarteras(flattened1)
    const dataFlat2 = resumenCarteras(flattened2)
    
  return (
    <>
    <FormatTable3 rangeFecStr={<>{fechaInicio} al <br/> {fechaFin}</>} value={'todo'} classNameTH={'text-white'} classNameTHEAD={'bg-primary'} 
                  flattened1={flattened1} flattened2={flattened2} header={<> <span className='fs-1'>{i.mes} {i.anio}</span></>}/>
    <FormatTable3 rangeFecStr={<>{fechaInicio} al <br/> {fechaFin}</>} flattened2={dataFlat2.nuevos} value={'nuevos'} flattened1={dataFlat1.nuevos} header={<div className='fs-1'>NUEVOS</div>}/>
    <FormatTable3 rangeFecStr={<>{fechaInicio} al <br/> {fechaFin}</>} flattened2={dataFlat2.cartera_renovacion} value={'reno'} flattened1={dataFlat1.cartera_renovacion} header={<div className='fs-1'>RENOVACIONES</div>}/>
    <FormatTable3 rangeFecStr={<>{fechaInicio} al <br/> {fechaFin}</>} flattened2={dataFlat2.cartera_reinscripciones} value={'rei'} flattened1={dataFlat1.cartera_reinscripciones} header={<div className='fs-1'>REINSCRIPCIONES</div>}/>
    </>
  )
}
function resumenCarteras(flattened1) {
   const cartera_renovacion = flattened1.filter(f => f.detalle_ventaMembresium.tb_ventum.id_origen === 691 || f.detalle_ventaMembresium.tb_ventum.id_origen === 696)
    const cartera_reinscripciones = flattened1.filter(f => f.detalle_ventaMembresium.tb_ventum.id_origen === 692)
    const nuevos = flattened1.filter(f => f.detalle_ventaMembresium.tb_ventum.id_origen !== 692 && f.detalle_ventaMembresium.tb_ventum.id_origen !== 691)
    
  return {
    cartera_reinscripciones,
    cartera_renovacion,
    nuevos
  }
}
const mesesMap = {
  enero:      1,
  febrero:    2,
  marzo:      3,
  abril:      4,
  mayo:       5,
  junio:      6,
  julio:      7,
  agosto:     8,
  septiembre: 9,
  octubre:   10,
  noviembre: 11,
  diciembre: 12,
};

function fechaSegura(dia, mesTexto, anio) {
  const mes = mesesMap[ mesTexto.toLowerCase() ];
  if (!mes) throw new Error(`Mes inválido: "${mesTexto}"`);
  
  // Día 0 del mes siguiente = último día del mes actual
  const maxDia = new Date(anio, mes, 0).getDate();
  const diaClampeado = Math.min(dia, maxDia);

  return new Date(anio, mes - 1, diaClampeado);
}