import { useForm } from '@/hooks/useForm'
import React from 'react'
import { Modal } from 'react-bootstrap'
const registerTransferencia = {
    id_cli: 0,
    id_membresia_transferencia: 0,
    precio_transferencia: 0
}
export const ModalVentaTransferencia = ({show, onHide}) => {
    const {formState, id_cli, id_membresia_transferencia, precio_transferencia, onInputChange, onInputChangeReact, onResetForm} = useForm(registerTransferencia)
    const submitTransferencia = () =>{
        onCancelModal()
    }
    const onCancelModal = () =>{
        onResetForm()
        onHide()
    }
  return (
    <>
    <Modal show={show} onHide={onCancelModal}>
        <Modal.Header>
        <Modal.Title>Registrar venta de transferencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
							<form onSubmit={submitTransferencia}>
								<div className='mb-3'>
									    <label htmlFor="nombre_pgm" className="form-label">
											Cliente a transferir*
										</label>
                                        
										<Select
											onChange={(e) =>
												onInputChangeReact(e, 'id_acces')
											}
											name={'id_acces'}
											placeholder={'Seleccione un accesorio'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayEstados}
											value={arrayEstados.find(
												(option) => option.value === id_cli
											)}
											required
										></Select>
								</div>
                                <Button type='submit'>Agregar</Button>
                                <a className='text-danger m-4' onClick={onCancelModal}>Cancelar</a>
							</form>
        </Modal.Body>
    </Modal>
    </>
  )
}
