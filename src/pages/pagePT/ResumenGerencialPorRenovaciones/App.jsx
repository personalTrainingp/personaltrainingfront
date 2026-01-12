import { PageBreadcrumb } from '@/components'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import React, { useEffect } from 'react'
import { DataTableOrigen } from './DataTableRenovaciones'
import { useRenovacionesStore } from './hook/useRenovacionesStore'
import { Col, Row } from 'react-bootstrap'

export const App = () => {
  const { dataSeguimientosConReno, dataSeguimientosSinReno, obtenerSeguimientos, obtenerVentas, dataVentasMembresiaReno, dataMembresias, dataSeguimientos, dataVentasMembresiaRei } = useRenovacionesStore()
  useEffect(() => {
    obtenerSeguimientos()
    obtenerVentas()
  }, [])
  console.log({dataVentasMembresiaRei});
  
  const analisisRenovaciones = [{mes: 9, anio: 2024, ar1: [], ar2: [], ar3:[]}, ...unirPorMesAnio(dataSeguimientosConReno, dataVentasMembresiaReno)].reduce((acc, f, idx) => {
  const vencimiento = (f.ar1?.length || 0);
  const renovaciones = (f.ar2?.length || 0);
  const pendientes =  vencimiento-renovaciones;
  // const reiLen = dataVentasMembresiaRei
  const renovacionesConMembresiaAnterior = f.ar2.map(a=>{
    const objMembresiaAnterior = dataSeguimientos.find(m=>m.id_membresia===a.id_membresia_anterior)
    return {
      ...a,
      mes: f.mes,
      anio: f.anio,
      objMembresiaAnterior
    }
  })
  // console.log({ renovacionesConMembresiaAnterior, renoConMemAnterior: agruparPorFechaVencimiento(renovacionesConMembresiaAnterior) });
  
  const pendientes_acum = idx === 0
    ? pendientes
    : acc[idx - 1].pendientes_acum + pendientes;

  acc.push({
    mes: f.mes,
    anio: f.anio,
    renovaciones: f.ar2,
    vencimiento: f.ar1,
    pendientes,
    pendientes_acum,
    dataRenovaciones: agruparPorFechaVencimiento(renovacionesConMembresiaAnterior).filter(re => esMesPosterior(re, f))
  });

  return acc;
}, []);
console.log({analisisRenovaciones});

  return (
    <div>
      <PageBreadcrumb title={'DETALLE RENOVACIONES'}/>
        <Row>
          {
            analisisRenovaciones.map(d=>{
              return (
                <Col lg={3}>
                  <DataTableOrigen dataRenovacionesAnteriores={d.dataRenovaciones} pendientes_acum={d.pendientes_acum} anio={d.anio} mes={d.mes} vencimientos={d.vencimiento} renovaciones={d.renovaciones}/>
                </Col>
              )
            })
          }
        </Row>
    </div>
  )
}
const esMesPosterior = (a, b) =>
  a.anio * 100 + a.mes < b.anio * 100 + b.mes;
const agruparPorFechaVencimiento = (data = []) => {
  const map = {};

  data.forEach(item => {
    const fecha = item?.objMembresiaAnterior?.fecha_vencimiento;
    if (!fecha) return;

    const d = new Date(fecha);
    const anio = d.getUTCFullYear();
    const mes = d.getUTCMonth() + 1; // 1–12
    const dia = d.getUTCDate();

    const key = `${anio}-${mes}`;

    if (!map[key]) {
      map[key] = { anio, mes, items: [] };
    }

    map[key].items.push(item);
  });

  return Object.values(map);
};


const unirPorMesAnio = (ar1 = [], ar2 = []) => {
  const map = new Map();
  const key = (mes, anio) => `${mes}-${anio}`;

  ar1.forEach(({ mes, anio, items }) => {
    const k = key(mes, anio);
    if (!map.has(k)) {
      map.set(k, { mes, anio, ar1: [], ar2: [], ar3: [] });
    }
    map.get(k).ar1.push(...items);
  });

  ar2.forEach(({ mes, anio, items }) => {
    const k = key(mes, anio);
    if (!map.has(k)) {
      map.set(k, { mes, anio, ar1: [], ar2: [], ar3: [] });
    }
    map.get(k).ar2.push(...items);
  });

  // 👉 ar3 = ar2 ∩ ar1 por id_cli
  map.forEach((g) => {
    const idsAr1 = new Set(g.ar1.map(i => i.id_cli));
    g.ar3 = g.ar2.filter(i => idsAr1.has(i.id_cli));
  });

  // 👉 ordenar por anio y mes
  return Array.from(map.values()).sort((a, b) => {
    if (a.anio !== b.anio) return a.anio - b.anio;
    return a.mes - b.mes;
  });
};
