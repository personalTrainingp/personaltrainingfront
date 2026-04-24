import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ItemsPagos } from './ItemsPagos'
import { useImpuestosStore } from '@/hooks/hookApi/useImpuestosStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { SideBarFormPago } from './SideBarFormPago'
import { InputButton } from '@/components/InputText'

export const sumarTarifas = (venta) =>{
	const sumaTarifas = Object.values(venta)
	.flatMap(array => array)
	.map(objeto => objeto.tarifa)
	.filter(tarifa => typeof tarifa === 'number')
	.reduce((total, tarifa) => total + tarifa, 0);
	return sumaTarifas
}
export const sumarPagos = (dataPagos)=>{
	const sumaPagos = Object.values(dataPagos).flatMap(array=>array).map(obj=>obj.monto_pago)
	.reduce((total, tarifa) => total + tarifa, 0);
	return sumaPagos;
}


export const CardPago = ({venta, dataPagos}) => {
	const sumaTarifas = sumarTarifas(venta)
	const [modalPay, setModalPag] = useState(false)
	const [SumaPagos, setSumaPagos] = useState(0)
	const { obtenerIgvHoy, obtenerImpuestoHoy } = useImpuestosStore()
	const { obtenerParametrosxENTIDAD } = useTerminoStore()
	const onModalOpenPay = ()  =>{
		setModalPag(true)
	}
	const onModalClosePay = () => {
		setModalPag(false)
	}
	useEffect(() => {
		const sumaTotalPagos = sumarPagos(dataPagos)
		setSumaPagos(sumaTotalPagos)
	}, [dataPagos])
	useEffect(() => {
		obtenerIgvHoy()
		obtenerParametrosxENTIDAD('formapago')
	}, [])
	const dataConComisionBanco = dataPagos.map((pago) => {
						const identificador = `${pago?.id_forma_pago}|${pago?.id_tipo_tarjeta}|${pago?.id_banco}|${pago?.n_cuotas}`;
						const porcentaje = [].find(
									(f) =>
										`${f.id_forma_pago}|${f.id_tipo_tarjeta}|${f.id_banco}|${f.n_cuotas}` ===
										identificador
								) || 0
						return {
							...venta,
							monto_pago: pago.monto_pago,
							porcentaje,
							comisionBanco: pago.monto_pago * (porcentaje.porcentaje_con_igv/100) ||0,
						};
					})
					const renta = (sumaTarifas/1.18)*0.03
					const igv=sumaTarifas-sumaTarifas/1.18
					const sumaComisionBancos = dataConComisionBanco.reduce((total, item)=>item.comisionBanco+total,0)
  return (		
    <Card>
        <Card.Header>
            <Card.Title>
			<span className='fs-3 text-change'>
				Datos de pago
			</span>
				</Card.Title>
			<ul className='d-flex justify-content-between p-0 m-0'>
				<li style={{float: 'left', width: '80%', listStyle: 'none', fontWeight: 'bold', fontSize: '25px'}}>Venta:</li>
				<li style={{float: 'left',  width: '24%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney className='fs-2' amount={sumaTarifas}/>
					</span>
				</li>
			</ul>
			<ul className='d-flex justify-content-between p-0 m-0'>
				<li style={{float: 'left', width: '80%', listStyle: 'none',fontWeight: 'bold', fontSize: '20px'}}>Igv({obtenerImpuestoHoy*100}%):</li>
				<li style={{float: 'left',  width: '24%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney style={{fontSize: '44px'}} className='fs-3' amount={igv}/>
					</span>
				</li>
			</ul>
			<ul className='d-flex justify-content-between p-0 m-0'>
				<li style={{float: 'left', width: '80%', listStyle: 'none',fontWeight: 'bold', fontSize: '20px'}}>IMPUESTO RENTA:</li>
				<li style={{float: 'left',  width: '24%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney style={{fontSize: '44px'}} className='fs-3' amount={renta}/>
					</span>
				</li>
			</ul>
			<ul className='d-flex justify-content-between p-0 m-0 text-change'>
				<li style={{float: 'left', width: '80%', listStyle: 'none',fontWeight: 'bold', fontSize: '20px'}}>COMISION POS:</li>
				<li style={{float: 'left',  width: '24%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney style={{fontSize: '44px'}} className='fs-3' amount={sumaComisionBancos}/>
					</span>
				</li>
			</ul>
			<ul className='d-flex justify-content-between p-0'>
				<li style={{float: 'left',  width: '80%', listStyle: 'none', fontWeight: 'bold', fontSize: '25px'}}>Subtotal:</li>
				<li style={{float: 'left',  width: '24%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney className='fs-2' amount={sumaTarifas-igv-renta-sumaComisionBancos}/>
					</span>
				</li>
			</ul>
			<ItemsPagos dataPagos={dataPagos}/>
        </Card.Header>
        <Card.Body>
			<InputButton label={'Pago adicional'} onClick={onModalOpenPay}/>
        </Card.Body>
		<Card.Footer>
			<span style={{fontWeight: 'bold', fontSize: '18px'}} className='d-flex justify-content-between fs-2'>
				<span className=''>{sumaTarifas-SumaPagos<0?'Vuelto: ':'Saldo pendiente: '}</span>
				<MoneyFormatter amount={sumaTarifas-SumaPagos<0?SumaPagos-sumaTarifas:sumaTarifas-SumaPagos}/>
			</span>
		</Card.Footer>
		<SideBarFormPago show={modalPay} onHide={onModalClosePay}/>
    </Card>
  )
}
