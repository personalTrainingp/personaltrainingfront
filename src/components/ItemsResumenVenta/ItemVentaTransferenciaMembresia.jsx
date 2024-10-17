
import React, { useState } from 'react';
import { FormatoDateMask, FormatoTimeMask, MoneyFormatter } from '../CurrencyMask';

export const ItemVentaTransferenciaMembresia = ({e}) => {
    console.log(e);
    
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
                            {/* <td className="border-0">
                                <div>
                                    {e.tb_ProgramaTraining.name_pgm} | {e.tb_semana_training.semanas_st} SEMANAS | 
                                </div>
                                <div>
                                    {e.tb_semana_training.nutricion_st} NUTRICION | {e.tb_semana_training.congelamiento_st} CONGELAMIENTO
                                </div>
                                
												<span className="text-muted font-weight-normal d-block">
													Inicia:{' '}
													{FormatoDateMask(
														e.fec_inicio_mem,
														'dddd D [de] MMMM [del] YYYY'
													)}{' '}
													a las{' '}
													<FormatoTimeMask
														date={e.horario.trim()}
														format={'hh:mm A'}
													/>
												</span>
												<span className="text-muted font-weight-normal d-block">
													Finaliza:{' '}
													{FormatoDateMask(
														e.fec_fin_mem,
														'dddd D [de] MMMM [del] YYYY'
													)}
												</span>
                            </td> */}
                            <td className="border-0">
                                {/* {e.venta_transferencia[0]} */}
                            </td>
                            <td className="border-0">
                                    {<MoneyFormatter amount={e.tarifa_monto} />}
                            </td>
                            <td className="border-0">
                                <a style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontSize: '15px'}}>CONTRATO</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
</div>
  )
}
