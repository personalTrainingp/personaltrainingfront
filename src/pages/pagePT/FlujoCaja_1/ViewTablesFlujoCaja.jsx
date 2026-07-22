import React, { useEffect, useState } from 'react'
import { generarMesYanio } from './helpers/generarMesYanio'
import { useFlujoCaja } from './hook/useFlujoCajaStore'
import { DataTablePrincipal } from './DataTables/DataTablePrincipal'
import { ViewResumenTotal } from './ViewResumenTotal'
import { useSelector } from 'react-redux'
import { DataTablePrincipalIng } from './DataTables/DataTablePrincipalIng'

export const ViewTablesFlujoCaja = ({arrayFecha=[], anio, id_empresa, classNameEmpresa, bgPastel}) => {
    const { obtenerEgresosxFecha, obtenerIngresosxFecha } = useFlujoCaja()
    const { dataGrupoGastos, dataGrupoIngresos } = useSelector((state)=>state.IMAGINARIA_FLUJO_CAJA)
    useEffect(() => {
    const obtenerDatos = async () => {
        await Promise.all([
            obtenerIngresosxFecha(id_empresa, arrayFecha),
            obtenerEgresosxFecha(id_empresa, arrayFecha)
        ])
    }
        obtenerDatos()
    }, [])
    console.log({dataGrupoGastos, dataGrupoIngresos});
    
  return (
    <div>
        <div style={{fontSize: '70px'}} className='text-black text-center'>INGRESOS</div>
        <div className="tab-scroll-container">
            {
                dataGrupoIngresos
                ?.filter(f=>f.gastos?.length!==0)
                .filter((f)=>f.id!==121 && f.id!==46)
                ?.map((data, i, arr)=>{
                    return (
                        <DataTablePrincipalIng
                            index={i+1}
                            id_empresa={id_empresa}
                            key={`${data.grupo}`} 
                            bgPastel={bgPastel} 
                            bgTotal={classNameEmpresa} 
                            itemsxDias={data?.itemsxDia}  
                            nombreGrupo={data.param_label} 
                            conceptos={data.parametro_grupo_gasto} 
                            sumaTotal={data.itemsxDia.reduce((total, item)=>total+item.monto, 0)}
                            data={arr} 
                            anio={anio}
                            cat={'ingresos'}
                            fechas={generarMesYanio( new Date(arrayFecha[0]), new Date(arrayFecha[1]) )}/>
                    )
                })
            }
        </div> 
            <div style={{fontSize: '70px'}} className='text-black text-center'>EGRESOS</div>
        <div className='tab-scroll-container'>
            {
                dataGrupoGastos
                .filter(f=>f.gastos?.length!==0)
                .filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.id!==97 && f.id!==110&& f.id!==153&& f.id!==103 && f.id!==150 && f.id!==157)
                ?.map((data,i, arr)=>{
                    return (
                        <DataTablePrincipal 
                            index={i+1}
                            id_empresa={id_empresa}
                            key={`${data.grupo}`}
                            bgPastel={bgPastel}
                            bgTotal={classNameEmpresa}
                            itemsxDias={data?.itemsxDia}
                            nombreGrupo={`${data.param_label}`}
                            conceptos={data.parametro_grupo_gasto}
                            sumaTotal={data.itemsxDia.reduce((total, item)=>total+item.monto, 0)}
                            data={arr}
                            anio={anio}
                            cat={'egresos'}
                            fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}
                            />
                    )
                })
            }
        </div>
        <div className='tab-scroll-container'>
            <ViewResumenTotal 
                bgPastel={bgPastel} 
                bgTotal={classNameEmpresa} 
                id_enterprice={id_empresa} 
                anio={[arrayFecha[0], arrayFecha[1]]}
                fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))} />
        </div>
    </div>
  )
}
