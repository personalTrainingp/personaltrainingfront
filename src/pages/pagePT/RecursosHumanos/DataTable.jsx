import { NumberFormatMoney } from '@/components/CurrencyMask'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { ModalDataDetalleTable } from './ModalDataDetalleTable'
import { useReportePlanillaStore } from './useReportePlanillaStore'
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc";
import Select from 'react-select'
dayjs.extend(utc);

function generarRangoMeses(mesAnio) {
  const [mesStr, anioStr] = mesAnio.trim().split("/");
  const mes = Number(mesStr);
  const anio = Number(anioStr);
  if (!mes || !anio) throw new Error("Formato esperado: MM/YYYY");

  const ultimoDia = new Date(anio, mes, 0).getDate();

  const inicio = dayjs.utc(new Date(Date.UTC(anio, mes - 1, 1))).startOf("day");
  const fin    = dayjs.utc(new Date(Date.UTC(anio, mes - 1, ultimoDia))).endOf("day");
  console.log({inicio, fin});
  
  return [inicio.toISOString(), fin.toISOString()];
}


export const DataTable = () => {
    const [optionsMeses, setoptionsMeses] = useState('')
    const [isOpenModalDetalleData, setisOpenModalDetalleData] = useState(false)
    const { obtenerMarcacionxFecha,obtenerContratosDeEmpleados, dataMarcacionxFecha, dataContratoxFecha } = useReportePlanillaStore()
    const [selectMes, setselectMes] = useState([])
    // Simulando datos para la tabla
  const data = [
    {
        mes: '08/2025',
        items_colaboradores_activos: [
            {cci: '', banco: 'bbva',cargo: 'contadora', nombre_apellidos: 'OFELIA VASQUEZ GARCIA', monto_pago: 2000, dias_tardanzas: 0, descuento: 0 }, 
            {cci: '00219319363020306118', banco: 'bcp',cargo: 'administracion', nombre_apellidos: 'MIRTHA MARQUEZ LEVANO', monto_pago: 2000, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0263629197-19', banco: 'bbva',cargo: 'venta', nombre_apellidos: 'ATENAS CORAL FIGUEROA', monto_pago: 1400, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0262250437', banco: 'bbva',cargo: 'sistemas', nombre_apellidos: 'CARLOS ROSALES MORALES', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0263567728', banco: 'bbva',cargo: 'supervision', nombre_apellidos: 'ALVARO SALAZAR GOMEZ', monto_pago: 2500, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0186-0200373041', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'JULIO CESAR TORRES ITURRIZAGA', monto_pago: 2000, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0186-0200506513', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'MILAGROS GALVAN DE LA CRUZ', monto_pago: 1550, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0227529488', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'VERONICA ROCIO GUTIERREZ REYNA', monto_pago: 1900, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0264721216', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'YASMIN JOSEFINA OLORTEGUI PEREZ', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0267745574', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'JESICA ROMERO ALONSO', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'CHRISTOPHER WILLY GARAY FIGUEROA', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0264733613', banco: 'bbva',cargo: 'NUTRICIONISTA', nombre_apellidos: 'TERESA ISABEL CHUECA GARCIA PYE', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0135-0201264485', banco: 'bbva',cargo: 'MANTENIMIENTO', nombre_apellidos: 'CARLOS CHUQUILLANQUI', monto_pago: 1800, dias_tardanzas: 0, descuento: 0 },
        ],
    }
  ]
  useEffect(() => {
    obtenerMarcacionxFecha(selectMes, 598)
    obtenerContratosDeEmpleados(selectMes)
  }, [selectMes])
  const dataContratoConMarcacion = dataContratoxFecha.map(c =>{
    const dataMarcacions = dataMarcacionxFecha.filter(m=>m.dni===c.numDoc_empl)
    const dataPlanilla = unirAsistenciaYContrato(dataMarcacions, c?._empl[0]?.contrato_empl?.filter(f=>f.id_tipo_horario===0), c.salario_empl)
    return {
      dataMarcacions,
      dataPlanilla,
      ...c
    }
  })
  console.log({dataMarcacionxFecha, dataContratoxFecha, dataContratoConMarcacion});
  const onChangeDetallePlanilla = (mesAnio)=>{
    // onOpenModalDetalleData()
    
    // setoptionsMeses(mesAnio)
      setselectMes(generarRangoMeses(mesAnio))
  }
  const onOpenModalDetalleData = ()=>{
    setisOpenModalDetalleData(true)
  }
  const onCloseModalDetalleData = ()=>{
    setisOpenModalDetalleData(false)
  }
  
  return (
    <>
      <Select
        options={[{label: '09/2025', value: '09/2025'}, {label: '08/2025', value: '08/2025'}, {label: '07/2025', value: '07/2025'}, {label: '06/2025', value: '06/2025'}]}
        onChange={(e)=>onChangeDetallePlanilla(e.value)}
      />
    <ModalDataDetalleTable dataContratoxFecha={dataContratoxFecha} unirAsistenciaYContrato={unirAsistenciaYContrato} dataMarcacionxFecha={dataMarcacionxFecha} dataContratoConMarcacion={dataContratoConMarcacion} show={isOpenModalDetalleData} onHide={onCloseModalDetalleData} mesAnio={selectMes}/>
    </>
  )
}


function unirAsistenciaYContrato(dataMarcacion = [], contrato_empl = [], sueldoMensual) {
  const toDateStr = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? null : d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  };
  const toTimeStr = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? null : d.toISOString().slice(11, 19); // HH:MM:SS
  };
  const timeToMinutes = (hhmmss) => {
    if (!hhmmss) return null;
    const [h, m, s] = hhmmss.split(":").map(Number);
    return h * 60 + m + Math.floor((s || 0) / 60);
  };

  // Index de marcación: quedarse con la más temprana por día
  const marcasByDate = new Map();
  for (const m of dataMarcacion) {
    const raw = m.tiempo_marcacion_new ?? m.tiempo_marcacion;
    if (!raw) continue;
    const iso = raw.includes("T") ? raw : raw.replace(" ", "T") + ".000Z";
    const fecha = toDateStr(iso);
    const hora = toTimeStr(iso);
    if (!fecha || !hora) continue;

    const curr = marcasByDate.get(fecha);
    if (!curr || timeToMinutes(hora) < timeToMinutes(curr.hora_marca)) {
      marcasByDate.set(fecha, { hora_marca: hora });
    }
  }

  // Armar resultado SOLO por días con contrato
  const out = [];
  for (const c of contrato_empl) {
    const fecha = toDateStr(c.fecha);
    const hora_inicio = toTimeStr(c.hora_inicio); // viene con 1970, solo hora
    if (!fecha || !hora_inicio) continue;

    const marca = marcasByDate.get(fecha) || { hora_marca: null };

    const minutosIni = timeToMinutes(hora_inicio);
    const minutosMarca = timeToMinutes(marca.hora_marca);
    const minutosDiferencia =
      minutosIni != null && minutosMarca != null
        ? Number(minutosMarca - minutosIni)
        : c.minutos;
    const minutosContratadosDelDia = c.minutos ?? null
    const minutosAsistidosDelDia = minutosContratadosDelDia-minutosDiferencia
    out.push({
      fecha,
      asistenciaYcontrato: {
        contrato_empl: {
          hora_inicio,
          minutos: minutosContratadosDelDia,
        },
        marcacion_empl: {
          hora_marca: marca.hora_marca,
        },
        minutosContratadosDelDia,
        minutosDiferencia,
        minutosAsistidosDelDia: minutosDiferencia<=(-1)?minutosContratadosDelDia:minutosAsistidosDelDia,
        sueldoNeto: valorDelDia(c.minutos ?? null, minutosDiferencia<=(-1)?minutosContratadosDelDia:minutosAsistidosDelDia, sueldoMensual/31)
      },
    });
  } 

  // Orden por fecha asc !((c.minutos ?? null)-marca.hora_marca)?(minutosDiferencia>0?minutosDiferencia:0):minutosDiferencia
  out.sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));
  return out;
}

function valorDelDia(minutosContratadoDelDia, minutosAsistidosDelDia, sueldoDelDia) {

  const valorDia = (minutosAsistidosDelDia*sueldoDelDia)/minutosContratadoDelDia
  return valorDia;
}