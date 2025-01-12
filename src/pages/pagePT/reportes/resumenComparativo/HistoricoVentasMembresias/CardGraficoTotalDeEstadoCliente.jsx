import React, { useEffect } from 'react'
import Chart from 'react-apexcharts';
import { useReporteResumenComparativoStore } from '../useReporteResumenComparativoStore';
import { useVentasMembresiaStore } from './useVentasMembresiaStore';
import config from '@/config';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import { Card } from 'react-bootstrap';

const RANGE_DATE= [new Date(2024, 8, 16), new Date()]
function ordenarPorMes(data) {
  const inicio = "2024-09"
  const agrupado = data.reduce((acumulador, item) => {
    const fechaVenta = new Date(item.tb_ventum.fecha_venta);
    const mes = `${String(fechaVenta.getMonth() + 1).padStart(2, '0')}/${fechaVenta.getFullYear()}`;

    if (!acumulador[mes]) {
      acumulador[mes] = {
        mes,
        tarifa_monto_total: 0,
        items: []
      };
    }

    acumulador[mes].tarifa_monto_total += item.tarifa_monto;
    acumulador[mes].items.push(item);

    return acumulador;
  }, {});

  // Crear un rango de meses desde el inicio hasta el mes más reciente
  const mesesCompletos = [];
  let fechaActual = new Date(`${inicio}-01T00:00:00Z`);
  const fin = new Date();

  while (fechaActual <= fin) {
    const mes = `${String(fechaActual.getMonth() + 1).padStart(2, '0')}/${fechaActual.getFullYear()}`;
    mesesCompletos.push(mes);
    fechaActual.setMonth(fechaActual.getMonth() + 1); // Avanzar al siguiente mes
  }

  // Completar los meses faltantes con datos vacíos
  const resultado = mesesCompletos.map((mes) => {
    if (agrupado[mes]) {
      return agrupado[mes];
    }
    return {
      mes,
      tarifa_monto_total: 0,
      items: []
    };
  });

  return resultado;
}
function generarMeses(desdeAnio, desdeMes) {
  const meses = [];
  const fechaInicio = new Date(desdeAnio, desdeMes - 1); // Septiembre 2024
  const fechaActual = new Date();

  while (fechaInicio <= fechaActual) {
    const mes = (fechaInicio.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaInicio.getFullYear();
    meses.push(`${mes}/${anio}`);
    fechaInicio.setMonth(fechaInicio.getMonth() + 1);
  }

  return meses
}
export const CardGraficoTotalDeEstadoCliente = () => {
  const { obtenerComparativoResumen, dataGroup, loading, dataGroupTRANSFERENCIAS, dataEstadoGroup, obtenerEstadosOrigenResumen } = useReporteResumenComparativoStore()
  // const { obtenerVentasMembresia } = useVentasMembresiaStore()
          useEffect(() => {
                  if(RANGE_DATE[0]===null) return;
                  if(RANGE_DATE[1]===null) return;
                  obtenerComparativoResumen(RANGE_DATE)
                  // obtenerEstadosOrigenResumen(RANGE_DATE)
              }, [])
  //TODO: DATA MAPEADA, PARA SOLO VENTAS
  let dataAlter = dataGroup.map(g=>{
    const data = ordenarPorMes(g.detalle_ventaMembresium)
    return {
      data,
      name: g.tb_image[0].name_image,
      width_image: g.tb_image[0].width,
      height_image: g.tb_image[0].height,
      // tarifa_monto: g.detalle_ventaMembresium.map(m=>m.tarifa_monto)
    }
  })
  console.log(dataGroup, "ventas");
  dataAlter = dataAlter.map(a=>{
    return {
      data: a.data.map(g=>g.tarifa_monto_total),
      name: a.name,
    }
  })
  console.log(dataAlter, "ventas mes historico");
  

  const series = [
    {
      name: "Nuevos (Change)",
      data: [10, 20, 15, 25, 30, 35],
    },
    {
      name: "Renovaciones (Change)",
      data: [5, 10, 8, 12, 15, 18],
    },
    {
      name: "Reinscripciones (Change)",
      data: [3, 6, 4, 8, 10, 12],
    },
    {
      name: "Nuevos (FS)",
      data: [12, 18, 20, 22, 25, 28],
    },
    {
      name: "Renovaciones (FS)",
      data: [6, 9, 7, 10, 12, 15],
    },
    {
      name: "Reinscripciones (FS)",
      data: [4, 5, 6, 8, 9, 10],
    },
    {
      name: "Nuevos (Muscle)",
      data: [15, 25, 20, 30, 35, 40],
    },
    {
      name: "Renovaciones (Muscle)",
      data: [8, 12, 10, 15, 18, 22],
    },
    {
      name: "Reinscripciones (Muscle)",
      data: [5, 8, 7, 10, 12, 15],
    },
  ]
  const options= {
    chart: {
      type: 'bar',
      height: 400,
      stacked: true, // Activa las barras apiladas
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
      },
    },
    series: [
      {
        name: 'Nuevos (Change)',
        data: [10, 20, 15, 25, 30, 35],
      },
      {
        name: 'Renovaciones (Change)',
        data: [5, 10, 8, 12, 15, 18],
      },
      {
        name: 'Reinscripciones (Change)',
        data: [3, 6, 4, 8, 10, 12],
      },
      {
        name: 'Nuevos (FS)',
        data: [12, 18, 20, 22, 25, 28],
      },
      {
        name: 'Renovaciones (FS)',
        data: [6, 9, 7, 10, 12, 15],
      },
      {
        name: 'Reinscripciones (FS)',
        data: [4, 5, 6, 8, 9, 10],
      },
      {
        name: 'Nuevos (Muscle)',
        data: [15, 25, 20, 30, 35, 40],
      },
      {
        name: 'Renovaciones (Muscle)',
        data: [8, 12, 10, 15, 18, 22],
      },
      {
        name: 'Reinscripciones (Muscle)',
        data: [5, 8, 7, 10, 12, 15],
      },
    ],
    xaxis: {
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], // Meses
    },
    yaxis: {
      title: {
        text: 'Cantidad',
      },
    },
    legend: {
      position: 'top',
    },
    group: {
      style: {
        groups: [
          { name: 'Change', series: [0, 1, 2] },
          { name: 'FS', series: [3, 4, 5] },
          { name: 'Muscle', series: [6, 7, 8] },
        ],
      },
    },
  };
  return (
            <Card>
              <Card.Header className='align-self-center'>
                <h1>TOTAL</h1>
              </Card.Header>
              <Card.Body>
              <div>
                <div id="chart">
                    {/* <ReactApexChart options={state.options} series={state.series} type="bar" height={350} /> */}
                          <Chart options={options} series={series} type="bar" height={550} />
                    
                  </div>
                <div id="html-dist"></div>
              </div>
              </Card.Body>
            </Card>
  )
}
