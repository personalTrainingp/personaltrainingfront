import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal } from 'react-bootstrap'
import Select from 'react-select'
import { DetalleVentaTransferencias } from './NuevaVenta2/detalles/DetalleVentaTransferencias'
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore'
import { helperFunctions } from '@/common/helpers/helperFunctions'
import { onSetDetalleTransferencia } from '@/store/uiNuevaVenta/uiNuevaVenta'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
const registerTransferencia = {
    id_cli: 0,
    id_horario: 0,
    fec_init_mem: dayjs().format('YYYY-MM-DD'),
}
export const ModalTransferencia = ({show, onHide}) => {
    const dispatch = useDispatch()
  const { obtenerParametrosLogosProgramas, obtenerSemanasPorPrograma, obtenerTarifasPorSemanas, obtenerHorariosPorPrograma, DataHorarioPGM, DataSemanaPGM, DataTarifaSM } = useTerminoStore()
    const { formState, fec_init_mem, id_horario, id_cli, onResetForm, onInputChangeReact, onInputChange } = useForm(registerTransferencia)
    const { obtenerParametrosClientes, DataClientes } = useTerminoStore()
    const { obtenerUltimaMebresiaxCli, dataUltimaMembxCli } = useUsuarioStore()
    
    useEffect(() => {
        
        obtenerParametrosClientes()
    }, [show])

    useEffect(() => {
        if(id_cli!==0){
            obtenerUltimaMebresiaxCli(id_cli)
        }
    }, [id_cli])
    useEffect(() => {
        if(id_cli!==0 && dataUltimaMembxCli){
            obtenerHorariosPorPrograma(dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].id_pgm)
        }
    }, [id_cli, dataUltimaMembxCli])
    
    
    
    const cancelModal = () =>{
        onHide()
        onResetForm()
    }
    const submitTransferencia = (e) =>{
        e.preventDefault()
        
                            dispatch(onSetDetalleTransferencia({...formState, id_membresia: dataUltimaMembxCli.ultimaMembresia.id, label_pgm: dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].tb_ProgramaTraining.name_pgm, label_cliente_antiguo: DataClientes.find(c=>c.value===id_cli).label, fec_fin_mem: modificarFechaHabiles(fec_init_mem, diasLaborables(new Date(), dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].fec_fin_mem)), sesiones_disponibles: diasLaborables(new Date(), dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].fec_fin_mem), label_horario: DataHorarioPGM.find(h=>h.value===id_horario).horario}))
        cancelModal()
    }
    const { diasLaborables, sumarDiasHabiles, modificarFechaHabiles } = helperFunctions()
    return (
    <Modal size='xxl' show={show} onHide={cancelModal}>
        <Modal.Header title='Venta de transferencias'>
            <Modal.Title>Venta de transferencias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitTransferencia}>
                <div>
                    <Col lg={12}>
                        <div className='mb-2'>
                            <label htmlFor="id_cli" className="form-label">
                                Cliente antiguo
                            </label>
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
                    </Col>
                    <Col lg={12}>
                        <div className="mb-2">
                            <label htmlFor="fec_init_mem" className="form-label">
                                fecha de inicio
                            </label>
                            <input
                                    className="form-control"
                                    type='date'
                                    name="fec_init_mem"
                                    id="fec_init_mem"
                                    value={fec_init_mem}
                                    onChange={onInputChange}
                                    placeholder="EJ. 20-02-24"
                                />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className="mb-2">
                            <label htmlFor="id_horario" className="form-label">
                                Horario
                            </label>
                            <Select
                                onChange={(e) =>onInputChangeReact(e, "id_horario")}
                                name={'id_horario'}
                                placeholder={'Seleccionar el horario'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={DataHorarioPGM}
                                value={DataHorarioPGM.find(
                                    (option) => option.value === id_horario
                                )}
                                required
                            />
                        </div>
                    </Col>
                </div>
                {
                    id_cli!==0 && (
                    <Col xxl={12}>
                        <DetalleVentaTransferencias 
                        name_socio={dataUltimaMembxCli.name_cli} 
                        ultima_mem_socio={dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].tb_ProgramaTraining.name_pgm}
                        sesiones_socio_antiguo={
                            // dayjs('2024-10-16').diff(dayjs(new Date()), 'day')
                            diasLaborables(new Date(), dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].fec_fin_mem)
                            // dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].fec_fin_mem
                        }
                        fecha_fin_mem={modificarFechaHabiles(fec_init_mem, diasLaborables(new Date(), dataUltimaMembxCli.ultimaMembresia?.detalle_ventaMembresia[0].fec_fin_mem))}
                        total={0}
                        />
                    </Col>
                    )
                }
                <Col xxl={12}>
                <Button type='submit'>Agregar venta</Button>
                <a className='text-danger m-4' onClick={cancelModal}>Cancelar</a>
                </Col>
            </form>
        </Modal.Body>
    </Modal>
  )
}
