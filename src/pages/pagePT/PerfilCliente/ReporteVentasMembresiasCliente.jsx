import React from 'react'
import Chart from 'react-apexcharts';

export const ReporteVentasMembresiasCliente = ({dataVenta}) => {
  console.log(dataVenta);
  
    const productosAgrupados = dataVenta.flatMap(venta => 
        venta.detalle_ventaMembresia?.map(producto => ({
            nombre_producto: producto.tb_ProgramaTraining.name_pgm,
            tarifa_monto: producto.tarifa_monto
        })) || []
    ).reduce((acc, producto) => {
        const existingProduct = acc.find(p => p.nombre_producto === producto.nombre_producto);
        if (existingProduct) {
            existingProduct.tarifa_total += producto.tarifa_monto;
        } else {
            acc.push({ nombre_producto: producto.nombre_producto, tarifa_total: producto.tarifa_monto });
        }
        return acc;
    }, []);
    
    const series = [
        {
          data: productosAgrupados.map(e=>e.tarifa_total),
        },
      ];
    const options = {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '30%', // Ajusta este valor para hacer las barras más delgadas
          },
        },
        xaxis: {
          categories: productosAgrupados.map(e=>e.nombre_producto),
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
    
    <Chart options={options} series={series} type="bar" width={650} />
  )
}