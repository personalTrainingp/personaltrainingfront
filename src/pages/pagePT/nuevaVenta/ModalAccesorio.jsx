import { helperFunctions } from '@/common/helpers/helperFunctions'
import { MoneyFormatter } from '@/components/CurrencyMask'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { onAddDetalleProductoAccesorios } from '@/store/uiNuevaVenta/uiNuevaVenta'
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
const registerAccesorio= {
    id_producto: 0,
    prec_acces: 0.00,
	cantidad: 1
}
export const ModalAccesorio = ({show, hide, data}) => {
	const dispatch = useDispatch()
    const { id_producto, cantidad, formState, onInputChange, onInputChangeReact, onInputChangeFunction, onResetForm } = useForm(data?data:registerAccesorio)
	const { obtenerParametrosProductosCategoriaAccesorios, DataProductosAccesorios } = useTerminoStore()
	const [accesorioSelect, setaccesorioSelect] = useState(undefined)
	const {randomFunction} = helperFunctions()
	useEffect(() => {
		obtenerParametrosProductosCategoriaAccesorios()
	}, [])
	const onCancelModal = () =>{
		onResetForm()
		hide()
	}
	const submitAccesorio=(e)=>{
		e.preventDefault()
		const { venta, nombre_producto, stock } = accesorioSelect;
		dispatch(onAddDetalleProductoAccesorios({...formState, 
				id: randomFunction(50, 'PROD'), 
				precio_unitario: venta,
				nombre_producto, 
				tarifa: venta * cantidad
			}))
		onCancelModal()
	}
	const onChangeAccesorios = (e) =>{
		onInputChangeReact(e, 'id_producto')
	}
	useEffect(() => {
		const oneAccesorio = DataProductosAccesorios.find(
			(option) => option.value === id_producto
		)
		setaccesorioSelect(oneAccesorio)
	}, [id_producto])
    return (
    <>
    
    <Modal size='xxl' show={show} onHide={onCancelModal}>
						<Modal.Header>
							<Modal.Title>Venta de accesorios</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<form onSubmit={submitAccesorio}>
								<div className='mb-3'>
									    <label htmlFor="id_producto" className="form-label">
											Accesorio*
										</label>
                                        
										<Select
											onChange={(e) =>
												onChangeAccesorios(e)
											}
											name={'id_producto'}
											placeholder={'Seleccione un accesorio'}
											className="react-select"
											classNamePrefix="react-select"
											options={DataProductosAccesorios}
											value={DataProductosAccesorios.find(
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
                                        name="cantidad"
                                        id="cantidad"
										// max={accesorioSelect?.stock?accesorioSelect.stock:1}
										min={1}
										type='number'
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
								<div className='info-producto mb-2'>
									<table>
										<tbody>
											{accesorioSelect?.venta&&(
												<tr>
													<td>Total: </td>
													<td>
														<MoneyFormatter amount={accesorioSelect?.venta * cantidad}/>
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
