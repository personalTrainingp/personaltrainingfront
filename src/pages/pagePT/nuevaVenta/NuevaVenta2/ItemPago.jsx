import { MoneyFormatter, NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'

export const ItemPago = ({deletePay, id, formaPay, fechaPay, observacionPay, montoPay, id_forma_pago, id_tarjeta, id_tipo_tarjeta, id_banco}) => {
    
  return (
            <ul className='d-flex justify-content-between align-items-center shadow p-1 border m-0 rounded rounded-3 my-1' key={id}>
                
				<li style={{float: 'left', width: '80%', listStyle: 'none', fontWeight: 'bold', fontSize: '15px'}}>
                    <i className='mdi mdi-delete-forever-outline text-danger fs-3 ms-2' onClick={()=>deletePay()}></i>
                    {id_forma_pago}{id_tarjeta?`/${id_tarjeta}`:''}{id_tipo_tarjeta?`/${id_tipo_tarjeta}`:''}{id_banco?`/${id_banco}`:''}
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

/*
<Col lg={6}>

            </Col>
            <Col lg={12}>
                <div className='text-muted align-items-center d-flex justify-content-between'>
                    <span className='fw-bold align-items-center d-flex'>
                            <i className='mdi mdi-delete-forever-outline text-danger fs-3 ms-2' onClick={()=>deletePay()}></i>
                        {/* {id_forma_pago}{id_tarjeta?`/${id_tarjeta}`:''}{id_tipo_tarjeta?`/${id_tipo_tarjeta}`:''}{id_banco?`/${id_banco}`:''} */
            //             YAPE
            //         </span>
            //         <span className='float-end d-flex align-items-center justify-content-between text-break bg-danger' style={{width: '30%'}}>
                        
			// 			<span>S/.</span>
            //         <NumberFormatter amount={montoPay}/>
            //         </span>
            //     </div>
            // </Col>
            /* <Col lg={12}>
                <div>
                    <div>
                        {observacionPay}
                    </div>
                </div>
            </Col> */
//