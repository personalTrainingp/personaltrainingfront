import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

export const FormatTable2 = ({ data, tFood }) => {
  const [tableData, setTableData] = useState(data);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortKey, setSortKey] = useState(null);

  const handleSort = (index, sectionIndex) => {
    const updatedData = [...tableData];
    updatedData[sectionIndex].body = [...updatedData[sectionIndex].body].sort((a, b) => {
      const aValue = a[index]?.celda || '';
      const bValue = b[index]?.celda || '';
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortKey(`${sectionIndex}-${index}`);
    setTableData(updatedData);
  };

  return (
    <>
      {tableData.map((section, sectionIndex) => (
        <Table striped responsive className="table-centered mb-4 fs-3 fw-bold" key={sectionIndex}>
          <thead className='bg-primary text-white'>
            <tr>
              {section.header.map((col, index) => (
                <th key={index} className='text-white' colSpan={col.colSpan || 1}>
                  {col.celda} {' '}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.body.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((col, colIndex) => (
                  <td key={colIndex} className="p-2" colSpan={col.colSpan || 1}>
                    {col.celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      ))}
      {tFood && (
        <div className='bg-primary text-white p-3 text-center fw-bold'>
          {tFood}
        </div>
      )}
    </>
  );
};
