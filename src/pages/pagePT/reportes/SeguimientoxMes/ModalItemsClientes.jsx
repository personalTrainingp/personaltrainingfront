import dayjs from 'dayjs';
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalItemsClientes = ({data, show, onHide, headModal}) => {
    console.log(data, "dadadad");

    const dataAlter = data.sort((a, b) => new Date(a.fec_inicio_mem) - new Date(b.fec_inicio_mem));

  return (
    <Dialog onHide={onHide} visible={show} header={headModal}>
        <Table
                                // style={{tableLayout: 'fixed'}}
                                className="table-centered mb-0"
                                hover
                                striped
                            >
                                
                                <thead className='bg-primary fs-1'>
                                                <tr>
                                                <th className='text-white text-center'></th>
                                                    <th className='text-white text-center'>SOCIOS </th>
                                                    <th className='text-white text-center'>FECHA INICIO </th>
                                                    <th className='text-white text-center'>FECHA FIN </th>
                                                </tr>
                                            </thead>
                                <tbody>
                                    {
                                        dataAlter.map((d, index)=>{
                                            return (
                                                <tr className='fs-3'>
                                                    <td className="border-0">
                                                        {index+1}
                                                    </td>
                                                    <td className="border-0">
                                                        {d.cliente}
                                                    </td>
                                                    <td className="border-0">
                                                        {dayjs.utc(d.fec_inicio_mem).format('DD [de] MMMM [del] YYYY')}
                                                    </td>
                                                    <td className="border-0">
                                                        {dayjs.utc(d.fec_fin_mem).format('DD [de] MMMM [del] YYYY')}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                                <tr className='bg-primary'>
                                    <td>
                                        <li className=' text-center list-unstyled p-2'><span className='fw-bold text-white' style={{fontSize: '40px'}}>{data.length}</span></li>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <li className=' text-center list-unstyled p-2'><span className='fw-bold text-white' style={{fontSize: '40px'}}>TOTAL</span></li>
                                    </td>
                                </tr>
                            </Table>
    </Dialog>
  )
}
