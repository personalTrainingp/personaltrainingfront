import React from 'react'
import { DataTableGastos } from '../GestGastos/DataTableGastos'
import { useSelector } from 'react-redux'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { TabPanel, TabView } from 'primereact/tabview'
import { MesxIgv } from './MesxIgv'
import dayjs from 'dayjs'
import { Col, Row } from 'react-bootstrap'

export const AppOrdenCompra = ({id_empresa}) => {
      const { dataView } = useSelector(e=>e.EGRESOS)
  return (
    <div>
      <TabView>
        <TabPanel header={'DATA'}>
        <div className='fs-2 text-change'>IGV ACUMULADO EN TOTAL: <NumberFormatMoney amount={dataView.filter((f) => f.impuesto_igv === true).reduce((total, item)=>item.monto+total, 0)-(dataView.filter((f) => f.impuesto_igv === true).reduce((total, item)=>item.monto+total, 0)/1.18)}/></div>
        <DataTableGastos sonCompras={true} id_empresa={id_empresa} />
        </TabPanel>
        <TabPanel header={'REPORTE POR MES'}>
          <Row>
            {
              agruparPorFecha(dataView.filter((f) => f.impuesto_igv === true)).map(m=>{
                return (
                  <Col lg={2}>
                    <MesxIgv data={m.items} monto_acumulado={m.monto_total-(m.monto_total/1.18)} label={dayjs(`15-${m.fecha.mes}-${m.fecha.anio}`, 'DD-M-YYYY').format('MMMM YYYY')}/>
                  </Col>
                )
              })
            }
          </Row>
        </TabPanel>
      </TabView>
    </div>
  )
}

const agruparPorFecha = (data) => {
  const map = new Map();

  data.forEach(item => {
    const fecha = new Date(item.fecha_comprobante);

    // const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const key = `${anio}-${mes}`;

    if (!map.has(key)) {
      map.set(key, {
        fecha: { mes, anio },
        monto_total: 0,
        items: []
      });
    }

    const grupo = map.get(key);

    grupo.monto_total += item.monto || 0;
    grupo.items.push(item);
  });

  // Convertir a array y ordenar por fecha
  return Array.from(map.values()).sort((a, b) => {
    const f1 = new Date(a.fecha.anio, a.fecha.mes - 1, a.fecha.dia);
    const f2 = new Date(b.fecha.anio, b.fecha.mes - 1, b.fecha.dia);
    return f1 - f2; // ascendente
  });
};