import { MoneyFormatter } from '@/components/CurrencyMask'
import { useForm } from '@/hooks/useForm'
import { arrayFacturas } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { ModalVentasPay } from './ModalVentasPay'
import { ItemsPagos } from './ItemsPagos'
import { useImpuestosStore } from '@/hooks/hookApi/useImpuestosStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'

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
  return (
    <Card>
        <Card.Header>
            <Card.Title>Datos de pago</Card.Title>
			<span style={{fontWeight: 'bold', fontSize: '18px'}} className='d-flex justify-content-between'>
				<span className=''>Subtotal:</span>
				<MoneyFormatter amount={sumaTarifas-sumaTarifas*obtenerImpuestoHoy}/>
			</span>
			<span style={{fontWeight: 'bold', fontSize: '18px'}} className='d-flex justify-content-between'>
				<span className=''>Igv:</span>
				<span className='text-muted font-15'>{obtenerImpuestoHoy*100}%</span>
				<MoneyFormatter amount={sumaTarifas*obtenerImpuestoHoy}/>
			</span>
			<span style={{fontWeight: 'bold', fontSize: '18px'}} className='d-flex justify-content-between'>
				<span className=''>Total:</span>
				<MoneyFormatter amount={sumaTarifas}/>
			</span>
        </Card.Header>
        <Card.Body>
			<ItemsPagos dataPagos={dataPagos}/>
			<a onClick={onModalOpenPay} style={{cursor: 'pointer'}}>Agregar Pago</a>
			<ModalVentasPay show={modalPay} onHide={onModalClosePay}/>
        </Card.Body>
		<Card.Footer>
			<span style={{fontWeight: 'bold', fontSize: '18px'}} className='d-flex justify-content-between'>
				<span className=''>{sumaTarifas-SumaPagos<0?'Vuelto: ':'Deuda: '}</span>
				<MoneyFormatter amount={sumaTarifas-SumaPagos<0?SumaPagos-sumaTarifas:sumaTarifas-SumaPagos}/>
			</span>
		</Card.Footer>
    </Card>
  )
}
