import React from 'react'
import HorarioMensual from './ViewDataHorarios';
export const App = () => {

const dataRaw = [
  {
    colaborador: "Miguel Humberto La Torre Céspedes",
    cargo: "ESTILISTA",
    diasLaborables: [   
                  {
        id_tipo_horario: 0,
        fecha: "2025-10-31 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
            {
        id_tipo_horario: 0,
        fecha: "2025-10-30 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
            {
        id_tipo_horario: 0,
        fecha: "2025-10-29 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
            {
        id_tipo_horario: 0,
        fecha: "2025-10-28 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      }, 
            {
        id_tipo_horario: 0,
        fecha: "2025-10-27 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-25 05:00:00.0000000 +00:00",
        horario: "00:00:00.0000000",
        minutos: 0
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-24 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-23 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-22 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-21 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-20 00:00:00.0000000 +00:00",
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-18 05:00:00.0000000 +00:00",
        horario: "07:00:00.0000000",
        minutos: 260
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-17 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-16 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-15 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-14 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-13 00:00:00.0000000 +00:00",
        horario: "06:00:00.0000000",
        minutos: 360
      },  
      {
        id_tipo_horario: 0,
        fecha: "2025-10-11 05:00:00.0000000 +00:00",
        horario: "00:00:00.0000000",
        minutos: 0
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-10 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-09 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-08 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-07 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-06 00:00:00.0000000 +00:00",
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-04 05:00:00.0000000 +00:00", 
        horario: "07:00:00.0000000",
        minutos: 260
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-03 05:00:00.0000000 +00:00",
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-02 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360 
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-01 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      }
    ]
  },
    {
    colaborador: "Miguel Humberto La Torre Céspedes",
    cargo: "ESTILISTA",
    diasLaborables: [   
                  {
        id_tipo_horario: 0,
        fecha: "2025-10-31 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
            {
        id_tipo_horario: 0,
        fecha: "2025-10-30 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
            {
        id_tipo_horario: 0,
        fecha: "2025-10-29 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
            {
        id_tipo_horario: 0,
        fecha: "2025-10-28 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      }, 
      {
        id_tipo_horario: 0,
        fecha: "2025-10-27 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-25 05:00:00.0000000 +00:00",
        horario: "00:00:00.0000000",
        minutos: 0
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-24 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-23 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-22 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-21 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-20 00:00:00.0000000 +00:00",
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-18 05:00:00.0000000 +00:00",
        horario: "07:00:00.0000000",
        minutos: 260
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-17 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-16 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-15 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-14 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-13 00:00:00.0000000 +00:00",
        horario: "06:00:00.0000000",
        minutos: 360
      },  
      {
        id_tipo_horario: 0,
        fecha: "2025-10-11 05:00:00.0000000 +00:00",
        horario: "00:00:00.0000000",
        minutos: 0
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-10 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-09 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-08 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-07 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-06 00:00:00.0000000 +00:00",
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-04 05:00:00.0000000 +00:00", 
        horario: "07:00:00.0000000",
        minutos: 260
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-03 05:00:00.0000000 +00:00",
        horario: "06:00:00.0000000",
        minutos: 360
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-02 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360 
      },
      {
        id_tipo_horario: 0,
        fecha: "2025-10-01 05:00:00.0000000 +00:00", 
        horario: "06:00:00.0000000",
        minutos: 360
      }
    ]
  },
];

const horarioColors = [
  { id_tipo_horario: 0, bg: "#0c09cbff" },
  { id_tipo_horario: 1, bg: "orange" },
  { id_tipo_horario: 2, bg: "#f5b26a" } // por ejemplo
];

  return (
    <>
        
        <HorarioMensual 
          dataRaw={dataRaw}
          horarioColors={horarioColors}
          fechaInicio="2024-10-01"
          fechaFin="2024-10-31"
        />
    </>
  )
}
