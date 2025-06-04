import React, { useEffect, useState } from 'react'
import { useFlujoCajaStore } from './hook/useFlujoCajaStore'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalDetallexCelda } from './ModalDetallexCelda'
import { useDispatch } from 'react-redux'
import { onSetViewSubTitle } from '@/store'

export const DatatableEgresos = ({id_enterprice, anio, nombre_empresa, background}) => {
        const [dataModal, setdataModal] = useState({})
            const [isOpenModalDetallexCelda, setisOpenModalDetallexCelda] = useState(false)
    const  { obtenerGastosxANIO, dataGastosxANIO } = useFlujoCajaStore()
    const dispatch = useDispatch()
    useEffect(() => {
        obtenerGastosxANIO(anio, id_enterprice)
    }, [id_enterprice, anio])
    useEffect(() => {
                dispatch(onSetViewSubTitle(nombre_empresa))
    }, [nombre_empresa])
    
    
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
                            <Table
                            striped
                            className="table-centered mb-0"
                            // hover
    
                            responsive
                        >
                            <thead className={`${background}`}>
                                <tr>
                                <th className='text-black fs-1'><span className='p-1 rounded rounded-3' style={{width: '360px'}}>{i+1}. {g.grupo}</span></th>
                                <th className='text-white text-center p-1 fs-1'>ENERO <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>FEBRERO <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>MARZO <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>ABRIL <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>MAYO <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>JUNIO <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>JULIO <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>AGOSTO <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>SEPTIEMBRE <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>OCTUBRE <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>NOVIEMBRE <span className='w-100 float-end'></span></th>
                                <th className='text-white text-center p-1 fs-1'>DICIEMBRE <span className='w-100 float-end'></span></th> 
                            {/* 
                                */}
                                <th className='text-center p-1 fs-1 text-black'>TOTAL <span className='w-100 float-end'></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    g.conceptos.map((c, index)=>(
                                        <tr>
                                            <td className='fw-bold fs-2'><div style={{width: '450px'}}>{index+1}. {c.concepto}</div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[0], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[0].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[1], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[1].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[2], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[2].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[3], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[3].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[4], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[4].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[5], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[5].monto_total}/></div></td>
                                             <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[6], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[6].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[7], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[7].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[8], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[8].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[9], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[9].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[10], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[10].monto_total}/></div></td>
                                            <td className='text-center fs-2'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[11], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[11].monto_total}/></div></td> 
                                        {/* 
                                           */}
                                            <td className='text-center fs-2'><div className='cursor-text-primary  fw-bold' onClick={()=>onOpenModalDetallexCelda({...c.items[12], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={
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
                                                                                                    c.items[11].monto_total}/></div></td>
                                        </tr>
                                    )
                                    )
                                }
                                <tr>
                                    <td className='fw-bolder fs-1'>TOTAL</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[0].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[1].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[2].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[3].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[4].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[5].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[6].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[7].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[8].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[9].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[10].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[11].monto_total}/>}</td>
                                {/* 
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[6].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[7].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[8].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[9].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[10].monto_total}/>}</td>
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={resultadoFinal.meses[11].monto_total}/>}</td> */}
                                    <td className='text-center fw-bolder fs-1'>{<NumberFormatMoney amount={
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
                        )})
                    }
                        <ModalDetallexCelda data={dataModal} onHide={onCloseModalDetallexCelda} show={isOpenModalDetallexCelda}/>
    </>
  )
}
