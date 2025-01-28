import React,{ useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
function sumarValoresPorHeader(array, isSummary) {
  return array.reduce((total, subArray) => {
    const item = subArray.find(obj => obj.isSummary === true);
    return item ? total + item.value : total;
  }, 0);
}
export const FormatTable = ({ data, tFood, onOpenModalSOCIOS }) => {
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
    console.log({tableData});
    
    return (
      <Table className="table-centered mb-0"
      striped
      responsive>
        <thead className='bg-primary fs-3'>
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
                <td onClick={()=>onOpenModalSOCIOS(col.items, '', 'SS')} key={colIndex}>
                  <li className={`d-flex flex-row justify-content-between p-2 ${(`${col.value}`.split(' ')[1]==='PM'?'bg-primary text-white':`${col.isPropiedad?'text-primary':'text-black'}`)}`}>
                                        <span style={{fontSize: '40px'}} className={`fw-bold ml-3 fs-2`}>{col.value}</span>
                  </li>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tr className='bg-primary'>
        {data[0].map((col) => (
          <td>
          <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>{col.tFood}</span></li>
      </td>
              
            ))}
                                                    </tr>
      </Table>
    );
}
