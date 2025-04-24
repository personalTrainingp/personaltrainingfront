
import React, { useState } from 'react';
import { FormatoDateMask, FormatoTimeMask, MoneyFormatter } from '../CurrencyMask';
import config from '@/config';
import dayjs from 'dayjs';

export const ItemVentaMembresia = ({e}) => {
    
  return (
            
    <div className="container">
        
        <table className="table font-14">
                    <thead>
                        <tr>
                            <th className="bg-light p-1">
                                <span className=" text-uppercase">PROGRAMA</span>
                            </th>
                            <th className="bg-light p-1">
                                <span className=" text-uppercase">PRECIO</span>
                            </th>
                            <th className="bg-light p-1">
                                <div className=" text-uppercase">CONTRATO</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-0">
                                <div>
                                    {e.tb_ProgramaTraining.name_pgm} / {e.tb_semana_training.semanas_st} SEMANAS 
                                </div>
                                <div>
                                    {e.tb_semana_training.nutricion_st} NUTRICION / {e.tb_semana_training.congelamiento_st} CONGELAMIENTO
                                </div>
                                
												<span className="text-muted font-weight-normal d-block">
													Inicio:{' '}
													{FormatoDateMask(
														e.fec_inicio_mem,
														'dddd D [de] MMMM [del] YYYY'
													)}{' '}
													a las{' '}
                                                    {e.horario}
												</span>
                            </td>
                            <td className="border-0">
                                    {<MoneyFormatter amount={e.tarifa_monto} />}
                            </td>
                            <td className="border-0">
                                {
                                    e.contrato_x_serv?
                                    <a  href={`${config.API_IMG.FILE_CONTRATOS_CLI}${e.contrato_x_serv?.name_image}`} style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontSize: '15px'}}>CONTRATO</a>
                                    :<span className='text-primary'>SIN CONTRATO</span>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
</div>
  )
}
