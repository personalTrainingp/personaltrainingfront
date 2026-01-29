import React, { useEffect } from 'react'
import { generarMesYanio } from './helpers/generarMesYanio'
import { TableResumen } from './DataTables/TableResumen'
import { useFlujoCaja } from './hook/useFlujoCaja'

export const ViewTablesFlujoCaja = ({arrayFecha=[], anio, id_empresa, classNameEmpresa, bgPastel}) => {
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha,  } = useFlujoCaja()
    useEffect(() => {
        obtenerEgresosxFecha(598, arrayFecha)
    }, [])
    
  return (
    <div>
        <TableResumen/>
        <pre>
            {JSON.stringify(generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1])), null, 2)}
        </pre>
    </div>
  )
}
