import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalItems = ({show, onHide, data, labelNam}) => {
    console.log(data, "data modalll");
    
  return (
    <Dialog header={labelNam} visible={show} onHide={onHide}>
        <Table className='fs-3'>
        			<thead>
						<tr>
							<th>Nombre del socio</th>
							<th>Edad</th>
							<th><SymbolSoles isbottom={false} fontSizeS={20}/></th>
							{/* <th>Amount</th> */}
						</tr>
					</thead>
					<tbody>
						{
							data?.map(d=>{
								return (
									<tr>
										<td>{d.tb_cliente.nombres_apellidos_cli}</td>
										{/* <td>{d.}</td> */}
										<td>
											<span className="">{d.edad}</span>
										</td>
										<td><NumberFormatMoney amount={d.suma_tarifa}/></td>
									</tr>
								)
							})
						}
					</tbody>
        </Table>
    </Dialog>
  )
}
