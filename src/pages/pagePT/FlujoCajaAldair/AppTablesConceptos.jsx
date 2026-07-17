import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { generarMesYanio } from './helpers/generarMesYanio'
import { TableConceptoAnio } from './DataTables/TableConceptoAnio'
import { useFlujoCaja } from './hook/useFlujoCajaStore'

export const AppTablesConceptos = ({id_empresa=598, fechas=[], bgTotal, bgPastel}) => {
    const generadorFechas = generarMesYanio( new Date('2026-01-01 15:45:47.6640000 +00:00'), new Date('2026-12-31 15:45:47.6640000 +00:00') )
    const { dataGastosxFecha,  obtenerGastosxFecha} = useFlujoCaja()
    useEffect(() => {
        obtenerGastosxFecha(id_empresa, ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00'])
    }, [])
    
  return (
    <div>
        {/* <pre>
            {JSON.stringify(agruparxConceptos(dataGastosxFecha.items), null, 2)}
        </pre> */}
        {
            agruparxConceptos(dataGastosxFecha.items).map(m=>{
                return (
                    <React.Fragment key={m.id_gasto}>
                            <div className='text-center text-black' style={{fontSize: '50px'}}>{m.data[0].tb_parametros_gasto.nombre_gasto}</div>
                        <div className='overflow-auto'>
                            <TableConceptoAnio nombreGrupo={m.data[0].tb_parametros_gasto.grupo} bgPastel={bgPastel} bgTotal={bgTotal} fechas={generadorFechas} concepto={''} data={m.data} id_empresa={id_empresa} />
                        </div>
                    </React.Fragment>
                )
            })
        }
    </div>
  )
}

const agruparxConceptos = (data = []) => {
  return Object.values(
    data.reduce((acc, item) => {
      const id_gasto = item.id_gasto;

      if (!acc[id_gasto]) {
        acc[id_gasto] = {
          id_gasto: id_gasto,
          monto_total: 0,
          data: [],
        };
      }

      acc[id_gasto].monto_total += item.monto;
      acc[id_gasto].data.push(item);

      return acc;
    }, {}),
  ).sort((a,b)=>a.data[0].tb_parametros_gasto.parametro_grupo.orden-b.data[0].tb_parametros_gasto.parametro_grupo.orden);
};