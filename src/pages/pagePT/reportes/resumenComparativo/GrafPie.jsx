import React from 'react'
import Chart from "react-apexcharts";

export const GrafPie = ({data=[], width, height}) => {
    const dataS = data.map(g=>{
        return {
            label: g.label,
            value: g.val
        }
    })
    const options = {
        labels: dataS.map(l=>l.label),
        legend: {
          fontSize: '24px',
          position: "bottom",
          labels: {
            colors: "#000", // Color del texto de la leyenda
          },
        },
        dataLabels: {
          offsetY: -100, // Ajusta este valor para subir los números
          enabled: true,
          formatter: (val, { seriesIndex, w }) => {
            const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            const value = w.globals.series[seriesIndex];
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} (${percentage}%)`; // Muestra el número y el porcentaje
          },
          style: {
            fontSize: "24px",
            fontWeight: "bold",
            colors: ["#fff"],
          },
        },
      };
    
      const series = dataS.map(l=>l.value); // Valores de cada segmento
    
  return (
    <div className='m-auto'>
        <Chart options={options} series={series} type="pie" width={width} height={height} />
    </div>
  )
}
