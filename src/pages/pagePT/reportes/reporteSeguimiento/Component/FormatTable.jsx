import React,{ useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
function sumarValoresPorHeader(array, isSummary) {
  return array.reduce((total, subArray) => {
    const item = subArray.find(obj => obj.isSummary === true);
    return item ? total + item.value : total;
  }, 0);
}
export const FormatTable = ({ data=[] }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "desc" });

  const handleSort = (header) => {
    const isDescending = sortConfig.key === header && sortConfig.direction === "desc";
    const direction = isDescending ? "asc" : "desc";

    const sorted = [...sortedData].sort((a, b) => {
      const itemA = a.find((col) => col.header === header);
      const itemB = b.find((col) => col.header === header);

      if (itemA?.value !== undefined && itemB?.value !== undefined) {
        return direction === "asc" ? itemA.value - itemB.value : itemB.value - itemA.value;
      }
      return 0;
    });

    setSortedData(sorted);
    setSortConfig({ key: header, direction });
  };
  
  // Obtener encabezados desde la primera fila de datos
  const headers = data[0]?.map((col) => col.header);

  return (
    <Table className="table-centered mb-0" striped responsive>
      <thead className='bg-primary fs-2'>
        <tr>
          {headers?.map((header, index) => {
            const isSortable = data[0][index]?.isSortable;
            return (
              <th className={`text-white`} key={index} onClick={() => isSortable && handleSort(header)} style={{ cursor: isSortable ? "pointer" : "default" }}>
                {header} {isSortable && (sortConfig.key === header ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕")}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row?.map((col, colIndex) => (
              <td key={colIndex} onClick={col.onClick}>
              <li className={`d-flex flex-row justify-content-between p-1`}>
                <span style={{fontSize: '35px'}} className={`fw-bold ml-1`}>
                  <span className='mr-1 text-black'>{col.isIndexado? rowIndex+1:''} </span>
                  <span className={`${(`${col.value}`.split(' ')[1]==='PM'?'bg-primary text-white':`${col.isPropiedad?'text-primary':'text-black'}`)}`}>{col.HTML ?? col.value}</span></span>
              </li>
            </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className='bg-primary'>
          {data[0]?.map((col, index) => (
            <td key={index}>
            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white ml-4' style={{fontSize: '40px'}}>{col.tFood}</span></li>
        </td>
            // <td key={index}>{col.tFood}</td>
          ))}
        </tr>
      </tfoot>
    </Table>
  );
}




































export const FormatTableS = ({ data, tFood }) => {
    const [tableData, setTableData] = useState(data);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortKey, setSortKey] = useState('');
  
    const handleSort = (key) => {
      const sortedData = tableData.map((row) => 
        row.slice().sort((a, b) => {
          if (a[key] < b[key]) return sortOrder === 'asc' ? -1 : 1;
          if (a[key] > b[key]) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        })
      );
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      setSortKey(key);
      setTableData(sortedData);
    };
    console.log({data});
    
    return (
      <Table className="table-centered mb-0"
      striped
      responsive>
        <thead className='bg-primary fs-2'>
          <tr>
            {data[0].map((col) => (
              <th className={`text-white`} key={col.header}>
                {col.header}{' '}
                {/* <Button
                  size="sm"
                  variant={sortKey === col.header ? 'primary' : 'secondary'}
                  onClick={() => handleSort(col.header)}
                >
                  {sortOrder === 'asc' && sortKey === col.header ? '↓' : '↑'}
                </Button> */}
              </th>
              
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((col, colIndex) => (
                <td key={colIndex}>
                  <li className={`d-flex flex-row justify-content-between p-2 ${(`${col.value}`.split(' ')[1]==='PM'?'bg-primary text-white':`${col.isPropiedad?'text-primary':'text-black'}`)}`}>
                    
                                        <span style={{fontSize: '32px'}} className={`fw-bold ml-3`}>{col.value}</span>
                    {/* {col.isPropiedad && <div className='pi pi-external-link m-0 cursor-pointer' />} */}
                  </li>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tr className='bg-primary'>
        {data[0].map((col) => (
          <td>
          <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white ml-4' style={{fontSize: '40px'}}>{col.tFood}</span></li>
      </td>
              
            ))}
                                                    </tr>
      </Table>
    );
}
