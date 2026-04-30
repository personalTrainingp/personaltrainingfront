import React, { useEffect } from 'react'
import { useFlujoCaja } from '../hook/useFlujoCajaStore';
import { generarMesYanio } from '../helpers/generarMesYanio';
import { Table } from 'react-bootstrap';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const ComparativaVentasxAnio = ({id_empresa}) => {
  const { obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
  const dataVentas = dataIngresosxFecha.find(f=>f.grupo=='INGRESOS')?.data
  useEffect(() => {
      obtenerIngresosxFecha(id_empresa, [new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2026-12-31 15:45:47.6640000 +00:00')]);
    }, []);
    const meses1 = generarMesYanio(
                new Date('2024-01-01 15:45:47.6640000 +00:00'),
                new Date('2024-03-31 15:45:47.6640000 +00:00')
              )
    const meses2 = generarMesYanio(
                new Date('2024-04-01 15:45:47.6640000 +00:00'),
                new Date('2024-06-30 15:45:47.6640000 +00:00')
              )
    const meses3 = generarMesYanio(
                new Date('2024-07-01 15:45:47.6640000 +00:00'),
                new Date('2024-09-30 15:45:47.6640000 +00:00')
              )
    const meses4 = generarMesYanio(
                new Date('2024-10-01 15:45:47.6640000 +00:00'),
                new Date('2024-12-31 15:45:47.6640000 +00:00')
              )
    const dataVentasAgrupadoxFecha = agruparPorFecha(dataVentas)
  return (
    <div className=''>
      <div style={{fontSize: '55px'}} className='text-black text-center'>1ER TRIMESTRE</div>
      <TableAnio dataVentasAgrupadoxFecha={dataVentasAgrupadoxFecha} meses={meses1}/>
      <div style={{fontSize: '55px'}} className='text-black text-center'>2DO TRIMESTRE</div>
      <TableAnio dataVentasAgrupadoxFecha={dataVentasAgrupadoxFecha} meses={meses2}/>
      <div style={{fontSize: '55px'}} className='text-black text-center'>3ER TRIMESTRE</div>
      <TableAnio dataVentasAgrupadoxFecha={dataVentasAgrupadoxFecha} meses={meses3}/>
      <div style={{fontSize: '55px'}} className='text-black text-center'>4TO TRIMESTRE</div>
      <TableAnio dataVentasAgrupadoxFecha={dataVentasAgrupadoxFecha} meses={meses4}/>
    </div>
  )
}

export const TableAnio = ({dataVentasAgrupadoxFecha, meses}) => {
  return (
      <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
        <thead>
            <tr>
                <th style={{width: '190px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black text-center'>AÑO / MES</div></th>
                {
                    meses?.map(e=>{
                        return (
                          <>
                            <th className='text-center fs-1' 
                            style={{width: '200px'}}>{e.mesSTR}</th>
                            <th className='text-center fs-1' 
                            style={{width: '100px'}}>%</th>
                          </>
                        )
                    })
                }
                <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-1' 
                style={{width: '150px'}}>TOTAL</th>
                <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-1' 
                style={{width: '150px'}}>%</th>
            </tr>
        </thead>
        <tbody>
          <TrAnio anio={2026} dataVentasAgrupadoxFecha={dataVentasAgrupadoxFecha} meses={meses}/>
          <TrAnio anio={2025} dataVentasAgrupadoxFecha={dataVentasAgrupadoxFecha} meses={meses}/>
          <TrAnio anio={2024} dataVentasAgrupadoxFecha={dataVentasAgrupadoxFecha} meses={meses}/>
        </tbody>
      </Table>
  )
}


export const TrAnio = ({anio, dataVentasAgrupadoxFecha, meses}) => {
  const mesesTotal = meses.map(m=>{
    return {
      montoV: dataVentasAgrupadoxFecha.filter(f=>f.fecha_primaria.anio==anio && f.fecha_primaria.mes===m.mes).reduce((total, item)=>item.montoTotal+total,0)
    }
  })
  const mesesTotalAnioAnterior = meses.map(m=>{
    return {
      montoV: dataVentasAgrupadoxFecha.filter(f=>f.fecha_primaria.anio==anio-1 && f.fecha_primaria.mes===m.mes).reduce((total, item)=>item.montoTotal+total,0)
    }
  })
  const dataxAnio = dataVentasAgrupadoxFecha.filter(f=>f.fecha_primaria.anio==anio)
  const xmes = meses.map(m=>dataVentasAgrupadoxFecha.filter(f=>f.fecha_primaria.mes===m.mes))[0]

  return (
          <tr>
            <td className='fs-1 text-center'>{anio}</td>
            {
              meses.map(m=>{
                const dataMesxFecha = dataVentasAgrupadoxFecha.filter(f=>f.fecha_primaria.mes===m.mes && f.fecha_primaria.anio==anio)
                const dataMesxFechaxAnioAnterior = dataVentasAgrupadoxFecha.filter(f=>f.fecha_primaria.mes===m.mes && f.fecha_primaria.anio==anio-1)
                const sumaDataMesxFecha = dataMesxFecha.reduce((total, item)=>item.montoTotal+total, 0)||0
                const sumaDataMesxFechaxAnioAnterior = dataMesxFechaxAnioAnterior.reduce((total, item)=>item.montoTotal+total, 0)||0
                return (
                  <>
                  <td>
                    <NumberFormatMoney
                      amount=
                      {dataMesxFecha.reduce((total, item)=>item.montoTotal+total, 0)}
                    />
                  </td>
                  <td>
                    <NumberFormatMoney
                      amount=
                      {(((((sumaDataMesxFecha*100)/sumaDataMesxFechaxAnioAnterior)))-100)>0?(((((sumaDataMesxFecha*100)/sumaDataMesxFechaxAnioAnterior)))-100):0}
                    />
                  </td>
                  </>
                )
              })
            }
            
            <td>
                <NumberFormatMoney
                  amount=
                {mesesTotal.reduce((total, item)=>item.montoV+total, 0)}
                />
            </td>
            <td>
                <NumberFormatMoney
                  amount=
                {(((mesesTotal.reduce((total, item)=>item.montoV+total, 0)*100)/mesesTotalAnioAnterior.reduce((total, item)=>item.montoV+total, 0))-100)>0?(((mesesTotal.reduce((total, item)=>item.montoV+total, 0)*100)/mesesTotalAnioAnterior.reduce((total, item)=>item.montoV+total, 0))-100):0}
                />
            </td>
          </tr>
  )
}


// export const TrTotal = ({dataVentasAgrupadoxFecha, meses}) => {
//   const mesesTotal = meses.map(m=>dataVentasAgrupadoxFecha.filter(f=>f.fecha_primaria.mes===m.mes))[0]
//   return (
//     <tr>
//       <td className='fs-1 text-center'>TOTAL</td>
//       {
//         meses.map(m=>{
//           const dataMes = dataVentasAgrupadoxFecha.filter(f=>f.fecha_primaria.mes===m.mes)
//           return (
//             <>
//                   <td>
//                     <NumberFormatMoney
//                       amount=
//                       {dataMes.reduce((total, item)=>item.montoTotal+total, 0)}
//                     />
//                   </td>
//                   <td>
//                     <NumberFormatMoney
//                       amount=
//                       {100}
//                     />
//                   </td>
//                   </>
//           )
//         })
//       }
//             <td>
//                 <NumberFormatMoney
//                   amount=
//                 {mesesTotal.reduce((total, item)=>item.montoTotal+total, 0)}
//                 />
//             </td>
//             <td>
//                 <NumberFormatMoney
//                   amount=
//                 {100}
//                 />
//             </td>
//     </tr>
//   )
// }


const agruparPorFecha = (data = []) => {
  const map = new Map();

  data.forEach(item => {
    const fecha = new Date(item.fecha_primaria);

    const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;

    if (!map.has(key)) {
      map.set(key, {
        fecha_primaria: {
          dia: fecha.getDate(),
          mes: fecha.getMonth() + 1,
          anio: fecha.getFullYear()
        },
        items: []
      });
    }

    map.get(key).items.push(item);
  });

  return Array.from(map.values()).map(m=>{
    return {
      montoTotal: m.items?.reduce((total, item)=>item.monto+total, 0),
      fecha_primaria: m.fecha_primaria
    }
  });
};