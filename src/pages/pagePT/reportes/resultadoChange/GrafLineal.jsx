import React, { useEffect } from 'react'
import Chart from 'react-apexcharts';
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
export const GrafLineal = ({data}) => {
        // const { obtenerComparativoResumen, dataGroup, loading, dataGroupTRANSFERENCIAS, dataEstadoGroup, obtenerEstadosOrigenResumen } = useReporteResumenComparativoStore()
        // const { obtenerVentasMembresia } = useVentasMembresiaStore()
        // console.log(data, "toc");
        
        // useEffect(() => {
        //         if(RANGE_DATE[0]===null) return;
        //         if(RANGE_DATE[1]===null) return;
        //         // obtenerComparativoResumen(RANGE_DATE)
        //         // obtenerEstadosOrigenResumen(RANGE_DATE)
        //     }, [])
            //TODO: DATA MAPEADA, PARA SOLO VENTAS
            let dataAlter = []
            // dataGroup.map(g=>{
            //   const data = ordenarPorMes(g.detalle_ventaMembresium)
            //   return {
            //     data,
            //     name: g.tb_image[0].name_image,
            //     width_image: g.tb_image[0].width,
            //     height_image: g.tb_image[0].height,
            //     // tarifa_monto: g.detalle_ventaMembresium.map(m=>m.tarifa_monto)
            //   }
            // })
            // console.log(dataAlter, "ventas mes historico");
            

            const series = [
              { name: "Facturación", data: data.map((item) => parseFloat(item.facturacion.toFixed(2))) },
              { name: "Conversor", data: data.map((item) => parseFloat(item.conversor)) },
              { name: "Inversión", data: data.map((item) => parseFloat(item.inversion.toFixed(2))) },
              { name: "Número de Cierre", data: data.map((item) => parseFloat(item.numero_cierre.toFixed(2))) },
              { name: "Ticket Medio", data: data.map((item) => parseFloat(item.ticket_medio.toFixed(2))) },
              { name: "CAC", data: data.map((item) => parseFloat(item.cac)) },
              { name: "ROAS", data: data.map((item) => parseFloat(item.roas)) },
              { name: "NUMERO DE MENSAJES", data: data.map((item) => parseFloat(item.numero_mensajes.toFixed(2))) },
            ];
          
            const options = {
              chart: {
                type: "line",
                toolbar: { show: false },
              },
              xaxis: {
                categories: data.map((item) => item.fecha),
                labels: {
                  style: {
                    fontSize: '12px',
                    color: '#000000'
                  },
                  rotate: -45,
                  formatter: (value) => value,
                },
                tickPlacement: "on",
              },
              yaxis: {
                labels: {
                  formatter: function (value) {
                    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  },
                  style: {
                    fontWeight: "bold", // Aplica negrita
                    color: "#000", // Color negro para etiquetas del eje Y
                    color: ["#B00007", "#F1BD00", "#1869C5", "#16A111", "#9426B2"], // Asegura que el color sea negro
                  },
                },
                title: {
                  text: "Valores",
                  style: {
                    color: "#000",
                  },
                },
              },
              stroke: {
                curve: "smooth",
              },
              markers: {
                size: 4,
              },
              dataLabels: {
                background: {
                  enabled: true,
                  padding: 4,
                  borderRadius: 10,
                  borderWidth: 1,
                  // opacity: 0.9,
                  // dropShadow: {
                  //   enabled: true,
                  //   top: 1,
                  //   left: 1,
                  //   blur: 1,
                  //   color: '#ffffff',
                  //   opacity: 0.45
                  // }
                },
                enabled: true,
                style: {
                  fontSize: '30px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 'bold',
                  // colors: ["#000"]
                },
                formatter: (value) => {
                  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                },
              },
              legend: {
                labels: {
                  colors: ["#B00007", "#F1BD00", "#1869C5", "#16A111", "#9426B2", "#FF8000", "#0057D9", "#D10012"],
                },
              },
              colors: ["#B00007", "#F1BD00", "#1869C5", "#16A111", "#9426B2", "#FF8000", "#0057D9", "#D10012"],
            };
          
    const formatCurrency = (value) => {
        return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
    };
  return (
    <div className='container-chart'>
      <Chart options={options} series={series} type="line" height={550} />
    </div>
  )
}
