import { NumberFormatMoney } from '@/components/CurrencyMask'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import React from 'react'

export const FormatTableCR = ({header='', data=[]}) => {
  const columns = [
    {id: 2, header: <div className='fs-3 text-center '>{header}</div>, render: (row)=>{
      return (
        <div className='' style={{fontSize: '30px'}}>
          {row.propiedad}
        </div>
      )
    }},
    {id: 3, header: <div className='fs-3 text-center '>SOCIOS</div>,  sortable: true, accessor: 'len', render: (row)=>{
      return (
        <div className=' text-center' style={{fontSize: '30px'}}>
          {row.len}
        </div>
      )
    }},
    {id: 4, header: <div className='fs-3 text-center '>SOCIOS<br/>%</div>, render: (row)=>{
      return (
        <div className=' text-center' style={{fontSize: '30px'}}>
          {( (row.len / data.reduce((total, item)=>total+item.len, 0))*100).toFixed(2) }
        </div>
      )
    }},
    {id: 5, header: <div className='fs-3 text-center '>VENTAS</div>, sortable: true, accessor: 'monto', render: (row)=>{
      return (
        <div className='text-center'>
          <NumberFormatMoney
            amount=
            {row.monto}
          />
        </div>
      )
    }},
  ]
  return (
    <>
        <DataTableCR
          searchable={false}
          exportable={false}
          data={data}
          columns={columns}
          tfoot={
            <tfoot>
              <tr>
                <td className='bg-change text-white fs-1 text-center'>TOTAL</td>
                <td className='bg-change text-white fs-1 text-center'>{data.reduce((total, item)=>total+item.len, 0)}</td>
                <td className='bg-change text-white fs-1 text-center'>{100}</td>
                <td className='bg-change text-white fs-1 text-center'><NumberFormatMoney amount={data.reduce((total, item)=>total+item.monto, 0)}/></td>
                {/* <td className='bg-change text-white'>{100}</td> */}
              </tr>
            </tfoot>
          }
        />
    </>
  )
}

export const FormatTableTotalCR = ({header='', data=[]}) => {
  const columns = [
    {id: 2, header: <div className='fs-2'>{header}</div>, render: (row)=>{
      return (
        <div className='fs-2'>
          {row.propiedad}
        </div>
      )
    }},
    {id: 5, header: <div className='fs-2'>{'VENTAS'}</div>, sortable: true, accessor: 'monto', render: (row)=>{
      return (
        <div className='text-center'>
          <NumberFormatMoney
            amount=
            {row.monto}
          />
        </div>
      )
    }},
    {id: 3, header: <div className='fs-2'>{'SOCIOS'}</div>,  sortable: true, accessor: 'len', render: (row)=>{
      return (
        <div className='fs-2 text-center'>
          {row.len}
        </div>
      )
    }},
    {id: 4, header: <div className='fs-2 text-center'> VENTA TOTAL<br/> %</div>, render: (row)=>{
      return (
        <div className='fs-2 text-center'>
          {( (row.monto / data.reduce((total, item)=>total+item.monto, 0))*100).toFixed(2) }
        </div>
      )
    }},
    {id: 5, header: <div className='fs-2 text-center'>SOCIOS<br/>%</div>, render: (row)=>{
      return (
        <div className='fs-2 text-center'>
          {( (row.len / data.reduce((total, item)=>total+item.len, 0))*100).toFixed(2) }
        </div>
      )
    }},
    {id: 6, header: <div className='fs-2 text-center'>TICKET MEDIO <br/> S/.</div>, render: (row)=>{
      return (
        <div className='text-center'>
          <NumberFormatMoney
            amount=
            {( (row.monto / row.len)) }
          />
        </div>
      )
    }},
  ]
  return (
    <div className='d-flex justify-content-center'>
        <DataTableCR
          searchable={false}
          exportable={false}
          data={data}
          columns={columns}
          tfoot={
            <tfoot>
              <tr>
                <td className='bg-change text-white text-center' style={{fontSize: '40px'}}>TOTAL</td>
                <td className='bg-change text-white text-center' style={{fontSize: '40px'}}><NumberFormatMoney className='fs-1' amount={data.reduce((total, item)=>total+item.monto, 0)}/></td>
                <td className='bg-change text-white text-center' style={{fontSize: '40px'}}>{data.reduce((total, item)=>total+item.len, 0)}</td>
                <td className='bg-change text-white text-center' style={{fontSize: '40px'}}><NumberFormatMoney className='fs-1' amount={100}/></td>
                <td className='bg-change text-white text-center' style={{fontSize: '40px'}}><NumberFormatMoney className='fs-1' amount={100}/></td>
                <td className='bg-change text-white text-center' style={{fontSize: '40px'}}><NumberFormatMoney className='fs-1' amount={data.reduce((total, item)=>total+item.monto, 0)/data.reduce((total, item)=>total+item.len, 0)}/></td>
                {/* <td className='bg-change text-white'>{100}</td> */}
              </tr>
            </tfoot>
          }
        />
    </div>
  )
}

export const FormatTableProgramaCR = ({header='', data=[]}) => {
  const columns = [
    {id: 2, header: `${header}`, render: (row)=>{
      return (
        <>
          {row.propiedad}
        </>
      )
    }},
    {id: 5, header: `VENTAS`, sortable: true, accessor: 'monto', render: (row)=>{
      return (
        <>
          <NumberFormatMoney
            amount=
            {row.monto}
          />
        </>
      )
    }},
    {id: 3, header: `SOCIOS`,  sortable: true, accessor: 'len', render: (row)=>{
      return (
        <>
          {row.len}
        </>
      )
    }},
    {id: 4, header: `% VENTA TOTAL`, render: (row)=>{
      return (
        <>
          {( (row.monto / data.reduce((total, item)=>total+item.monto, 0))*100).toFixed(2) }
        </>
      )
    }},
    {id: 5, header: `% SOCIOS`, render: (row)=>{
      return (
        <>
          {( (row.len / data.reduce((total, item)=>total+item.len, 0))*100).toFixed(2) }
        </>
      )
    }},
    {id: 6, header: `S/. TICKET MEDIO`, render: (row)=>{
      return (
        <>
          <NumberFormatMoney
            amount=
            {( (row.monto / row.len)) }
          />
        </>
      )
    }},
  ]
  return (
    <>
        <DataTableCR
          searchable={false}
          exportable={false}
          data={data}
          columns={columns}
          tfoot={
            <tfoot>
              <tr>
                <td className='bg-change text-white'>TOTAL</td>
                <td className='bg-change text-white'>{data.reduce((total, item)=>total+item.len, 0)}</td>
                <td className='bg-change text-white'>{100}</td>
                <td className='bg-change text-white'><NumberFormatMoney amount={data.reduce((total, item)=>total+item.monto, 0)}/></td>
                <td className='bg-change text-white'><NumberFormatMoney amount={100}/></td>
                <td className='bg-change text-white'><NumberFormatMoney amount={data.reduce((total, item)=>total+item.monto, 0)/data.reduce((total, item)=>total+item.len, 0)}/></td>
                {/* <td className='bg-change text-white'>{100}</td> */}
              </tr>
            </tfoot>
          }
        />
    </>
  )
}
