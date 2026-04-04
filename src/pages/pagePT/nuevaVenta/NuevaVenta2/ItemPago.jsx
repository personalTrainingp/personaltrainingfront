import { MoneyFormatter, NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'

export const ItemPago = ({deletePay, id, formaPay, fechaPay, observacionPay, montoPay, id_forma_pago, id_tarjeta, id_tipo_tarjeta, id_banco, porcentajeBancos}) => {
    
  return (
            <ul className='d-flex justify-content-between align-items-center shadow p-1 border m-0 rounded rounded-3 my-1' key={id}>
                
				<li style={{float: 'left', width: '80%', listStyle: 'none', fontWeight: 'bold', fontSize: '15px'}}>
                    <i className='mdi mdi-delete-forever-outline text-danger fs-3 ms-2' onClick={()=>deletePay()}></i>
                    {id_forma_pago}{id_tarjeta?`/${id_tarjeta}`:''}{id_tipo_tarjeta?`/${id_tipo_tarjeta}`:''}{id_banco?`/${id_banco}`:''}
					{/* {
						porcentajeBancos && (
							<>
								<br/>
								<span className='text-change'>
									% COMISION: {porcentajeBancos} <span className='float-end'><NumberFormatMoney amount={montoPay*(porcentajeBancos/100)}/></span>
								</span>
							</>
						)
					} */}
                </li>
				<li style={{float: 'left',  width: '40%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney amount={montoPay}/>
					</span>
				</li>
			</ul>
  )
}
