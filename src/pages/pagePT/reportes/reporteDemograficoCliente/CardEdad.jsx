import { TabPanel, TabView } from 'primereact/tabview'
import React, { useState } from 'react'
import { TarjetasPago } from './TarjetasPago'
function calcularEdad(fechaNacimiento, fechaVenta) {
    const hoy = new Date(fechaVenta);
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
  
    // Ajustar si el cumpleaños no ha ocurrido aún este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
  }
  
  function sumarTarifaMonto(detalles) {
      return [
        detalles.detalle_membresia&&detalles.detalle_membresia,
        detalles.detalle_cita_nut&&detalles.detalle_cita_nut,
        detalles.detalle_cita_tratest&&detalles.detalle_cita_tratest,
        detalles.detalle_prodAccesorios&&detalles.detalle_prodAccesorios,
        detalles.detalle_prodSuplementos&&detalles.detalle_prodSuplementos
      ]
        .flat() // Aplana los arrays para unirlos en uno solo
        .reduce((total, item) => total + (item?.tarifa_monto || 0), 0); // Suma los valores de tarifa_monto
    }
const agruparPorRangoEdad = (data) => {
    const rangos = [
      { rango_edad: "38 - 42", min: 38, max: 42 },
      { rango_edad: "43 - 47", min: 43, max: 47 },
      { rango_edad: "30 - 32", min: 30, max: 32 },
      { rango_edad: "48 - 52", min: 48, max: 52 },
      { rango_edad: "33 - 37", min: 33, max: 37 },
      { rango_edad: "53 - 57", min: 53, max: 57 },
      { rango_edad: "22 - 29", min: 22, max: 29 },
      { rango_edad: "16 - 21", min: 16, max: 21 },
      { rango_edad: "10 - 15", min: 10, max: 15 },
      // { rango_edad: "1 - 3", min: 1, max: 3 },
      { rango_edad: "58 - 63", min: 58, max: 63 },
      { rango_edad: "64 - 69", min: 64, max: 69 },
      { rango_edad: "70 - \n 🔝", min: 70, max: Infinity },


      // { rango_edad: "28", min: 28, max: 28 },
      // { rango_edad: "29", min: 29, max: 29 },
      // { rango_edad: "30", min: 30, max: 30 },
      // { rango_edad: "31", min: 31, max: 31 },
      // { rango_edad: "32", min: 32, max: 32 },
      // { rango_edad: "28", min: 28, max: 28 },

      // { rango_edad: "88 a mas", min: 88, max: Infinity },
    ];
  
    const resultado = rangos.map((rango) => {
      const items = data.filter(
        (item) => item.edad >= rango.min && item.edad <= rango.max
      );
      const suma_tarifa_total = items.reduce((acc, curr) => acc + curr.suma_tarifa, 0);
  
      return {
        rango_edad: rango.rango_edad,
        suma_tarifa_total,
        items,
      };
    });
  
    return resultado;
  };
export const CardEdad = ({tasks, dataSumaTotal}) => {
    const pagos = tasks.map(t => ({
        fec_nacimiento: t.tb_cliente.fecha_nacimiento,
        edad: calcularEdad(t.tb_cliente.fecha_nacimiento, t.fecha_venta),
        tb_cliente: t.tb_cliente,
        suma_tarifa: sumarTarifaMonto(t)
    }))
    const ordenarxSumaTarifaTotal = agruparPorRangoEdad(pagos).sort((a,b)=>b.suma_tarifa_total-a.suma_tarifa_total)
    const ordenarxCantidad = agruparPorRangoEdad(pagos).sort((a,b)=>b.items.length-a.items.length)
    const ordenarxTicketMedio = agruparPorRangoEdad(pagos).sort((a, b) => {
        const promedioA = a.suma_tarifa_total/a.items.length;
        const promedioB = b.suma_tarifa_total/b.items.length;
        console.log(promedioA, 'prom A');
        // console.log(promedioB, 'prom B');
        // console.log(promedioB, '');
        
        return promedioA;
      });
    console.log(ordenarxTicketMedio);
  return (
    <>
    <TabView>
        <TabPanel header={<span className='fs-2'>RANKING POR RANGO DE EDAD </span>}>
        <TarjetasPago labelsGraphic={ordenarxSumaTarifaTotal.map(f=>(f.items.length))} rangeEdadOrden={ordenarxCantidad} tasks={tasks} title={'RANKING POR RANGO DE EDAD'}/>
        </TabPanel>
        <TabPanel header={<span className='fs-2'>RANKING POR RANGO DE EDAD POR MONTO DE VENTA</span>}>
        <TarjetasPago labelsGraphic={ordenarxSumaTarifaTotal.map(f=>(f.suma_tarifa_total))} rangeEdadOrden={ordenarxSumaTarifaTotal} tasks={tasks} title={'RANKING POR RANGO DE EDAD POR MONTO DE VENTA'}/>
        </TabPanel>
        <TabPanel header={<span className='fs-2'>RANKING POR RANGO DE EDAD POR TICKET MEDIO</span>}>
        <TarjetasPago labelsGraphic={ordenarxSumaTarifaTotal.map(f=>(f.suma_tarifa_total/f.items.length))} rangeEdadOrden={ordenarxTicketMedio} tasks={tasks} title={'RANKING POR RANGO DE EDAD POR TICKET MEDIO'}/>
        </TabPanel>
    </TabView>

    </>
  )
}
