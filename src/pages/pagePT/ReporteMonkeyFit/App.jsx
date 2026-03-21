import React, { useEffect } from 'react'
import { useMonkeyFitStore } from './useMonkeyFitStore'
import { Table } from 'react-bootstrap'
import { generarMesYanio } from './generarMesYanio'
import dayjs from 'dayjs'

export const App = () => {
    const { dataMF, obtenerMF } = useMonkeyFitStore()
    useEffect(() => {
        obtenerMF()
    }, [])
    const arrayFecha = ['2025-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    const dataMFClientesRepetidos = agruparPorCliente(dataMF).filter(f=>f?.items.length>1).map(g=>{
        return {
            ...g,
            items: agruparPorFecha(g.items)
        }
    })
  return (
    <div>
            <Table responsive className="tabla-egresos fs-3">
                <thead>
                    <tr>
                        <th className='bg-change'></th>
                        {
                            generarMesYanio(new Date(arrayFecha[0])).map(g=>{
                                return (
                                    <th className='fs-3 bg-change text-white'>{dayjs(`${g.fecha}-15`, 'YYYY-M-DD').format('YYYY-MMMM')}</th>
                                )
                            })
                        }
                        <th className='fs-3 bg-change text-white'>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataMFClientesRepetidos.map(r=>{

                            return (
                                <tr>
                                    <th className='fs-3 bg-change text-white sticky-td-598'>
                                        {r.items[0]?.items[0]?.cliente.nombre_cli} {r.items[0]?.items[0]?.cliente.apPaterno_cli}
                                    </th>
                                    {
                                        generarMesYanio(new Date(arrayFecha[0])).map(g=>{
                                            const items = r.items.filter(f=>`${f.anio}-${f.mes}`==`${g.anio}-${g.mes}`)
                                            return (
                                                <td className='fs-3 text-center'>{items.length}</td>
                                            )
                                        })
                                    }
                                    <td className='fs-3 text-center'>
                                        
                                        {r.items?.length}
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </Table>
    </div>
  )
}


const agruparPorCliente = (data) => {
  const result = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.id_cli]) {
        acc[item.id_cli] = {
          id_cli: item.id_cli,
          items: []
        };
      }

      acc[item.id_cli].items.push(item);
      return acc;
    }, {})
  );

  return result
};

const agruparPorFecha = (data) => {
  return Object.values(
    data.reduce((acc, item) => {
      const fecha = new Date(item.fechaP);

      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1; // 0-based
      const anio = fecha.getFullYear();

      const key = `${anio}-${mes}-${dia}`;

      if (!acc[key]) {
        acc[key] = {
          dia,
          mes,
          anio,
          items: []
        };
      }

      acc[key].items.push(item);

      return acc;
    }, {})
  );
};