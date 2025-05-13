import React from 'react'
import { ItemTableTotal } from './ItemTableTotal'
import { Card, Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import config from '@/config'
import { useGrouped } from './hooks/useGrouped'
import { FormatTable } from './Component/FormatTable'
import { GrafPie } from './GrafPie'

export const TableTotal = ({data, agruparPorSocios, IsVentaCero, isCanje, isTime, titleH1, isNeedGenere, labelTicketMedio='Ticket medio', avataresDeProgramas=[], arrayEstadistico=[], labelTotal, onOpenModalSOCIOS}) => {
    const { agruparPorSexo } = useGrouped()
    const estadisticas = arrayEstadistico.map(d=>{
        // console.log(d, "holahola");
        
        const arrayGeneral = arrayEstadistico.map(f=>f.items).flat()
        const cantidad = d.items?.length
        const cantidadEstadisticas =  arrayEstadistico?.reduce((acc, item)=>acc+item.items?.length, 0)
        const sumaMontoTotal =  arrayGeneral.reduce((acc, item)=>acc+item?.tarifa_monto, 0)
        const monto_total =  d.items?.reduce((acc, item)=>acc+item?.tarifa_monto, 0)
        const ticketMedio = (monto_total/cantidad)||0
        const porcentajeCantidad = (cantidad/cantidadEstadisticas)*100
        const porcentajeMonto = (monto_total/sumaMontoTotal)*100
        const agrupadoPorSexo = agruparPorSexo(d.items)
        // console.log(agrupadoPorSexo);
        return {
            pFem: agrupadoPorSexo[0].items,
            pMasc: agrupadoPorSexo[1].items,
            cantidad,
            monto_total,
            ticketMedio,
            porcentajeCantidad,
            porcentajeMonto,
            items: d.items || [],
            propiedad: d.propiedad
        }
    }).sort((a,b)=>b.monto_total-a.monto_total).map((grupo, index, array) => {
        return [
        { header: labelTotal, value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
        { header: "socios",  value: grupo.cantidad, tFood: grupo.cantidad },
        { header: "% socios", isSummary: true, value: '', items: grupo.items, tFood: '' },
            ]
        }
        )
        const result = data?.map(subArray => {
            const firstObj = subArray[0]; // Tomar solo el primer objeto de cada subarray
            return {
              val: firstObj?.items?.length || 0, // Si 'items' no existe, devuelve 0
              label: firstObj?.value || '' // Si 'value' no existe, devuelve cadena vacía
            };
          });

    //     const formattedData = data?.map(group => {
    //         const propiedadObj = group.find(item => item.isPropiedad);
    //         return {
    //           label: propiedadObj?.value,
    //           val: propiedadObj?.items?.length
    //         };
    //       });
    // console.log({estadisticas, labelTotal, data}, "arraaaaa");
    
    
    // const estadisticasCanje = arrayEstadistico.map(d=>{
    //     // console.log(d, "holahola");
        
    //     const arrayGeneral = arrayEstadistico.map(f=>f.items).flat()
    //     const cantidad = d.items?.length
    //     const cantidadEstadisticas =  arrayEstadistico?.reduce((acc, item)=>acc+item.items?.length, 0)
    //     const sumaMontoTotal =  arrayGeneral.reduce((acc, item)=>acc+item?.tarifa_monto, 0)
    //     const monto_total =  d.items?.reduce((acc, item)=>acc+item?.tarifa_monto, 0)
    //     const ticketMedio = (monto_total/cantidad)||0
    //     const porcentajeCantidad = (cantidad/cantidadEstadisticas)*100
    //     const porcentajeMonto = (monto_total/sumaMontoTotal)*100
    //     const agrupadoPorSexo = agruparPorSexo(d.items)
    //     console.log(d.items, agruparxCliente(d.items));
        
    //     // console.log(agrupadoPorSexo);
    //     return {
    //         pFem: agrupadoPorSexo[0].items,
    //         pMasc: agrupadoPorSexo[1].items,
    //         cantidad,
    //         monto_total,
    //         ticketMedio,
    //         cantidadCanje: agruparxCliente(d.items).length||[].length,
    //         porcentajeCantidad,
    //         porcentajeMonto,
    //         items: d.items || [],
    //         propiedad: d.propiedad
    //     }
    // }).sort((a,b)=>b.monto_total-a.monto_total)
    /**
     * 
     * .sort((a,b)=>{
        if (a.cantidad === b.cantidad) {
            // Si las cantidades son iguales, ordenar por monto
            return b.monto_total-a.monto_total;
          }
          // Ordenar por cantidad
          return b.cantidad-a.cantidad;
    })
     */
    const dataGrafico = data?.map(group=>{
        const propiedadObj = group.find(item => item.isPropiedad);
                    return {
                        label: propiedadObj?.value,
                        val: propiedadObj?.items?.length
                    };
    })
  return (
    <Card>
        <div className='text-center'>
            {titleH1}
        </div>
        <Card.Header className='d-flex align-self-center'>
            {avataresDeProgramas.map((d, index)=>{
                
                return(
                    <div className='d-flex justify-content-center align-items-center'>
                        <img className='mx-4' src={`${config.API_IMG.LOGO}${d.name_image}`} height={d.height} width={d.width}/>
                        <span className='mb-2' style={{fontSize: '50px'}}>
                            {index===2?'':'+'}
                        </span>
                    </div>
                )
            }
        )
            }
        </Card.Header>
        <Card.Body className='d-flex justify-content-center' style={{paddingBottom: '1px !important'}}>
            <br/>
        <div  style={{width: '100%'}}>
            <FormatTable data={data}/>
                                <GrafPie height={700} width={1000} data={result}/>
        </div>
        </Card.Body>
        {/* <GrafPie data={dataGrafico} height={800} width={800}/> */}
    </Card>
  )
}



const agruparxCliente = (data)=>{
    console.log(data, "dddddd 151");
    
    const groupedData = Object.values(
        data.reduce((acc, item) => {
          const nombres_socios = item.tb_ventum.id_cli;
          if (!acc[nombres_socios]) {
            acc[nombres_socios] = { nombres_socios, items: [] };
          }
          acc[nombres_socios].items.push(item);
          return acc;
        }, {})
      );
    return groupedData      
}












/**
 * 

<Table
                                // style={{tableLayout: 'fixed'}}
                                className="table-centered mb-0"
                                hover
                                striped
                            >
                                        {
                                            isNeedGenere? (
                                                <thead className='bg-primary fs-1'>
                                                <tr>
                                                    <th className='text-white text-center'></th>
                                                    <th className='text-white text-center' style={{width: '290px'}}>{labelTotal} </th>
                                                    {
                                                        !IsVentaCero && <th className='text-white text-center'> <SymbolSoles isbottom={false} fontSizeS={'16px'}/>  VENTA TOTAL </th>
                                                    }
                                                    <th className='text-white text-center'>SOCIOS </th>
                                                    <th className='text-white text-center'>FEM. </th>
                                                    <th className='text-white text-center'>MASC. </th>
                                                    {
                                                        !IsVentaCero &&<th className='text-white text-center'> % VENTA TOTAL</th>
                                                    }
                                                    <th className='text-white text-center'> % SOCIOS </th>
                                                    <th className='text-white text-center'>
                                                        TICKET MEDIO 
                                                        </th>
                                                </tr>
                                            </thead>
                                            ):(

                                                <thead className='bg-primary fs-1'>
                                                <tr>
                                                <th className='text-white text-center'></th>
                                                    <th className='text-white text-center' style={{width: '290px'}}>{labelTotal} </th>
                                                    {
                                                        !IsVentaCero &&
                                                        <th className='text-white text-center'> 
                                                            <SymbolSoles isbottom={false} fontSizeS={'16px'}/>  VENTA TOTAL 
                                                        </th>
                                                    }
                                                    <th className='text-white text-center'>SOCIOS </th>
                                                    {
                                                        !IsVentaCero &&
                                                        <th className='text-white text-center'> % VENTA TOTAL</th>
                                                    }
                                                    <th className='text-white text-center'> % SOCIOS </th>
                                                    {
                                                        !IsVentaCero &&
                                                    <th className='text-white text-center'>
                                                        TICKET MEDIO 
                                                        </th>

                                                    }
                                                </tr>
                                            </thead>
                                            )
                                        }
                                <tbody>
                                    {
                                        estadisticas.map((p, index)=>{
                                            
                                            return (
                                                <ItemTableTotal 
                                                index={index}
                                                IsVentaCero={IsVentaCero}
                                                isTime
                                                isNeedGenere={isNeedGenere}
                                                pFem={p.pFem.length}
                                                pMasc={p.pMasc.length}
                                                cantidad={p.cantidad} 
                                                monto={p.monto_total} 
                                                porcentajeCantidad={p.porcentajeCantidad} 
                                                porcentajeMonto={p.porcentajeMonto}
                                                ticketMedio={p.ticketMedio} 
                                                label={p.propiedad}  
                                                items={p.items} 
                                                onClick={()=>onOpenModalSOCIOS(p.items, avataresDeProgramas, `${labelTotal} - ${p.propiedad}`, isCanje)}
                                                />
                                            )
                                        })
                                    }
                                </tbody>
                                <tr className='bg-primary'>
                                    <td>
                                        <li className=' text-center list-unstyled p-2'><span className='fw-bold text-white' style={{fontSize: '40px'}}></span></li>
                                    </td>
                                    <td>
                                        <li className=' text-center list-unstyled p-2'><span className='fw-bold text-white' style={{fontSize: '40px'}}>TOTAL</span></li>
                                    </td>
                                    {
                                        !IsVentaCero && 
                                        <td>
                                            <li className=' text-center list-unstyled p-2'><span className='fw-bold text-white' style={{fontSize: '40px'}}><NumberFormatMoney amount={estadisticas.reduce((acc, item)=>acc+item.monto_total,0)}/></span></li>
                                        </td>
                                    }
                                    <td> 
                                        <li className=' text-center list-unstyled p-2'>
                                            <span className='fw-bold text-white' style={{fontSize: '40px'}}>{arrayEstadistico?.reduce((acc, curr) => acc + curr.items?.length, 0)}</span>
                                        </li>
                                    </td>
                                    {
                                        isNeedGenere && (
                                            <td> 
                                                <li className=' text-center list-unstyled p-2'>
                                                    <span className='fw-bold text-white' style={{fontSize: '40px'}}>{estadisticas.reduce((acc, item)=>acc+item.pFem.length,0)}</span>
                                                </li>
                                            </td>
                                        )
                                    }
                                    {
                                        isNeedGenere && (
                                                <td> 
                                                <li className=' text-center list-unstyled p-2'>
                                                    <span className='fw-bold text-white' style={{fontSize: '40px'}}>{estadisticas.reduce((acc, item)=>acc+item.pMasc.length,0)}</span>
                                                </li>
                                            </td>
                                        )
                                    }
                                    <td>
                                        <li className=' text-center list-unstyled p-2'><span className='fw-bold text-white' style={{fontSize: '40px'}}>{estadisticas.reduce((acc, item)=>acc+item.porcentajeCantidad,0).toFixed(2)}</span></li>
                                    </td>
                                    {
                                        !IsVentaCero &&
                                        <td>
                                            <li className=' text-center list-unstyled p-2'><span className='fw-bold text-white' style={{fontSize: '40px'}}>{estadisticas.reduce((acc, item)=>acc+item.porcentajeCantidad,0).toFixed(2)}</span></li>
                                        </td>
                                    }
                                    {
                                        !IsVentaCero && 
                                        <td>
                                            <li className=' text-center list-unstyled p-2'><span className='fw-bold text-white' style={{fontSize: '40px'}}><NumberFormatMoney amount={estadisticas.reduce((acc, item)=>acc+item.monto_total,0)/arrayEstadistico?.reduce((acc, curr) => acc + curr.items?.length, 0)}/></span></li>
                                        </td>
                                    }
                                    
                                </tr>
                            </Table>
 */