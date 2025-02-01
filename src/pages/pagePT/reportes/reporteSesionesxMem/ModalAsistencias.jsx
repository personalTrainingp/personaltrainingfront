import dayjs from 'dayjs'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalAsistencias = ({visible, onHide, dataMarcacion=[]}) => {
    console.log({dataMarcacion});
    
  return (
    <Dialog
        visible={visible}
        onHide={onHide}
        style={{ width: '40vw', maxHeight: '90vh' }}
        >
        <h3>Marcaciones de asistencia</h3>
        
                                    <Table
                                                        // style={{tableLayout: 'fixed'}}
                                                        className="table-centered mb-0"
                                                        // hover
                                                        striped
                                                        responsive
                                                    >
                                                        <thead className='bg-primary fs-1'>
                                                            <tr>
                                                                <th className='text-white text-center'></th>
                                                                <th className='text-white text-center'>Fecha</th>
                                                                <th className='text-white text-center'>INICIO </th>
                                                                {/* <th className='text-white text-center'>FIN </th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                dataMarcacion.map((marcacion, index, array)=>{
                                                                    
                                                                    return(
                                                                        <tr className={`border-1 ${dayjs(array[0].fecha,'YYYY-MM-DD').format('dddd')===dayjs(marcacion.fecha,'YYYY-MM-DD').format('dddd')?'border-black':'border-none'}`}>
                                                                            <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{index+1}</span></li>
                                                                                </td>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{dayjs(marcacion.fecha,'YYYY-MM-DD').format('dddd, DD [/] MM [/] YYYY')}</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{dayjs.utc(marcacion.marcacion_inicio).format('hh:mm:ss')}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </Table>
    </Dialog>
  )
}
