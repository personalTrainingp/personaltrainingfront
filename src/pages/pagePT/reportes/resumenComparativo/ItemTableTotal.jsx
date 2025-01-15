import { NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask';
import React from 'react'

export const ItemTableTotal = ({label, onClick, cantidad, porcentajeCantidad, monto, ticketMedio, items=[]}) => {
  return (
		<tr onClick={onClick}>
			<td className="text-center">
				<li className="list-unstyled p-2">
					<div className="fw-bold text-primary fs-1 ">{label}</div>
				</li>
			</td>
			<td className='text-center'>
				<li className="list-unstyled p-2">
					<div className="fw-bold fs-1 " >
					{cantidad}
					</div>
				</li>
			</td>
			<td className="text-center">
				<li className="list-unstyled p-2">
					<div className="fw-bold fs-1 " >
						<NumberFormatMoney amount={ticketMedio} />
					</div>
				</li>
			</td>
			<td className="text-center d-flex justify-content-center">
				<li className="list-unstyled p-2 bg-danger" style={{width: '300px'}}>
					<div className="fw-bold fs-1 text-end" >
						<NumberFormatMoney amount={monto} />
					</div>
				</li>
			</td>
			<td className="text-center">
				<li className="list-unstyled p-2">
					<div className="fw-bold fs-1 " >
						{porcentajeCantidad.toFixed(2)}
					</div>
				</li>
			</td>
		</tr>
  );
}
