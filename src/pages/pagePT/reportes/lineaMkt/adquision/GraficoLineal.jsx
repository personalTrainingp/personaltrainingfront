import React from 'react';
import Chart from 'react-apexcharts';

export const GraficoLineal = ({data}) => {

    
    
  const fechas = data.map((d) => d.fecha);

  const nombresVendedores = [
    ...new Set(data.flatMap((d) => d.itemVendedores.map((v) => v.nombre))),
  ];

  // Crear series por vendedor con null si tarifa = 0 (no muestra barra)
  const series = nombresVendedores
    .map((nombre) => {
      const valores = data.map((mes) => {
        const vendedor = mes.itemVendedores.find((v) => v.nombre === nombre);
        const tarifa = vendedor?.datos?.total?.tarifa || 0;
        return tarifa > 0 ? tarifa : null; // Oculta barra con null
      });
      return {
        name: nombre,
        data: valores,
      };
    })
    .filter((serie) => serie.data.some((v) => v !== null)); // Oculta vendedores 100% en cero

  const hayDatos = series.length > 0;

  const options = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: fechas,
      title: { text: "Meses" },
    },
    
    yaxis: {
      title: { text: 'Tarifa', style: { fontSize: '16px' } },
      labels: {
        style: { fontSize: '14px' },
        formatter: (val) => `S/ ${val.toLocaleString('es-PE')}`,
      },
    },
    title: {
      text: "Tarifa por Vendedor por Mes",
      align: "center",
    },
    legend: {
      position: "bottom",
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        borderRadius: 4,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => (val != null ? `S/ ${val}` : "Sin tarifa"),
      },
    },
  };

  return hayDatos ? (
    <Chart options={options} series={series} type="bar" height={400} />
  ) : (
    <p>No hay datos para mostrar.</p>
  );
}
