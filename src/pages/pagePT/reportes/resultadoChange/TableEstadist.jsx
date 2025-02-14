import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap';

export const TableEstadist = ({data}) => {
  return (
    
    <Table className="table-centered mb-0" style={{width: '750px'}} striped responsive>
      <thead className='bg-primary fs-2'>
        <tr>
              <th className={`text-white`} >
                {data.mes}
              </th>
              <th className={`text-white`} >
                {/* {data.mes} */}
              </th>
        </tr>
      </thead>
      <tbody>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '35px'}} className={`fw-bold ml-3`}>{'INVERSION'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '45px'}} className={`fw-bold ml-3`}><SymbolSoles numero={<NumberFormatMoney amount={data.inversion}/>}/></span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '35px'}} className={`fw-bold ml-3`}>{'FACTURACION'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '45px'}} className={`fw-bold ml-3`}><SymbolSoles numero={<NumberFormatMoney amount={data.facturacion}/>}/></span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '35px'}} className={`fw-bold ml-3`}>{'MENSAJES'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '45px'}} className={`fw-bold ml-3`}>{data.numero_mensajes}</span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '35px'}} className={`fw-bold ml-3`}>{'CONVERSION'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '45px'}} className={`fw-bold ml-3`}>{((data.numero_cierre/data.numero_mensajes)*100).toFixed(2)} %</span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '35px'}} className={`fw-bold ml-3`}>{'ventas'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '45px'}} className={`fw-bold ml-3`}>{data.numero_cierre}</span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '35px'}} className={`fw-bold ml-3`}>{'CAC'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '45px'}} className={`fw-bold ml-3`}>{(data.inversion/data.numero_cierre).toFixed(2)}</span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '35px'}} className={`fw-bold ml-3`}>{'ROAS'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '45px'}} className={`fw-bold ml-3`}>{(data.facturacion/data.inversion).toFixed(0)}</span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '35px'}} className={`fw-bold ml-3`}>{'TICKET MEDIO'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '45px'}} className={`fw-bold ml-3`}><SymbolSoles numero={<NumberFormatMoney amount={(data.ticket_medio)}/>}/></span>
              </li>
            </td>
          </tr>
      </tbody>
    </Table>
  )
}
