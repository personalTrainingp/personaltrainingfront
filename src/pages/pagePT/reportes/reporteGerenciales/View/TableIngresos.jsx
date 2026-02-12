import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap'

export const TableIngresos = ({bgTotal,  dataNuevos, dataReinscripciones,  dataRenovaciones, dataProductos17, dataProductos18, dataMF}) => {
  console.log({dataNuevos, dataReinscripciones,  dataRenovaciones, dataProductos17, dataProductos18, dataMF});
  
  return (
    <>
      <Table style={{width: '90%'}}>
          <thead className={`${bgTotal}`}>
            <tr>
              <th className='text-white'>INGRESOS</th>
              <th className='text-white'>CANTIDAD</th>
              <th className='text-white'>S/.</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>NUEVOS</td>
                <td>{dataNuevos.length}</td>
                <td><NumberFormatMoney amount={dataNuevos.reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></td>
              </tr>
              <tr>
                <td>RENOVACIONES</td>
                <td>{dataRenovaciones.length}</td>
                <td><NumberFormatMoney amount={dataRenovaciones.reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></td>
              </tr>
              <tr>
                <td>REINSCRIPCIONES</td>
                <td>{dataReinscripciones.length}</td>
                <td><NumberFormatMoney amount={dataReinscripciones.reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></td>
              </tr>
          </tbody>
          <thead className={`${bgTotal}`}>
            <tr>
              <th className='text-white'>TOTAL</th>
              <th className='text-white'>{dataNuevos.length+dataRenovaciones.length+dataReinscripciones.length}</th>
              <th className='text-white'><NumberFormatMoney amount={dataNuevos.reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)+dataRenovaciones.reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)+dataReinscripciones.reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></th>
            </tr>
          </thead>
      </Table>
      {/* <Table style={{width: '90%'}}>
          <thead className={`${bgTotal}`}>
            <tr>
              <th className='text-white'>MONKEY FIT</th>
              <th className='text-white'>{dataMF.length}</th>
              <th className='text-white'><NumberFormatMoney amount={dataMF.reduce((total, item)=>total+item.montoTotal, 0)}/></th>
            </tr>
          </thead>
      </Table> */}
      <Table style={{width: '90%'}}>
          <thead className={`${bgTotal}`}>
            <tr>
              <th className='text-white'>PRODUCTOS</th>
              <th className='text-white'>CANTIDAD</th>
              <th className='text-white'>S/.</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>SUPLEMENTOS</td>
                <td>{dataProductos17.reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataProductos17.reduce((total, item)=>total+item.montoTotal, 0)}/></td>
              </tr>
              <tr>
                <td>ACCESORIOS</td>
                <td>{dataProductos18.reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataProductos18.reduce((total, item)=>total+item.montoTotal, 0)}/></td>
              </tr>
          </tbody>
      </Table>
    </>
  )
}
