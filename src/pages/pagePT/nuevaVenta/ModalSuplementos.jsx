import { helperFunctions } from '@/common/helpers/helperFunctions'
import { MoneyFormatter } from '@/components/CurrencyMask'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { onAddDetalleProductoSuplementos } from '@/store/uiNuevaVenta/uiNuevaVenta'
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
const registerAccesorio= {
    id_producto: 0,
    prec_supl: 0.00,
    cantidad: 1
}
export const ModalSuplementos = ({show, hide, data}) => {
    const dispatch = useDispatch()
    const { id_producto, cantidad, formState, onInputChange, onInputChangeReact, onResetForm } = useForm(data?data:registerAccesorio)
	const { obtenerParametrosProductosCategoriaSuplementos, DataProductosSuplementos } = useTerminoStore()
	const [suplementoSelect, setSuplementoSelect] = useState(undefined)
	const {randomFunction} = helperFunctions()
	useEffect(() => {
		obtenerParametrosProductosCategoriaSuplementos()
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
		const onSuplemento = DataProductosSuplementos.find(
			(option) => option.value === id_producto
		)
		setSuplementoSelect(onSuplemento)
	}, [id_producto])
	
    return (
    <>
    
    <Modal size='xxl' show={show} onHide={onCancelModal}>
						<Modal.Header>
							<Modal.Title>Venta de suplementos</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<form onSubmit={submitSuplementos}>
								<div className='mb-3'>
									    <label htmlFor="id_producto" className="form-label">
                                            Suplementos*
										</label>
										<Select
											onChange={(e) =>
												onInputChangeReact(e, 'id_producto')
											}
											name={'id_producto'}
											placeholder={'Seleccione un suplemento'}
											className="react-select"
											classNamePrefix="react-select"
											options={DataProductosSuplementos}
											value={DataProductosSuplementos.find(
												(option) => option.value === id_producto
											)}
											required
										></Select>
								</div>
                                <div className="mb-3">
                                    <label htmlFor="cantidad" className="form-label">
                                        Cantidad*
                                    </label>
                                    <input
                                        className="form-control"
                                        placeholder="cantidad"
                                        value={cantidad}
                                        // max={suplementoSelect?.stock?suplementoSelect.stock:1}
                                        type='number'
                                        name="cantidad"
                                        id="cantidad"
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
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
