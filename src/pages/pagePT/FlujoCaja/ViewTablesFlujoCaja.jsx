import React, { useEffect } from 'react'
import { generarMesYanio } from './helpers/generarMesYanio'
import { TableResumen } from './DataTables/TableResumen'
import { useFlujoCaja } from './hook/useFlujoCaja'
import { DataTablePrincipal } from './DataTables/DataTablePrincipal'

export const ViewTablesFlujoCaja = ({arrayFecha=[], anio, id_empresa, classNameEmpresa, bgPastel}) => {
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    useEffect(() => {
        obtenerEgresosxFecha(598, arrayFecha)
        obtenerIngresosxFecha(598, arrayFecha)
    }, [])
    console.log({dataIngresosxFecha, dataGastosxFecha});
    
  return (
    <div>
        <div className="tab-scroll-container">
            <div className='fs-1 text-center'>INGRESOS</div>
            {
                dataIngresosxFecha?.map(data=>{
                    return (
                        <DataTablePrincipal bgPastel={bgPastel} bgTotal={classNameEmpresa} itemsxDias={data?.itemsxDias}  nombreGrupo={data.grupo} conceptos={data.conceptos} data={dataGastosxFecha} fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}/>
                    )
                })
            }
            <div className='fs-1 text-center'>EGRESOS</div>
            {
                dataGastosxFecha.map(data=>{
                    return (
                        <DataTablePrincipal bgPastel={bgPastel} bgTotal={classNameEmpresa} itemsxDias={data?.itemsxDias}  nombreGrupo={data.grupo} conceptos={data.conceptos} data={dataGastosxFecha} fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}/>
                    )
                })
            }
        </div>
        {/* <TableResumen /> */}
        {/* <pre>
            {JSON.stringify(generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1])), null, 2)}
        </pre> */}
    </div>
  )
}
