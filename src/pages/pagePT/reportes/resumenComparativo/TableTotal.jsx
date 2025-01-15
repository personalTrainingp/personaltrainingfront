import React from 'react'
import { ItemTableTotal } from './ItemTableTotal'
import { Card, Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import config from '@/config'

export const TableTotal = ({avataresDeProgramas=[], arrayEstadistico=[], labelTotal, onOpenModalSOCIOS}) => {
    const estadisticas = arrayEstadistico.map(d=>{
        const cantidad = d.items?.length
        const cantidadEstadisticas =  arrayEstadistico?.reduce((acc, item)=>acc+item.items?.length, 0)
        const monto_total =  d.items?.reduce((acc, item)=>acc+item?.tarifa_monto, 0)
        const ticketMedio = (monto_total/cantidad)||0
        const porcentajeCantidad = (cantidad/cantidadEstadisticas)*100
        return {
            cantidad,
            monto_total,
            ticketMedio,
            porcentajeCantidad,
            items: d.items && [],
            propiedad: d.propiedad
        }
    })
    console.log({arrayEstadistico, estadisticas, avataresDeProgramas});
    
  return (
    <Card>
        <Card.Header className='d-flex align-self-center'>
            {/* <Card.Title>
                <h4>{d.name_pgm}</h4>
            </Card.Title> */}
            {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
            {/* <h1>TOTAL</h1> */}
            {avataresDeProgramas.map((d, index)=>{
                
                return(
                    <div>
                        <img className='m-4' src={`${config.API_IMG.LOGO}${d.name_image}`} height={d.height} width={d.width}/>
                        <span style={{fontSize: '50px'}}>{index===2?'':'+'}</span>
                    </div>
                )
            }
        )
            }
        {/* <div style={{fontSize: '120px'}}>TOTAL</div> */}
        </Card.Header>
        <Card.Body style={{paddingBottom: '1px !important'}}>
            <br/>

            <Table
                                // style={{tableLayout: 'fixed'}}
                                className="table-centered mb-0"
                                // hover
                                striped
                                responsive
                            >
                                <thead className='bg-primary fs-1'>
                                    <tr>
                                        <th className='text-white text-center' style={{width: '290px'}}>{labelTotal} </th>
                                        <th className='text-white text-center'>SOCIOS </th>
                                        <th className='text-white text-center'> TICKET MEDIO </th>
                                        <th className='text-white text-center'> <SymbolSoles isbottom={false} fontSizeS={'16px'}/> </th>
                                        <th className='text-white text-center'> % </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        estadisticas.map(p=>{
                                            
                                            return (
                                                <ItemTableTotal cantidad={p.cantidad} monto={p.monto_total} porcentajeCantidad={p.porcentajeCantidad} ticketMedio={p.ticketMedio} label={p.propiedad}  items={p.items} onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `${labelTotal} - ${p.propiedad}`)}/>
                                            )
                                        })
                                    }
                                </tbody>
                                <tr className='bg-primary'>
                                    <td>
                                        <li className=' text-center p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                                    </td>
                                    <td> 
                                        <li className=' text-center p-2'>
                                            <span className='fw-bold text-white fs-2'>{arrayEstadistico?.reduce((acc, curr) => acc + curr.items?.length, 0)}</span>
                                        </li>

                                    {/* <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                        {arrayEstadistico?.reduce((acc, curr) => acc + curr.items?.length, 0)}
                                    </span> */}
                                    </td>
                                    <td>
                                        <li className=' text-center p-2'><span className='fw-bold text-white fs-2'><NumberFormatMoney amount={estadisticas.reduce((acc, item)=>acc+item.ticketMedio,0)}/></span></li>
                                    </td>
                                    <td>
                                        <li className=' text-center p-2'><span className='fw-bold text-white fs-2'><NumberFormatMoney amount={estadisticas.reduce((acc, item)=>acc+item.monto_total,0)}/></span></li>
                                    </td>
                                    <td>
                                        <li className=' text-center p-2'><span className='fw-bold text-white fs-2'>{estadisticas.reduce((acc, item)=>acc+item.porcentajeCantidad,0).toFixed(2)}</span></li>
                                    </td>
                                    
                                </tr>
                            </Table>
        </Card.Body>
    </Card>
  )
}
