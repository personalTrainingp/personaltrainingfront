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

  const base = dayjs.utc(`${anio}-${String(mes).padStart(2, "0")}-01`);
  const inicio = base.startOf("month").startOf("day"); // 00:00:00Z del 1er día
  const fin    = base.endOf("month").endOf("day");     // 23:59:59.999Z del último día

  return [inicio.toISOString(), fin.toISOString()];
}


export const DataTable = () => {
    const [optionsMeses, setoptionsMeses] = useState('')
    const [isOpenModalDetalleData, setisOpenModalDetalleData] = useState(false)
    const { obtenerMarcacionxFecha,obtenerContratosDeEmpleados, dataMarcacionxFecha, dataContratoxFecha } = useReportePlanillaStore()
    const [selectMes, setselectMes] = useState([])
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
        options={[{label: '09/2025', value: '09/2025'}, {label: '08/2025', value: '08/2025'}, {label: '07/2025', value: '07/2025'}, {label: '06/2025', value: '06/2025'}, {label: '10/2025', value: '10/2025'}]}
        onChange={(e)=>onChangeDetallePlanilla(e.value)}
      />
    <ModalDataDetalleTable dataContratoxFecha={dataContratoxFecha} unirAsistenciaYContrato={unirAsistenciaYContrato} dataMarcacionxFecha={dataMarcacionxFecha} dataContratoConMarcacion={dataContratoConMarcacion} show={isOpenModalDetalleData} onHide={onCloseModalDetalleData} mesAnio={selectMes}/>
    </>
  )
}

// Helpers con dayjs
const toDateStrUTC = (val) => {
  const d = dayjs.utc(val);
  return d.isValid() ? d.format("YYYY-MM-DD") : null;
};

const toTimeStrUTC = (val) => {
  const d = dayjs.utc(val);
  return d.isValid() ? d.format("HH:mm:ss") : null;
};

// Acepta: "YYYY-MM-DDTHH:mm:ssZ", "YYYY-MM-DD HH:mm:ss", etc. -> retorna ISO utc string
const normalizeToUTC = (raw) => {
  if (!raw) return null;
  // Si ya parece ISO con 'T' y quizás 'Z', lo tomamos como UTC
  if (typeof raw === "string" && raw.includes("T")) {
    const d = dayjs.utc(raw);
    return d.isValid() ? d.toISOString() : null;
  }
  // Formato tipo "YYYY-MM-DD HH:mm:ss"
  if (typeof raw === "string" && raw.includes(" ")) {
    const d = dayjs.utc(raw.replace(" ", "T"));
    return d.isValid() ? d.toISOString() : null;
  }
  // Si viene numérico/Date-like, intentar parse directo a utc
  const d = dayjs.utc(raw);
  return d.isValid() ? d.toISOString() : null;
};

const extractOnlyTime = (val) => {
  if (!val) return null;
  // Si trae fecha (e.g., "1970-01-01T08:00:00Z"), formatear a HH:mm:ss
  if (typeof val === "string" && val.includes("T")) {
    const d = dayjs.utc(val);
    return d.isValid() ? d.format("HH:mm:ss") : null;
  }
  // Si ya es "HH:mm:ss"
  if (/^\d{2}:\d{2}:\d{2}$/.test(String(val))) return String(val);
  // Último recurso: parsear y formatear
  const d = dayjs.utc(val);
  return d.isValid() ? d.format("HH:mm:ss") : null;
};

const timeToMinutes = (hhmmss) => {
  if (!hhmmss) return null;
  const [h, m, s] = hhmmss.split(":").map(Number);
  return h * 60 + m + Math.floor((s || 0) / 60);
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function unirAsistenciaYContrato(dataMarcacion = [], contrato_empl = [], sueldoMensual) {
  function valorDelDia(minutosContratadoDelDia, minutosAsistidosDelDia, sueldoDelDia) {
  if (!minutosContratadoDelDia || minutosContratadoDelDia <= 0) return 0;
  const asistidos = clamp(minutosAsistidosDelDia ?? 0, 0, minutosContratadoDelDia);
  return (asistidos * sueldoDelDia) / minutosContratadoDelDia;
}

  // 1) Tomar la marca más temprana por día (en UTC)
  const marcasByDate = new Map();
  for (const m of dataMarcacion) {
    const iso = normalizeToUTC(m.tiempo_marcacion_new ?? m.tiempo_marcacion);
    if (!iso) continue;

    const fecha = toDateStrUTC(iso);       // "YYYY-MM-DD"
    const hora  = toTimeStrUTC(iso);       // "HH:mm:ss"
    if (!fecha || !hora) continue;

    const curr = marcasByDate.get(fecha);
    if (!curr || timeToMinutes(hora) < timeToMinutes(curr.hora_marca)) {
      marcasByDate.set(fecha, { hora_marca: hora });
    }
  }

  // 2) Construir salida solo para días que tienen contrato
  const out = [];
  for (const c of contrato_empl) {
    const fecha = toDateStrUTC(c.fecha);
    const hora_inicio = extractOnlyTime(c.hora_inicio); // puede venir con 1970 o solo hora

    if (!fecha || !hora_inicio) continue;

    const marca = marcasByDate.get(fecha) || { hora_marca: null };

    const minutosIni = timeToMinutes(hora_inicio);
    const minutosMarca = timeToMinutes(marca.hora_marca);

    // Diferencia real (marca - inicio), si no hay marca, usar c.minutos como fallback (tu lógica previa)
    const minutosDiferencia =
      minutosIni != null && minutosMarca != null
        ? Number(minutosMarca - minutosIni)
        : (c.minutos ?? null);

    const minutosContratadosDelDia = c.minutos ?? null;

    // Asistidos = contratados - diferencia (si llegó tarde, diferencia>0, si llegó antes, <0)
    let minutosAsistidosDelDia = null;
    if (minutosContratadosDelDia != null && minutosDiferencia != null) {
      minutosAsistidosDelDia = minutosContratadosDelDia - minutosDiferencia;
      // Evitar negativos o superar lo contratado
      minutosAsistidosDelDia = clamp(
        minutosAsistidosDelDia,
        0,
        minutosContratadosDelDia
      );
    }

    // Sueldo diario prorrateado (31 como en tu código)
    const sueldoDelDia = sueldoMensual / contrato_empl.filter(e=>e.id_tipo_horario===0).length;

    const sueldoNeto =
      minutosContratadosDelDia && minutosAsistidosDelDia != null
        ? (minutosAsistidosDelDia * sueldoDelDia) / minutosContratadosDelDia
        : 0;

    out.push({
      fecha,
      dias: contrato_empl.filter(e=>e.id_tipo_horario===0).length,
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
        minutosAsistidosDelDia,
        // sueldoNeto,
        sueldoDelDia,
        valorDia: valorDelDia(minutosContratadosDelDia, minutosAsistidosDelDia, sueldoDelDia)
      },
    });
  }

  // 3) Ordenar por fecha asc usando dayjs
  out.sort((a, b) =>
    dayjs.utc(a.fecha).isBefore(dayjs.utc(b.fecha)) ? -1 :
    dayjs.utc(a.fecha).isAfter(dayjs.utc(b.fecha))  ?  1 : 0
  );

  return out;
}

function valorDelDia(minutosContratadoDelDia, minutosAsistidosDelDia, sueldoDelDia) {

  const valorDia = (minutosAsistidosDelDia*sueldoDelDia)/minutosContratadoDelDia
  return valorDia;
}