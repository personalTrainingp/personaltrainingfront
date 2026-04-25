import React, { useEffect } from 'react'
import { useContratosDeClientes } from './useContratosDeClientes'
import { useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { DateMask } from '@/components/CurrencyMask'

export const AppReporteContratosClientes = () => {
    const { obtenerContratosDeClientes } = useContratosDeClientes()
    const { dataView } =useSelector(e=>e.DATA)
    useEffect(() => {
        obtenerContratosDeClientes
    }, [])
    const resultado = (agruparPorMesAnio(dataView));
  return (
    <div>
        <Row>
            {
                resultado.map(r=>{
                    return (
                        <Col className='' lg={4}>
                            <div className='m-1'>
                                <div className='bg-change text-white p-1 text-center fs-1'>
                                    <DateMask date={`${r.fecha_p.anio}-${r.fecha_p.mes}-05`} format={'YYYY'}/>
                                    <br/>
                                    <DateMask date={`${r.fecha_p.anio}-${r.fecha_p.mes}-05`} format={'MMMM'}/>
                                </div>
                                <div className='border-change d-flex justify-content-center text-center text-black fs-2'>
                                    <div className='d-flex flex-row text-end'>
                                      <span className='d-flex flex-column'>
                                        <span className='mx-2 text-end'>
                                            FIRMADOS: 
                                        </span>
                                        <span className='mx-2'>
                                            FOTOS: 
                                        </span>
                                      </span>
                                      <span className='d-flex flex-column'>
                                        <span className='mx-2'>
                                            {r.items.filter(f=>f.firmado==='SI').length}
                                        </span>
                                        <span className='mx-2'>
                                            {r.items.filter(f=>f.conFoto==='SI').length}
                                        </span>
                                      </span>
                                    </div>
                                    <div className='d-flex flex-column text-end text-change'>
                                      <div className='d-flex flex-row text-end'>
                                      <span className='d-flex flex-column'>
                                        <span className='mx-2 text-end'>
                                            SIN FIRMA: 
                                        </span>
                                        <span className='mx-2'>
                                            SIN FOTO: 
                                        </span>
                                      </span>
                                      <span className='d-flex flex-column'>
                                        <span className='mx-2'>
                                            {r.items.filter(f=>f.firmado==='NO').length}
                                        </span>
                                        <span className='mx-2'>
                                            {r.items.filter(f=>f.conFoto==='NO').length}
                                        </span>
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
        {/* <pre>
            {JSON.stringify(resultado, null, 2)}
        </pre> */}
    </div>
  )
}
const agruparPorMesAnio = (data = []) => {
  return Object.values(
    data.reduce((acc, item) => {
      if (!item?.fecha_p) return acc;

      const fecha = new Date(item.fecha_p);
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
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
  ).sort((a, b) => {
  const fA = new Date(`${a.fecha_p.anio}-${a.fecha_p.mes}-05`);
  const fB = new Date(`${b.fecha_p.anio}-${b.fecha_p.mes}-05`);
  return fB - fA;
});;
};
const ordenarMeses = (data) => {
  return [...data].sort((a, b) => {
    const fA = new Date(`${a.fecha_p.anio}-${a.fecha_p.mes}-01`);
    const fB = new Date(`${b.fecha_p.anio}-${b.fecha_p.mes}-01`);
    return fA - fB; // ascendente
  });
};
const acumularPorMes = (data = []) => {
  const ordenado = ordenarMeses(data);

  let acumulado = [];

  return ordenado.map((mesObj) => {
    acumulado = [...acumulado, ...mesObj.items];

    return {
      fecha_p: mesObj.fecha_p,
      items: acumulado
    };
  });
};