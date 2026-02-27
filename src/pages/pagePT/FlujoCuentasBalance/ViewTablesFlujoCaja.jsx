import React, { useEffect } from 'react'
import { generarMesYanio } from './helpers/generarMesYanio'
import { TableResumen } from './DataTables/TableResumen'
import { useFlujoCaja } from './hook/useFlujoCaja'
import { DataTablePrincipal } from './DataTables/DataTablePrincipal'

export const ViewTablesFlujoCaja = ({arrayFecha=[], anio, id_empresa, classNameEmpresa, bgPastel}) => {
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha,  } = useFlujoCaja()
    useEffect(() => {
        obtenerEgresosxFecha(598, arrayFecha)
    }, [])
    
  return (
    <div>
        <div className="tab-scroll-container">
            {
                dataGastosxFecha.map((data, i)=>{
                    return (
                        <DataTablePrincipal index={i} itemsxDias={data?.itemsxDias}  nombreGrupo={data.grupo} conceptos={data.conceptos} data={dataGastosxFecha} fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}/>
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
