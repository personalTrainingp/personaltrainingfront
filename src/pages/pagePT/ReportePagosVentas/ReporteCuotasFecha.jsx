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
                                <div className='bg-change text-white p-1 text-center fs-1'>
                                    <DateMask date={`${r.fecha_p.anio}-${r.fecha_p.mes}-05`} format={'MMMM '}/>
                                    <DateMask date={`${r.fecha_p.anio}-${r.fecha_p.mes}-05`} format={'YYYY '}/>
                                </div>
                                <div className='border-change d-flex flex-column text-center text-black fs-2'>
                                    <div className='d-flex justify-content-around w-100'>
                                        <div>
                                            OPENPAY
                                        </div>
                                        <div className='d-flex flex-column text-start'>
                                            <span>
                                                1 CUOTA :  {filtrarxCuota(r.items, 0).filter(f=>f.pago.id_operador===1739||f.pago.id_forma_pago===1389||f.pago.id_forma_pago===1743).length}
                                            </span>
                                            <span>
                                                3 CUOTA :  {filtrarxCuota(r.items, 3).filter(f=>f.pago.id_operador===1739||f.pago.id_forma_pago===1389||f.pago.id_forma_pago===1743).length}
                                            </span>
                                            <span>
                                                6 CUOTA :  {filtrarxCuota(r.items, 6).filter(f=>f.pago.id_operador===1739||f.pago.id_forma_pago===1389||f.pago.id_forma_pago===1743).length}
                                            </span><span>
                                                QR :  {r.items.filter(f=>f.pago.id_forma_pago===1471).filter(f=>f.pago.id_operador===1739||f.pago.id_forma_pago===1389||f.pago.id_forma_pago===1743).length}
                                            </span><span>
                                                INTERNACIONAL:  {r.items.filter(f=>!f.pago.es_nacional).filter(f=>f.pago.id_operador===1739||f.pago.id_forma_pago===1389).length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='border-change d-flex flex-column text-center text-black fs-2'>
                                    <div className='d-flex justify-content-around w-100'>
                                        <div>
                                            IZIPAY
                                        </div>
                                        <div className='d-flex flex-column text-start'>
                                            <span>
                                                1 CUOTA :  {filtrarxCuota(r.items, 0).filter(f=>f.pago.id_operador===1740||f.pago.id_forma_pago===597||f.pago.id_forma_pago===1743).length}
                                            </span>
                                            <span>
                                                3 CUOTA :  {filtrarxCuota(r.items, 3).filter(f=>f.pago.id_operador===1740||f.pago.id_forma_pago===597||f.pago.id_forma_pago===1743).length}
                                            </span>
                                            <span>
                                                6 CUOTA :  {filtrarxCuota(r.items, 6).filter(f=>f.pago.id_operador===1740||f.pago.id_forma_pago===597||f.pago.id_forma_pago===1743).length}
                                            </span><span>
                                                QR :  {r.items.filter(f=>f.pago.id_forma_pago===1471).filter(f=>f.pago.id_operador===1740||f.pago.id_forma_pago===597||f.pago.id_forma_pago===1743).length}
                                            </span><span>
                                                INTERNACIONAL:  {r.items.filter(f=>!f.pago.es_nacional).filter(f=>f.pago.id_operador===1740||f.pago.id_forma_pago===597).length}
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