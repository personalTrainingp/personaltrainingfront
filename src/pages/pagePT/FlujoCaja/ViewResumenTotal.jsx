import React, { useEffect } from 'react'
import { useFlujoCaja } from './hook/useFlujoCajaStore';
import { Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const ViewResumenTotal = ({fechas, id_enterprice, bgTotal, bgPastel, anio, onOpenModalTableItems}) => {
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    useEffect(() => {
        obtenerEgresosxFecha(id_enterprice, anio, 'tenet')
    }, [id_enterprice])
    useEffect(() => {
        obtenerIngresosxFecha(id_enterprice, anio, 'tenet')
    }, [])
    console.log({dataGastosxFecha, dataIngresosxFecha});
    
    const dataAlter = fechas.map((f, index, array)=>{
        const dataGasto = dataGastosxFecha.filter(f=>f.grupo!=="COMPRA PRODUCTOS/ACTIVOS").flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresos = dataIngresosxFecha.filter(f=>f.grupo!=='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresosExcepcionales = dataIngresosxFecha.filter(f=>f.grupo==='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const sumaIngresos = dataIngresos.reduce((total, item)=>item.monto+total, 0)
        const cantidadIngresos = dataIngresos.length;
        const sumaIngresosExcepcional = dataIngresosExcepcionales.reduce((total, item)=>item.monto+total, 0);
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
        <>
          <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
            <thead>
              <tr>
                <td style={{width: '400px'}} className={`sticky-td- border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}>{'RESULTADO ANUAL'}</td>
                {
                  dataAlter.map(f=>{
                    return (
                      <React.Fragment key={`${f.mesStr}`}>
                      <td className={`text-center ${bgTotal}`} style={{width: '240px'}}>{f.mesStr}</td>
                      </React.Fragment>
                    )
                  })
                }
                <td className='text-center' style={{width: '120px'}}>TOTAL <br/> ANUAL</td>
                <td className='text-center' style={{width: '120px'}}>MOV. <br/> ANUAL</td>
                <td className='text-center' style={{width: '120px'}}>%<br/>PART. <br/> ANUAL</td>
                <td className='text-center' style={{width: '120px'}}>PROMEDIO<br/>MENSUAL <br/> ANUAL</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>INGRESOS</th>
                {
                  dataAlter.map(e=>{
                    return (
                      <React.Fragment>
                        <td className={``}> <NumberFormatMoney amount={e.sumaIngresos}/></td>
                      </React.Fragment>
                    )
                  })
                }
                <td>ss</td>
                <td>ss</td>
                <td>ss</td>
              </tr>
              <tr>
                <th className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice}`}>EGRESOS</th>
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
                <th className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice}`}>UTILIDAD BRUTA</th>
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
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>ING. EXTRAORDINARIOS</th>
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
                <th className={`border-left-10 border-right-10 border-bottom-10 sticky-td-${id_enterprice}`}>UTILIDAD NETA</th>
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
        </>
  )
}
