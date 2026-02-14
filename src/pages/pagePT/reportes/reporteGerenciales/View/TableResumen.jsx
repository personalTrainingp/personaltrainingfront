import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap';

export const TableResumen = ({withHeaderVertical, dataEgresos, dataIngresos, bgTotal, id_empresa}) => {
  console.log({dataEgresos, dataIngresos});
  
  return (
    <>
      {
        id_empresa!==800 ? (
          <>
          <Table style={{width: '90%'}}>
          <thead className={`${bgTotal}`}>
                  <tr>
                    <th className='text-white' colSpan={2}> <div style={{width: `${withHeaderVertical}px`}}>UTILIDAD</div></th>
                    <th className='text-white'>S/.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={2}>INGRESOS</td>
                    <td><NumberFormatMoney amount={dataIngresos.reduce((total, item)=>total+item.montoTotal, 0)}/></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>EGRESOS</td>
                    <td><NumberFormatMoney amount={dataEgresos.reduce((total, item)=>total+item.montoTotal, 0)}/></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>TOTAL</td>
                    <td><NumberFormatMoney amount={dataIngresos.reduce((total, item)=>total+item.montoTotal, 0)-dataEgresos.reduce((total, item)=>total+item.montoTotal, 0)}/></td>
                  </tr>
                </tbody>
          </Table>
          </>
        ):(
          <>
          <Table style={{width: '90%'}}>
          <thead className={`${bgTotal}`}>
                  <tr>
                    <th className='text-white' colSpan={2}> <div style={{width: `${withHeaderVertical}px`}}>UTILIDAD</div></th>
                    <th className='text-white'>S/.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={2}>INGRESOS</td>
                    <td><NumberFormatMoney amount={dataIngresos.reduce((total, item)=>total+item.montoTotal, 0)*3.6}/></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>EGRESOS</td>
                    <td><NumberFormatMoney amount={dataEgresos.reduce((total, item)=>total+item.montoTotal, 0)}/></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>TOTAL</td>
                    <td><NumberFormatMoney amount={dataIngresos.reduce((total, item)=>total+item.montoTotal, 0)*3.6-dataEgresos.reduce((total, item)=>total+item.montoTotal, 0)}/></td>
                  </tr>
                </tbody>
          </Table></>
        )
      }
    </>
  )
}
