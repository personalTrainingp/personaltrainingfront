import React, { useEffect } from 'react'

import { InputTextarea } from 'primereact/inputtextarea';

import { RadioButton } from 'primereact/radiobutton';
import config from '@/config';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { useForm } from '@/hooks/useForm';
import Select from 'react-select'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useProspectoStore } from '@/hooks/hookApi/useProspectoStore';
import { useSelector } from 'react-redux';
import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore';

function ordenarPorIdPgm(data) {
	const orden = [2, 4, 3];

	return data.sort((a, b) => {
		return orden.indexOf(a.id_pgm) - orden.indexOf(b.id_pgm);
	});
}
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
export const ModalProspectos = ({show, onHide}) => {
    const { obtenerProgramasActivos, programasActivos } = useTerminoStore()
    const { obtenerParametrosVendedores, DataVendedores } = useTerminoStore()
    const { startRegisterProspecto } = useProspectoStore()

	const { datapgmPT } = useSelector((e) => e.programaPT);
	const { startRegisterProgramaTraining, startObtenerTBProgramaPT } = useProgramaTrainingStore();
    const saveProspecto = () =>{
        startRegisterProspecto(formState)
    }
    useEffect(() => {
        obtenerProgramasActivos()
        obtenerParametrosVendedores()
        startObtenerTBProgramaPT()
    }, [])
    
    const cancelarProspecto = ()=>{
        onHide()
        onResetForm()
    }
    const {formState, nombres, apellido_materno, apellido_paterno, correo, celular, id_empl, id_pgm, observacion, onResetForm, onInputChange, onInputChangeReact} = useForm(registerProspecto)
	const productDialogFooter = (
		<React.Fragment>
			<Button label="Cancelar" icon="pi pi-times" outlined onClick={cancelarProspecto} />
			<Button label="Guardar" icon="pi pi-check" onClick={saveProspecto} />
		</React.Fragment>
	);
    const onChangeFunction = (o,e)=>{
        console.log(o,e);
        
        console.log(id_pgm==e.id_pgm);
    }
    // function ordenarPorIdPgm(data, orden) {
    //     // const orden = [2, 4, 3, 5];
    
    //     return data.sort((a, b) => {
    //         return orden.indexOf(a.id_pgm) - orden.indexOf(b.id_pgm);
    //     });
    // }
    
  return (
    
			<Dialog
            visible={show}
            style={{ width: '50rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header="Nuevo Prospecto"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={cancelarProspecto}
        >
            <form>
                <Row>
                    <Col>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">
                                Nombres*
                            </label>
                            <InputText
                                value={nombres}
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
                                value={apellido_paterno}
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
                                value={apellido_materno}
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
                                value={celular}
                                name='celular'
                                onChange={onInputChange}
                                required
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
                                value={correo}
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
                                    datapgmPT.map(e=>{
                                        // console.log(e);
                                        
                                    if(!e.estado_pgm){
                                        return;
                                    }
                                    
                                    return(
                                    <Col className={`content-img`} xl={3} lg={4} sm={3} xs={6} style={{cursor: 'pointer'}} key={e.id_pgm}>
                                        <label>
                                        <img className={`hover-card-border ${id_pgm==e.id_pgm?'card-border':''}`} width={e.tb_image?.width} height={50} src={`${config.API_IMG.LOGO}${e.tb_image?.name_image}`}/>
                                        <input
                                            value={e.id_pgm}
                                            type="radio"
                                            // hidden={true}
                                            name="id_pgm"
                                            onChange={(o)=>onChangeFunction(o, e)}
                                        />
                                        </label>
                                    </Col>
                                    )
                                    })
                  }
                            </div>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className="field">
                            <label htmlFor="description" className="font-bold">
                                Observacion
                            </label>
                            <InputTextarea
                                id="name"
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
            </form>
        </Dialog>
  )
}
