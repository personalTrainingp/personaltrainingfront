import { NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask';
import React from 'react'

export const ItemTableTotal = ({index, IsVentaCero, isTime, isNeedGenere, pFem, pMasc,  label, onClick, cantidad, porcentajeCantidad, monto, ticketMedio, porcentajeMonto, items=[]}) => {
	console.log(label, "labe");
	
  return (
		<tr onClick={onClick}>
			<td className="text-center">
				<li className="list-unstyled p-2">
					<div className={`fw-bold text-primary fs-1`}>{index+1}</div>
				</li>
			</td>
			<td className="text-center">
				<li className="list-unstyled p-2">
					<div className={`fw-bold text-primary fs-1 ${isTime && (`${label}`.split(' ')[1]=='PM'&&'bg-primary text-white')}`}>{label}</div>
				</li>
			</td>
			{
				!IsVentaCero&&
				<td className="text-center">
					<li className="list-unstyled p-2" style={{width: '300px'}}>
						<div className="fw-bold fs-1 text-end" >
							<NumberFormatMoney amount={monto} />
						</div>
					</li>
				</td>
			}
			<td className='text-center'>
				<li className="list-unstyled p-2">
					<div className="fw-bold fs-1 " >
					{cantidad}
					</div>
				</li>
			</td>
			{
				isNeedGenere && (
					<td className='text-center'>
						<li className="list-unstyled p-2">
							<div className="fw-bold fs-1 " >
							{pFem}
							</div>
						</li>
					</td>
				)
			}
			{
				isNeedGenere && (
					
						<td className='text-center'>
						<li className="list-unstyled p-2">
							<div className="fw-bold fs-1 " >
							{pMasc}
							</div>
						</li>
					</td>
				)
			}
			{
				!IsVentaCero&&
				<td className="text-center">
					<li className="list-unstyled p-2">
						<div className="fw-bold fs-1 " >
							{porcentajeMonto.toFixed(2)}
						</div>
					</li>
				</td>
			}
			<td className="text-center">
				<li className="list-unstyled p-2">
					<div className="fw-bold fs-1 " >
						{porcentajeCantidad.toFixed(2)}
					</div>
				</li>
			</td>
			{
				// !IsVentaCero &&
				// <td className="text-center">
				// 	<li className="list-unstyled p-2">
				// 		<div className="fw-bold fs-1 " >
				// 			<NumberFormatMoney amount={ticketMedio} />
				// 		</div>
				// 	</li>
				// </td>
			}
		</tr>
  );
}
