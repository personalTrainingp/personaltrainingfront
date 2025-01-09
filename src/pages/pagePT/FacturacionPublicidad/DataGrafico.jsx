import dayjs from 'dayjs';
import React from 'react'
import Chart from 'react-apexcharts';
function agruparPorMes(datos) {
    return datos.reduce((acumulador, item) => {
        // Extraemos el mes y el año de la fecha
        const partesFecha = item.fecha.split('/');
        const mesAnio = `${partesFecha[1]}/${partesFecha[2]}`; // Formato MM/YYYY

        // Verificamos si ya existe un grupo para este mes y año
        let grupo = acumulador.find(grupo => grupo.mesAnio === mesAnio);

        if (!grupo) {
            // Si no existe el grupo, lo creamos
            grupo = { mesAnio, dolares_total: 0, items: [] };
            acumulador.push(grupo);
        }

        // Actualizamos el total de dólares y agregamos el item al grupo
        grupo.dolares_total += item.dolares;
        grupo.items.push(item);

        return acumulador;
    }, []);
}

export const DataGrafico = ({dat}) => {
    const pagos = agruparPorMes(dat).map(producto => ({
        mesAnio: dayjs(producto.mesAnio, 'MM/YYYY').format('MMM[.] YYYY'),
        dolares_total: producto.dolares_total
    })).sort((a, b) => b.mesAnio.split('/')[0] - a.mesAnio.split('/')[0]) || []
    
    const series = [
        {
            name: 'TOTAL',
          data: pagos.map(e=>e.dolares_total),
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
            style: {
              fontSize: '20px', // Cambia este valor para hacer los números más grandes
            },
			formatter: function (val, opts) {
				return ''
			},
          },
        xaxis: {
          categories: pagos.map(e=>e.mesAnio),
        },
		yaxis:{
      labels: {
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
          whiteSpace: 'normal', // Permitir saltos de línea
          wordWrap: 'break-word', // Romper palabras largas si es necesario
        },
      },
  
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
                            <Chart options={options} series={series} type="bar" height={550} />
  )
}
