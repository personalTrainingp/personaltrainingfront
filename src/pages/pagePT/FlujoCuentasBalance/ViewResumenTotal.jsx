import React, { useEffect } from "react"
import { useFlujoCaja } from "./hook/useFlujoCajaStore"
import { Table } from "react-bootstrap"
import dayjs from "dayjs"
import { NumberFormatMoney } from "@/components/CurrencyMask"

export const ViewResumenTotal = ({fechas, id_enterprice, bgTotal, bgPastel, anio, onOpenModalTableItems}) => {
  const { dataCuentasBalancexFecha: dataCuentasPorPagar, obtenerCuentasBalancexFecha:ObtenerdataCuentasPorPagar } = useFlujoCaja()
  const { dataCuentasBalancexFecha: dataCuentasPorCobrar, obtenerCuentasBalancexFecha:ObtenerdataCuentasPorCobrar } = useFlujoCaja()
  useEffect(() => {
    ObtenerdataCuentasPorPagar(id_enterprice, anio, 'PorPagar')
    ObtenerdataCuentasPorCobrar(id_enterprice, anio, 'PorCobrar')
  }, [id_enterprice, fechas])


  const dataAlter = fechas.map((f, index, array)=>{
      const cuentasPagar = dataCuentasPorPagar.flatMap(e=>e.items)
      const cuentasCobrar = dataCuentasPorCobrar.flatMap(e=>e.items)
      
      return {
          ...f,
          // items: conceptos.flatMap(grupo => grupo.items).filter(i=>i.mes===f.mes && i.anio===f.anio),
          mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
          cuentasCobrar: cuentasCobrar.filter((c)=>c.anio==f.anio&&c.mes==f.mes),
          montoCuentasCobrar: cuentasCobrar.filter((c)=>c.anio==f.anio&&c.mes==f.mes).reduce((total, item)=>item.montoTotal+total,0),
          montoCuentasPagar: cuentasPagar.filter((c)=>c.anio==f.anio&&c.mes==f.mes).reduce((total, item)=>item.montoTotal+total,0),
          cuentasPagar: cuentasPagar.filter((c)=>c.anio==f.anio&&c.mes==f.mes)
      }
    })
    
  console.log({dataCuentasPorPagar, dataCuentasPorCobrar, dataAlter});

  return (
    <>
    <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
      <thead>
        <tr>
          <th style={{width: '500px'}} className={`fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_enterprice}-white text-black`}></th>
          {
            dataAlter.map(f=>{
              return (
                <React.Fragment key={`${f.mesStr}`}>
                <td className={`text-center border-black ${bgTotal}`} style={{width: '240px'}}>{f.mesStr}</td>
                </React.Fragment>
              )
            })
          }
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={`sticky-td-${id_enterprice} border-left-10 border-right-10 ${bgTotal}`}>CUENTAS POR PAGAR</td>
          {
            dataAlter.map(f=>{
              return (
                <React.Fragment key={`${f.mesStr}`}>
                <td className={`text-center border-black`} style={{width: '240px'}}><NumberFormatMoney amount={f.montoCuentasPagar}/></td>
                </React.Fragment>
              )
            })
          }
        </tr>
        <tr>
          <td className={`sticky-td-${id_enterprice} border-left-10 border-right-10 ${bgTotal}`}>CUENTAS POR COBRAR</td>
          {
            dataAlter.map(f=>{
              return (
                <React.Fragment key={`${f.mesStr}`}>
                <td className={`text-center border-black`} style={{width: '240px'}}><NumberFormatMoney amount={f.montoCuentasCobrar}/></td>
                </React.Fragment>
              )
            })
          }
        </tr>
        <tr>
          <td className={`sticky-td-${id_enterprice} border-left-10 border-right-10 ${bgTotal}`}>SALDO</td>
          {
            dataAlter.map(f=>{
              return (
                <React.Fragment key={`${f.mesStr}`}>
                <td className={`text-center border-black`} style={{width: '240px'}}>{f.mesStr}</td>
                </React.Fragment>
              )
            })
          }
        </tr>
      </tbody>
    </Table>
    {}
    </>
  )
  
} 
