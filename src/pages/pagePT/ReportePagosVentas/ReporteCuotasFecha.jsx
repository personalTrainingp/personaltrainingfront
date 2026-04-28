import React, { useEffect } from 'react'
import { useVentasPagosStore } from './useVentasPagosStore'
import { useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { DateMask } from '@/components/CurrencyMask'

export const ReporteCuotasFecha = () => {
        const { obtenerPagosVentas } = useVentasPagosStore()
        useEffect(() => {
        obtenerPagosVentas()
        }, [])
        const { dataView } = useSelector(e=>e.PAGOSVENTAS)
        const resultado = agruparPorMesAnio(dataView)
  return (
    <div>
        <Row>
            {
                resultado.map(r=>{
                    return (
                        <Col lg={4}>
                            <div className='m-1'>
                                <div className='bg-change text-white p-1 text-center' style={{fontSize: '50px'}}>
                                    <DateMask date={`${r.fecha_p.anio}-${r.fecha_p.mes}-05`} format={'YYYY '}/>
                                    <DateMask date={`${r.fecha_p.anio}-${r.fecha_p.mes}-05`} format={'MMMM '}/>
                                </div>
                                <div className='border-change d-flex flex-column text-center text-black fs-2'>
                                    <div className='d-flex justify-content-around w-100'>
                                        <div className='text-change' style={{fontSize: '40px'}}>
                                            OPENPAY
                                        </div>
                                        <div className='d-flex flex-column text-start'>
                                            <span>
                                                <span className='text-change'>1</span> CUOTA : <span className='text-change'>{filtrarxCuota(r.items, 0).filter(f=>f.pago.id_operador===1739&&f.pago.id_forma_pago===1743).length}</span> 
                                            </span>
                                            <span>
                                                <span className='text-change'>3</span> CUOTA : <span className='text-change'>{filtrarxCuota(r.items, 3).filter(f=>f.pago.id_operador===1739&&f.pago.id_forma_pago===1743).length}</span> 
                                            </span>
                                            <span>
                                                <span className='text-change'>6</span> CUOTA : <span className='text-change'>{filtrarxCuota(r.items, 6).filter(f=>f.pago.id_operador===1739&&f.pago.id_forma_pago===1743).length}</span> 
                                            </span><span>
                                                QR :  <span className='text-change'>{r.items.filter(f=>f.pago.id_forma_pago===1471).filter(f=>f.pago.id_operador===1739).length}</span>
                                            </span><span>
                                                INTERNACIONAL:  <span className='text-change'>{r.items.filter(f=>!f.pago.es_nacional).filter(f=>f.pago.id_operador===1739).length}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='border-change d-flex flex-column text-center text-black fs-2'>
                                    <div className='d-flex justify-content-around w-100'>
                                        <div className='text-change' style={{fontSize: '40px'}}>
                                            IZIPAY
                                        </div>
                                        <div className='d-flex flex-column text-start'>
                                            <span>
                                                <span className='text-change'>1</span> CUOTA : <span className='text-change'>{filtrarxCuota(r.items, 0).filter(f=>f.pago.id_operador===1740&&f.pago.id_forma_pago===1743).length}</span> 
                                            </span>
                                            <span>
                                                <span className='text-change'>3</span> CUOTA :  <span className='text-change'>{filtrarxCuota(r.items, 3).filter(f=>f.pago.id_operador===1740&&f.pago.id_forma_pago===1743).length}</span>
                                            </span>
                                            <span>
                                                <span className='text-change'>6</span> CUOTA : <span className='text-change'>{filtrarxCuota(r.items, 6).filter(f=>f.pago.id_operador===1740&&f.pago.id_forma_pago===1743).length}</span>
                                            </span><span>
                                                QR : <span className='text-change'>{r.items.filter(f=>f.pago.id_forma_pago===1471).filter(f=>f.pago.id_operador===1740).length}</span> 
                                            </span><span>
                                                INTERNACIONAL: <span className='text-change'>{r.items.filter(f=>!f.pago.es_nacional).filter(f=>f.pago.id_operador===1740).length}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )
                })
            }
        </Row>
        <pre>
            {JSON.stringify(resultado, null, 2)}
        </pre>
    </div>
  )
}


const agruparPorMesAnio = (data) =>
  Object.values(
    data.reduce((acc, item) => {
      const fecha = new Date(item.fecha_p);

      const mes = fecha.getMonth() + 1; // 1-12
      const anio = fecha.getFullYear();

      const key = `${anio}-${mes}`;

      if (!acc[key]) {
        acc[key] = {
          fecha_p: { mes, anio },
          items: []
        };
      }

      acc[key].items.push(item);

      return acc;
    }, {})
  );

const filtrarxCuota = (data, n_cuota)=>{
    return data?.filter(f=>f?.pago?.n_cuotas==n_cuota)
}
const filtrarPorQR = ()=>{

}