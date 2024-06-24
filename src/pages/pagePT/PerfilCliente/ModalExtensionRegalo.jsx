import { useForm } from '@/hooks/useForm';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react'
import { Col, Row } from 'react-bootstrap';
const registerExRegalos ={
    dias_habiles: 1,
    observacion: '',
}
export const ModalExtensionRegalo = ({show, onHide}) => {
    const {formState, dias_habiles, observacion, onResetForm, onInputChange, onInputChangeReact} = useForm(registerExRegalos)
    
    const cancelarExtensionRegalo = ()=>{
        onHide()
        onResetForm()
    }
    const submitExtensionRegalo = ()=>{

        cancelarExtensionRegalo()
    }
    const productDialogFooter = (
		<React.Fragment>
			<Button label="Cancel" icon="pi pi-times" outlined onClick={cancelarExtensionRegalo} />
			<Button label="Save" icon="pi pi-check" onClick={submitExtensionRegalo} />
		</React.Fragment>
	);
  return (
    <Dialog
        visible={show}
        style={{ width: '50rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Nuevo Regalo"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={cancelarExtensionRegalo}
        >
            
            <form>
                <Row>
                    <Col>
                        <div className="field">
                            <label htmlFor="dias_habiles" className="font-bold">
                                Dias*
                            </label>
                            <InputText
                                value={dias_habiles}
                                name='dias_habiles'
                                onChange={onInputChange}
                                max={1}
                                required
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className="field">
                            <label htmlFor="observacion" className="font-bold">
                                Observacion
                            </label>
                            <InputTextarea
                                id="observacion"
                                value={observacion}
                                name='observacion'
                                onChange={onInputChange}
                                autoFocus
                                rows={3}
                                cols={20}
                            />
                        </div>
                    </Col>
                </Row>
                <div>Ultima membresia:</div>
                <div>Fecha en la que termina su membresia:</div>
            </form>
    </Dialog>
  )
}
