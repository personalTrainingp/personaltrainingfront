import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap'

export const TableIngresos = ({bgTotal, dataVentas, id_empresa,  dataNuevos, dataReinscripciones,  dataRenovaciones, dataProductos17, dataProductos18, dataMF}) => {
  console.log({dataNuevos, dataReinscripciones,  dataRenovaciones, dataProductos17, dataProductos18, dataMF, dataVentas});
  
  return (
    <>
    {
      id_empresa!==800 ? (
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
                <td>{dataVentas.filter(e=>e.concepto==='NUEVOS').length}</td>
                <td><NumberFormatMoney amount={dataVentas.filter(e=>e.concepto==='NUEVOS').reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></td>
              </tr>
              <tr>
                <td>RENOVACIONES</td>
                <td>{dataVentas.filter(e=>e.concepto==='RENOVACIONES').length}</td>
                <td><NumberFormatMoney amount={dataVentas.filter(e=>e.concepto==='RENOVACIONES').reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></td>
              </tr>
              <tr>
                <td>REINSCRIPCIONES</td>
                <td>{dataVentas.filter(e=>e.concepto==='REINSCRIPCIONES').length}</td>
                <td><NumberFormatMoney amount={dataVentas.filter(e=>e.concepto==='REINSCRIPCIONES').reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></td>
              </tr>
          </tbody>
          <thead className={`${bgTotal}`}>
            <tr>
              <th className='text-white'>TOTAL</th>
              <th className='text-white'>{dataVentas.filter(e=>e.modelo==='MEMBRESIAS').length}</th>
              <th className='text-white'><NumberFormatMoney amount={dataVentas.filter(e=>e.modelo==='MEMBRESIAS').reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></th>
            </tr>
          </thead>
      </Table>
      
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
                <td>{dataVentas.filter(e=>e.concepto==='PRODUCTO17').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataVentas.filter(e=>e.concepto==='PRODUCTO17').reduce((total, item)=>total+item.montoTotal, 0)}/></td>
              </tr>
              <tr>
                <td>ACCESORIOS</td>
                <td>{dataVentas.filter(e=>e.concepto==='PRODUCTO18').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataVentas.filter(e=>e.concepto==='PRODUCTO18').reduce((total, item)=>total+item.montoTotal, 0)}/></td>
              </tr>
          </tbody>
      </Table>
        </>
      ): (
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
                <td>ARRENDAMIENTO</td>
                <td>{dataVentas.filter(e=>e.concepto==='ARRENDAMIENTO').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataVentas.filter(e=>e.concepto==='ARRENDAMIENTO').reduce((total, item)=>total+item.montoTotal, 0)*3.60}/></td>
              </tr>
              <tr>
                <td>INGRESOS EXTRAORDINARIOS</td>
                <td>{dataVentas.filter(e=>e.concepto==='INGRESOS EXTRAORDINARIOS').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataVentas.filter(e=>e.concepto==='INGRESOS EXTRAORDINARIOS').reduce((total, item)=>total+item.montoTotal, 0)*3.60}/></td>
              </tr>
              <tr>
                <td>SUELDOS/PRESTAMOS</td>
                <td>{dataVentas.filter(e=>e.concepto==='SUELDOS/PRESTAMOS').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataVentas.filter(e=>e.concepto==='SUELDOS/PRESTAMOS').reduce((total, item)=>total+item.montoTotal, 0)*3.60}/></td>
              </tr>
          </tbody>
      </Table>
      </>
      )
    }
    </>
  )
}
