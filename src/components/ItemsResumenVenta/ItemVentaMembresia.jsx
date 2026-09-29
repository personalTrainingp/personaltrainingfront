
import React, { useState } from 'react';
import { FormatoDateMask, FormatoTimeMask, MoneyFormatter } from '../CurrencyMask';
import config from '@/config';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// onEditarFechaInicio (opcional): async (idMembresia, 'YYYY-MM-DD') => { ok, msg, fecha_vencimiento }.
// Si se pasa, aparece un lápiz para cambiar la fecha de inicio (se actualiza la venta y el seguimiento).
export const ItemVentaMembresia = ({e, onEditarFechaInicio}) => {
    const fechaInicioActual = e.fec_inicio_mem ? String(dayjs.utc(e.fec_inicio_mem).format('YYYY-MM-DD')) : '';
    const [isEditandoInicio, setisEditandoInicio] = useState(false)
    const [nuevaFechaInicio, setnuevaFechaInicio] = useState(fechaInicioActual)
    const [isGuardandoInicio, setisGuardandoInicio] = useState(false)
    const [mensajeInicio, setmensajeInicio] = useState(null) // { tipo: 'error', texto }

    const onEditarInicio = () => {
        setnuevaFechaInicio(fechaInicioActual)
        setmensajeInicio(null)
        setisEditandoInicio(true)
    }
    const onGuardarInicio = async () => {
        if (!nuevaFechaInicio || nuevaFechaInicio === fechaInicioActual) {
            setisEditandoInicio(false)
            return
        }
        setisGuardandoInicio(true)
        const resultado = await onEditarFechaInicio(e.id, nuevaFechaInicio)
        setisGuardandoInicio(false)
        if (!resultado?.ok) {
            setmensajeInicio({ tipo: 'error', texto: resultado?.msg || 'No se pudo cambiar la fecha de inicio' })
            return
        }
        // El mensaje de éxito lo muestra quien recarga la venta (este componente se vuelve a montar)
        setisEditandoInicio(false)
    }
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
													{isEditandoInicio ? (
														<span className="d-inline-flex align-items-center gap-2">
															<input
																type="date"
																className="form-control form-control-sm d-inline-block w-auto"
																value={nuevaFechaInicio}
																onChange={(ev) => setnuevaFechaInicio(ev.target.value)}
																disabled={isGuardandoInicio}
															/>
															{isGuardandoInicio ? (
																<i className="pi pi-spin pi-spinner" />
															) : (
																<>
																	<i className="pi pi-check hover-text cursor-pointer text-success" title="Guardar" onClick={onGuardarInicio}></i>
																	<i className="pi pi-times hover-text cursor-pointer" title="Cancelar" onClick={() => setisEditandoInicio(false)}></i>
																</>
															)}
														</span>
													) : (
														<>
															{FormatoDateMask(
																e.fec_inicio_mem,
																'dddd D [de] MMMM [del] YYYY'
															)}{' '}
															a las{' '}
															{e.horario}
															{onEditarFechaInicio && e.id && (
																<i
																	className="pi pi-pencil hover-text cursor-pointer ml-4 ms-2"
																	title="Cambiar la fecha de inicio (se actualiza la venta y el seguimiento)"
																	onClick={onEditarInicio}
																></i>
															)}
														</>
													)}
												</span>
												{mensajeInicio && (
													<small className="d-block text-danger">
														{mensajeInicio.texto}
													</small>
												)}
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
