import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useForm } from '@/hooks/useForm'
import { arrayFacturas } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { ModalVentasPay } from './ModalVentasPay'
import { ItemsPagos } from './ItemsPagos'
import { useImpuestosStore } from '@/hooks/hookApi/useImpuestosStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { SideBarFormPago } from './SideBarFormPago'
import { impuestosBancos } from '../../ReportePagosVentas/useVentasPagosStore'

export const sumarTarifas = (venta) =>{
	const sumaTarifas = Object.values(venta)
	.flatMap(array => array) // Aplanamos los arrays en uno solo
	.map(objeto => objeto.tarifa) // Obtenemos un array con todas las tarifas
	.filter(tarifa => typeof tarifa === 'number') // Filtramos solo los valores que son números
	.reduce((total, tarifa) => total + tarifa, 0); // Sumamos todas las tarifas
	return sumaTarifas
}
export const sumarPagos = (dataPagos)=>{
	const sumaPagos = Object.values(dataPagos).flatMap(array=>array).map(obj=>obj.monto_pago)
	.reduce((total, tarifa) => total + tarifa, 0); // Sumamos todas las tarifas
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
						const porcentaje = impuestosBancos.find(
									(f) =>
										`${f.id_forma_pago}|${f.id_tipo_tarjeta}|${f.id_banco}|${f.n_cuotas}` ===
										identificador
								)?.porcentaje || 0
						return {
							...venta,
							monto_pago: pago.monto_pago,
							porcentaje,
							comisionBanco: pago.monto_pago * (porcentaje/100)
						};
					})
					const sumaComisionBancos = dataConComisionBanco.reduce((total, item)=>item.comisionBanco+total,0)
  return (
    <Card>
        <Card.Header>
            <Card.Title>Datos de pago</Card.Title>
			<ul className='d-flex justify-content-between p-0 m-0'>
				<li style={{float: 'left',  width: '80%', listStyle: 'none', fontWeight: 'bold', fontSize: '15px'}}>Subtotal:</li>
				<li style={{float: 'left',  width: '40%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney amount={sumaTarifas-sumaTarifas*obtenerImpuestoHoy}/>
					</span>
				</li>
			</ul>
			<ul className='d-flex justify-content-between p-0 m-0'>
				<li style={{float: 'left', width: '80%', listStyle: 'none',fontWeight: 'bold', fontSize: '15px'}}>Igv({obtenerImpuestoHoy*100}%):</li>
				<li style={{float: 'left',  width: '40%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney amount={sumaTarifas*obtenerImpuestoHoy}/>
					</span>
				</li>
			</ul>
			<ul className='d-flex justify-content-between p-0 m-0'>
				<li style={{float: 'left', width: '80%', listStyle: 'none',fontWeight: 'bold', fontSize: '15px'}}>COMISION:</li>
				<li style={{float: 'left',  width: '40%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney amount={sumaComisionBancos}/>
					</span>
				</li>
			</ul>
			<ul className='d-flex justify-content-between p-0 m-0'>
				<li style={{float: 'left', width: '80%', listStyle: 'none', fontWeight: 'bold', fontSize: '15px'}}>Total:</li>
				<li style={{float: 'left',  width: '40%', listStyle: 'none'}}>
					<span className='d-flex justify-content-between'>
						<span>S/.</span>
						<NumberFormatMoney amount={sumaTarifas}/>
					</span>
				</li>
			</ul>
			<ItemsPagos dataPagos={dataPagos}/>
        </Card.Header>
        <Card.Body>
			<a className='text-primary underline' onClick={onModalOpenPay} style={{cursor: 'pointer'}}>Agregar Pago</a>
			{/* <ModalVentasPay show={modalPay} onHide={onModalClosePay}/> */}
        </Card.Body>
		<Card.Footer>
			<span style={{fontWeight: 'bold', fontSize: '18px'}} className='d-flex justify-content-between'>
				<span className=''>{sumaTarifas-SumaPagos<0?'Vuelto: ':'Saldo pendiente: '}</span>
				<MoneyFormatter amount={sumaTarifas-SumaPagos<0?SumaPagos-sumaTarifas:sumaTarifas-SumaPagos}/>
			</span>
		</Card.Footer>
		<SideBarFormPago show={modalPay} onHide={onModalClosePay}/>
    </Card>
  )
}
