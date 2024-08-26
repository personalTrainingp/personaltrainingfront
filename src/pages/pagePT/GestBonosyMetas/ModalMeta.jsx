import { CurrencyMask } from '@/components/CurrencyMask'
import { useMetaStore } from '@/hooks/hookApi/useMetaStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import React, { useEffect } from 'react'
import Select from 'react-select'

import { InputTextarea } from 'primereact/inputtextarea';

import { RadioButton } from 'primereact/radiobutton';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Col, Modal, Row } from 'react-bootstrap'
import { InputNumber } from 'primereact/inputnumber'


const registerMeta = {
    nombre_meta: '', meta: '', bono: '', fec_init: '', fec_final: '', observacion: ''
}
export const ModalMeta = ({show, onHide, data}) => {
    const { startRegistrarMeta } = useMetaStore()
    const {formState, nombre_meta, meta, bono, fec_init, fec_final, observacion, onResetForm, onInputChange, onInputChangeReact} = useForm(registerMeta)
    const cancelarProspecto = ()=>{
        onHide()
        onResetForm()
    }
    const saveProspecto = () =>{
        // startRegisterProspecto(formState)
        startRegistrarMeta(formState)
        console.log(formState);
    }
	const productDialogFooter = (
		<React.Fragment>
			<Button label="Cancelar" icon="pi pi-times" outlined onClick={cancelarProspecto} />
			<Button label="Guardar" icon="pi pi-check" onClick={saveProspecto} />
		</React.Fragment>
	);
  return (
    
			<Dialog
            visible={show}
            style={{ width: '50rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header="Nueva META"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={cancelarProspecto}
        >
            <form>
                <Row>
                    <Col lg={12}>
                        <div className="field">
                            <label htmlFor="nombre_meta" className="font-bold">
                                Nombre de la meta*
                            </label>
                            <InputText
                                value={nombre_meta}
                                name='nombre_meta'
                                onChange={onInputChange}
                                required
                                placeholder='META DE ...'
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="field">
                            <label htmlFor="meta" className="font-bold">
                                Meta*
                            </label>
                            <InputNumber
                                value={meta}
                                mode="currency" 
                                currency="PEN" 
                                locale="es-PE"
                                name='meta'
                                onChange={(e)=>onInputChangeReact(e, "meta")}
                                required
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="field">
                            <label htmlFor="bono" className="font-bold">
                                Bono
                            </label>
                            <InputNumber
                                value={bono}
                                mode="currency" 
                                currency="PEN" 
                                locale="es-PE"
                                name='bono'
                                onChange={(e)=>onInputChangeReact(e, "bono")}
                                required
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="field">
                            <label htmlFor="fec_init" className="font-bold">
                                Fecha inicial
                            </label>
                            {/* <Calendar value={fec_init} name='fec_init' aut onChange={onInputChange} /> */}
                            <InputText
                                id="fec_init"
                                type='date'
                                value={fec_init}
                                name='fec_init'
                                onChange={onInputChange}
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="field">
                            <label htmlFor="fec_final" className="font-bold">
                                Fecha final
                            </label>
                            <InputText
                                id="fec_final"
                                type='date'
                                value={fec_final}
                                name='fec_final'
                                onChange={onInputChange}
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
                                placeholder='META FIJADA PARA...'
                                onChange={onInputChange}
                                autoFocus
                                rows={3}
                                cols={20}
                            />
                        </div>
                    </Col>
                </Row>
            </form>
        </Dialog>
  )
}
