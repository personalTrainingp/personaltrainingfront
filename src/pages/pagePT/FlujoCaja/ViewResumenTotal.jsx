import React, { useEffect } from 'react'
import { useFlujoCaja } from './hook/useFlujoCajaStore';
import { Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import { NumberFormatMoney } from '@/components/CurrencyMask';

const getQuotaParaMes = (monthIndex, year) => {
  const y = year;
  const m = monthIndex;
  switch (`${m}-${y}`) {
    case "3-2026":
      return {
        meta: 100000,
      };
    case "2-2026":
      return {
        meta: 100000,
      };
    case "1-2026":
      return {
        meta: 110000,
      };
    case "12-2025":
      return {
        meta: 90000,
      };

    case "11-2025":
      return {
        meta: 90000,
      };

    case "10-2025":
      return {
        meta: 85000,
      };

    case "9-2025":
      return {
        meta: 75000,
      };

    case "8-2025":
      return {
        meta: 70000,
      };

    case "7-2025":
      return {
        meta: 60000,
      };

    case "6-2025":
      return {
        meta: 60000,
      };

    case "5-2025":
      return {
        meta: 60000,
      };

    case "4-2025":
      return {
        meta: 60000,
      };

    case "3-2025":
      return {
        meta: 60000,
      };

    case "2-2025":
      return {
        meta: 60000,
      };

    case "1-2025":
      return {
        meta: 60000,
      };

    default:
      return {
        meta: 0,
      };
  }
};
export const ViewResumenTotal = ({fechas, id_enterprice, bgTotal, bgPastel, anio, onOpenModalTableItems}) => {
    const fechaElegida = new Date(anio[0])
    const fechaActual = new Date()
    const anioElegido = fechaElegida.getFullYear()
    const mesElegido = fechaElegida.getMonth()+1
    const anioActual = fechaActual.getFullYear()
    const mesActual = fechaActual.getMonth()+1
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    useEffect(() => {
        obtenerEgresosxFecha(id_enterprice, anio, 'tenet')
    }, [id_enterprice])
    useEffect(() => {
        obtenerIngresosxFecha(id_enterprice, anio, 'tenet')
    }, [])
    
    const dataAlter = fechas.map((f, index, array)=>{
        const dataGasto = dataGastosxFecha.filter(f=>f.grupo!=="COMPRA PRODUCTOS/ACTIVOS" && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.grupo!=="BONO GERENCIAS" ).flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresos = dataIngresosxFecha.filter(f=>f.grupo!=='PRESTAMOS A TERCEROS').filter(f=>f.grupo!=='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresosExcepcionales = dataIngresosxFecha.filter(f=>f.grupo==='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const sumaIngresos = dataIngresos.reduce((total, item)=>item.monto+total, 0)
        const cantidadIngresos = dataIngresos.length;
        const sumaIngresosExcepcional = dataIngresosExcepcionales.reduce((total, item)=>item.monto+total, 0);
        const cantidadIngresosExcepcional = dataIngresosExcepcionales.length;
        const sumaGastos = dataGasto.reduce((total, item)=>item.monto+total, 0)
        const cantidadGastos = dataGasto.length;
        const utilidadBruta = sumaIngresos-sumaGastos
        const utilidadNeta = (sumaIngresos+sumaIngresosExcepcional)-sumaGastos
        const utilidadUltimaLinea = ((utilidadNeta && sumaIngresos) && (utilidadNeta*100)/sumaIngresos)
        return {
            ...f,
            dataIngresos,
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
      const dataAlterMesCompleto = fechas.filter((f)=>`${f.anio}-${f.mes}`!==`${anioActual}-${mesActual}`).map(f=>{
        const dataGasto = dataGastosxFecha.filter(f=>f.grupo!=="COMPRA PRODUCTOS/ACTIVOS"&& f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.grupo!=="BONO GERENCIAS").flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresos = dataIngresosxFecha.filter(f=>f.grupo!=='PRESTAMOS A TERCEROS').filter(f=>f.grupo!=='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresosExcepcionales = dataIngresosxFecha.filter(f=>f.grupo==='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const sumaIngresos = dataIngresos.reduce((total, item)=>item.monto+total, 0)
        const sumaGastos = dataGasto.reduce((total, item)=>item.monto+total, 0)
        const sumaIngresosExcepcional = dataIngresosExcepcionales.reduce((total, item)=>item.monto+total, 0);
        return {
          dataGasto,
          dataIngresos,
          dataIngresosExcepcionales,
          sumaIngresos,
          sumaGastos,
          sumaIngresosExcepcional
        }
      })
      
    const dataBono = fechas.map((f, index, array)=>{
        const dataGasto = dataGastosxFecha.filter(f=>f.grupo!=="COMPRA PRODUCTOS/ACTIVOS"&& f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.grupo!=="BONO GERENCIAS").flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresos = dataIngresosxFecha.filter(f=>f.grupo!=='PRESTAMOS A TERCEROS').filter(f=>f.grupo!=='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const dataIngresosExcepcionales = dataIngresosxFecha.filter(f=>f.grupo==='INGRESOS EXTRAORDINARIOS').flatMap(e=>e.items).filter(e=>e.mes===f.mes).flatMap(e=>e.items);
        const sumaIngresos = dataIngresos.reduce((total, item)=>item.monto+total, 0)
        const cantidadIngresos = dataIngresos.length;
        const sumaIngresosExcepcional = dataIngresosExcepcionales.reduce((total, item)=>item.monto+total, 0);
        const cantidadIngresosExcepcional = dataIngresosExcepcionales.length;
        const sumaGastos = dataGasto.reduce((total, item)=>item.monto+total, 0)
        const cantidadGastos = dataGasto.length;
        const utilidadBruta = sumaIngresos-sumaGastos
        const utilidadNeta = (sumaIngresos+sumaIngresosExcepcional)-sumaGastos
        const utilidadUltimaLinea = ((utilidadNeta && sumaIngresos) && (utilidadNeta*100)/sumaIngresos)
        return {
            ...f,
            dataIngresos,
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
      const ingresosAcumulados = dataAlter.reduce((total, item)=>item.sumaIngresos+total, 0)
    const utilidadBrutaTotal = dataAlter.reduce((total, item)=>item.sumaIngresos+total, 0)-dataAlter.reduce((total, item)=>item.sumaGastos+total, 0)
    const utilidadNetaTotal = (dataAlter.reduce((total, item)=>item.sumaIngresos+total, 0)+dataAlter.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0))-dataAlter.reduce((total, item)=>item.sumaGastos+total, 0)
    const utilidadNetaTotalMESCOMPLETO = (dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)+dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0))-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0)
    const utilidadBrutaTotalMESCOMPLETO = (dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)+dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0))-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0)
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
                      <td className={`text-center ${bgTotal} ${`${f.mes}-${f.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`} style={{width: '240px'}}>{f.mesStr}</td>
                      </React.Fragment>
                    )
                  })
                }
                <td className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '230px'}}>TOTAL <br/> ANUAL</td>
                <td className='text-center border-top-10 border-bottom-10 border-right-10' style={{width: '230px'}}>PROMEDIO <br/> MENSUAL <br/> ANUAL</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>INGRESOS</th>
                {
                  dataAlter.map((e, i)=>{
                    return (
                      <React.Fragment>
                        <td className={`text-end ${`${e.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> <NumberFormatMoney amount={e.sumaIngresos}/></td>
                      </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className='text-end'>
                    <NumberFormatMoney amount={dataAlter.reduce((total, item)=>item.sumaIngresos+total, 0)}/>
                  </div>
                </td>
                <td className='border-right-10'>
                  <div className='text-end'>
                    <NumberFormatMoney amount={dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)/encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaIngresos!=0).length)}/>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice}`}>EGRESOS</th>
                {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-change text-end ${`${e.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> <div className='text-change' onClick={()=>onOpenModalTableItems(e.dataGasto)}><NumberFormatMoney amount={-e.sumaGastos}/></div></td>
                    </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className='text-change text-end '>
                    <NumberFormatMoney amount={-dataAlter.reduce((total, item)=>item.sumaGastos+total, 0)}/>
                  </div>
                </td>
                <td className='border-right-10 '>
                  <div className='text-change text-end '>
                    <NumberFormatMoney amount={-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0)/encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaGastos!=0).length)}/>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice}`}>UTILIDAD / PERDIDA BRUTA</th>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end ${`${e.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> <div className={`${e.utilidadBruta>0?'text-ISESAC':'text-change'} `} ><NumberFormatMoney amount={e.utilidadBruta}/></div> </td>
                    </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className={`${utilidadBrutaTotal>0?'text-ISESAC':'text-change'} text-end`} ><NumberFormatMoney amount={utilidadBrutaTotal}/></div>
                </td>
                <td className='border-right-10'>
                  <div className={`${utilidadBrutaTotal>0?'text-ISESAC':'text-change'} text-end`}>
                    <NumberFormatMoney amount={(dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0))/encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaGastos!=0).length)}/>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>ING. EXTRAORDINARIOS</th>
                {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end ${`${e.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> <NumberFormatMoney amount={e.sumaIngresosExcepcional}/></td>
                    </React.Fragment>
                    )
                  })
                }
                <td className={`text-end border-left-10 border-right-10`}> 
                  <NumberFormatMoney amount={dataAlter.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0)}/></td>
                
                <td className='border-right-10'>
                  <div className={`text-end`}>
                    <NumberFormatMoney amount={dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0)/encontrarFechas(anioElegido,dataAlter.filter(f=>f.sumaGastos!=0).length)}/>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>UTILIDAD NETA</th>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end ${`${e.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}><div className={`${e.utilidadNeta>0?'text-ISESAC':'text-change'}`}> <NumberFormatMoney className='fs-2' amount={e.utilidadNeta}/></div></td>
                    </React.Fragment>
                    )
                  })
                }
                      <td className={`text-end border-left-10 border-right-10`}><div className={`${utilidadNetaTotal>0?'text-ISESAC':'text-change'}`}> <NumberFormatMoney className='fs-2' amount={utilidadNetaTotal}/></div></td>
                      <td className={`text-end border-right-10`}><div className={`${utilidadNetaTotalMESCOMPLETO>0?'text-ISESAC':'text-change'}`}> <NumberFormatMoney className='fs-2' amount={utilidadNetaTotalMESCOMPLETO/encontrarFechas(anioElegido,dataAlter.filter(f=>f.sumaGastos!=0).length)}/></div></td>
              </tr> 
              <tr>
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>% Utilidad / Perdida</th>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end ${`${e.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}><div className={`${e.utilidadNeta>0?'text-ISESAC':'text-change'}`} style={{fontSize: '30px'}}>{(e.utilidadUltimaLinea).toFixed(2)}</div></td>
                    </React.Fragment>
                    )
                  })
                }
                      <td className={`text-end border-left-10 border-right-10 border-bottom-10`}><div className={`${(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-2' amount={(utilidadNetaTotal&&ingresosAcumulados)&&((utilidadNetaTotal*100)/ingresosAcumulados)}/></div></td>
                      <td className={`text-end border-right-10 border-bottom-10`}><div className={`${(utilidadNetaTotal&&ingresosAcumulados)&&(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-2' amount={((utilidadNetaTotal&&ingresosAcumulados)&&((utilidadNetaTotal*100)/ingresosAcumulados))}/></div></td>
              </tr> 
              <tr>
                <th className={`border-left-10 border-right-10 sticky-td-${id_enterprice}`}>% ALCANCE CUOTA</th>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end ${`${e.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                        <div className={``} style={{fontSize: '30px'}}>
                          <NumberFormatMoney
                            className='fs-2'
                            amount=
                            {getQuotaParaMes(e.mes, e.anio).meta}
                          />
                        </div>
                      </td>
                    </React.Fragment>
                    )
                  })
                }
                      <td className={`text-end border-left-10 border-right-10 border-bottom-10`}><div className={`${(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-2' amount={(utilidadNetaTotal&&ingresosAcumulados)&&((utilidadNetaTotal*100)/ingresosAcumulados)}/></div></td>
                      <td className={`text-end border-right-10 border-bottom-10`}><div className={`${(utilidadNetaTotal&&ingresosAcumulados)&&(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-2' amount={((utilidadNetaTotal&&ingresosAcumulados)&&((utilidadNetaTotal*100)/ingresosAcumulados))}/></div></td>
              </tr> 
              <tr>
                <th className={`border-left-10 border-right-10 border-bottom-10 sticky-td-${id_enterprice}`}>BONO GERENCIAS (5% UTILIDAD BRUTA)</th>
              {
                dataBono.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end ${`${e.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                        <div className={``} style={{fontSize: '30px'}}>
                          {e.sumaIngresos<getQuotaParaMes(e.mes, e.anio).meta?'0.00':<NumberFormatMoney amount={e.utilidadBruta} className='fs-2'/>}
                        </div>
                      </td>
                    </React.Fragment>
                    )
                  })
                }
                      <td className={`text-end border-left-10 border-right-10 border-bottom-10`}><div className={`${(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-2' amount={(utilidadNetaTotal&&ingresosAcumulados)&&((utilidadNetaTotal*100)/ingresosAcumulados)}/></div></td>
                      <td className={`text-end border-right-10 border-bottom-10`}><div className={`${(utilidadNetaTotal&&ingresosAcumulados)&&(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-2' amount={((utilidadNetaTotal&&ingresosAcumulados)&&((utilidadNetaTotal*100)/ingresosAcumulados))}/></div></td>
              </tr> 
            </tbody>
          </Table>
        </>
  )
}

function encontrarFechas(anio, a=0) {
  const hoy = new Date()
  // Año actual
const year = hoy.getFullYear();
console.log({asdf: a});

// Mes actual (0 = enero, 11 = diciembre)
const month = hoy.getMonth()+ 1;
const ultimaFecha = new Date(year, month , 0);
const diaUltimaFecha = ultimaFecha.getDate()
const diaActual = hoy.getDate()
if(anio===year){
  return diaActual==diaUltimaFecha?0:month-1;
}else{
  // if(anio===2024){
  //   return a
  // }
  return 12;
}
}