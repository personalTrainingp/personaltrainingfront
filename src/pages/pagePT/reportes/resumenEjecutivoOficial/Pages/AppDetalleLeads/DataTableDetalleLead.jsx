import React from 'react'
import { Button, Table } from 'react-bootstrap'
import {  NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';

export const DataTableDetalleLead = ({label, data, dataLeads, arrayFechas=[], corte, nombreCategoriaVenta, dataCuotaMetaDelMes=[]}) => {
    const fechaSeleccionada = '2026-1'
    const dataConMes = arrayFechas.map(arr=>{
        const dataFiltradaMes =  data?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        const dataCorte = data?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio).filter((el) => corte.dia.includes(el.dia))
        const dataMetaFiltradaMes =  dataCuotaMetaDelMes?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)

        const dataLeadMes1515 = dataLeads.leadsRed1515?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        const dataLeadMesCorte1515 = dataLeads.leadsRed1515?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio).filter((el) => corte.dia.includes(el.dia))
        const montoTotalLead1515 = dataLeadMes1515?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        const montoCorteLead1515 = dataLeadMesCorte1515?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        
        const dataLeadMes1514 = dataLeads.leadsRed1514?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        const dataLeadMesCorte1514 = dataLeads.leadsRed1514?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio).filter((el) => corte.dia.includes(el.dia))
        const montoTotalLead1514 = dataLeadMes1514?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        const montoCorteLead1514 = dataLeadMesCorte1514?.reduce((total, item) => total + (item?.montoTotal || 0), 0)

        const montoTotal_idorigen694 = dataFiltradaMes.reduce((total, dia) => {
            return total + dia.items
                .filter(item => item.id_origen === 694)
                .reduce((sum, item) => sum + (item.montoTotal || 0), 0);
        }, 0);

        const montoCorte_idorigen694 = dataCorte.reduce((total, dia) => {
            return total + dia.items
                .filter(item => item.id_origen === 694)
                .reduce((sum, item) => sum + (item.montoTotal || 0), 0);
        }, 0);
        const montoTotal_idorigen693 = dataFiltradaMes.reduce((total, dia) => {
            return total + dia.items
                .filter(item => item.id_origen === 693)
                .reduce((sum, item) => sum + (item.montoTotal || 0), 0);
        }, 0);

        const montoCorte_idorigen693 = dataCorte.reduce((total, dia) => {
            return total + dia.items
                .filter(item => item.id_origen === 693)
                .reduce((sum, item) => sum + (item.montoTotal || 0), 0);
        }, 0);
        const montoTotal_idorigen695 = dataFiltradaMes.reduce((total, dia) => {
            return total + dia.items
                .filter(item => item.id_origen === 695)
                .reduce((sum, item) => sum + (item.montoTotal || 0), 0);
        }, 0);

        const montoCorte_idorigen695 = dataCorte.reduce((total, dia) => {
            return total + dia.items
                .filter(item => item.id_origen === 695)
                .reduce((sum, item) => sum + (item.montoTotal || 0), 0);
        }, 0);

        // TODO
        const cantTotal_idorigen694 = dataFiltradaMes.reduce((total, dia) => {
    return total + dia.items.filter(item => item.id_origen === 694).length;
}, 0);

        const cantCorte_idorigen694 = dataCorte.reduce((total, dia) => {
    return total + dia.items.filter(item => item.id_origen === 694).length;
}, 0);
        const cantTotal_idorigen693 = dataFiltradaMes.reduce((total, dia) => {
    return total + dia.items.filter(item => item.id_origen === 693).length;
}, 0);

        const cantCorte_idorigen693 = dataCorte.reduce((total, dia) => {
    return total + dia.items.filter(item => item.id_origen === 693).length;
}, 0);
        const cantTotal_idorigen695 = dataFiltradaMes.reduce((total, dia) => {
    return total + dia.items.filter(item => item.id_origen === 695).length;
}, 0);

        const cantCorte_idorigen695 = dataCorte.reduce((total, dia) => {
    return total + dia.items.filter(item => item.id_origen === 695).length;
}, 0);


        const montoTotal = dataFiltradaMes?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        const montoCorte = dataCorte?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        const montoMeta = dataMetaFiltradaMes?.reduce((total, item) => total + (item?.meta || 0), 0)
        const montoTotalVentaMeta = montoTotal_idorigen693+montoTotal_idorigen694
        const montoCorteVentaMeta = montoCorte_idorigen693+montoCorte_idorigen694
        const montoCorteVentaTikTok = montoCorte_idorigen695
        const montoTotalVentaTiktok = montoTotal_idorigen695
        const cantTotalVentaMeta = cantTotal_idorigen694+cantTotal_idorigen693
        const cantCorteVentaMeta = cantCorte_idorigen694+cantCorte_idorigen693
        const cantTotalVentaTikTok = cantTotal_idorigen695
        const cantCorteVentaTikTok = cantCorte_idorigen695;
        return {
            ...arr,
            cantTotalVentaMeta, 
cantCorteVentaMeta,
cantTotalVentaTikTok,
cantCorteVentaTikTok,
            dataLeadMesCorte1515,
            dataLeadMesCorte1514,
            montoTotalVentaMeta,
            montoCorteVentaMeta,
            montoCorteVentaTikTok,
            montoTotalVentaTiktok,
            montoCorteLead1515,
            montoTotalLead1515,
            montoTotalLead1514,
            montoCorteLead1514,
            montoTotal,
            montoCorte,
            montoMeta,
            dataVentaCorte: dataCorte.map((d)=>{
                return {
                    ...d,
                    agrupadoxIdOrigen: agruparxIdOrigen(d.items)
                }
            }),
            dataVentaTotal: dataFiltradaMes.map((d)=>{
                return {
                    ...d,
                    agrupadoxIdOrigen: agruparxIdOrigen(d.items)
                }
            })
        }
    })
  return (
    <>
        <Table className="tabla-egresos" style={{width: '100%'}}  bordered>
            <thead>
                <tr className='bg-change'>
                    <th className='fs-2 bg-change' style={{width: '250px'}}>
                        <div className='text-change'>
                            {nombreCategoriaVenta}
                        </div>
                    </th>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <th className={`fs-2 text-center text-white ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} style={{width: '240px'}}>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('YYYY')}<br/>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>INVERSION META</td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-2 text-center  ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <div className='text-color-dolar'>
                                        $<NumberFormatMoney className='fs-1' amount={d.montoCorteLead1515}/>

                                    </div>
                                    </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            VENTA MEMBRESIAS META
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <NumberFormatMoney className='fs-1' amount={d.montoTotalVentaMeta}/>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td fs-3 text-white text-center' style={{backgroundColor: '#2196F3'}}>
                        <div className=''>
                            ROAS META
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td style={{backgroundColor: '#2195f358'}} className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <NumberFormatMoney className='fs-1' amount={d.montoTotalVentaMeta/(d.montoCorteLead1515*3.37)}/>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            CANTIDAD LEADS META
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center  ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <div className='fs-2'>
                                    {d.dataLeadMesCorte1515.length}
                                    </div>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            COSTO POR LEAD META
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <NumberFormatMoney className='fs-1' amount={(d.montoCorteLead1515/d.montoCorteVentaMeta)}/>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            COSTO ADQUISICION DE CLIENTES META
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <NumberFormatMoney className='fs-1' amount={(d.montoCorteVentaMeta/d.cantCorteVentaMeta)}/>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            CANTIDAD CLIENTES META
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-1 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    {d.cantCorteVentaMeta}
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            % CONVERSION META
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <NumberFormatMoney className='fs-1' amount={(d.cantCorteVentaMeta/d.dataLeadMesCorte1515.length)*100}/>
                                </td>
                            )
                        })
                    }
                </tr>
                {/* TODO: TIKTOK */}
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center' style={{borderTop: '4px solid black'}}>{'Inversion Tiktok'}</td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-2 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} style={{borderTop: '4px solid black'}}><NumberFormatMoney className='fs-1' amount={d.montoCorteLead1514}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            VENTA MEMBRESIAS TIKTOK
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <NumberFormatMoney className='fs-1' amount={d.montoCorteVentaTikTok}/>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td- fs-3 text-white text-center' style={{backgroundColor: '#2196F3'}}>
                        <div className=''>
                            ROAS TIKTOK
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} style={{backgroundColor: '#2196F3'}}>
                                    <NumberFormatMoney className='fs-1' amount={d.montoTotalVentaTiktok/(d.montoCorteLead1514)}/>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            CANTIDAD LEADS TIKTOK
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center  ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <div className='fs-2'>
                                    {d.dataLeadMesCorte1514.length}
                                    </div>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            COSTO POR LEAD TIKTOK
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <NumberFormatMoney className='fs-1' amount={(d.montoCorteLead1514/d.montoCorteVentaTikTok)}/>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            COSTO ADQUISICION DE CLIENTES TIKTOK
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <NumberFormatMoney className='fs-1' amount={(d.montoCorteVentaTiktok/d.cantCorteVentaTiktok)}/>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            CANTIDAD CLIENTES TIKTOK
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-1 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    {d.cantCorteVentaTiktok}
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white text-center'>
                        <div className=''>
                            % CONVERSION TIKTOK
                        </div>
                    </td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >
                                    <NumberFormatMoney className='fs-1' amount={(d.cantCorteVentaTiktok/d.dataLeadMesCorte1514.length)*100}/>
                                </td>
                            )
                        })
                    }
                </tr>
            </tbody>
        </Table>
    </>
  )
}

function agruparxIdOrigen(data) {
    const resultado = data.reduce((acc, item) => {
  let grupo = acc.find(g => g.id_origen === item.id_origen);

  if (!grupo) {
    grupo = {
      id_origen: item.id_origen,
      data: [],
      monto_total: 0,
    };
    acc.push(grupo);
  }

  grupo.data.push(item);
  grupo.monto_total += item.montoTotal;

  return acc;
}, []);
return resultado
}