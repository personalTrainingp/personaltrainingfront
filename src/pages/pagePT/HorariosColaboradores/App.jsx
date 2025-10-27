import React from 'react'
import { ViewDataHorarios } from './ViewDataHorarios'

export const App = () => {
    const colaboradores = [
  {
    id: 1,
    nombre: "ALVARO",
    diasTexto: ["LUNES a VIERNES", "SABADO", "DOMINGO"],
    bloques: [
      // cada bloque = un rango pintado
      {
        inicio: "07:00", // HH:mm en 24h
        fin: "14:00",
        tipo_horario: "presencial",
      },
      // ...
    ],
  }
];
    const legendColors = [
    { tipo_horario: "presencial", color: "#1e90ff" },
    { tipo_horario: "refrigerio", color: "#ff0000" },
    { tipo_horario: "sabado", color: "#9c27b0" },
    { tipo_horario: "virtual", color: "#707070" },
    { tipo_horario: "standbye", color: "#b388ff" },
    ];

  return (
    <>
        <ViewDataHorarios data={colaboradores} legendColors={legendColors}/>
    </>
  )
}
