import React from 'react'

import Chart from 'react-apexcharts';
export const ComparativaGeneral = () => {

    const series = [{
        name: 'Fs 45',
        data: [44, 55, 57]
      }, {
        name: 'muscle',
        data: [76, 85, 101]
      }, {
        name: 'Change 45',
        data: [35, 41, 36]
      }
    ]
    const options = {
        colors: ["#D41115"],
        chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: ['FS 45', 'MUSCLE', 'CHANGE 45'],
            
          labels:{
            style: {
              fontSize: '15px', // Cambia este valor para hacer los números más grandes
              fontWeight: 'bold',
            },
          }
          },
          yaxis: {
            title: {
              text: '$ (thousands)'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "$ " + val + " thousands"
              }
            }
          }
      };
      
	const formatCurrency = (value) => {
		return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
	};
  return (
    <div dir="ltr">
    <div className="chartjs-chart">
        <Chart options={options} series={series} type="bar" height={350} />
    </div>
</div>
  )
}
