import React from 'react'

import Chart from 'react-apexcharts';

export const ComparativoxDiaBar = () => {
    const pagos = [
        {
            id: 2,
            nombre_producto: 'FS 45',
            total_ventas: 100,
        },{
            id: 2,
            nombre_producto: 'MUSCLE',
            total_ventas: 200,
        },{
            id: 3,
            nombre_producto: 'CHANGE 45',
            total_ventas: 400,
        }
    ]
    const series = [
        {
            name: 'TOTAL:',
          data: pagos.map(e=>e.total_ventas),
        },
      ];
    const options = {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '50%', // Ajusta este valor para hacer las barras más delgadas
          },
        },
        colors: ['#D41115'], // Cambia el color de las barras (puedes añadir más colores si hay múltiples series)
        dataLabels: {
            enabled: true,
            offsetX: 10,
            style: {
              fontSize: '16px', // Cambia este valor para hacer los números más grandes
            },
			formatter: function (val, opts) {
				return ''
			},
          },
        xaxis: {
          categories: pagos.map(e=>e.nombre_producto),
        },
        yaxis:{
          labels:{
            style: {
              fontSize: '15px', // Cambia este valor para hacer los números más grandes
              fontWeight: 'bold',
            },
          }
        },
		tooltip: {
			y: {
				formatter: function (val) {
					return formatCurrency(val);
				},
			},
		},
      };
      
	const formatCurrency = (value) => {
		return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
	};
  return (
    <div dir="ltr">
    <div style={{ height: '320px'}} className="mt-3 chartjs-chart">
        
    <Chart options={options} series={series} type="bar" height={350} />
    </div>
</div>
  )
}
