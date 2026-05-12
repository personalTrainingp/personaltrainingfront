import React from 'react'
import { FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import { Table } from 'react-bootstrap';
import { generarMesYanio } from '../helpers/generarMesYanio';

export const TableProyectados = ({data, id_empresa, fechas=[], anio=2026, mes='04', bgPastel='', classNameEmpresa=''}) => {
  return (
    <div>
        {
                        data
                        .sort((a, b)=>a.orden-b.orden)
                        .filter(f=>f.gastos?.length!==0)
                        .filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.id!==97 && f.id!==110&& f.id!==153)
                        ?.map((data, i)=>{
                            return (
                                <DataTablePrincipal 
                                    index={i+1}
                                    id_empresa={id_empresa}
                                    key={`${data.grupo}`} 
                                    bgPastel={bgPastel} 
                                    bgTotal={classNameEmpresa} 
                                    itemsxDias={data?.itemsxDia}  
                                    nombreGrupo={data.param_label} 
                                    fechas={fechas}
                                    conceptos={data.parametro_grupo_gasto} 
                                    anio={anio}
                                    />
                            )
                        })
                    }
    </div>
  )
}


export const DataTablePrincipal = ({anio, id_empresa, itemsxDias=[], conceptos=[], fechas=[], nombreGrupo='', index='', bgTotal, bgPastel, onOpenModalTableItems}) => {
  const fecha = new Date()
  const anioActual = fecha.getFullYear()
  const mesActual = fecha.getMonth()+1
  const dataAlter = fechas.map((f, index, array)=>{
        const dataTotal = itemsxDias.find(i=>i.mes===f.mes && i.anio===f.anio)??{}
        const dataPagadas = dataTotal.items?.filter(e=>e?.id_estado_gasto===1423) || [];
        const dataNoPagadas = dataTotal.items?.filter(e=>e?.id_estado_gasto===1424) || [];
        const data =  [...dataPagadas, ...dataNoPagadas]
          return {
              ...f,
              mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
              data: data,
              sumaMonto: (data?.reduce((total, item)=>total+item?.monto, 0)||0),
          }
  })
  const dataSinMesActual = dataAlter.filter(f=>f.mes<=4 && f.anio===2026)
  const dataMesActual = dataAlter.filter(f=>f.mes==5 && f.anio===2026)
  return (
    <>
      <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
        <thead>
          <tr>
            <th style={{width: '500px'}} className={` text-break fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black `}>{index}. {nombreGrupo==='GAS / MANTENIMIENTO Y MOVILIDADES'?<>GAS<br/> MANTENIMIENTO<br/> MOVILIDADES</>:(nombreGrupo)}</th>
            <th>PROMEDIO MENSUAL</th>
            {
              dataMesActual.map(f=>{
                return (
                  <React.Fragment key={`${f.mesStr}`}>
                  <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>{f.mesStr}</td>
                  </React.Fragment>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            conceptos.sort((a, b)=>a.orden-b.orden).map((c, i)=>{
              return (
                <React.Fragment>
                  {
                    c.itemsxDia?.filter(f=>f.mes==5 && f.anio===2026).reduce((total, im)=>total+im?.monto_proyectado, 0)<=c.itemsxDia?.filter(f=>f.mes<=4 && f.anio===2026 && f.monto!==0).reduce((total, im)=>total+im?.monto, 0)/c.itemsxDia?.filter(f=>f.mes<=4 && f.anio===2026 && f.monto!==0).length
                    && (
                    <tr key={c.nombre_gasto}>
                      <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 ${bgTotal}`}>
                        {i+1}. {(c.nombre_gasto)}
                      </td>
                    <td className='text-end '><NumberFormatMoney amount={c.itemsxDia?.filter(f=>f.mes<=4 && f.anio===2026 && f.monto!==0).reduce((total, im)=>total+im?.monto, 0)/c.itemsxDia?.filter(f=>f.mes<=4 && f.anio===2026 && f.monto!==0).length}/></td>
                    <td className='text-end '><NumberFormatMoney amount={c.itemsxDia?.filter(f=>f.mes==5 && f.anio===2026).reduce((total, im)=>total+im?.monto_proyectado, 0)}/></td>
                    </tr>
                    )
                  }
                </React.Fragment>
              )
            })
          }
        </tbody>
      </Table>
    </>
  )
}
