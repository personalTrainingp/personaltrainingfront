import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap'

export const TableIngresos = ({bgTotal, dataIngresos, id_empresa}) => {
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
                <td>{dataIngresos.filter(e=>e.concepto==='NUEVOS').length}</td>
                <td><NumberFormatMoney amount={dataIngresos.filter(e=>e.concepto==='NUEVOS').reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></td>
              </tr>
              <tr>
                <td>RENOVACIONES</td>
                <td>{dataIngresos.filter(e=>e.concepto==='RENOVACIONES').length}</td>
                <td><NumberFormatMoney amount={dataIngresos.filter(e=>e.concepto==='RENOVACIONES').reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></td>
              </tr>
              <tr>
                <td>REINSCRIPCIONES</td>
                <td>{dataIngresos.filter(e=>e.concepto==='REINSCRIPCIONES').length}</td>
                <td><NumberFormatMoney amount={dataIngresos.filter(e=>e.concepto==='REINSCRIPCIONES').reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></td>
              </tr>
          </tbody>
          <thead className={`${bgTotal}`}>
            <tr>
              <th className='text-white'>TOTAL</th>
              <th className='text-white'>{dataIngresos.filter(e=>e.modelo==='MEMBRESIAS').length}</th>
              <th className='text-white'><NumberFormatMoney amount={dataIngresos.filter(e=>e.modelo==='MEMBRESIAS').reduce((total,item)=>total+item.detalle_membresias[0].tarifa_monto,0)}/></th>
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
                <td>{dataIngresos.filter(e=>e.concepto==='PRODUCTO17').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataIngresos.filter(e=>e.concepto==='PRODUCTO17').reduce((total, item)=>total+item.montoTotal, 0)}/></td>
              </tr>
              <tr>
                <td>ACCESORIOS</td>
                <td>{dataIngresos.filter(e=>e.concepto==='PRODUCTO18').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataIngresos.filter(e=>e.concepto==='PRODUCTO18').reduce((total, item)=>total+item.montoTotal, 0)}/></td>
              </tr>
          </tbody>
          <thead className={`${bgTotal}`}>
            <tr>
              <th className='text-white'>TOTAL</th>
              <th className='text-white'>{dataIngresos.filter(e=>e.modelo==='producto').length}</th>
              <th className='text-white'><NumberFormatMoney amount={dataIngresos.filter(e=>e.modelo==='producto').reduce((total,item)=>total+item.montoTotal,0)}/></th>
            </tr>
          </thead>
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
                <td>{dataIngresos.filter(e=>e.concepto==='ARRENDAMIENTO').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataIngresos.filter(e=>e.concepto==='ARRENDAMIENTO').reduce((total, item)=>total+item.montoTotal, 0)*3.36}/></td>
              </tr>
              <tr>
                <td>INGRESOS EXTRAORDINARIOS</td>
                <td>{dataIngresos.filter(e=>e.concepto==='INGRESOS EXTRAORDINARIOS').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataIngresos.filter(e=>e.concepto==='INGRESOS EXTRAORDINARIOS').reduce((total, item)=>total+item.montoTotal, 0)*3.36}/></td>
              </tr>
              <tr>
                <td>SUELDOS/PRESTAMOS</td>
                <td>{dataIngresos.filter(e=>e.concepto==='SUELDOS/PRESTAMOS').reduce((total, item)=>total+item.cantidadTotal, 0)}</td>
                <td><NumberFormatMoney amount={dataIngresos.filter(e=>e.concepto==='SUELDOS/PRESTAMOS').reduce((total, item)=>total+item.montoTotal, 0)*3.36}/></td>
              </tr>
          </tbody>
          <thead className={`${bgTotal}`}>
            <tr>
              <th className='text-white'>TOTAL</th>
              <th className='text-white'>{dataIngresos.filter(e=>e.concepto==='ARRENDAMIENTO').reduce((total, item)=>total+item.cantidadTotal, 0)+dataIngresos.filter(e=>e.concepto==='INGRESOS EXTRAORDINARIOS').reduce((total, item)=>total+item.cantidadTotal, 0)+dataIngresos.filter(e=>e.concepto==='SUELDOS/PRESTAMOS').reduce((total, item)=>total+item.cantidadTotal, 0)}</th>
              <th className='text-white'><NumberFormatMoney amount={(dataIngresos.filter(e=>e.concepto==='ARRENDAMIENTO').reduce((total, item)=>total+item.montoTotal, 0)+dataIngresos.filter(e=>e.concepto==='INGRESOS EXTRAORDINARIOS').reduce((total, item)=>total+item.montoTotal, 0)+dataIngresos.filter(e=>e.concepto==='SUELDOS/PRESTAMOS').reduce((total, item)=>total+item.montoTotal, 0))*3.36}/></th>
            </tr>
          </thead>
      </Table>
      </>
      )
    }
    </>
  )
}
