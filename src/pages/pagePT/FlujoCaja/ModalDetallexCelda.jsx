import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { ModalIngresosGastos } from '../GestGastos/ModalIngresosGastos'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'

export const ModalDetallexCelda = ({id_enterprice, anio, show, onShow, onHide, data, obtenerGastosxANIO, bgEmpresa}) => {
  const [isModalDetalleGasto, setisModalDetalleGasto] = useState(false)
  const [ModalDetalleGasto, setModalDetalleGasto] = useState({})
  const { obtenerGastoxID, gastoxID, isLoading, startDeleteGasto, setgastoxID } = useGf_GvStore()
  const onOpenModalDetalleGasto = (idGasto)=>{
    setisModalDetalleGasto(true);
    onHide()
    obtenerGastoxID(idGasto)
  }
  const onCloseModalDetalleGasto = ()=>{
    setisModalDetalleGasto(false);
    // onShow()
    obtenerGastosxANIO(anio, id_enterprice)
  }
  console.log({data: agruparPorComprobante(data?.items)});
  
  return (
    <>
    <Dialog visible={show} style={{width: '100rem'}} onHide={onHide} header={`EGRESOS POR DETALLE - ${data?.grupo} - ${data?.concepto}`}>
        <Table  responsive hover striped>
          <thead className={`${bgEmpresa}`}>
              <tr>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'></div></th>
                  <th className='text-white p-1 fs-3'>PROV. / COLABORADOR</th>
                  <th className='text-white p-1 fs-3'>descripcion / evento</th>
                  <th className='text-white p-1 fs-3'>N° DE COMPROBANTE </th>
                  <th className='text-white p-1 fs-3'>N° OPERACION </th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de comprobante</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de pago</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>monto</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>DOCUMENTO</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>FORMA DE PAGO</div></th>
              </tr>
          </thead>
          <tbody>
                {
                  data?.items?.map(f=>{
                    const isSinDoc = f.parametro_comprobante?.label_param==='SIN DOCUMENTO'
                    return (
                      <tr>
                          <td className='fs-2' onClick={()=>onOpenModalDetalleGasto(f.id)}><span className={isSinDoc?'text-primary':'text-black'}><i className='pi pi-pencil fw-bold text-primary cursor-pointer p-1 fs-2'/></span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.tb_Proveedor?.razon_social_prov}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.descripcion}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.n_comprabante}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.n_operacion===''?'EFECTIVO':f.n_operacion}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{dayjs(f.fec_comprobante).format('dddd DD [DE] MMMM [DEL] YYYY')}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{dayjs(f.fec_pago).format('dddd DD [DE] MMMM [DEL] YYYY')}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-green'}>
                            <div>
                              {f.moneda ==='USD' && <SymbolDolar numero={<NumberFormatMoney amount={f.monto}/>}/>}
                            </div>
                            <div>
                                  <SymbolSoles numero={<NumberFormatMoney amount={f.monto * f.tc}/>}/>
                            </div>
                          </span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.parametro_comprobante?.label_param}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.parametro_forma_pago?.label_param}</span></td>
                      </tr>
                    )
                  })
                }
          </tbody>
        </Table>
        {
          data?.grupo==='PRESTAMOS' && (
            <div className='fs-1'>
              NOTA: PODRIA HABER UNA DIFERENCIA ENTRE EL IMPORTE DE PUBLICIDAD DIGITAL VS PRESTAMOS RAL, PORQUE FACEBOOK EMITE LA FACTURA ANTES DEL CARGO EN LA TARJETA DE CREDITO
            </div>
          )
        }
        <span className='fs-1'>RESUMEN:</span>
        {
          agruparPorComprobante(data?.items).map(m=>{
            const formasPago = agruparPorFormaPago(m?.items).map(item => `${item.nombre_fp}: ${FUNMoneyFormatter(item.monto_total)}`).join(', ');
            
            return (
              <> 
              <div className='fs-2'>{m.nombre_com}: <SymbolSoles isbottom={'12'} numero={<NumberFormatMoney amount={m.monto_total}/>}/>  ({formasPago})</div>
              </>
            )
          })
        }
    </Dialog>
    <ModalIngresosGastos onHide={onCloseModalDetalleGasto} data={gastoxID} isLoading={isLoading} id_enterprice={id_enterprice} onShow={()=>setisModalDetalleGasto(true)} show={isModalDetalleGasto}   />
    </>
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
    grupos[nombre_com].monto_total += item.monto*item.tc || 0;
    grupos[nombre_com].items.push(item);
  });
  
  return Object.values(grupos);
}


function agruparPorFormaPago(data) {
  const grupos = {};

  data?.forEach(item => {
    const nombre_fp = item?.parametro_forma_pago?.label_param || 'SIN DOCUMENTO';
    if (!grupos[nombre_fp]) {
      grupos[nombre_fp] = {
        nombre_fp,
        monto_total: 0,
        items: []
      };
    }
    grupos[nombre_fp].monto_total += item.monto*item.tc || 0;
    grupos[nombre_fp].items.push(item);
  });
  console.log(Object.values(grupos));
  
  return Object.values(grupos);
}