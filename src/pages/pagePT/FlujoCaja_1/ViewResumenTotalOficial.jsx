import React, { useEffect } from 'react'
import { useFlujoCaja } from './hook/useFlujoCajaStore'
import { agruparPorGrupoYConcepto } from './helpers/agrupamientosOficiales'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'

export const ViewResumenTotalOficial = ({fechas, id_enterprice, bgTotal, bgPastel, anio, onOpenModalTableItems}) => {
    const fechaElegida = new Date(anio[0])
    const fechaActual = new Date()
    const anioElegido = fechaElegida.getFullYear()
    const mesElegido = fechaElegida.getMonth()+1
    const anioActual = fechaActual.getFullYear()
    const mesActual = fechaActual.getMonth()+1
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    useEffect(() => {
        obtenerEgresosxFecha(id_enterprice, anio)
    }, [id_enterprice])
    useEffect(() => {
        obtenerIngresosxFecha(id_enterprice, anio)
    }, [])
    const alterMap = fechas.map(m=>{
        const dataGastos = dataGastosxFecha.items.filter(f=>
            f.tb_parametros_gasto.parametro_grupo.id!==97 && 
            f.tb_parametros_gasto.parametro_grupo.id!==153 && 
            f.tb_parametros_gasto.parametro_grupo.id!==103&& 
            f.tb_parametros_gasto.parametro_grupo.id!==150).filter(f=>f.fechaP.mesP===Number(m.mes))
        const dataIngresos = dataIngresosxFecha.items.filter(f=>f.fechaP.mesP===m.mes)
        const dataIngresosVentas = dataIngresos.filter(f=>f.tb_parametros_gasto.parametro_grupo.id!==121)
        const cuotaAlcanzarVentas = getQuotaParaMes(m.mes, m.anio).meta
        const sumaGastosReal = dataGastos.reduce((total, item)=>total+item.monto, 0)
        const sumaGastosProyectado = dataGastos.reduce((total, item)=>total+item.monto_proyectado, 0)
        const sumaVentasReal = dataIngresosVentas.reduce((total, item)=>total+item.monto, 0)
        const utilidadVentasReal = sumaVentasReal-sumaGastosReal
        const bonoGerencia = utilidadVentasReal*0.05
        const utilidadUltimaLinea = ((sumaVentasReal) && (utilidadVentasReal*100)/sumaVentasReal)
        const terminologiasConProyectado = agruparPorGrupoYConcepto(dataGastos, dataGastosxFecha.terminologiasUsadas, 2026)
        return {
            ...m,
            terminologiasConProyectado,
            sumaVentasReal,
            dataGastos,
            dataIngresos,
            cuotaAlcanzarVentas,
            sumaGastosProyectado,
            sumaGastosReal,
            utilidadVentasReal,
            bonoGerencia,
            utilidadUltimaLinea
        }
    })
  return (
    <div>
        <Table className="tabla-egresos fs-3" style={{ width: '100%', marginBottom: '200px' }} bordered>
            <thead>
                <tr>
                <th style={{width: '500px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}><div className='text-black'>{'RESULTADO ANUAL'}</div></th>
                {
                    fechas.map(f=>{
                    return (
                        <React.Fragment key={`${f?.mes}`}>
                        <td className={`text-center ${bgTotal} ${`${f?.mes}-${f.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`} style={{width: '270px'}}>{f.mesSTR}</td>
                        </React.Fragment>
                    )
                    })
                }
                <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '230px'}}>TOTAL <br/> ANUAL</th>
                <th className='text-center border-top-10 border-bottom-10 border-right-10' style={{width: '230px'}}>PROMEDIO <br/> MENSUAL <br/> ANUAL</th>
                </tr>
            </thead>
            <tbody>
                {
                    id_enterprice!==800 && (
                    <tr>
                        <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>CUOTA</td>
                    {
                        alterMap.map(e=>{
                        return (
                            <React.Fragment>
                            <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                                <div className={``} style={{fontSize: '30px'}}>
                                <NumberFormatMoney
                                    className='fs-2'
                                    amount=
                                    {e.cuotaAlcanzarVentas}
                                />
                                </div>
                            </td>
                            </React.Fragment>
                            )
                        })
                        }
                            <td className={`text-end border-left-10 border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                            <td className={`text-end border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                    </tr> 
                    )
                }
                
                    <tr>
                        <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>
                                INGRESOS
                        </td>
                    {
                        alterMap.map(e=>{
                        return (
                            <React.Fragment>
                            <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                                <div className={``} style={{fontSize: '30px'}}>
                                <NumberFormatMoney
                                    className='fs-2'
                                    amount=
                                    {e.sumaVentasReal}
                                />
                                </div>
                            </td>
                            </React.Fragment>
                            )
                        })
                        }
                            <td className={`text-end border-left-10 border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                            <td className={`text-end border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                    </tr>
                    <tr>
                        <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>
                            <div className='d-flex flex-column'>
                                <span className='mb-2'>
                                EGRESO REAL
                                </span>
                                <span>
                                PROYECTADO
                                </span>
                            </div>
                        </td>
                    {
                        alterMap.map(e=>{
                        return (
                            <React.Fragment>
                            <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                                <div className={``} style={{fontSize: '30px'}} onClick={()=>onOpenModalTableItems(e.dataGastos, dataGastosxFecha, e.mes, anio, true)}>
                                <NumberFormatMoney
                                    className='fs-2'
                                    amount=
                                    {e.sumaGastosReal}
                                />
                                <br/>
                                <NumberFormatMoney
                                    className='fs-2'
                                    amount=
                                    {e.sumaGastosProyectado}
                                />
                                </div>
                            </td>
                            </React.Fragment>
                            )
                        })
                        }
                            <td className={`text-end border-left-10 border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                            <td className={`text-end border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                    </tr>
                    <tr>
                        <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>
                            UTILIDAD / PERDIDA
                        </td>
                    {
                        alterMap.map(e=>{
                        return (
                            <React.Fragment>
                            <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                                <div className={``} style={{fontSize: '30px'}}>
                                <NumberFormatMoney
                                    className='fs-2'
                                    amount=
                                    {e.utilidadVentasReal}
                                />
                                </div>
                            </td>
                            </React.Fragment>
                            )
                        })
                        }
                            <td className={`text-end border-left-10 border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                            <td className={`text-end border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                    </tr>
                    <tr>
                        <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>
                            % Utilidad / Perdida
                        </td>
                    {
                        alterMap.map(e=>{
                        return (
                            <React.Fragment>
                            <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                                <div className={``} style={{fontSize: '30px'}}>
                                <NumberFormatMoney
                                    className='fs-2'
                                    amount=
                                    {e.utilidadUltimaLinea}
                                />
                                </div>
                            </td>
                            </React.Fragment>
                            )
                        })
                        }
                            <td className={`text-end border-left-10 border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                            <td className={`text-end border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                    </tr>
                    <tr>
                        <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>
                            BONO GERENCIAS (5% UTILIDAD BRUTA)
                        </td>
                    {
                        alterMap.map(e=>{
                        return (
                            <React.Fragment>
                            <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                                <div className={``} style={{fontSize: '30px'}}>
                                <NumberFormatMoney
                                    className='fs-2'
                                    amount=
                                    {e.bonoGerencia}
                                />
                                </div>
                            </td>
                            </React.Fragment>
                            )
                        })
                        }
                            <td className={`text-end border-left-10 border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                            <td className={`text-end border-right-10 border-bottom-10 fs-1 text-center`}>-</td>
                    </tr>
                    
            </tbody>
        </Table>
    </div>
  )
}

function encontrarFechas(anio) {
  const hoy = new Date()
  // Año actual
const year = hoy.getFullYear();
// console.log({asdf: a});

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



const getQuotaParaMes = (monthIndex, year) => {
  const y = year;
  const m = monthIndex;
  switch (`${m}-${y}`) {
    case "5-2026":
      return {
        meta: 110000,
      };
    case "4-2026":
      return {
        meta: 115000,
      };
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