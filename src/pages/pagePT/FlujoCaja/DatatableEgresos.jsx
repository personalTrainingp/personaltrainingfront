import React, { useEffect, useState } from 'react'
import { useFlujoCajaStore } from './hook/useFlujoCajaStore'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalDetallexCelda } from './ModalDetallexCelda'

export const DatatableEgresos = ({id_enterprice, anio}) => {
        const [dataModal, setdataModal] = useState({})
            const [isOpenModalDetallexCelda, setisOpenModalDetallexCelda] = useState(false)
    const  { obtenerGastosxANIO, dataGastosxANIO } = useFlujoCajaStore()
    useEffect(() => {
        obtenerGastosxANIO(anio, id_enterprice)
    }, [id_enterprice, anio])
    
    // Función para sumar los monto_total por cada mes
    function sumarMontosPorMes(datos, grupo) {
        const mesesSuma = [];
        // Inicializamos el arreglo de meses con los valores en cero
        for (let i = 1; i <= 12; i++) {
        mesesSuma.push({ mes: i, monto_total: 0 });
        }
    
        // Recorremos cada concepto y sumamos los montos por mes
        datos.forEach(concepto => {
        concepto.items.forEach(item => {
            const mesIndex = item.mes - 1; // Los índices de los meses van de 0 a 11
            mesesSuma[mesIndex].monto_total += item.monto_total;
        });
        });
    
        return { grupo, meses: mesesSuma };
    }
    const onCloseModalDetallexCelda = ()=>{
        setisOpenModalDetallexCelda(false)
        setdataModal([])
    }
    
    const onOpenModalDetallexCelda = (data)=>{
        setisOpenModalDetallexCelda(true)        
        setdataModal(data)
    }
  return (
    <>
    
                    {
                        dataGastosxANIO.map((g, i)=>{
                            
                            const resultadoFinal = sumarMontosPorMes(g.conceptos, g.grupo);
                            
                            return(
                                <div className='table-responsive' style={{width: '100%'}}>
                                    <Table
                                    striped
                                    className="table"
                                    style={{width: '100%'}}
                                    responsive
                                >
                                    <thead className="bg-primary">
                                        <tr>
                                        <th className='text-black fs-3' style={{width: '360px'}}><span className='p-1 rounded rounded-3'>{i+1}. {g.grupo}</span></th>
                                        <th className='text-white text-center'>ENERO</th>
                                        <th className='text-white text-center'>FEBRERO</th>
                                        <th className='text-white text-center'>MARZO</th>
                                        <th className='text-white text-center'>ABRIL</th>
                                        <th className='text-white text-center'>MAYO</th>
                                        <th className='text-white text-center'>JUNIO</th>
                                        <th className='text-white text-center'>JULIO</th>
                                        <th className='text-white text-center'>AGOSTO</th>
                                        <th className='text-white text-center'>SEPTIEMBRE</th>
                                        <th className='text-white text-center'>OCTUBRE</th>
                                        <th className='text-white text-center'>NOVIEMBRE</th>
                                        <th className='text-white text-center'>DICIEMBRE</th>
                                        <th className='text-white text-center'>TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            g.conceptos.map((c, index)=>{
                                                const monto_suma_total =  []
                                                return (
                                                <tr>
                                                    <td className='fw-bold fs-4' ><div className=''>{index+1}. {c.concepto}</div></td>
                                                    <td className='text-center'><div className={`cursor-text-primary ${c.items[0].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[0], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[0].monto_total}/></div></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[1].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[1], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[1].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[2].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[2], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[2].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[3].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[3], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[3].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[4].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[4], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[4].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[5].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[5], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[5].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[6].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[6], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[6].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[7].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[7], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[7].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[8].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[8], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[8].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[9].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[9], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[9].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[10].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[10], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[10].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary ${c.items[11].monto_total<=0?'text-danger':'text-black'}`} onClick={()=>onOpenModalDetallexCelda({...c.items[11], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[11].monto_total}/></span></td>
                                                    <td className='text-center'><span className={`cursor-text-primary`} onClick={()=>onOpenModalDetallexCelda({...c.items[12], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={
                                                                                                            c.items[0].monto_total+
                                                                                                            c.items[1].monto_total+
                                                                                                            c.items[2].monto_total+
                                                                                                            c.items[3].monto_total+
                                                                                                            c.items[4].monto_total+
                                                                                                            c.items[5].monto_total+
                                                                                                            c.items[6].monto_total+
                                                                                                            c.items[7].monto_total+
                                                                                                            c.items[8].monto_total+
                                                                                                            c.items[9].monto_total+
                                                                                                            c.items[10].monto_total+
                                                                                                            c.items[11].monto_total}/></span></td>
                                                </tr>
                                            )
                                            }
                                            )
                                        }
                                        <tr>
                                            <td className='fw-bolder h4'>TOTAL</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[0].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[1].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[2].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[3].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[4].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[5].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[6].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[7].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[8].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[9].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[10].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[11].monto_total}/>}</td>
                                            <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={
                                                                                                    resultadoFinal.meses[0].monto_total+
                                                                                                    resultadoFinal.meses[1].monto_total+
                                                                                                    resultadoFinal.meses[2].monto_total+
                                                                                                    resultadoFinal.meses[3].monto_total+
                                                                                                    resultadoFinal.meses[4].monto_total+
                                                                                                    resultadoFinal.meses[5].monto_total+
                                                                                                    resultadoFinal.meses[6].monto_total+
                                                                                                    resultadoFinal.meses[7].monto_total+
                                                                                                    resultadoFinal.meses[8].monto_total+
                                                                                                    resultadoFinal.meses[9].monto_total+
                                                                                                    resultadoFinal.meses[10].monto_total+
                                                                                                    resultadoFinal.meses[11].monto_total
                                                                                                    }/>}</td>
                                        </tr>
                                    </tbody>
                                    </Table>
                                </div>
                        )})
                    }
                        <ModalDetallexCelda id_enterprice={id_enterprice} obtenerGastosxANIO={()=>obtenerGastosxANIO(anio, id_enterprice)} data={dataModal} onShow={()=>setisOpenModalDetallexCelda(true)} onHide={onCloseModalDetallexCelda} show={isOpenModalDetallexCelda}/>
    </>
  )
}
