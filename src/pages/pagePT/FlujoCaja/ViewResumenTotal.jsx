import React, { useEffect } from 'react'
import { useFlujoCaja } from './hook/useFlujoCaja';
import { Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const ViewResumenTotal = ({fechas, id_enterprice, bgTotal, bgPastel, anio, onOpenModalTableItems}) => {
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    useEffect(() => {
        obtenerEgresosxFecha(id_enterprice, anio)
    }, [id_enterprice])
    useEffect(() => {
        obtenerIngresosxFecha(id_enterprice, anio)
    }, [])
    console.log({dataGastosxFecha, dataIngresosxFecha});
    
    const dataAlter = fechas.map((f, index, array)=>{
        const dataGasto = dataGastosxFecha.filter(f=>f.grupo!=="COMPRA PRODUCTOS/ACTIVOS").flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresos = dataIngresosxFecha.filter(f=>f.grupo!=='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresosExcepcionales = dataIngresosxFecha.filter(f=>f.grupo==='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const sumaIngresos = dataIngresos.reduce((total, item)=>item.monto+total, 0)
        const cantidadIngresos = dataIngresos.length;
        const sumaIngresosExcepcional = dataIngresosExcepcionales.reduce((item, total)=>item.monto+total, 0);
        const cantidadIngresosExcepcional = dataIngresosExcepcionales.length;
        const sumaGastos = dataGasto.reduce((total, item)=>item.monto+total, 0)
        const cantidadGastos = dataGasto.length;
        const utilidadBruta = sumaIngresos-sumaGastos
        const utilidadNeta = (sumaIngresos+sumaIngresosExcepcional)-sumaGastos
        return {
            ...f,
            dataGasto,
            sumaGastos,
            utilidadNeta,
            utilidadBruta,
            cantidadGastos,
            sumaIngresos,
            cantidadIngresos,
            sumaIngresosExcepcional,
            cantidadIngresosExcepcional,
            mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
        }
      })
      return (
    <Table className="tabla-egresos" style={{ width: '100%' }} bordered>
      <thead>
        <tr>
          <th style={{width: '280px'}} className={`border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}>{'RESULTADO ANUAL'}</th>
          {
            dataAlter.map(f=>{
              return (
                <React.Fragment key={`${f.mesStr}`}>
                <th className={`text-center ${bgTotal}`} style={{width: '240px'}}>{f.mesStr}</th>
                </React.Fragment>
              )
            })
          }
          <th className='text-center' style={{width: '120px'}}>TOTAL <br/> ANUAL</th>
          <th className='text-center' style={{width: '120px'}}>MOV. <br/> ANUAL</th>
          <th className='text-center' style={{width: '120px'}}>%<br/>PART. <br/> ANUAL</th>
          <th className='text-center' style={{width: '120px'}}>PROMEDIO<br/>MENSUAL <br/> ANUAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={`sticky-td border-left-10 border-right-10 ${bgTotal}`}>INGRESOS</td>
        {
          dataAlter.map(e=>{
            return (
              <React.Fragment>
                <td className={``}> <NumberFormatMoney amount={e.sumaIngresos}/></td>
              </React.Fragment>
              )
            })
          }
        </tr>
        <tr>
          <td className={`sticky-td border-left-10 border-right-10 ${bgTotal}`}>EGRESOS</td>
        {
          dataAlter.map(e=>{
            return (
              <React.Fragment>
                <td className={`text-change`}> <div className='text-change' onClick={()=>onOpenModalTableItems(e.dataGasto)}><NumberFormatMoney amount={-e.sumaGastos}/></div></td>
              </React.Fragment>
              )
            })
          }
        </tr>
        <tr>
          <td className={`sticky-td border-left-10 border-right-10 ${bgTotal}`}>UTILIDAD BRUTA</td>
        {
          dataAlter.map(e=>{
            return (
              <React.Fragment>
                <td className={``}> <div className={`${e.utilidadBruta>0?'text-color-dolar':'text-change'} `} ><NumberFormatMoney amount={e.utilidadBruta}/></div> </td>
              </React.Fragment>
              )
            })
          }
        </tr>
        <tr>
          <td className={`sticky-td border-left-10 border-right-10 ${bgTotal}`}>ING. EXCEPCIONALES</td>
        {
          dataAlter.map(e=>{
            return (
              <React.Fragment>
                <td className={``}> <NumberFormatMoney amount={e.sumaIngresosExcepcional}/></td>
              </React.Fragment>
              )
            })
          }
        </tr>
        <tr>
          <td className={`sticky-td border-left-10 border-right-10 ${bgTotal}`}>UTILIDAD NETA</td>
        {
          dataAlter.map(e=>{
            return (
              <React.Fragment>
                <td className={`${e.utilidadNeta>0?'text-color-dolar':'text-change'} `}> <NumberFormatMoney amount={e.utilidadNeta}/></td>
              </React.Fragment>
              )
            })
          }
        </tr> 
      </tbody>
    </Table>
  )
}
