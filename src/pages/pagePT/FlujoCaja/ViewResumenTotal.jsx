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
        const utilidadUltimaLinea = (utilidadNeta && (utilidadNeta/sumaIngresos))*100
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
            utilidadUltimaLinea: (utilidadUltimaLinea),
            mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
        }
      })
    const utilidadBrutaTotal = dataAlter.reduce((total, item)=>item.sumaIngresos+total, 0)-dataAlter.reduce((total, item)=>item.sumaGastos+total, 0)
    const utilidadNetaTotal = (dataAlter.reduce((total, item)=>item.sumaIngresos+total, 0)+dataAlter.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0))-dataAlter.reduce((total, item)=>item.sumaGastos+total, 0)
      return (
        <>
          <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
            <thead>
              <tr>
                <th style={{width: '500px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}><div className='text-black'>{'RESULTADO ANUAL'}</div></th>
                {
                  dataAlter.map(f=>{
                    return (
                      <React.Fragment key={`${f.mesStr}`}>
                      <td className={`text-center ${bgTotal}`} style={{width: '240px'}}>{f.mesStr}</td>
                      </React.Fragment>
                    )
                  })
                }
                <td className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '190px'}}>TOTAL <br/> ANUAL</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>INGRESOS</th>
                {
                  dataAlter.map(e=>{
                    return (
                      <React.Fragment>
                        <td className={`text-end`}> <NumberFormatMoney amount={e.sumaIngresos}/></td>
                      </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className='text-end'>
                    <NumberFormatMoney amount={dataAlter.reduce((total, item)=>item.sumaIngresos+total, 0)}/>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice}`}>EGRESOS</th>
                {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-change text-end`}> <div className='text-change' onClick={()=>onOpenModalTableItems(e.dataGasto)}><NumberFormatMoney amount={-e.sumaGastos}/></div></td>
                    </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className='text-change text-end '>
                    <NumberFormatMoney amount={-dataAlter.reduce((total, item)=>item.sumaGastos+total, 0)}/>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice}`}>UTILIDAD BRUTA</th>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end `}> <div className={`${e.utilidadBruta>0?'text-ISESAC':'text-change'} `} ><NumberFormatMoney amount={e.utilidadBruta}/></div> </td>
                    </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className={`${utilidadBrutaTotal>0?'text-ISESAC':'text-change'} text-end`} ><NumberFormatMoney amount={utilidadBrutaTotal}/></div>
                </td>
              </tr>
              <tr>
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>ING. EXTRAORDINARIOS</th>
                {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end`}> <NumberFormatMoney amount={e.sumaIngresosExcepcional}/></td>
                    </React.Fragment>
                    )
                  })
                }
                <td className={`text-end border-left-10 border-right-10`}> <NumberFormatMoney amount={dataAlter.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0)}/></td>
              </tr>
              <tr>
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>UTILIDAD NETA</th>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end `}><div className={`${e.utilidadNeta>0?'text-ISESAC':'text-change'}`}> <NumberFormatMoney className='fs-2' amount={e.utilidadNeta}/></div></td>
                    </React.Fragment>
                    )
                  })
                }
                      <td className={`text-end border-left-10 border-right-10`}><div className={`${utilidadNetaTotal>0?'text-ISESAC':'text-change'}`}> <NumberFormatMoney className='fs-2' amount={utilidadNetaTotal}/></div></td>
              </tr> 
              <tr>
                <th className={`border-left-10 border-right-10 border-bottom-10 sticky-td-${id_enterprice}`}>% UTILIDAD ULTIMA LINEA</th>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end`}><div className={`${e.utilidadNeta>0?'text-ISESAC':'text-change'}`} style={{fontSize: '30px'}}>{(e.utilidadUltimaLinea).toFixed(2)}</div></td>
                    </React.Fragment>
                    )
                  })
                }
                      <td className={`text-end border-left-10 border-right-10 border-bottom-10`}><div className={`${dataAlter.reduce((total, item)=>item.utilidadUltimaLinea+total, 0)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-2' amount={dataAlter.reduce((total, item)=>item.utilidadUltimaLinea+total, 0)/12}/></div></td>
              </tr> 
            </tbody>
          </Table>
        </>
  )
}

function encontrarFechas() {
  const hoy = new Date()
  // Año actual
const year = hoy.getFullYear();

// Mes actual (0 = enero, 11 = diciembre)
const month = hoy.getMonth()+ 1;
const ultimaFecha = new Date(year, month , 0);
const diaUltimaFecha = ultimaFecha.getDate()
const diaActual = hoy.getDate()

  return diaActual==diaUltimaFecha?0:month-1;
}