import { PageBreadcrumb } from '@/components'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import React, { useEffect } from 'react'
import { DataTableOrigen } from './DataTableRenovaciones'
import { useRenovacionesStore } from './hook/useRenovacionesStore'
import { Col, Row } from 'react-bootstrap'

export const App = () => {
  const { dataSeguimientosConReno, dataSeguimientosSinReno, obtenerSeguimientos, obtenerVentas, dataVentasMembresia } = useRenovacionesStore()
  useEffect(() => {
    obtenerSeguimientos()
    obtenerVentas()
  }, [])
  console.log({ums: unirPorMesAnio(dataSeguimientosConReno, dataVentasMembresia)});
  const analisisRenovaciones = [{mes: 9, anio: 2024, ar1: [], ar2: [], ar3:[]}, ...unirPorMesAnio(dataSeguimientosConReno, dataVentasMembresia)].reduce((acc, f, idx) => {
  const vencimiento = (f.ar1?.length || 0);
  const renovaciones = (f.ar3?.length || 0);
  const pendientes = vencimiento - renovaciones;

  const pendientes_acum = idx === 0
    ? pendientes
    : acc[idx - 1].pendientes_acum + pendientes;

  acc.push({
    mes: f.mes,
    anio: f.anio,
    renovaciones: f.ar1,
    vencimiento: f.ar3,
    pendientes,
    pendientes_acum,
  });

  return acc;
}, []);
  return (
    <div>
      <PageBreadcrumb title={'DETALLE RENOVACIONES'}/>
        <Row>
          {
            analisisRenovaciones.map(d=>{
              return (
                <Col lg={3}>
                  <DataTableOrigen  pendientes_acum={d.pendientes_acum} anio={d.anio} mes={d.mes} vencimientos={d.vencimiento} renovaciones={d.renovaciones}/>
                </Col>
              )
            })
          }
        </Row>
    </div>
  )
}


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

const calcularAr3 = (data = []) =>
  data.map((item, index, arr) => {
    if (index === 0) {
      return {
        ...item,
        ar3: item.ar1,
      };
    }

    return {
      ...item,
      ar3: arr[index - 1].ar1 + item.ar2,
    };
  });