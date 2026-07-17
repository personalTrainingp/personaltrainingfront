import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore';
import { FechaCorte } from '@/components/RangeCalendars/FechaRange';
import { Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const AppDetalleProgramas = ({arrayFechas}) => {
    const { obtenerVentas, dataVentas,  } = useInformeEjecutivoStore()
    const { corte } = useSelector((e) => e.DATA);

    useEffect(() => {
        obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
    }, [])
    const dataAlterada = dataVentas.dataMembresias.map(m=>{
        return {
            ...m,
            items: (m.items)
        }
    })
    const dataConMes = arrayFechas.map(arr=>{
        const dataFiltradaMes =  dataAlterada?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        const montoTotal = dataFiltradaMes?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        const cantTotal = dataFiltradaMes.reduce((total, dia) => {
            return total + (dia.items ?? []).reduce((sub, venta) => {
                return sub + (venta.cantidadTotal ?? 0);
            }, 0);
        }, 0);
        return {
            ...arr,
            items: dataFiltradaMes,
            montoTotal,
            cantTotal: cantTotal,
        }
    })
    const tablaProgramas = generarTablaProgramas(dataConMes);
  return (
    <div>
        <FechaCorte corte={corte.corte} inicio={corte.inicio}/>
        <div className="table-responsive" style={{ width: '100%' }}>
            <Table className="tabla-egresos" style={{width: '100%'}}  bordered>
                <thead>
                    <tr>
                        <th className='bg-change' style={{width: '250px'}}></th>
                        {
                            dataConMes.map(d=>{
                                return (
                                    <th  className={`fs-2 text-center bg-change text-black ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} style={{width: '240px'}}>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('YYYY')}<br/>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')}</th>
                                )
                            })
                        }
                        <th className='bg-change fs-2 text-center' style={{width: '250px'}}>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tablaProgramas.map((programa)=>(
                        <tr key={programa.id_pgm}>

                            <td className='sticky-td-598 fs-3 text-white'>{programa.nombre}</td>

                            {
                                dataConMes.map((mes)=>{
                                    const key = `${mes.anio}-${mes.mes}`;
                                    const dato = programa.meses[key] ?? {
                                        cantidad:0,
                                        monto:0
                                    };
                                    return (
                                        <td
                                            key={key}
                                            className="text-center"
                                        >
                                            <div className='fs-3'>{dato.cantidad}</div>
                                            <div><NumberFormatMoney amount={dato.monto}/></div>
                                        </td>
                                    );
                                })
                            }

                            <td className="text-center">
                                <div className='fs-3'>{programa.totalCantidad}</div>
                                <div><NumberFormatMoney amount={programa.totalMonto}/></div>
                            </td>

                        </tr>
                        ))
                        }
                        <tr>
                            <td className='sticky-td-598 fs-3 text-white'>TOTAL</td>
                            {
                                dataConMes.map(d=>{
                                    return (
                                        <td className={`fs-2 text-center text-black`} style={{width: '240px'}}>
                                            <div className='fs-3'>
                                                {d.cantTotal}
                                            </div>
                                            <div>
                                                <NumberFormatMoney amount={d.montoTotal}/>
                                            </div>
                                        </td>
                                    )
                                })
                            }
                        </tr>
                </tbody>
            </Table>
        </div>
    </div>
  )
}

function generarTablaProgramas(dataConMes = []) {
    const programas = {};

    dataConMes.forEach((mes) => {
        const keyMes = `${mes.anio}-${mes.mes}`;

        mes.items.forEach((dia) => {
            dia.items.forEach((venta) => {
                const id = venta.id_pgm;
                const nombre =
                    venta.detalle_membresias?.[0]?.tb_ProgramaTraining?.name_pgm ??
                    `Programa ${id}`;

                if (!programas[id]) {
                    programas[id] = {
                        id_pgm: id,
                        nombre,
                        totalMonto: 0,
                        totalCantidad: 0,
                        meses: {}
                    };
                }

                if (!programas[id].meses[keyMes]) {
                    programas[id].meses[keyMes] = {
                        monto: 0,
                        cantidad: 0
                    };
                }

                programas[id].meses[keyMes].monto += venta.montoTotal;
                programas[id].meses[keyMes].cantidad += venta.cantidadTotal;

                programas[id].totalMonto += venta.montoTotal;
                programas[id].totalCantidad += venta.cantidadTotal;
            });
        });
    });

    return Object.values(programas);
}