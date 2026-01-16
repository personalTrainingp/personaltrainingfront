import React, { useEffect, useState } from 'react'
import { useComprasStore } from '../useComprasStore'
import dayjs from 'dayjs'
import { ModalDetalleMembresia } from './ModalDetalleMembresia'
import { Image } from 'primereact/image'
import config from '@/config'
import { useDetalleMembresiaStore } from './useDetalleMembresiaStore'

export const PanelMembresias = ({id_cli}) => {
    const { obtenerMembresiasxCli, dataMembresias } = useComprasStore()
    const { dataSeguimientos, obtenerSeguimientosxIdCli } = useDetalleMembresiaStore()
    const [isOpenModalDetalleMembresia, setisOpenModalDetalleMembresia] = useState(false)
    const [dataRow, setdataRow] = useState({})
    useEffect(() => {
        obtenerMembresiasxCli(id_cli)
        obtenerSeguimientosxIdCli(id_cli)
    }, [id_cli])
    const onOpenModalDetalleMembresia = (row)=>{
        setisOpenModalDetalleMembresia(true)
        setdataRow(row)
    }
    const onCloseModalDetalleMembresia = ()=>{
        setisOpenModalDetalleMembresia(false)
    }
  return (
    <div>
    {
            dataMembresias?.map((f)=>{
                const fecha_venta = dayjs.utc(f.fecha_venta).format('dddd DD [de] MMMM [del] YYYY')
                const detalle_ventamembresia = f.detalle_ventaMembresia[0];
                const programa = detalle_ventamembresia.tb_ProgramaTraining===null?'SIN DEFINIR':detalle_ventamembresia.tb_ProgramaTraining.name_pgm
                const Imgprograma = detalle_ventamembresia.tb_ProgramaTraining===null?'SIN DEFINIR':detalle_ventamembresia.tb_ProgramaTraining?.tb_image?.name_image
                const fecha_inicio = dayjs.utc(detalle_ventamembresia.fec_inicio_mem).format('dddd DD [de] MMMM [del] YYYY')
                const fecha_fin = dayjs(detalle_ventamembresia.fec_fin_mem).format('dddd DD [de] MMMM [del] YYYY')
                const semanas_vendidas = detalle_ventamembresia.tb_semana_training?.semanas_st
                return (
                    <div key={`${programa}-${fecha_venta}`} className='m-auto shadow-3 border-1 rounded-1 d-flex p-2'>
                        <div style={{width: '25%'}} className='p-2'>
                            <Image src={`${config.API_IMG.LOGO}${Imgprograma}`} width='100%'/>
                            <span className='fw-bold fs-4 d-flex flex-column'>
                                <span>
                                    {programa} / {semanas_vendidas} SEMANAS
                                </span>
                            </span>
                        </div>
                        <div style={{width: '75%'}} className='d-flex flex-column'>
                            <span>
                                FECHA DE VENTA: <strong>{fecha_venta}</strong>
                            </span>
                            <span>
                                FECHA DE INICIO: <strong>{fecha_inicio}</strong>
                            </span>
                            <span>
                                FECHA DE FIN: <strong>{fecha_fin}</strong>
                            </span>
                            <span>
                                NUTRICION: <strong>{detalle_ventamembresia.tb_semana_training.nutricion_st}</strong>
                            </span>
                            <span>
                                CONGELAMIENTO: <strong>{detalle_ventamembresia.tb_semana_training.congelamiento_st}</strong>
                            </span>
                        </div>
                            <td className='fs-4 underline text-primary cursor-pointer' onClick={()=>onOpenModalDetalleMembresia(f)}>DETALLE</td>
                    </div>
                )
            })
        }
    {
        isOpenModalDetalleMembresia && 
        <ModalDetalleMembresia dataRow={dataRow} show={isOpenModalDetalleMembresia} onHide={onCloseModalDetalleMembresia}/>
    }
    </div>
  )
}
