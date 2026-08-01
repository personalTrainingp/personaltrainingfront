import React, { useEffect } from 'react'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore'
import { arrayOrigenDeCliente } from '@/types/type'
import { Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { useSelector } from 'react-redux'

export const AppVentasxOrigen = ({arrayFechas, corte}) => {
  const { obtenerVentas, dataVentas,  } = useInformeEjecutivoStore()

    const { fecha } = useSelector((e) => e.DATA);
    const fechaSeleccionada = `${fecha.split('-')[0]}-${fecha.split('-')[1]}`;
  useEffect(() => {
      obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
  }, [])
  const resultado = dataVentas.dataMembresias.map(registro => {
  const ventaOrigenes = Object.values(
    registro.items.reduce((acc, item) => {
      const id = item.id_origen;

      if (!acc[id]) {
        acc[id] = {
          id_origen: id,
          data: [],
          monto_total: 0,
          cantidad_total: 0,
        };
      }

      acc[id].data.push(item);
      acc[id].monto_total += item.montoTotal || 0;
      acc[id].cantidad_total += item.cantidadTotal || 0;

      return acc;
    }, {})
  );

  return {
    ...registro,
    ventaOrigenes,
  };
});

    const dataConMes = arrayFechas.map(arr=>{
        const dataFiltradaMes =  resultado?.filter((f)=>f.mes===arr?.mes && f.anio===arr?.anio && f.dia <corte?.corte)
        return {
            ...arr,
            items: dataFiltradaMes,
        }
    })
    // .filter(f=>f.anio<Number(fecha.split('-')[0]) || (f.anio===Number(fecha.split('-')[0]) && f.mes<Number(fecha.split('-')[1])))
  return (
    <div>
      {
        arrayOrigenDeCliente.map((origen, i) => {
            const dataOrigenes = dataConMes
              .map(mes => {
                // Nos quedamos solo con los registros del mes que sí tienen este origen
                const itemsFiltrados = mes.items.filter(item =>
                  item.ventaOrigenes.some(vo => vo.id_origen === origen.value)
                )
                // Extraemos, de cada registro, ÚNICAMENTE el sub-total de este origen
                // (antes se usaba item.montoTotal, que es el total de TODOS los orígenes del mes)
                const origenesDelMes = itemsFiltrados.map(item =>
                  item.ventaOrigenes.find(vo => vo.id_origen === origen.value)
                )
    
                const monto = origenesDelMes.reduce((a, vo) => a + (vo?.monto_total || 0), 0)
                const cantidad = origenesDelMes.reduce((a, vo) => a + (vo?.cantidad_total || 0), 0)
    
                // Total del mes considerando TODOS los orígenes (para el % de participación)
                const montoTotalMes = mes.items.reduce(
                  (a, item) => a + item.ventaOrigenes.reduce((b, vo) => b + (vo.monto_total || 0), 0),
                  0
                )
    
                return {
                  ...mes,
                  items: itemsFiltrados,
                  monto,
                  cantidad,
                  participacion: montoTotalMes ? (monto / montoTotalMes) * 100 : 0,
                }
              })
              
              const data4MejoresMeses = dataOrigenes.sort((a,b) => b.monto - a.monto).slice(0, 4).sort((a,b) => a.monto - b.monto)
              const dataOrigenesMasMesActual = dataOrigenes.filter(d => d.mes===Number(fecha.split('-')[1]) && d.anio===Number(fecha.split('-')[0]))
              const dataMejoresMesesMasMesActual = [ ...data4MejoresMeses, ...dataOrigenesMasMesActual]
          return (
            <div key={origen.value}>
              <div className='mb-4 text-center'>
                <span className='bg-change fs-1 p-2 text-white'>{i+1}. {origen.label}</span>
              </div>
              <Table className="tabla-egresos" style={{width: '100%'}}  bordered>
                <thead>
                  <tr>
                    <th className='bg-change' style={{width: '250px'}}>Mes</th>
                    {
                        dataMejoresMesesMasMesActual.map(d=>{
                            return (
                                <th  className={`fs-3 text-center bg-change text-white p-1`}  style={{width: '240px'}}>
                                  {dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')}
                                  {dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('YYYY')}
                                </th>
                            )
                        })
                    }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='sticky-td-598 fs-3 text-white'>VENTA MEMBRESIAS</td>
                    {
                        dataMejoresMesesMasMesActual.map(d=>{
                            return (
                                <td  className={`fs-2 text-center text-black`}>
                                  <NumberFormatMoney
                                    amount=
                                    {d.monto}
                                  />
                                </td>
                            )
                        })
                    }
                  </tr>
                  <tr>
                    <td className='sticky-td-598 fs-3 text-white'>CANTIDAD MEMBRESIAS</td>
                    {
                        dataMejoresMesesMasMesActual.map(d=>{
                            return (
                                <td  className={`fs-2 text-center text-black`}>{d.cantidad}</td>
                            )
                        })
                    }
                  </tr>
                  <tr>
                    <td className='sticky-td-598 fs-3 text-white'>TICKET MEDIO</td>
                    {
                        dataMejoresMesesMasMesActual.map(d=>{
                            return (
                                <td  className={`fs-2 text-center text-black`}>
                                  <NumberFormatMoney
                                    amount=
                                    {d.monto / (d.cantidad || 1)}/></td>
                            )
                        })
                    }
                  </tr>
                  <tr>
                    <td className='sticky-td-598 fs-3 text-white'>% PARTICIPACION</td>
                    {
                        dataMejoresMesesMasMesActual.map(d=>{
                            return (
                                <td  className={`fs-2 text-center text-black`}>{d.participacion.toFixed(1)}%</td>
                            )
                        })
                    }
                  </tr>
                </tbody>
              </Table>
            </div>
          )
        })
      }
    </div>
  )
}
