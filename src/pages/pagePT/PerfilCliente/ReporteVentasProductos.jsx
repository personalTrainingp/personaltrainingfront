import Chart from 'react-apexcharts';

export const ReporteVentasProductos = ({dataVenta}) => {
    
    const productosAgrupados = dataVenta.flatMap(venta => 
        venta.detalle_ventaProductos?.map(producto => ({
            nombre_producto: producto.tb_producto.nombre_producto,
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
        colors: ['#D41115'], // Cambia el color de las barras (puedes añadir más colores si hay múltiples series)
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
