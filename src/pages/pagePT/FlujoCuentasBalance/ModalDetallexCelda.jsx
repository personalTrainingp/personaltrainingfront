import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { ModalIngresosGastos } from '../GestGastos/ModalIngresosGastos'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'

export const ModalDetallexCelda = ({arrayRangeDate, bgMultiValue, id_enterprice, anio, show, onShow, onHide, data, obtenerGastosxANIO, bgEmpresa}) => {
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
    obtenerGastosxANIO(arrayRangeDate, id_enterprice)
  }
  return (
    <>
    <Dialog visible={show} style={{width: '150rem'}} onHide={onHide} header={`DETALLE - ${data?.grupo} - ${data?.concepto}`}>
        <Table  responsive hover striped style={{width: '100%'}}>
          <thead >
              <tr className={`${bgEmpresa} bg-primary`}>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'></div></th>
                  <th className='text-white p-1 fs-3'>
                    <div className='bg-porsiaca' style={{width: '350px'}}>
                      PROVEEDOR/<br/> COLABORADOR
                    </div>
                    </th>
                  <th className='text-white p-1 fs-3'>
                    <div  className='bg-porsiaca' style={{width: '350px'}}>
                      descripcion / evento
                    </div>
                  </th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de comprobante</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>fecha de pago</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>monto</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>DOCUMENTO</div></th>
                  <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>FORMA DE PAGO</div></th>
                  <th className='text-white p-1 fs-3'>N° DE COMPROBANTE </th>
                  <th className='text-white p-1 fs-3'>N° OPERACION </th>
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
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{dayjs(f.fec_comprobante).format('dddd DD [DE] MMMM [DEL] YYYY')}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{dayjs(f.fec_pago).format('dddd DD [DE] MMMM [DEL] YYYY')}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-green'}>
                            <div>
                              {f.moneda ==='USD' && <SymbolDolar numero={<NumberFormatMoney amount={f.monto}/>}/>}
                              <br/>
                              {f.moneda ==='USD' && `T.C.: ${f.tc}`}
                            </div>
                            <div>
                                  {f.moneda ==='PEN' &&<SymbolSoles numero={<NumberFormatMoney amount={f.monto}/>}/>}
                            </div>
                          </span></td>
                          <td className='fs-2 text-primary'><span className={'text-primary fw-bold'}>{f.parametro_comprobante?.label_param}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.parametro_forma_pago?.label_param}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.n_comprabante}</span></td>
                          <td className='fs-2'><span className={isSinDoc?'text-primary':'text-black'}>{f.n_operacion===''?'EFECTIVO':f.n_operacion}</span></td>
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
        <div className='d-flex justify-content-around '>
          <div className=''>
            <span className={`text-white ${bgEmpresa} fs-1`}>GASTOS PROVEEDORES</span>
            {
              agruparPorProveedor(data?.items).map((m, i)=>{
                return (
                  <>
                  <div className='fs-2'><span className='fw-bold' style={{color: `${bgMultiValue}`}}>{i+1}. {m.nombre_fp.split(' ').length>=4 || m.nombre_fp.split(' ').length==3?<>{m.nombre_fp.split(' ')[0]} {m.nombre_fp.split(' ')[1]}<br/>{m.nombre_fp.split(' ')[2]} {m.nombre_fp.split(' ')[3]}</>:<>{m.nombre_fp}</>}:</span> {FUNMoneyFormatter(m.monto_total)}({m.items.length})</div>
                  </>
                )
              })
            }
          </div>
          <div className={`mx-3 ${bgEmpresa}`} style={{width: '3px'}}>
          </div>
          <div className=''>
            <span className={`text-white ${bgEmpresa} fs-1`}>FORMA DE PAGO:</span>
            {
              agruparPorComprobante(data?.items).map((m, i)=>{
                const formasPago = agruparPorFormaPago(m?.items).map(item => `${item.nombre_fp}: ${FUNMoneyFormatter(item.monto_total)}`).join(', ');
                return (
                  <>
                  <div className='fs-2'><span className='fw-bold' style={{color: `${bgMultiValue}`}}>{i+1}. {m.nombre_com} ({m.items?.length})</span>: <SymbolSoles isbottom={'12'} numero={<NumberFormatMoney amount={m.monto_total}/>}/>  ({formasPago})</div>
                  </>
                )
              })
            }
          </div>
        </div>
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


function agruparPorProveedor(data) {
  const grupos = {};

  data?.forEach(item => {
    const nombre_fp = item?.tb_Proveedor?.razon_social_prov || 'SIN DOCUMENTO';
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