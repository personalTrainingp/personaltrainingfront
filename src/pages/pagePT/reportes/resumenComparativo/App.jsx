import { PageBreadcrumb } from '@/components'
import React, { useEffect } from 'react'
import { useResumenComparativoStore } from './useResumenComparativoStore'
import { FormatTableCR, FormatTableTotalCR } from './FormatTableCR'
import { Card, Col, Row } from 'react-bootstrap'
import { arrayEstadoCivil, arrayOrigenDeCliente, arraySexo } from '@/types/type'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'

const ColumnPgm = ({data, dataChange, dataFs, dataFm, header}) => {
  return (
    <>
      <div style={{fontSize: '50px'}} className='text-center'>{header}</div>
      <Row style={{marginBottom: '100px'}}>
        <Col lg={4}>
        <Card>
            <div className='fs-1 text-center'>
              <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={440} style={{padding: '20px 0 5px 0'}}/>
            </div>
            <FormatTableCR header={header} data={dataChange}/>
        </Card>
        </Col>
        <Col lg={4}>
        <Card>
          <div className='fs-1 text-center'>
              <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={190} style={{padding: '20px 0 5px 0'}}/>
          </div>
          <FormatTableCR header={header} data={dataFs}/>
        </Card>
        </Col>
        <Col lg={4}>
        <Card>
          <div className='fs-1 text-center'>
              <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={280} style={{padding: '20px 0 5px 0'}}/>
          </div>
          <FormatTableCR header={header} data={dataFm}/>
        </Card>
        </Col>
        <Col lg={12}>
        <Card>
          <div className='fs-1 text-center d-flex align-items-center justify-content-center'>
            <span>
              <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={440} style={{padding: '20px 0 5px 0'}}/>
            </span>
            <span className='mx-4'>
              +
            </span>
            <span>
              <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={190} style={{padding: '20px 0 5px 0'}}/>
            </span>
            <span className='mx-4'>
              +
            </span>
            <span>
              <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={280} style={{padding: '20px 0 5px 0'}}/>
            </span>
          </div>
          <FormatTableTotalCR header={header} data={data}/>
        </Card>
        </Col>
      </Row>
    </>
  )
}

export const App = () => {
    const { dataVentas, obtenerVentas } = useResumenComparativoStore()
        const { RANGE_DATE, dataView } = useSelector(e => e.DATA)
    useEffect(() => {
        obtenerVentas([new Date(RANGE_DATE[0]), new Date(RANGE_DATE[1])])
    }, [RANGE_DATE])
    const dataV = {
      change: agruparxPgm(dataVentas).find(f=>f.pgm==='CHANGE 45')?.items,
      fs: agruparxPgm(dataVentas).find(f=>f.pgm==='FS 45')?.items,
      fm: agruparxPgm(dataVentas).find(f=>f.pgm==='FISIO MUSCLE')?.items,
      todos: dataVentas
    }
  return (
    <div>
        <PageBreadcrumb title={'Resumen para marketing'}/>
        <FechaRange rangoFechas={RANGE_DATE}/>
        <ColumnPgm header='CATEGORIA' data={agruparPorCat(dataV.todos)} dataChange={agruparPorCat(dataV.change)} dataFs={agruparPorCat(dataV.fs)} dataFm={agruparPorCat(dataV.fm)}/>
        <ColumnPgm header='SEMANAS (SESIONES)' data={agruparPorSemanas(dataV.todos)} dataChange={agruparPorSemanas(dataV.change)} dataFs={agruparPorSemanas(dataV.fs)} dataFm={agruparPorSemanas(dataV.fm)}/>
        <ColumnPgm header='SEXO' data={agruparPorGenero(dataV.todos)} dataChange={agruparPorGenero(dataV.change)} dataFs={agruparPorGenero(dataV.fs)} dataFm={agruparPorGenero(dataV.fm)}/>
        <ColumnPgm header='EDAD' data={agruparPorEdad(dataV.todos)} dataChange={agruparPorEdad(dataV.change)} dataFs={agruparPorEdad(dataV.fs)} dataFm={agruparPorEdad(dataV.fm)}/>
        <ColumnPgm header={<span className=''>ESTADO<br/> CIVIL</span>} data={agruparPorEstCivil(dataV.todos)} dataChange={agruparPorEstCivil(dataV.change)} dataFs={agruparPorEstCivil(dataV.fs)} dataFm={agruparPorEstCivil(dataV.fm)}/>
        <ColumnPgm header='ORIGEN' data={agruparPorOrigen(dataV.todos)} dataChange={agruparPorOrigen(dataV.change)} dataFs={agruparPorOrigen(dataV.fs)} dataFm={agruparPorOrigen(dataV.fm)}/>
        <ColumnPgm header='ASESORES' data={agruparPorEmpl(dataV.todos)} dataChange={agruparPorEmpl(dataV.change)} dataFs={agruparPorEmpl(dataV.fs)} dataFm={agruparPorEmpl(dataV.fm)}/>
    </div>
  )
}

function agruparPorOrigen(data) {
  const grupos = {};

  data?.forEach(item => {
    const propiedad = `${item?.id_origen}` || 0;
    if (!grupos[propiedad]) {
      grupos[propiedad] = {
        propiedad,
        id_origen: item?.id_origen,
        items: []
      };
    }
    grupos[propiedad].items.push(item);
  });
  return Object.values(grupos).map(m=>{
    return {
      ...m,
      propiedad: `${arrayOrigenDeCliente.find(f=>f.value ===Number(m.id_origen))?.label}`,
      len: m.items.length,
      monto: m.items.reduce((total, item)=>total+item.detalle_ventaMembresia[0].tarifa_monto, 0)
    }
  });
}


function agruparPorEmpl(data) {
  const grupos = {};

  data?.forEach(item => {
    const propiedad = `${item?.tb_empleado.nombres_apellidos_empl}` || 0;
    if (!grupos[propiedad]) {
      grupos[propiedad] = {
        propiedad,
        nombres_empl: item?.tb_empleado.nombres_apellidos_empl,
        items: []
      };
    }
    grupos[propiedad].items.push(item);
  });
  return Object.values(grupos).map(m=>{
    return {
      ...m,
      propiedad: `${m.nombres_empl.split(' ')[0]}`,
      len: m.items.length,
      monto: m.items.reduce((total, item)=>total+item.detalle_ventaMembresia[0].tarifa_monto, 0)
    }
  }).filter(f=>f.monto!==0);
}


function agruparPorCat(data) {
  const grupos = {};

  data?.forEach(item => {
    const propiedad = `${item?.cat}` || 0;
    if (!grupos[propiedad]) {
      grupos[propiedad] = {
        propiedad,
        cat: item?.cat,
        items: []
      };
    }
    grupos[propiedad].items.push(item);
  });
  return Object.values(grupos).map(m=>{
    return {
      ...m,
      propiedad: `${m.cat}`,
      len: m.items.length,
      monto: m.items.reduce((total, item)=>total+item.detalle_ventaMembresia[0].tarifa_monto, 0)
    }
  }).filter(f=>f.monto!==0);
}


function agruparPorGenero(data) {
  const grupos = {};

  data?.forEach(item => {
    const prop = `${item?.tb_cliente.sexo_cli}` || 0;
    if (!grupos[prop]) {
      grupos[prop] = {
        prop,
        id_sexo: item?.tb_cliente.sexo_cli,
        items: []
      };
    }
    grupos[prop].items.push(item);
  });
  return Object.values(grupos).map(m=>{
    return {
      ...m,
      propiedad: arraySexo.find(f=>f.value===Number(m.prop))?.label,
      len: m.items.length,
      monto: m.items.reduce((total, item)=>total+item.detalle_ventaMembresia[0].tarifa_monto, 0)
    }
  });
}


function agruparPorEstCivil(data) {
  const grupos = {};

  data?.forEach(item => {
    const prop = `${item?.tb_cliente.estCivil_cli}` || 0;
    if (!grupos[prop]) {
      grupos[prop] = {
        prop,
        id_estado_civil: item?.tb_cliente.estCivil_cli,
        items: []
      };
    }
    grupos[prop].items.push(item);
  });
  return Object.values(grupos).map(m=>{
    return {
      ...m,
      propiedad: arrayEstadoCivil.find(f=>f.value===Number(m.id_estado_civil))?.label,
      len: m.items.length,
      monto: m.items.reduce((total, item)=>total+item.detalle_ventaMembresia[0].tarifa_monto, 0)
    }
  });
}


function agruparPorEdad(data) {
  const grupos = {};

  data?.forEach(item => {
    const propiedad = `${item?.rango_edad}` || 0;
    if (!grupos[propiedad]) {
      grupos[propiedad] = {
        propiedad,
        rango_edad: item?.rango_edad,
        items: []
      };
    }
    grupos[propiedad].items.push(item);
  });
  return Object.values(grupos).map(m=>{
    return {
      ...m,
      propiedad: m.rango_edad,
      len: m.items.length,
      monto: m.items.reduce((total, item)=>total+item.detalle_ventaMembresia[0].tarifa_monto, 0),
      genero: agruparPorGenero(m.items)
    }
  });
}


function agruparPorSemanas(data) {
  const grupos = {};

  data?.forEach(item => {
    const propiedad = `${item.detalle_ventaMembresia[0].tb_semana_training.semanas_st}|${item.detalle_ventaMembresia[0].tb_semana_training.sesiones}` || 0;
    if (!grupos[propiedad]) {
      grupos[propiedad] = {
        propiedad,
        semanas: item.detalle_ventaMembresia[0].tb_semana_training.semanas_st,
        sesiones: item.detalle_ventaMembresia[0].tb_semana_training.sesiones,
        items: []
      };
    }
    grupos[propiedad].items.push(item);
  });
  return Object.values(grupos).map(m=>{
    return {
      ...m,
      propiedad: `${m.semanas} (${m.sesiones} SESIONES)`,
      len: m.items.length,
      monto: m.items.reduce((total, item)=>total+item.detalle_ventaMembresia[0].tarifa_monto, 0)
    }
  });
}


function agruparxPgm(data) {
    const grupos = {};

  data?.forEach(item => {
    const propiedad = `${item?.pgm}` || 0;
    if (!grupos[propiedad]) {
      grupos[propiedad] = {
        propiedad,
        pgm: item?.pgm,
        items: []
      };
    }
    grupos[propiedad].items.push(item);
  });
  return Object.values(grupos).map(m=>{
    return {
      ...m,
      propiedad: m.pgm,
      len: m.items.length,
      monto: m.items.reduce((total, item)=>total+item.detalle_ventaMembresia[0].tarifa_monto, 0)
    }
  });
}

