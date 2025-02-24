import { NumberFormatMoney } from '@/components/CurrencyMask'
import config from '@/config'
import dayjs, { utc } from 'dayjs'
import React from 'react'
import { Table } from 'react-bootstrap';

dayjs.extend(utc);
export const ItemMembresia = ({item}) => {
  return (
    <div className='m-4 border border-2 rounded-5 p-3 d-flex justify-content-between'>
        <div  style={{width: '300px'}}>
                <img width={item.tb_ProgramaTraining.tb_image.width} height={90} src={`${config.API_IMG.LOGO}${item.tb_ProgramaTraining.tb_image.name_image}`}/>
                <h1 className='text-primary'>
                    {item.tb_semana_training.semanas_st} semanas
                </h1>
        </div>
        <div style={{width: '600px'}}>
            
            <span className='fw-bold fs-3'>
                {item.tb_semana_training.nutricion_st} nutricion / 3 nutricion
                <br/>
                {item.tb_semana_training.congelamiento_st} congelamiento / 4 congelamiento
            </span>
            <br/>
            <span className='fw-bold fs-5'>
                INICIO: {dayjs.utc(item.fec_inicio_mem).format('dddd DD [de] MMMM [del] YYYY')} A LAS {dayjs.utc(item.horario).format('hh:mm A') }
            </span>
            <br/>
            <span className='fw-bold fs-5'>
                FIN: {dayjs(item.fec_fin_mem).format('dddd DD [de] MMMM [del] YYYY')}
            </span>
            <br/>
        </div>
        <div className='align-content-center mx-2'>
            <span className='fw-bold fs-3'>
                S/. <NumberFormatMoney amount={item.tarifa_monto}/>
            </span>
        </div>
    </div>
  )
}
