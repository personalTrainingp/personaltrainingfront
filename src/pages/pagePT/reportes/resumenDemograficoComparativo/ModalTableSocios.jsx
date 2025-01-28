import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

function calcularDiferenciaFechas(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
  
    const diferenciaAnios = fin.getFullYear() - inicio.getFullYear();
    return diferenciaAnios;
  }
export const ModalTableSocios = ({clickDataSocios, avatarProgramaSelect, clickDataLabel, show, onHide}) => {
    // console.log(clickDataSocios, "modal ");
    console.log('asdfasdf');
    console.log(clickDataSocios, avatarProgramaSelect);
    
    const dataAlter = clickDataSocios?.map(d=>{
        // console.log(d, "fecha_ventario");
        
        return {
            nombres_socios: `${d.tb_ventum.tb_cliente.nombre_cli} ${d.tb_ventum.tb_cliente.apPaterno_cli} ${d.tb_ventum.tb_cliente.apMaterno_cli}`,
            monto: d.tarifa_monto,
            sesionesVendidas: d.tb_semana_training.sesiones,
            fecha_venta: `${d.tb_ventum.fecha_venta}`,
            fecha_nacimiento: `${d.tb_ventum.tb_cliente.fecha_nacimiento}`,
            edad: calcularDiferenciaFechas(d.tb_ventum.tb_cliente.fecha_nacimiento, d.tb_ventum.fecha_venta ),
            nombre_tarifa: '',
            // fecha_inicio: '',
            // fecha_fin: '',
            fecha_venta: d.tb_ventum.fecha_venta,
            // asesor_venta: '',
        }
    })
  return (
    <Dialog header={clickDataLabel} style={{width: '80rem'}} visible={show} onHide={onHide}>
        <div className='d-flex justify-content-center mb-3'>
            
            <img src={avatarProgramaSelect.urlImage}  height={`${avatarProgramaSelect.height }`} width={`${avatarProgramaSelect.width }`}/>
        </div>
        <Table
                    striped
                    className="table-centered mb-0"
                    >
                    <thead className='bg-primary'>
                        <tr>
                            <th className='text-white p-1 fs-3'>Socio</th>
                            <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'><SymbolSoles numero={''} isbottom={false}/></div></th>
                            <th className='text-white p-1 fs-3'>Sesiones vendidas</th>
                            <th className='text-white p-1 fs-3'>FECHA DE NACIMIENTO</th>
                            <th className='text-white p-1 fs-3'>EDAD</th>
                            {/* <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>Tarifas</div></th> */}
                            {/* <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de inicio de la membresia</div></th> */}
                            {/* <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de fin de membresia</div></th> */}
                            <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>Fecha de venta</div></th>
                            {/* <th className='text-white p-1 fs-3'>%</th> */}
                            {/* <th className='text-white p-1 fs-3'><div className=''>TICKET M.</div></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataAlter?.map(d=>(
                                <tr>
                                    <td className='fs-2'>{d.nombres_socios}</td>
                                    <td className='fs-2'><span className='d-flex justify-content-end'><NumberFormatMoney amount={d.monto}/></span></td>
                                    <td className='fs-2 text-center'>{d.sesionesVendidas}</td>
                                    <td className='fs-2'>{ dayjs.utc(d.fecha_nacimiento).format('dddd DD [DE] MMMM [DEL] YYYY')}</td>
                                    <td className='fs-2 text-center'>{d.edad}</td>
                                    <td className='fs-2'><span className='d-flex justify-content-end'>{dayjs.utc(d.fecha_venta).format('dddd DD [DE] MMMM [DEL] YYYY')}</span></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
    </Dialog>
  )
}
