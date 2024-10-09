import React from 'react'
import { Table } from 'react-bootstrap';

export const DetalleVentaTransferencias = ({name_socio, ultima_mem_socio, sesiones_socio_antiguo, total}) => {
	return (
    <Table className="table table-centered mb-0">
      <tbody>
        <tr className="text-start">
          <td>
            <h5 className="m-0">SOCIO ANTIGUO:</h5>
          </td>
          <td className="text-start  fw-semibold">{name_socio}</td>
        </tr>
        <tr className="text-start">
          <td>
            <h5 className="m-0">Membresia por transferir:</h5>
          </td>
          <td className="text-start  fw-semibold">{ultima_mem_socio}</td>
        </tr>
        <tr className="text-start">
          <td>
            <h5 className="m-0">SESIONES POR TRANSFERIR:</h5>
          </td>
          <td className="text-start  fw-semibold">{sesiones_socio_antiguo}</td>
        </tr>
        <tr className="text-start">
          <td>
            <h5 className="m-0">Total:</h5>
          </td>
          <td className="text-start fw-semibold">{total}</td>
        </tr>
      </tbody>
    </Table>
	);
}
