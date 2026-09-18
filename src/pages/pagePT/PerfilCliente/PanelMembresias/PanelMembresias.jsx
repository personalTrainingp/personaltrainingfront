import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { ModalDetalleMembresia } from './ModalDetalleMembresia'
import { Image } from 'primereact/image'
import config from '@/config'
import { useDetalleMembresiaStore } from './useDetalleMembresiaStore'
import sinImage from '@/assets/images/SinImage.jpg'

// Membresías tal como están en tb_seguimiento (SeguimientoOficial), identificadas por uid.
// fecha_vencimiento viene de tb_seguimiento (ya ajustada por congelamientos/regalos),
// a diferencia de fec_fin_mem que es la fecha original de la venta.
export const PanelMembresias = ({uid}) => {
    const { dataSeguimientos, obtenerSeguimientosxUid } = useDetalleMembresiaStore()
    const [isOpenModalDetalleMembresia, setisOpenModalDetalleMembresia] = useState(false)
    const [dataRow, setdataRow] = useState({})
    useEffect(() => {
        if(uid) obtenerSeguimientosxUid(uid)
    }, [uid])
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
            dataSeguimientos?.map((seg)=>{
                const venta = seg.venta;
                if(!venta) return null;
                const fecha_venta = dayjs.utc(venta.tb_ventum?.fecha_venta).format('dddd DD [de] MMMM [del] YYYY')
                const programa = venta.tb_ProgramaTraining===null?'SIN DEFINIR':venta.tb_ProgramaTraining?.name_pgm
                const nameImgPrograma = venta.tb_ProgramaTraining?.tb_image?.name_image
                const srcImgPrograma = nameImgPrograma ? `${config.API_IMG.LOGO}${nameImgPrograma}` : sinImage
                const fecha_inicio = dayjs.utc(venta.fec_inicio_mem).format('dddd DD [de] MMMM [del] YYYY')
                const fecha_fin = dayjs.utc(seg.fecha_vencimiento).format('dddd DD [de] MMMM [del] YYYY')
                const semanas_vendidas = venta.tb_semana_training?.semanas_st
                return (
                    <div key={seg.id} className='m-auto shadow-3 border-1 rounded-1 d-flex p-2'>
                        <div style={{width: '25%'}} className='p-2'>
                            <Image src={srcImgPrograma} width='100%'/>
                            <span className='fw-bold fs-4 d-flex flex-column'>
                                <span>
                                    {programa} / {semanas_vendidas} SEMANAS
                                </span>
                            </span>
                        </div>
                        <div style={{width: '75%'}} className='d-flex flex-column'>
                            <span>
                                DIA Y FECHA: <strong>{fecha_venta}</strong>
                            </span>
                            <span>
                                FECHA DE INICIO: <strong>{fecha_inicio}</strong>
                            </span>
                            <span>
                                FECHA DE FIN: <strong>{fecha_fin}</strong>
                            </span>
                            <span>
                                NUTRICION: <strong>{venta.tb_semana_training?.nutricion_st}</strong>
                            </span>
                            <span>
                                CONGELAMIENTO: <strong>{venta.tb_semana_training?.congelamiento_st}</strong>
                            </span>
                        </div>
                            <td className='fs-4 underline text-primary cursor-pointer' onClick={()=>onOpenModalDetalleMembresia({detalle_ventaMembresia: [venta]})}>DETALLE</td>
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
