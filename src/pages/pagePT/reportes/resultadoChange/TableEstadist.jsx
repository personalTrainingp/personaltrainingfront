import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask';
import { Button } from 'primereact/button';
import React from 'react'
import { Table } from 'react-bootstrap';

export const TableEstadist = ({data, onOpenModalAddMesResChange, onDataViewVentas}) => {
  return (
    <Table className="table-centered mb-0" striped responsive>
      <thead className='bg-primary fs-2' onClick={onOpenModalAddMesResChange}>
        <tr>
              <th className={`text-white`} >
                {data.fecha}
              </th>
              <th className={`text-white`} >
                {/* {data.mes} */}
              </th>
        </tr>
      </thead>
      <tbody>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-1 text-primary`}>
                <span style={{fontSize: '30px'}} className={`fw-bold ml-3`}>{'INVERSION'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-1 float-end`}>
                <span style={{fontSize: '40px'}} className={`fw-bold ml-3`}><SymbolSoles fontSizeS={'fs-1'} numero={<NumberFormatMoney amount={data.inversion}/>}/></span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-1 text-primary`}>
                <span style={{fontSize: '30px'}} className={`fw-bold ml-3`}>{'FACTURACION'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-1 float-end`}>
                <span style={{fontSize: '40px'}} className={`fw-bold ml-3`}><SymbolSoles fontSizeS={'fs-1'} numero={<NumberFormatMoney amount={data.facturacion}/>}/></span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-1 text-primary`}>
                <span style={{fontSize: '30px'}} className={`fw-bold ml-3`}>{'MENSAJES'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-1 float-end`}>
                <span style={{fontSize: '40px'}} className={`fw-bold ml-3`}><NumberFormatter amount={data.numero_mensajes }/></span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-1 text-primary`}>
                <span style={{fontSize: '30px'}} className={`fw-bold ml-3`}>{'CONVERSION'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-1 float-end`}>
                <span style={{fontSize: '40px'}} className={`fw-bold ml-3`}>{data.conversor} %</span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-1 text-primary`}>
                <span style={{fontSize: '30px'}} className={`fw-bold ml-3`}>{'SOCIOS'}</span>
              </li>
            </td>
            <td onClick={onDataViewVentas}>
              <li className={`d-flex flex-row justify-content-between p-1 float-end`} >
                <span style={{fontSize: '40px'}} className={`fw-bold ml-3`}>{data.numero_cierre}</span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '30px'}} className={`fw-bold ml-3`}>{'CAC'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '40px'}} className={`fw-bold ml-3`}>{data.cac}</span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '30px'}} className={`fw-bold ml-3`}>{'ROAS'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '40px'}} className={`fw-bold ml-3`}>{(data.roas)}</span>
              </li>
            </td>
          </tr>
          <tr>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 text-primary`}>
                <span style={{fontSize: '30px'}} className={`fw-bold ml-3`}>{'TICKET MEDIO'}</span>
              </li>
            </td>
            <td>
              <li className={`d-flex flex-row justify-content-between p-2 float-end`}>
                <span style={{fontSize: '40px'}} className={`fw-bold ml-3`}><SymbolSoles fontSizeS={'fs-1'} numero={<NumberFormatMoney amount={(data.ticket_medio).toFixed(2)}/>}/></span>
              </li>
            </td>
          </tr>
      </tbody>
    </Table>
  )
}
