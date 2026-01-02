import { helperFunctions } from '@/common/helpers/helperFunctions'
import { MoneyFormatter } from '@/components/CurrencyMask'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { onAddDetalleProductoSuplementos } from '@/store/uiNuevaVenta/uiNuevaVenta'
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import { useNuevaVentaStore } from './hooks/useNuevaVentaStore'
import { InputSelect, InputText } from '@/components/InputText'
const registerAccesorio= {
    id_producto: 0,
    prec_supl: 0.00,
    cantidad: 1
}
export const ModalSuplementos = ({show, hide, data, id}) => {
    const dispatch = useDispatch()
    const { id_producto, cantidad, formState, onInputChange, onInputChangeReact, onResetForm } = useForm(data?data:registerAccesorio)
	const { dataProductosActivos, obtenerProductosActivos } = useNuevaVentaStore()
	const [suplementoSelect, setSuplementoSelect] = useState(undefined)
	const {randomFunction} = helperFunctions()
	useEffect(() => {
		obtenerProductosActivos(598)
	}, [])
	const onCancelModal = () =>{
        hide();
        onResetForm()
    }
    const submitSuplementos = (e) => {
        e.preventDefault()
		const { venta, nombre_producto, stock } = suplementoSelect;
        dispatch(onAddDetalleProductoSuplementos({...formState, 
            id: randomFunction(50, 'SUPL'), 
			precio_unitario: venta,
            nombre_producto,
            tarifa: venta * cantidad
        }))
        onCancelModal()
    }
	useEffect(() => {
		const onSuplemento = dataProductosActivos.find(
			(option) => option.value === id_producto
		)
		setSuplementoSelect(onSuplemento)
	}, [id_producto])
	
    return (
    <>
    
    <Modal size='xxl' show={show} onHide={onCancelModal}>
						<Modal.Header>
							<Modal.Title>Venta de SUPLEMENTOS</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<form onSubmit={submitSuplementos}>
								<Row>
									<Col lg={12}>
										<div className='mb-3'>
											<InputSelect label={'producto'} nameInput={'id_producto'} placeholder='Seleccionar el producto' onChange={onInputChange} options={dataProductosActivos} required/>
										</div>
									</Col>
									<Col lg={12}>
										<div className='mb-3'>
											<InputText label={'Cantidad'} nameInput={'cantidad'} onChange={onInputChange} value={cantidad} required/>
										</div>
									</Col>
								</Row>
								<div className='info-producto mb-2'>
									<table>
										<tbody>
											{suplementoSelect?.venta&&(
												<tr>
													<td>Total: </td>
													<td>
														<MoneyFormatter amount={suplementoSelect?.venta * cantidad}/>
													</td>
												</tr>
											)
											}
										</tbody>
									</table>
								</div>
                                <Button type='submit'>Agregar</Button>
                                <a className='text-danger m-4' onClick={onCancelModal}>Cancelar</a>
							</form>
						</Modal.Body>
					</Modal>
    </>
  )
}
