import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap';

export const ModalVistaSocios = ({data, show, onHide}) => {
  
  return (
    <Dialog style={{width: '70rem'}} header={data.fecha} visible={show} onHide={onHide}>
        <Table
                        striped
                        className="table-centered mb-0"
                        >
                        <thead className='bg-primary'>
                            <tr>
                                <th className='text-white p-1 fs-3'></th>
                                <th className='text-white p-1 fs-3'>Socio</th>
                                <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'><SymbolSoles numero={''} isbottom={true}/></div></th>
                                <th className='text-white p-1 fs-3'>Sesiones</th>
                                {/* <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>Tarifas</div></th> */}
                                {/* <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de inicio de la membresia</div></th> */}
                                {/* <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de fin de membresia</div></th> */}
                                <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>Fecha de venta</div></th>
                                {/* <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>PROCEDENCIA</div></th> */}
                                {/* <th className='text-white p-1 fs-3'>%</th> */}
                                {/* <th className='text-white p-1 fs-3'><div className=''>TICKET M.</div></th> */}
                            </tr>
                        </thead>
                        <tbody>
                          {
                            data?.items?.map((d, index)=>{
                              const nombres_apellidos_cli = `${d.detalle_ventaMembresium.tb_ventum.tb_cliente.nombre_cli} ${d.detalle_ventaMembresium.tb_ventum.tb_cliente.apPaterno_cli} ${d.detalle_ventaMembresium.tb_ventum.tb_cliente.apMaterno_cli}`
                              const monto_tarifa = d.detalle_ventaMembresium.tarifa_monto
                              const sesiones = d.detalle_ventaMembresium.tb_semana_training.sesiones
                              const fecha_venta = d.detalle_ventaMembresium.tb_ventum.fecha_venta
                              return (
                                <tr>
                                        <td className='fs-2'>{index+1}</td>
                                        <td className='fs-2'>{nombres_apellidos_cli}</td>
                                        <td className='fs-2'><span className='d-flex justify-content-end'><NumberFormatMoney amount={monto_tarifa}/></span></td>
                                        <td className='fs-2 text-center'>{sesiones}</td>
                                        <td className='fs-2'><span className='d-flex justify-content-end'>{dayjs.utc(fecha_venta).format('dddd DD [DE] MMMM [DEL] YYYY')}</span></td>
                                    </tr>
                              )
                            })
                          }
                        
                        </tbody>
                    </Table>
    </Dialog>
  )
}
