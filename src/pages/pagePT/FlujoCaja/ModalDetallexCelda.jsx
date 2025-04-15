import { NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalDetallexCelda = ({show, onHide, data}) => {
  console.log(data, "ddaa");
  
  return (
    <Dialog visible={show} style={{width: '60rem'}} onHide={onHide} header={`EGRESOS POR DETALLE - ${data?.grupo} - ${data?.concepto}`}>
        <Table responsive hover>
          <thead className='bg-primary'>
              <tr>
                  <th className='text-white p-1 fs-3'>descripcion</th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de pago</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>monto</div></th>
                  {/* <th className='text-white p-1 fs-3'>%</th> */}
                  {/* <th className='text-white p-1 fs-3'><div className=''>TICKET M.</div></th> */}
              </tr>
          </thead>
          <tbody>
                {
                  data?.items?.map(f=>{
                    return (
                      <tr>
                          <td className='fs-2'><span className=''>{f.descripcion}</span></td>
                          <td className='fs-2'><span className=''>{dayjs(f.fec_pago).format('dddd DD [DE] MMMM [DEL] YYYY')}</span></td>
                          <td className='fs-2'><span className=''><NumberFormatMoney amount={f.monto}/></span></td>
                      </tr>
                    )
                  })
                }
          </tbody>
        </Table>
    </Dialog>
  )
}
