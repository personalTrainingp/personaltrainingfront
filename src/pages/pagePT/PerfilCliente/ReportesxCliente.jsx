import React from 'react'
import { ReporteVentasProductos } from './ReporteVentasProductos';
import { ReporteVentasMembresiasCliente } from './ReporteVentasMembresiasCliente';
import { ReporteVentasCitas } from './ReporteVentasCitas';

export const ReportesxCliente = ({dataVenta, uid}) => {
    console.log(dataVenta, uid);
    // Extraer todos los objetos {nombre_producto, tarifa_monto} de detalle_ventaProductos
    // Extraer y agrupar por nombre_producto, sumando la tarifa_monto
    
  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
        <div>
            <h3>PRODUCTOS:</h3>
            <ReporteVentasProductos dataVenta={dataVenta}/>
        </div>
        <div>
            <h3>MEMBRESIAS:</h3>
            <ReporteVentasMembresiasCliente dataVenta={dataVenta}/>
        </div>
        <div>
            <h3>CITAS:</h3>
            <ReporteVentasCitas dataVenta={dataVenta}/>
        </div>
    </div>
  )
}
