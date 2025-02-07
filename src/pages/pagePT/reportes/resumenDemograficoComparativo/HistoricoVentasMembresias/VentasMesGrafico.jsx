import React, { useEffect } from 'react'
import Chart from 'react-apexcharts';
import { useReporteResumenComparativoStore } from '../useReporteResumenComparativoStore';
import { useVentasMembresiaStore } from './useVentasMembresiaStore';
import config from '@/config';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';

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
export const VentasMesGrafico = () => {
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
            // console.log(dataGroup, "ventas");
            dataAlter = dataAlter.map(a=>{
              return {
                data: a.data.map(g=>g.tarifa_monto_total),
                name: a.name,
              }
            })
            // console.log(dataAlter, "ventas mes historico");
            

        const series = dataAlter
        const options = {
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [5, 7, 5],
              curve: 'straight',
              dashArray: [0, 8, 5]
            },
            title: {
              text: 'MONTO',
              align: 'left'
            },
            legend: {
              formatter: function(val, opts) {
                return `
                <div className='custom-legend-item'>
                  <img width=${val.width_image} height=80 src='${config.API_IMG.LOGO}${val}'></img>
                </div>
                `; 
              },
              
              tooltipHoverFormatter: function(val, opts) {
                return val
              }
            },
            markers: {
              size: 0,
              hover: {
                sizeOffset: 6
              }
            },
            xaxis: {
              categories: generarMeses(2024, 9),
              labels:{
                style: {
                  fontSize: '25px',
                  fontWeight: 'bold',
                },
              },
              offsetY: 30, // Ajusta el espacio horizontal
              offsetX: 0, // Ajusta el espacio horizontal
            },
            yaxis: {
              // offsetY: 10, // Ajusta el espacio horizontal
              labels:{
                style: {
                  fontSize: '25px',
                  fontWeight: 'bold',
                },
                formatter: function(val, opts) {
                  // console.log(opts, "opttt");
                        // Formatea el número como moneda
                return new Intl.NumberFormat('es-PE', { 
                  style: 'currency', 
                  currency: 'PEN' // Cambia a tu moneda deseada, por ejemplo, USD, EUR, etc.
                }).format(val);
                },
              },
            },
            tooltip: {
              y: [
                {
                  title: {
                    formatter: function (val) {
                      return val + " (mins)"
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val + " per session"
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                }
              ]
            },
            grid: {
              borderColor: '#f1f1f1',
            }
          }
          
    const formatCurrency = (value) => {
        return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
    };
  return (
    <div className='container-chart'>
      <Chart options={options} series={series} type="line" height={550} />
    </div>
  )
}
