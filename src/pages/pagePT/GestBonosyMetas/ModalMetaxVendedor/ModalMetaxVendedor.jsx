import { CurrencyMask, MoneyFormatter } from '@/components/CurrencyMask'
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
import { Slider } from "primereact/slider";


const registerMeta = {
    range_meta_asesor: ''
}
export const ModalMetaxVendedor = ({show, onHide, data, isLoading}) => {
    const { startRegistrarMeta } = useMetaStore()
    const {formState, range_meta_asesor, onResetForm, onInputChange, onInputChangeReact} = useForm(registerMeta)
    const cancelarMeta = ()=>{
        onHide()
        onResetForm()
    }
    
    const GuardarMeta = () =>{
        // startRegisterProspecto(formState)
        startRegistrarMeta(formState)
    }
	const productDialogFooter = (
		<React.Fragment>
			<Button label="Cancelar" icon="pi pi-times" outlined onClick={cancelarMeta} />
			<Button label="Guardar" icon="pi pi-check" onClick={GuardarMeta} />
		</React.Fragment>
	);

  return (
    
			<Dialog
            visible={show}
            style={{ width: '50rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header="META POR VENDEDOR"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={cancelarMeta}
        >
            {
                isLoading? (
                    <>
                    CARGANDO...
                    </>
                ):(
                    <form>
                        <Row className='d-flex align-items-center'>
                            <Col lg={6}>
                                <span>Carlos Rosales Morales</span>
                            </Col>
                            <Col lg={6}>
                                    <InputText value={range_meta_asesor} name={"range_meta_asesor"} onChange={onInputChange} className="w-full" />
                                    <Slider value={range_meta_asesor} name='range_meta_asesor' onChange={(e)=>onInputChangeReact(e, "range_meta_asesor")} className="w-full" min={10} />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                            </Col>
                            <Col lg={6}>
                            
                                <div className='mt-3'>
                                    <MoneyFormatter amount={data.meta}/>
                                </div>
                                {/* {data.meta} */}
                            </Col>
                        </Row>
                    </form>
                )
            }
        </Dialog>
  )
}
