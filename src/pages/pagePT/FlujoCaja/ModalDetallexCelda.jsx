import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalDetallexCelda = ({show, onHide, data}) => {
  console.log(data, agruparPorComprobante(data?.items), "ddaa");
  
  return (
    <Dialog visible={show} style={{width: '90rem'}} onHide={onHide} header={`EGRESOS POR DETALLE - ${data?.grupo} - ${data?.concepto}`}>
        <Table responsive hover striped>
          <thead className='bg-primary'>
              <tr>
                  <th className='text-white p-1 fs-3'>PROV. / COLABORADOR</th>
                  <th className='text-white p-1 fs-3'>descripcion</th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de comprobante</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de pago</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>monto</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>DOCUMENTO</div></th>
                  {/* <th className='text-white p-1 fs-3'>%</th> */}
                  {/* <th className='text-white p-1 fs-3'><div className=''>TICKET M.</div></th> */}
              </tr>
          </thead>
          <tbody>
                {
                  data?.items?.map(f=>{
                    const isSinDoc = f.parametro_comprobante?.label_param==='SIN DOCUMENTO'
                    return (
                      <tr>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.tb_Proveedor?.razon_social_prov}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.descripcion}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{dayjs(f.fec_comprobante).format('dddd DD [DE] MMMM [DEL] YYYY')}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{dayjs(f.fec_pago).format('dddd DD [DE] MMMM [DEL] YYYY')}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}><NumberFormatMoney amount={f.monto}/></span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.parametro_comprobante?.label_param}</span></td>
                      </tr>
                    )
                  })
                }
          </tbody>
        </Table>
        {
          agruparPorComprobante(data?.items).map(g=>{
            return (
              <>
              <span className={g.nombre_com==='SIN DOCUMENTO'?'text-primary fs-1 fw-bold': 'fs-1 fw-bold'}>{g.nombre_com}: <SymbolSoles isbottom={'12'} numero={<NumberFormatMoney amount={g.monto_total}/>}/></span>
              <br/>
              </>
            )
          })
        }
    </Dialog>
  )
}


function agruparPorComprobante(data) {
  const grupos = {};

  data?.forEach(item => {
    const nombre_com = item?.parametro_comprobante?.label_param || 'SIN DOCUMENTO';
    if (!grupos[nombre_com]) {
      grupos[nombre_com] = {
        nombre_com,
        monto_total: 0,
        items: []
      };
    }
    grupos[nombre_com].monto_total += item.monto || 0;
    grupos[nombre_com].items.push(item);
  });

  return Object.values(grupos);
}