import React, { useEffect } from 'react'
import Chart from 'react-apexcharts';
import config from '@/config';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
const processData = (data) => {
    // console.log(data.map(item=>item.items.reduce((sum, i)=>sum+)), "sumado");
    
    return {
        categories: data.map((item) => item.fecha), // Fechas en eje X
        series: [
          {
            name: "Ventas",
            data: data.map((item) =>
              item.items.reduce((sum, i) => sum + (i.detalle_ventaMembresium?.tarifa_monto || 0), 0)
            ), // Sumar tarifas por fecha
          },
          {
            name: "SOCIOS",
            data: data.map((item) =>
              item.items.length
            ), // Sumar tarifas por fecha
          },
          {
            name: "TICKET MEDIO",
            data: data.map((item) =>
                item.items.reduce((sum, i) => sum + (i.detalle_ventaMembresium?.tarifa_monto || 0), 0)/item.items.length
              ), // Sumar tarifas por fecha
          },
        ],
      };
  };
export const GrafLineal = ({data}) => {
    const { categories, series } = processData(data);

    const options = {
        chart: { type: "line" },
        xaxis: { categories },
        stroke: { curve: "smooth" },
        markers: {
          size: 6, // Tamaño del punto en la línea
          colors: ["#FF4560"], // Color de los puntos
          strokeWidth: 2,
        },
        dataLabels: {
          enabled: true, // Muestra los valores sobre las líneas
          style: {
            fontSize: "22px",
            colors: ["#000"], // Color del texto
          },
        },
          tooltip: {
            enabled: true, // Muestra información al pasar el mouse
            y: {
              formatter: (value) => `S/. ${value}`, // Formato de la moneda
            },
          },
        legend: {
            labels: {
              colors: ["#B00007", "#F1BD00", "#1869C5", "#16A111", "#9426B2", "#FF8000", "#0057D9", "#D10012"],
            },
          },
          colors: ["#B00007", "#F1BD00", "#1869C5", "#16A111", "#9426B2", "#FF8000", "#0057D9", "#D10012"],
    };
  return (
    <div className='container-chart'>
      <Chart options={options} series={series} type="line" height={550} />
    </div>
  )
}
