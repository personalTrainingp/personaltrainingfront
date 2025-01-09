import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'
import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { ModalDetalleTable } from './ModalDetalleTable'
import { Table } from 'react-bootstrap'
function agruparPorMes(datos) {
    return datos.reduce((acumulador, item) => {
        // Extraemos el mes y el año de la fecha
        const partesFecha = item.fecha.split('/');
        const mesAnio = `${partesFecha[1]}/${partesFecha[2]}`; // Formato MM/YYYY

        // Verificamos si ya existe un grupo para este mes y año
        let grupo = acumulador.find(grupo => grupo.mesAnio === mesAnio);

        if (!grupo) {
            // Si no existe el grupo, lo creamos
            grupo = { mesAnio, dolares_total: 0, items: [] };
            acumulador.push(grupo);
        }

        // Actualizamos el total de dólares y agregamos el item al grupo
        grupo.dolares_total += item.dolares;
        grupo.items.push(item);

        return acumulador;
    }, []);
}

export const DataTable = ({dat}) => {
    const [isOpenModalDetalle, setisOpenModalDetalle] = useState(false)
    const onOpenModalDetalle = ()=>{
        setisOpenModalDetalle(true)
    }
    const onCloseModalDetalle = ()=>{
        setisOpenModalDetalle(false)
    }
  return (
    <>
    <Button className='fs-2' label='VER DETALLE' onClick={onOpenModalDetalle} text/>
    <ModalDetalleTable dae={dat} show={isOpenModalDetalle} onHide={onCloseModalDetalle}/>
    <Table
                                                                // style={{tableLayout: 'fixed'}}
                                                                className="table-centered mb-0 fs-3"
                                                                // hover
                                                                striped
                                                                // responsive
                                                            >
                                                                <thead className="bg-primary">
                                                                    <tr>
                                                                        <th className='text-white p-2 py-2'>FECHA</th>
                                                                        <th className='text-white p-2 py-2' 
                                                                        >
                                                                            DOLARES
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        agruparPorMes(dat).map(d=>{
                                                                            return (
                                                                                <tr>
                                                                                    <td>
                                                                                        <span className='text-primary fw-bold'>{dayjs(d.mesAnio, 'MM/YYYY').format('MMMM YYYY')}</span>
                                                                                        {/* <span className='fw-boldd'>{dayjs(d.fecha, 'DD/MM/YYYY').format(' [DE] MMMM [DEL] YYYY')}</span> */}
                                                                                    </td>
                                                                                    {/* <td>{d.metodo_pago}</td> */}
                                                                                    <td><SymbolDolar numero={<NumberFormatMoney amount={d.dolares_total}/>}/> </td>
                                                                                </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                </tbody>
                                                                        <tr className='bg-primary text-white'>
                                                                                    <td>
                                                                                        <div className='text-white p-3 fs-2 fw-bold'>
                                                                                            TOTAL
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span className='text-white fs-2 fw-bold'>
                                                                                        <SymbolDolar numero={<NumberFormatMoney amount={dat.reduce((total, item) => total + (item?.dolares || 0), 0)}/>}/> 
                                                                                        </span>
                                                                                        </td>
                                                                                </tr>
                                                            </Table>
    </>
  )
}
