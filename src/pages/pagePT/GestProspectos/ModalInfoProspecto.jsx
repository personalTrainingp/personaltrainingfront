import React, { useEffect } from 'react'

import { InputTextarea } from 'primereact/inputtextarea';

import { RadioButton } from 'primereact/radiobutton';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { useForm } from '@/hooks/useForm';
import Select from 'react-select'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useProspectoStore } from '@/hooks/hookApi/useProspectoStore';
import { TabPanel, TabView } from 'primereact/tabview';
import { SectionComentario } from '@/components/Comentario/SectionComentario';
const registerProspecto = {
    nombres: '',
    apellido_materno: '',
    apellido_paterno: '',
    correo: '',
    celular: '',
    id_empl: 0,
    id_pgm: 0,
    observacion: ''
}
export const ModalInfoProspecto = ({show, onHide, data}) => {
    const { obtenerProgramasActivos, programasActivos } = useTerminoStore()
    const { obtenerParametrosVendedores, DataVendedores } = useTerminoStore()
    const { startRegisterProspecto } = useProspectoStore()

    const saveProspecto = () =>{
        startRegisterProspecto(formState)
    }
    useEffect(() => {
        obtenerProgramasActivos()
        obtenerParametrosVendedores()
    }, [])
    
    const cancelarProspecto = ()=>{
        onHide()
        onResetForm()
    }
    const {formState, nombres, apellido_materno, apellido_paterno, correo, celular, id_empl, id_pgm, observacion, onResetForm, onInputChange, onInputChangeReact} = useForm(data)
	const productDialogFooter = (
		<React.Fragment>
			<Button label="Cancelar" icon="pi pi-times" outlined onClick={cancelarProspecto} />
			<Button label="Guardar" icon="pi pi-check" onClick={saveProspecto} />
		</React.Fragment>
	);
  return (
    
			<Dialog
            visible={show}
            style={{ width: '45rem', height: '80rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header="Informacion del Prospecto"
            modal
            className="p-fluid"
            // footer={productDialogFooter}
            onHide={cancelarProspecto}
        >
            {data.id && (
                <TabView>
                    <TabPanel header="Informacion del prospecto">
                        <form>
                            <Row>
                                <Col>
                                    <div className="field">
                                        <label htmlFor="name" className="font-bold">
                                            Nombre completo*
                                        </label>
                                        <InputText
                                            value={nombres||''}
                                            name='nombres'
                                            onChange={onInputChange}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="field">
                                        <label htmlFor="name" className="font-bold">
                                            Apellido paterno*
                                        </label>
                                        <InputText
                                            value={apellido_paterno||''}
                                            name='apellido_paterno'
                                            onChange={onInputChange}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="field">
                                        <label htmlFor="name" className="font-bold">
                                            Apellido materno*
                                        </label>
                                        <InputText
                                            value={apellido_materno||''}
                                            name='apellido_materno'
                                            onChange={onInputChange}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="field">
                                        <label htmlFor="name" className="font-bold">
                                            Numero de celular*
                                        </label>
                                        <InputText
                                            value={celular||''}
                                            name='celular'
                                            onChange={onInputChange}
                                            autoFocus
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="field">
                                        <label htmlFor="name" className="font-bold">
                                            Correo
                                        </label>
                                        <InputText
                                            id="name"
                                            value={correo||''}
                                            name='correo'
                                            onChange={onInputChange}
                                            autoFocus
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="field">
                                        <label htmlFor="name" className="font-bold">
                                            Asesor comercial*
                                        </label>
                                        <Select
                                            onChange={(e) => onInputChangeReact(e, 'id_empl')}
                                            name="id_empl"
                                            placeholder={'Seleccionar el asesor'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={DataVendedores}
                                            value={DataVendedores.find(
                                                (option) => option.value === id_empl
                                            )||0}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="field">
                                        <label className="mb-3 font-bold">Programa de interes*</label>
                                        <div className="formgrid grid">
                                            {
                                                programasActivos.map(e=>(
                                                    <div className="field-radiobutton col-6" key={e.value}>
                                                        <RadioButton
                                                            inputId={e.value}
                                                            name="id_pgm"
                                                            value={e.value}
                                                            checked={id_pgm===e.value}
                                                            onChange={onInputChange}
                                                        />
                                                        <label htmlFor={e.value}>{e.label}</label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="field">
                                        <label htmlFor="observacion" className="font-bold">
                                            Observacion
                                        </label>
                                        <InputTextarea
                                            id="observacion"
                                            value={observacion||''}
                                            name='observacion'
                                            onChange={onInputChange}
                                            autoFocus
                                            rows={3}
                                            cols={20}
                                        />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                <Row>
                                    <Col lg={6}>
                                        <Button label="Cancelar" icon="pi pi-times" outlined onClick={cancelarProspecto} />
                                    </Col>
                                    <Col lg={6}>
			                            <Button label="Guardar" icon="pi pi-check" onClick={saveProspecto} />
                                    </Col>
                                </Row>
                                </Col>
                            </Row>
                        </form>
                    </TabPanel>
                    <TabPanel header='Comentarios'>
                        <SectionComentario uid_comentario={data.uid_comentario}/>
                        {/* <SectionProspectoComentarios data={data}/> */}
                    </TabPanel>
                </TabView>
            )
            }
        </Dialog>
  )
}
