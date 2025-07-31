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
    <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
  <table className="table table-striped mb-0" style={{ width: '100%', tableLayout: 'fixed' }}>
    <thead className='bg-primary' style={{ position: 'sticky', top: 0, zIndex: 10, color: 'white', fontSize: '23px' }}>
      <tr>
        {headers?.map((header, index) => {
          const isSortable = data[0][index]?.isSortable;
          return (
            <th
              key={index}
              onClick={() => isSortable && handleSort(header)}
              className='bg-primary'
              style={{
                cursor: isSortable ? "pointer" : "default",
              }}
            >
              <div style={{width: '300px'}} className='d-flex justify-content-center'>
                <div>
                  {header}{" "}
                  {isSortable &&
                    (sortConfig.key === header
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕")}
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
    <tbody>
      {sortedData.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((col, colIndex) => (
            <td key={colIndex} onClick={col.onClick}>
                <div style={{ fontSize: '35px', width: '300px' }} className={`fw-bold ${colIndex==0?'text-start':'text-end'}`}>
                  <span className={`mr-1 text-black ${colIndex==0?'':'d-none'}`}>
                    {col.isIndexado ? rowIndex + 1 : ''} 
                  </span>
                  <span style={{marginRight: '120px'}} className={` ${(`${col.value}`.split(' ')[1] === 'PM' ? 'bg-primary text-white' : (col.isPropiedad ? 'text-primary' : 'text-black'))}`}>
                    {col.HTML ?? col.value}
                  </span>
                </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
    <tfoot  style={{ position: 'sticky', bottom: 0, zIndex: 2,  }} className="bg-primary">
      <tr>
        {data[0]?.map((col, index) => (
          <td key={index}>
            <div style={{ fontSize: '50px', width: '300px' }} className={`fw-bold ${index==0?'text-start':'text-end'}`}>
              <span className={`fw-bold text-white ${index===0?'':''}`} style={{ marginRight: '120px' }}>
                {col.tFood}
              </span>
            </div>
          </td>
        ))}
      </tr>
    </tfoot>
  </table>
</div>

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
