import React, { useEffect } from 'react'
import { filtrarPorFechaVencimiento, useInformeEjecutivoStore } from '../../useInformeEjecutivoStore'
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';

export const AppSociosInactivos = ({corte}) => {
      const { obtenerSeguimientos, dataSeguimientos } = useInformeEjecutivoStore()
      const { fecha } = useSelector((e) => e.DATA);
      const fechaSeleccionada = `${fecha.split('-')[0]}-${fecha.split('-')[1]}`;
      useEffect(() => {
        obtenerSeguimientos()
      }, [])
      console.log({dataSeguimientos}, 'aaa');
      const sociosInactivos = filtrarPorFechaVencimiento(dataSeguimientos, `${fecha}-${corte.inicio}`, `${fecha}-${corte.corte}`)
  return (
    <div>
      TOTAL: {sociosInactivos.length}
        <Table>
          <thead>
            <tr>
              <th>NOMBRES Y APELLIDOS</th>
              <th>PROGRAMA</th>
              <th>FECHA DE VENCIMIENTO</th>
            </tr>
          </thead>
          <tbody>
            {
              sociosInactivos.map((socio, index) => {
                return (
                  <tr key={index}>
                    <td>{socio.nombres_apellidos_cli}</td>
                    <td>{socio.ultimoPrograma}</td>
                    <td>{socio.fecha_vencimiento_}</td>
                  </tr>
                )
              })
            }
            <tr>
              <td></td>
            </tr>
          </tbody>
        </Table>
    </div>
  )
}
