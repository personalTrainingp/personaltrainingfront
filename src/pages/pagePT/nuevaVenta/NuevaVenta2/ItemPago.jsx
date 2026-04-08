import { MoneyFormatter, NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'

export const ItemPago = ({deletePay, id, montoPay, id_forma_pago, id_tarjeta, id_tipo_tarjeta, id_banco, porcentajeBancos, cuotas=0, porcentajeBancosMasIgv}) => {
    
  return (
            <ul className='d-flex justify-content-between align-items-start shadow p-1 border m-0 rounded rounded-3 my-1' key={id}>
                
				<li style={{float: 'left', width: '80%', listStyle: 'none', fontWeight: 'bold', fontSize: '25px'}}>
                    <i className='mdi mdi-delete-forever-outline text-change fs-3 ms-2' onClick={()=>deletePay()}></i>
                    {id_forma_pago}{id_tarjeta?`/${id_tarjeta}`:''}{id_tipo_tarjeta?`/${id_tipo_tarjeta}`:''}{id_banco?`/${id_banco}`:''}
					{
						porcentajeBancos&& (
							<>
								<br/>
								<span className='text-change fs-3' style={{marginLeft: '18px'}}>
									POS: {porcentajeBancos.toFixed(2)} % + igv = {porcentajeBancosMasIgv} %
									{/*  */}
								</span>
								<br/>
								{
									cuotas!==0 && (
										<span className='text-change fs-4' style={{marginLeft: '18px'}}>{cuotas} cuotas sin intereses</span>
									)
								}
							</>
						)
					}
                </li>
				<li style={{float: 'left',  width: '23%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney amount={montoPay}/>
					</span>
					{
						porcentajeBancos&&(
							<span className='d-flex justify-content-between text-change'>
								<span>S/.</span>
								<NumberFormatMoney amount={montoPay*(porcentajeBancosMasIgv/100)}/>
							</span>
						)
					}
				</li>
			</ul>
  )
}
