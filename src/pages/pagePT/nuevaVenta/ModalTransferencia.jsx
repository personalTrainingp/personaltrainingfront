import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import React, { useEffect } from 'react'
import { Button, Col, Modal } from 'react-bootstrap'
import Select from 'react-select'
import { DetalleVentaTransferencias } from './NuevaVenta2/detalles/DetalleVentaTransferencias'
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore'
import { helperFunctions } from '@/common/helpers/helperFunctions'
const registerTransferencia = {
    id_cli: 0
}
export const ModalTransferencia = ({show, onHide}) => {
    const { formState, id_cli, onResetForm, onInputChangeReact } = useForm(registerTransferencia)
    const { obtenerParametrosClientes, DataClientes } = useTerminoStore()
    const { obtenerUltimaMebresiaxCli, dataUltimaMembxCli } = useUsuarioStore()
    useEffect(() => {
        obtenerParametrosClientes()
    }, [])

    useEffect(() => {
        if(id_cli!==0){
            obtenerUltimaMebresiaxCli(id_cli)
        }
    }, [id_cli])
    
    const cancelModal = () =>{
        onHide()
        onResetForm()
    }
    const submitTransferencia = () =>{
        
        cancelModal()
    }
    const { diasLaborables } = helperFunctions()
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
                        placeholder={'Seleccione el socio antiguo'}
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
                    <DetalleVentaTransferencias 
                    name_socio={dataUltimaMembxCli.name_cli} 
                    ultima_mem_socio={dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].tb_ProgramaTraining.name_pgm}
                    sesiones_socio_antiguo={dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].fec_fin_mem}
                    total={0}
                    />
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
