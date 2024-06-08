import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import React, { useEffect } from 'react'
import { Button, Col, Modal } from 'react-bootstrap'
import Select from 'react-select'
import { DetalleVentaTransferencias } from './NuevaVenta2/detalles/DetalleVentaTransferencias'
const registerTransferencia = {
    id_cli: 0
}
export const ModalTransferencia = ({show, onHide}) => {
    const { formState, id_cli, onResetForm, onInputChangeReact } = useForm(registerTransferencia)
    const { obtenerParametrosClientes, DataClientes } = useTerminoStore()
    useEffect(() => {
        obtenerParametrosClientes()
    }, [])
    
    const cancelModal = () =>{
        onHide()
        onResetForm()
    }
    const submitTransferencia = () =>{
        
        cancelModal()
    }
  return (
    <Modal size='xxl' show={show} onHide={cancelModal}>
        <Modal.Header title='Venta de transferencias'>
            <Modal.Title>Venta de transferencias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitTransferencia}>
                <div className='mb-2'>
                    <Select
                        onChange={(e) =>onInputChangeReact(e, "id_cli")}
                        name={'id_cli'}
                        placeholder={'Seleccione un cliente'}
                        className="react-select"
                        classNamePrefix="react-select"
                        options={DataClientes}
                        value={DataClientes.find(
                            (option) => option.value === id_cli
                        )}
                        required
                    />
                </div>
                <Col xxl={12}>
                    <DetalleVentaTransferencias/>
                </Col>
                <Col xxl={12}>
                <Button>Agregar venta</Button>
                <a className='text-danger m-4' onClick={cancelModal}>Cancelar</a>
                </Col>
            </form>
        </Modal.Body>
    </Modal>
  )
}
