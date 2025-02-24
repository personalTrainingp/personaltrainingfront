import dayjs from 'dayjs';
import { Dialog } from 'primereact/dialog'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { Table } from 'react-bootstrap';

export const ModalDetalleMembresia = ({show, onHide, dataRow}) => {
    const dataCongelamientos = dataRow?.detalle_ventaMembresia[0]?.tb_extension_membresia?.filter(f=>f.tipo_extension==='CON')
    const dataRegalos = dataRow?.detalle_ventaMembresia[0]?.tb_extension_membresia?.filter(f=>f.tipo_extension==='REG')
  return (
    <Dialog visible={show} onHide={onHide} style={{width: '50rem'}}>
            <TabView>
                <TabPanel header='DIAS DE CONGELAMIENTOS'>
                <Table
                    className="table-centered mb-0"
                    striped
                    responsive
                >
                    <thead className="bg-primary">
                        <tr>
                            <th className='text-white p-2 py-2'>FECHA INICIO</th>
                            <th className='text-white p-2 py-2'>FECHA FIN</th>
                            <th className='text-white p-2 py-2'>OBSERVACION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataCongelamientos.map(d=>{
                                return (
                                    <tr>
                                            <td className='fs-3'>{d.extension_inicio}</td>
                                            <td className='fs-3'>{d.extension_fin}</td>
                                            <td className='fs-3'>{d.observacion}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                </TabPanel>
                <TabPanel header='DIAS DE REGALO'>
                <Table
                    className="table-centered mb-0"
                    // hover
                    striped
                    responsive
                >
                    <thead className="bg-primary">
                        <tr>
                            <th className='text-white p-2 py-2'>FECHA INICIO</th>
                            <th className='text-white p-2 py-2'>FECHA FIN</th>
                            <th className='text-white p-2 py-2'>OBSERVACION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataRegalos.map(d=>{
                                return (
                                    <tr>
                                            <td className='fs-3'>{dayjs(d.extension_inicio).format('dddd DD [de] MMM [DEL] YYYY')} </td>
                                            <td className='fs-3'>{dayjs(d.extension_fin).format('dddd DD [de] MMM [DEL] YYYY')}</td>
                                            <td className='fs-3'>{d.observacion}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                </TabPanel>
            </TabView>
    </Dialog>
  )
}
