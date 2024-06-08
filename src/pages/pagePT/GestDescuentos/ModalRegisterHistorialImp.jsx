import { useImpuestosStore } from '@/hooks/hookApi/useImpuestosStore'
import { useForm } from '@/hooks/useForm'
import React from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
const registerImp = {
  multiplicador_imp: 0
}
export const ModalRegisterHistorialImp = ({show, onHide, id_impuesto}) => {
  const { formState, multiplicador_imp, onResetForm, onInputChange } = useForm(registerImp)
  const cancelModal = () =>{
      onHide()
      onResetForm()
  }
  const { registerCambioenImpues } = useImpuestosStore()
    const submitImpuesto = (e)=>{
      e.preventDefault()
      console.log(formState, id_impuesto);
      registerCambioenImpues(id_impuesto, formState)
      cancelModal()
    }
  return (
    <>
    <Modal onHide={cancelModal} show={show}>
        <Modal.Header>
            <Modal.Title>Registrar cambio al impuesto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={submitImpuesto}>
            <Row>
                <Col xl={12}>
                    <div className="mb-2">
                        <label htmlFor="multiplicador_imp" className="form-label">
                            Multiplicador de igv*
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            name="multiplicador_imp"
                            id="multiplicador_imp"
                            placeholder="Multiplicador"
                            value={multiplicador_imp}
                            onChange={onInputChange}
                        />
                    </div>
                </Col>
                <Col xl={12}>
                  <Button type='submit'>Agregar</Button>
                </Col>
            </Row>
          </form>
        </Modal.Body>
    </Modal>
    </>
  )
}
