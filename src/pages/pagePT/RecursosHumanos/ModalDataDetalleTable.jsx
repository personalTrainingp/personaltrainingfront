import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalDataDetalleTable = ({mesAnio, show, onHide, data}) => {
  console.log(data, "porrrr");
  
  return (
    <Dialog header={`DETALLE DEL ${mesAnio}`} visible={show} onHide={onHide}>
      <div className='fs-4'>
        <Table striped responsive>
          <thead className='bg-primary text-white'>
            <tr className='text-white'>
              <th className='text-white'>CARGO</th>
              <th className='text-white'>COLABORADOR</th>
              <th className='text-white'>SEGUN CONTRATO <SymbolSoles fontSizeS={'10px'}/></th>
              <th className='text-white'>DIAS LABORABLES SEGUN CONTRATO</th>
              <th className='text-white'>DIAS CON TARDANZA (3MIN TOLERANCIA)</th>
              <th className='text-white'>DESCUENTO</th>
              <th className='text-white'>MONTO A PAGAR <SymbolSoles fontSizeS={'10px'}/></th>
              <th className='text-white'>BANCO</th>
              <th className='text-white'>CUENTA O CCI</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.cargo}</td>
                <td>{item.nombre_apellidos}</td>
                <td><NumberFormatMoney amount={item.monto_pago}/></td>
                <td>{31}</td>
                <td>{item.dias_tardanzas}</td>
                <td>{item.descuento}</td>
                <td><NumberFormatMoney amount={(item.monto_pago-item.descuento)}/></td>
                <td>{item.banco}</td>
                <td>{item.cci}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Dialog>
  )
}
