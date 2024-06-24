import { useForm } from '@/hooks/useForm';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react'
import { Col, Row } from 'react-bootstrap';
const registerExCongelamiento ={
    extension_inicio: new Date(),
    extension_fin: '',
    extension_fin: '',
}
export const ModalExtensionCongelamiento = ({show, onHide}) => {
    const {formState, extension_inicio, extension_fin, dias_habiles, observacion, img_prueba_extension, onResetForm, onInputChange, onInputChangeReact} = useForm(registerExCongelamiento)
    
    const cancelarExtensionCongelamiento = ()=>{
        onHide()
        onResetForm()
    }
    const submitExtensionCongelamiento = ()=>{

        cancelarExtensionCongelamiento()
    }
    const productDialogFooter = (
		<React.Fragment>
			<Button label="Cancel" icon="pi pi-times" outlined onClick={cancelarExtensionCongelamiento} />
			<Button label="Save" icon="pi pi-check" onClick={submitExtensionCongelamiento} />
		</React.Fragment>
	);
  return (
    <Dialog
        visible={show}
        style={{ width: '50rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Nuevo Congelamiento"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={cancelarExtensionCongelamiento}
        >
            
            <form>
                <Row>
                    <Col lg={12}>
                        <div className="field">
                            <label htmlFor="extension_inicio" className="font-bold">
                                Fecha en la que se va a congelar
                            </label>
                            <input
                                id="extension_inicio"
                                className='form-control'
                                value={extension_inicio}
                                name='extension_inicio'
                                type='date'
                                onChange={onInputChange}
                                autoFocus
                                rows={3}
                                cols={20}
                            />
                        </div>
                    </Col>
                    <Col lg={8}>
                        <div className="field">
                            <label htmlFor="extension_fin" className="font-bold">
                                Fecha en la que se va a terminar de congelar
                            </label>
                            <input
                                id="extension_fin"
                                className='form-control'
                                value={extension_fin}
                                name='extension_fin'
                                type='date'
                                onChange={onInputChange}
                                autoFocus
                                rows={3}
                                cols={20}
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="dias_habiles" className="font-bold">
                                Dias
                            </label>
                            <input
                                id="dias_habiles"
                                className='form-control'
                                value={dias_habiles}
                                name='dias_habiles'
                                onChange={onInputChange}
                                autoFocus
                                rows={3}
                                cols={20}
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
