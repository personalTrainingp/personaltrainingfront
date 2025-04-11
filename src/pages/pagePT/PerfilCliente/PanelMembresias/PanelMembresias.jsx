import React, { useEffect, useState } from 'react'
import { ItemMembresia } from './ItemMembresia'
import { useComprasStore } from '../useComprasStore'
import { onSetViewSubTitle } from '@/store'
import { useDispatch } from 'react-redux'
import { Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import { ModalDetalleMembresia } from './ModalDetalleMembresia'

export const PanelMembresias = ({id_cli}) => {
    const { obtenerMembresiasxCli, dataMembresias } = useComprasStore()
    const [isOpenModalDetalleMembresia, setisOpenModalDetalleMembresia] = useState(false)
    const [dataRow, setdataRow] = useState({})
    const dispatch = useDispatch()
    useEffect(() => {
        obtenerMembresiasxCli(id_cli)
    }, [])
    useEffect(() => {
        dispatch(onSetViewSubTitle('MEMBRESIAS'))
    }, [1])
    const onOpenModalDetalleMembresia = (row)=>{
        setisOpenModalDetalleMembresia(true)
        setdataRow(row)
    }
    const onCloseModalDetalleMembresia = ()=>{
        setisOpenModalDetalleMembresia(false)
    }
  return (
    <div>
        <Table
        // style={{tableLayout: 'fixed'}}
        className="table-centered mb-0"
        // hover
        striped
        responsive
    >
        
        <thead className="bg-primary">
            <tr>
                {/* <th className='text-white p-2 py-2'>FECHA DE VENTA</th> */}
                <th className='text-white p-2 py-2'>PROGRAMA / SEMANAS</th>
                <th className='text-white p-2 py-2'>FECHA INICIO</th>
                <th className='text-white p-2 py-2'>FECHA FIN</th>
                <th className='text-white p-2 py-2'></th>
            </tr>
        </thead>
        <tbody>
        {
            dataMembresias?.map((f)=>{
                const fecha_venta = dayjs.utc(f.fecha_venta).format('dddd DD [de] MMMM [del] YYYY')
                const detalle_ventamembresia = f.detalle_ventaMembresia[0];
                const programa = detalle_ventamembresia.tb_ProgramaTraining===null?'SIN DEFINIR':detalle_ventamembresia.tb_ProgramaTraining.name_pgm
                const fecha_inicio = dayjs.utc(detalle_ventamembresia.fec_inicio_mem).format('dddd DD [de] MMMM [del] YYYY')
                const fecha_fin = dayjs(detalle_ventamembresia.fec_fin_mem).format('dddd DD [de] MMMM [del] YYYY')
                const semanas_vendidas = detalle_ventamembresia.tb_semana_training?.semanas_st
                return (
                    <tr key={`${programa}-${fecha_venta}`}>
                            {/* <td className='fs-3'>{fecha_venta}</td> */}
                            <td className='fs-3'>
                                <span>
                                    {programa} / {semanas_vendidas} SEMANAS
                                </span>
                                <br/>
                                <span>
                                    3 NUTRI / 1 CONG
                                </span>
                            </td>
                            <td className='fs-3'>{fecha_inicio}</td>
                            <td className='fs-3'>{fecha_fin}</td>
                            <td className='fs-4 underline text-primary cursor-pointer' onClick={()=>onOpenModalDetalleMembresia(f)}>DETALLE</td>
                    </tr>
                )
            })
        }
        </tbody>
    </Table>
    {
        isOpenModalDetalleMembresia && 
        <ModalDetalleMembresia dataRow={dataRow} show={isOpenModalDetalleMembresia} onHide={onCloseModalDetalleMembresia}/>
    }
    </div>
  )
}
