import React from 'react'
import { Table } from 'react-bootstrap';

export const DetalleVentaTransferencias = () => {
	return (
    <Table className="table table-centered mb-0">
      <tbody>
        <tr className="text-start">
          <td>
            <h5 className="m-0">Cliente emisor:</h5>
          </td>
          <td className="text-start  fw-semibold">Carlos Rosales Morales</td>
        </tr>
        <tr className="text-start">
          <td>
            <h5 className="m-0">Membresia por transferir:</h5>
          </td>
          <td className="text-start  fw-semibold">RPM 50</td>
        </tr>
        <tr className="text-start">
          <td>
            <h5 className="m-0">Semanas por transferir:</h5>
          </td>
          <td className="text-start  fw-semibold">24 semanas</td>
        </tr>
        <tr className="text-start">
          <td>
            <h5 className="m-0">Total:</h5>
          </td>
          <td className="text-start fw-semibold">$1234123.00</td>
        </tr>
      </tbody>
    </Table>
	);
}
