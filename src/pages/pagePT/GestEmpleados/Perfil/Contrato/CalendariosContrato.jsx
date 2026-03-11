import React, { useState } from "react"

const diasHeader = [
  "LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"
]

const nombresMes = [
  "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
  "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"
]

const diasSemana = [
  "DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"
]

/* ---------- TUS FUNCIONES IGUAL ---------- */

function generarCalendario(fechaInicio, fechaFin, dataJornada, estabilidades){
  const dias = []
  let actual = new Date(fechaInicio)
  const contadores = {}

  while (actual <= fechaFin) {

    const diaNombre = diasSemana[actual.getDay()]
    const eventos = dataJornada.filter(d => d.dia === diaNombre)

    let activo = true

    if (eventos.length) {

      const est = estabilidades.find(
        e => e.id === eventos[0].id_estabilidad
      )

      if (est && !(est.si === 0 && est.no === 0)) {

        const ciclo = est.si + est.no

        contadores[diaNombre] ??= 0

        activo = contadores[diaNombre] % ciclo < est.si

        contadores[diaNombre]++

      }
    }

    dias.push({
      fecha: new Date(actual),
      dia: actual.getDate(),
      mes: actual.getMonth(),
      anio: actual.getFullYear(),
      diaSemana: diaNombre,
      activo,
      eventos: activo ? eventos : []
    })

    actual.setDate(actual.getDate() + 1)
  }

  return dias
}

function agruparPorMes(calendario){

  const map = {}

  calendario.forEach(d=>{

    const key = `${d.anio}-${d.mes}`

    if(!map[key]){
      map[key]={
        anio:d.anio,
        mes:d.mes,
        dias:[]
      }
    }

    map[key].dias.push(d)

  })

  return Object.values(map)
}

function obtenerOffsetPrimerDia(anio,mes){

  const first = new Date(anio,mes,1)

  let day = first.getDay()

  if(day===0) day = 7

  return day-1
}

/* ---------- COMPONENTE ---------- */

export default function CalendariosContrato({
  fechaInicio="2026-01-01",
  fechaFin="2026-03-30",
  estabilidades=[
    {id: 3, label: '2 dias si y un dia no', si: 2, no: 1},
    {id: 1, label: '3 dias si y un dia no', si: 1, no: 1},
    {id: 2, label: 'Fijo toda las veces', si: 0, no: 0},
  ],
  dataJornadaPorSemana=[
    {dia: 'LUNES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
    {dia: 'MARTES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
    {dia: 'MIERCOLES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
    {dia: 'JUEVES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
    {dia: 'VIERNES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
    {dia: 'SABADO', id_estabilidad: 1, hora_inicio: '07:00:00', hora_fin: '13:00:00'},
  ]
}) {

  const calendario = generarCalendario(
    new Date(fechaInicio),
    new Date(fechaFin),
    dataJornadaPorSemana,
    estabilidades
  )

  const meses = agruparPorMes(calendario)

  /* -------- MES INICIAL -------- */

  const fechaActual = new Date()
  const fInicio = new Date(fechaInicio)
  const fFin = new Date(fechaFin)

  const fechaBase =
    fechaActual > fInicio && fechaActual < fFin
      ? fechaActual
      : fFin

  const indexInicial = meses.findIndex(
    m =>
      m.mes === fechaBase.getMonth() &&
      m.anio === fechaBase.getFullYear()
  )

  const [indexMes,setIndexMes] = useState(
    indexInicial >= 0 ? indexInicial : 0
  )

  const mes = meses[indexMes]

  const offset = obtenerOffsetPrimerDia(mes.anio,mes.mes)

  /* -------- UI -------- */

  return(

    <div>

      {/* HEADER CARRUSEL */}

      <div style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        gap:20,
        marginBottom:20
      }}>

        <button
          onClick={()=>setIndexMes(v=>Math.max(v-1,0))}
        >
          ◀
        </button>

        <h3 style={{margin:0}}>
          {nombresMes[mes.mes]} {mes.anio}
        </h3>

        <button
          onClick={()=>setIndexMes(v=>Math.min(v+1,meses.length-1))}
        >
          ▶
        </button>

      </div>

      {/* HEADER DIAS */}

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(7,1fr)",
        gap:6,
        marginBottom:6
      }}>

        {diasHeader.map(d=>(

          <div key={d} style={{
            fontWeight:"bold",
            textAlign:"center"
          }}>
            {d}
          </div>

        ))}

      </div>

      {/* DIAS */}

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(7,1fr)",
        gap:6
      }}>

        {[...Array(offset)].map((_,i)=>(
          <div key={"empty"+i}/>
        ))}

        {mes.dias.map((d,j)=>(

          <div
            key={j}
            style={{
              border:"1px solid #ccc",
              padding:10,
              textAlign:"center",
              borderRadius:6,
              background:d.activo ? "#e8f4ff" : "#f1f1f1"
            }}
          >
            {d.dia}
          </div>

        ))}

      </div>

    </div>

  )

}