import React, { useEffect } from 'react'
import { DataTableGastos } from '../GestGastos/DataTableGastos'
import { useSelector } from 'react-redux'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { TabPanel, TabView } from 'primereact/tabview'
import { MesxIgv } from './MesxIgv'
import { Table } from 'react-bootstrap'
import { generarMesYanio } from './generarMesYanio'
import { useOrdenCompra } from './useOrdenCompra'
const fecha = new Date()
const anioActual = fecha.getFullYear()
export const AppOrdenCompra = ({id_empresa}) => {
      const { dataView } = useSelector(e=>e.EGRESOS)
      const { dataGastosxFecha, dataIngresosxFecha, obtenerEgresosxFecha, obtenerIngresosxFecha } = useOrdenCompra()
      const ingresosVentas = dataIngresosxFecha.find(f=>f.id===112)?.gastos
      const ingresosExtraord = dataIngresosxFecha.find(f=>f.id===121)?.gastos
      useEffect(() => {
        obtenerIngresosxFecha(id_empresa, ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00'])
      }, [id_empresa])
      
      const dataAlter = generarMesYanio(new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date(`${anioActual}-12-31 15:45:47.6640000 +00:00`)).map(m=>{
        const igvCompras = agruparPorFechaComprobante(dataView.filter((f) => f.impuesto_igv === true)).filter(f=>f.fecha.anio===m.anio && f.fecha.mes===m.mes).map(m=>{return {monto_total: m.monto_total, len: m.items.length}})
        const igvVentas = agruparPorFechaVenta(ingresosVentas)?.filter(f=>f.fecha.anio===m.anio && f.fecha.mes===m.mes).map(m=>{return {monto_total: m.monto_total, len: m.items.length}})
        const Ventas = agruparPorFechaVenta(ingresosVentas)?.filter(f=>f.fecha.anio===m.anio && f.fecha.mes===m.mes).map(m=>{return {monto_total: m.monto_total, len: m.items.length}})
        const igvIngresosBolsa = agruparPorFecComprobante(ingresosExtraord)?.filter(f=>f.fecha.anio===m.anio && f.fecha.mes===m.mes).map(m=>{return {monto_total: m.monto_total, len: m.items.length}})
        return {
          montoSuma: igvCompras.reduce((total, item)=>item.monto_total+total, 0),
          igv: igvCompras,
          Ventas: Ventas,
          montoSumaVentas: Ventas.reduce((total, item)=>item.monto_total+total, 0),
          igvVentas,
          montoSumaIgvVentas: igvVentas.reduce((total, item)=>item.monto_total+total, 0),
          montoSumaingresosBolsa: igvIngresosBolsa.reduce((total, item)=>item.monto_total+total, 0),
          igvIngresosBolsa,
          ...m,
        }
      })
  return (
    <div>
          <div className="tab-scroll-container">
            <div style={{fontSize: '60px'}} className='text-black text-center'>IGV 2026</div>
            <TableAnio anio={2026} dataAlter={dataAlter} id_empresa={id_empresa}/>
            <div style={{fontSize: '60px'}} className='text-black text-center'>IGV 2025</div>
            <TableAnio anio={2025} dataAlter={dataAlter} id_empresa={id_empresa}/>
            <div style={{fontSize: '60px'}} className='text-black text-center'>IGV 2024</div>
            <TableAnio anio={2024} dataAlter={dataAlter} id_empresa={id_empresa}/>
          </div>
      {/* <TabView>
        <TabPanel header={'DATA'}>
        <div className='fs-2 text-change'>IGV ACUMULADO EN TOTAL: <NumberFormatMoney amount={dataView.filter((f) => f.impuesto_igv === true).reduce((total, item)=>item.monto+total, 0)-(dataView.filter((f) => f.impuesto_igv === true).reduce((total, item)=>item.monto+total, 0)/1.18)}/></div>
        <DataTableGastos sonCompras={true} id_empresa={id_empresa} />
        </TabPanel>
        <TabPanel header={'REPORTE POR MES'}>
          <div>
          </div>
        </TabPanel>
      </TabView> */}
    </div>
  )
}

const TableAnio = ({dataAlter, anio, id_empresa})=>{
  return (
    
            <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
              <thead>
                <tr>
                  <th style={{width: '200px'}} className={` text-break fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black text-center`}>MES <br/> AÑO </th>
                  {
                    generarMesYanio(new Date('2026-01-01 15:45:47.6640000 +00:00'), new Date('2026-12-31 15:45:47.6640000 +00:00')).map(m=>{
                      return (
                        <React.Fragment key={`${m.mesSTR}`}>
                          <td className={`text-center border-black bg-change fs-2 text-white`} style={{width: '250px'}}>{m.mesSTR}</td>
                          {/* <td className={`text-center border-black bg-change-pastel text-white`} style={{width: '90px'}}>MOV.</td> */}
                        </React.Fragment>
                      )
                    })
                  }
                  {/* <th className='text-center border-top-10 border-left-10 border-bottom-10' style={{width: '200px'}}>TOTAL <br/> ANUAL</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`fs-2 bg-change text-center text-white sticky-td-${id_empresa}`}>VENTAS</td>
                    {
                      dataAlter?.filter(f=>f.anio===anio).map(m=>{
                        return(
                          <React.Fragment key={`${m.mesSTR}`}>
                            <MesxIgv className={'text-center '} mes={m.mes} anio={m.anio} len={m.igvVentas[0]?.len} monto_acumulado={(m.montoSumaIgvVentas)}/>
                          </React.Fragment>
                        )
                      })
                    }
                </tr>
                <tr>
                  <td className={`fs-2 bg-change text-center text-white sticky-td-${id_empresa}`}>IGV VENTAS</td>
                    {
                      dataAlter?.filter(f=>f.anio===anio).map(m=>{
                        return(
                          <React.Fragment key={`${m.mesSTR}`}>
                            <MesxIgv className={'text-center text-change'} mes={m.mes} anio={m.anio} len={m.igvVentas[0]?.len} monto_acumulado={m.montoSumaIgvVentas-(m.montoSumaIgvVentas/1.18)}/>
                          </React.Fragment>
                        )
                      })
                    }
                </tr>
                <tr>
                  <td className={`fs-2 bg-change text-center text-white sticky-td-${id_empresa}`}>IGV COMPRAS</td>
                    {
                      dataAlter?.filter(f=>f.anio===anio).map(m=>{
                        return(
                          <React.Fragment key={`${m.mesSTR}`}>
                            <MesxIgv className={'text-ISESAC text-center'} mes={m.mes} anio={m.anio} len={m.igv[0]?.len} m={m} monto_acumulado={m.montoSuma-(m.montoSuma/1.18)}/>
                          </React.Fragment>
                        )
                      })
                    }
                </tr>
                <tr>
                  <td className={`fs-2 bg-change text-center text-white sticky-td-${id_empresa}`}>IGV GASTOS</td>
                    {
                      dataAlter?.filter(f=>f.anio===anio).map(m=>{
                        return(
                          <React.Fragment key={`${m.mesSTR}`}>
                            <MesxIgv className={'text-ISESAC text-center'} mes={m.mes} anio={m.anio} len={m.igv[0]?.len} m={m} monto_acumulado={0}/>
                          </React.Fragment>
                        )
                      })
                    }
                </tr>
                <tr>
                  <td className={`fs-2 bg-change text-center text-white sticky-td-${id_empresa}`}>IGV <br/>BOLSA</td>
                    {
                      dataAlter?.filter(f=>f.anio===anio).map(m=>{
                        return(
                          <React.Fragment key={`${m.mesSTR}`}>
                            <MesxIgv className={'text-ISESAC text-center'} mes={m.mes} anio={m.anio} len={m.igvIngresosBolsa[0]?.len} monto_acumulado={m.montoSumaingresosBolsa}/>
                          </React.Fragment>
                        )
                      })
                    }
                </tr>
                <tr>
                  <td className={`fs-2 bg-change text-center text-white sticky-td-${id_empresa}`}>TOTAL</td>
                    {
                      dataAlter?.filter(f=>f.anio===anio).map(m=>{
                        return(
                          <React.Fragment key={`${m.mesSTR}`}>
                            <MesxIgv mes={m.mes} anio={m.anio} m={m} monto_acumulado={(m.montoSumaIgvVentas-(m.montoSumaIgvVentas/1.18))-((m.montoSuma-(m.montoSuma/1.18))+(m.montoSumaingresosBolsa))}/>
                          </React.Fragment>
                        )
                      })
                    }
                </tr>
              </tbody>
            </Table>
  )
}


const agruparPorFechaComprobante = (data) => {
  const map = new Map();

  data?.forEach(item => {
    const fecha = new Date(item.fecha_comprobante);

    // const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const key = `${anio}-${mes}`;

    if (!map.has(key)) {
      map.set(key, {
        fecha: { mes, anio },
        monto_total: 0,
        items: []
      });
    }

    const grupo = map.get(key);

    grupo.monto_total += item.monto || 0;
    grupo.items.push(item);
  });

  // Convertir a array y ordenar por fecha
  return Array.from(map.values()).sort((a, b) => {
    const f1 = new Date(a.fecha.anio, a.fecha.mes - 1, a.fecha.dia);
    const f2 = new Date(b.fecha.anio, b.fecha.mes - 1, b.fecha.dia);
    return f1 - f2; // ascendente
  });
};

const agruparPorFecComprobante = (data) => {
  const map = new Map();

  data?.forEach(item => {
    const fecha = new Date(item.fec_comprobante);

    // const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const key = `${anio}-${mes}`;

    if (!map.has(key)) {
      map.set(key, {
        fecha: { mes, anio },
        monto_total: 0,
        items: []
      });
    }

    const grupo = map.get(key);

    grupo.monto_total += item.monto || 0;
    grupo.items.push(item);
  });

  // Convertir a array y ordenar por fecha
  return Array.from(map.values()).sort((a, b) => {
    const f1 = new Date(a.fecha.anio, a.fecha.mes - 1, a.fecha.dia);
    const f2 = new Date(b.fecha.anio, b.fecha.mes - 1, b.fecha.dia);
    return f1 - f2; // ascendente
  });
};

const agruparPorFechaVenta = (data) => {
  const map = new Map();

  data?.forEach(item => {
    const fecha = new Date(item.fecha_venta);

    // const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const key = `${anio}-${mes}`;

    if (!map.has(key)) {
      map.set(key, {
        fecha: { mes, anio },
        monto_total: 0,
        items: []
      });
    }

    const grupo = map.get(key);

    grupo.monto_total += item.monto || 0;
    grupo.items.push(item);
  });

  // Convertir a array y ordenar por fecha
  return Array.from(map.values()).sort((a, b) => {
    const f1 = new Date(a.fecha.anio, a.fecha.mes - 1, a.fecha.dia);
    const f2 = new Date(b.fecha.anio, b.fecha.mes - 1, b.fecha.dia);
    return f1 - f2; // ascendente
  });
};