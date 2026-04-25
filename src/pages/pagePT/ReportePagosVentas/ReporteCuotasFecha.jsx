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
                                    <DateMask date={`${r.fecha_p.anio}-${r.fecha_p.mes}-05`} format={'YYYY'}/>
                                    <br/>
                                    <DateMask date={`${r.fecha_p.anio}-${r.fecha_p.mes}-05`} format={'MMMM'}/>
                                </div>
                                <div className='border-change d-flex justify-content-center text-center text-black fs-2'>
                                    <div className='d-flex flex-column text-start'>
                                        <span className='mx-2'>
                                            CUOTAS 0:
                                        </span>
                                        <span className='mx-2'>
                                            CUOTAS 1: 
                                        </span>
                                        <span className='mx-2'>
                                            CUOTAS 2: 
                                        </span>
                                        <span className='mx-2'>
                                            CUOTAS 3: 
                                        </span>
                                        <span className='mx-2'>
                                            CUOTAS 4: 
                                        </span>
                                        <span className='mx-2'>
                                            CUOTAS 5: 
                                        </span>
                                        <span className='mx-2'>
                                            CUOTAS 6: 
                                        </span>
                                    </div><div className='d-flex flex-column text-start'>
                                        <span className='mx-2'>
                                            {r.items?.filter(f=>f?.pago?.n_cuotas==0).length}
                                        </span>
                                        <span className='mx-2'>
                                            {r.items?.filter(f=>f?.pago?.n_cuotas==1).length}
                                        </span>
                                        <span className='mx-2'>
                                            {r.items?.filter(f=>f?.pago?.n_cuotas==2).length}
                                        </span>
                                        <span className='mx-2'>
                                            {r.items?.filter(f=>f?.pago?.n_cuotas==3).length}
                                        </span>
                                        <span className='mx-2'>
                                            {r.items?.filter(f=>f?.pago?.n_cuotas==4).length}
                                        </span>
                                        <span className='mx-2'>
                                            {r.items?.filter(f=>f?.pago?.n_cuotas==5).length}
                                        </span>
                                        <span className='mx-2'>
                                            {r.items?.filter(f=>f?.pago?.n_cuotas==6).length}
                                        </span>
                                    </div>
                                </div>
                                {/* 
                                
                                */}
                            </div>
                        </Col>
                    )
                })
            }
        </Row>
        <pre>
            {JSON.stringify(agruparPorMesAnio(dataView), null, 2)}
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
