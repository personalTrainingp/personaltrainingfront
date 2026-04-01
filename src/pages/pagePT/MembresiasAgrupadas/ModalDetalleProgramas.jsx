import React from 'react'
import { Modal, Table } from 'react-bootstrap'

export const ModalDetalleProgramas = ({show, onHide, detalle=[]}) => {
    const table= tableData(detalle)
      const programas = getProgramas(table);
  return (
    <Modal show={show} onHide={onHide}>
        {/* <pre>
            {
                JSON.stringify(table, null, 2)
            }
        </pre> */}
    <Table className='w-100'>
      <thead>
        <tr className='bg-change'>
          <th className='text-white fs-3'>Año</th>
          {programas.map(p => (
            <th className='text-white fs-3 text-center' key={p}>{p}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(table).map(year => (
          <tr key={year}>
            <td className='fs-3 text-center'>{year}</td>
            {programas.map(p => (
              <td className='fs-3 text-center' key={p}>
                {table[year][p] || 0}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
    </Modal>
  )
}

const tableData = (data=[]) => {
  const result = {};

  data.forEach(item => {
    const year = new Date(item.fecha_venta).getFullYear();

    item.detalle_ventaMembresia.forEach(det => {
      const programa = det.tb_ProgramaTraining.name_pgm;

      if (!result[year]) result[year] = {};
      if (!result[year][programa]) result[year][programa] = 0;

      result[year][programa]++;
    });
  });

  return result;
};

const getProgramas = (table) => {
  const programas = new Set();

  Object.values(table).forEach(yearData => {
    Object.keys(yearData).forEach(p => programas.add(p));
  });

  return Array.from(programas);
};