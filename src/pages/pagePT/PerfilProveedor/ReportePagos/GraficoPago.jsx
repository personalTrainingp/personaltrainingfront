import React from 'react'
import Chart from 'react-apexcharts';

export const GraficoPago = ({abono, saldo}) => {
    const options = {
        series: [abono, saldo],
        labels: ["Abono", "Saldo"],
        chart: {
          type: 'donut',
        },
        responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ],
        colors: ['#008000', '#FF0000'], // Cambia el color de las barras (puedes añadir más colores si hay múltiples series)
        dataLabels: {
            enabled: true,
            offsetX: 10,
            style: {
              fontSize: '25px', // Cambia este valor para hacer los números más grandes
            },
			// formatter: function (val, opts) {
			// 	return ''
			// },
          },
      };
  return (
    <div className='d-flex justify-content-center'>
        <Chart options={options} series={options.series} width={450} type="pie" height={450} />
    </div>
  )
}
