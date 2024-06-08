import { CurrencyMask } from '@/components/CurrencyMask'
import { useMetaStore } from '@/hooks/hookApi/useMetaStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import React, { useEffect } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
const registerMeta = {
    meta_meta: '',
    nombre_meta: '',
    bono: '',
    fec_inicio: '',
    fec_fin: ''
}
export const ModalMeta = ({show, onHide, data}) => {
    const { formState, nombre_meta, meta_meta, bono, fec_fin, fec_inicio, onInputChange, onResetForm } = useForm(data?data:registerMeta)
    const cancelModal=()=>{
        onHide()
        onResetForm()
    }
    const { startRegistrarMeta, obtenerMetas } = useMetaStore()
    
    const submitMeta = (e)=>{
        e.preventDefault()
        startRegistrarMeta({
            ...formState,
            meta_meta: parseFloat(formState.meta_meta.replace(/,/g, '')).toFixed(2),
            bono: parseFloat(formState.bono.replace(/,/g, '')).toFixed(2),
        })
        obtenerMetas()
        cancelModal()
    }
  return (
    <Modal show={show} onHide={cancelModal} size='xxl'>
        <Modal.Header>
            <Modal.Title>Registrar Meta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitMeta}>
                <Row>
                    <Col lg={6}>
                    <div className="mb-4">
                        <label htmlFor="nombre_meta" className="form-label">
                            Nombre de la meta*
                        </label>
                        <input
                            className="form-control"
                            name='nombre_meta'
                            value={nombre_meta}
                            onChange={onInputChange}
                            id="nombre_meta"
                            placeholder="EJ. Meta de febrero"
                            required
                        />
                    </div>
                    </Col>
                    <Col lg={6}>
                    <div className="mb-4">
                        <label htmlFor="meta_meta" className="form-label">
                            Meta*
                        </label>
                        <input
                            className="form-control"
                            name='meta_meta'
                            value={meta_meta}
                            onChange={(e)=>onInputChange(CurrencyMask(e))}
                            id="bono"
                            placeholder="EJ. 2.000.000"
                            required
                        />
                    </div>
                    </Col>
                    <Col lg={6}>
                    <div className="mb-4">
                        <label htmlFor="bono" className="form-label">
                            Bono*
                        </label>
                        <input
                            className="form-control"
                            name='bono'
                            value={bono}
                            onChange={(e)=>onInputChange(CurrencyMask(e))}
                            id="bono"
                            placeholder="EJ. 2.000.000"
                            required
                        />
                    </div>
                    </Col>
                    <Col lg={6}>
                    <div className="mb-4">
                        <label htmlFor="fec_inicio" className="form-label">
                            Fecha de inicio*
                        </label>
                        <input
                            className="form-control"
                            name="fec_inicio"
                            id="fec_inicio"
                            value={fec_inicio}
                            type='date'
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    </Col>
                    <Col lg={6}>
                    <div className="mb-4">
                        <label htmlFor="fec_fin" className="form-label">
                            Fecha final*
                        </label>
                        <input
                            className="form-control"
                            name="fec_fin"
                            id="fec_fin"
                            value={fec_fin}
                            type='date'
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    </Col>
                    <Col lg={12}> 
                    <Button type='submit'>Agregar Meta</Button>
                    </Col>
                </Row>
            </form>
        </Modal.Body>
    </Modal>
  )
}
