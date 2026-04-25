import React, { useEffect } from 'react'
import { useVentasPagosStore } from './useVentasPagosStore'
import { useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { TabPanel, TabView } from 'primereact/tabview'
import { ReporteCuotasFecha } from './ReporteCuotasFecha'

export const ReporteCuotas = () => {
    const { obtenerPagosVentas } = useVentasPagosStore()
    useEffect(() => {
    obtenerPagosVentas()
    }, [])
    const { dataView } = useSelector(e=>e.PAGOSVENTAS)
  return (
    <div>
        <TabView>
            <TabPanel header={'POR OPERADORES'}>
                <Row>
                    <Col lg={6}>
                        <div className='m-1'>
                            <div className='bg-change text-white p-1 text-center fs-1'>
                                OPENPAY
                            </div>
                            <div className='border-change d-flex flex-column justify-content-center text-center text-black fs-2 '>
                                {
                                    agrupar(dataView).filter(f=>f.id_forma_pago===1389).sort((a,b)=>a.n_cuotas-b.n_cuotas).map(r=>{
                                        return (
                                                <div>
                                                        {r.n_cuotas} CUOTAS - {r.items.length} PAGOS
                                                        <br/>
                                                </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className='m-1'>
                            <div className='bg-change text-white p-1 text-center fs-1'>
                                IZIPAY
                            </div>
                            <div className='border-change d-flex flex-column justify-content-center text-center text-black fs-2 '>
                                {
                                    agrupar(dataView).filter(f=>f.id_forma_pago===597).sort((a,b)=>a.n_cuotas-b.n_cuotas).map(r=>{
                                        return (
                                                <div>
                                                        {r.n_cuotas} CUOTAS - {r.items.length} PAGOS
                                                        <br/>
                                                </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
            </TabPanel>
            <TabPanel header={'POR FECHA'}>
                <ReporteCuotasFecha/>
            </TabPanel>
        </TabView>
    </div>
  )
}
const agrupar = (data) => {
  const map = {};

  data.forEach(item => {
    const { id_forma_pago, n_cuotas } = item.pago;
    const key = `${id_forma_pago}-${n_cuotas}`;

    if (!map[key]) {
      map[key] = {
        id_forma_pago,
        n_cuotas,
        items: []
      };
    }

    map[key].items.push(item);
  });

  return Object.values(map);
};