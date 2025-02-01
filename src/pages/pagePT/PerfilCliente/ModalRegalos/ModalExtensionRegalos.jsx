import { DateMask } from '@/components/CurrencyMask';
import { useExtensionStore } from '@/hooks/hookApi/useExtensionStore';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useForm } from '@/hooks/useForm';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
const registerExRegalos ={
    dias_habiles: 1,
    observacion: '',
}
const valorDef = {
    tb_ProgramaTraining:'', 
    tb_semana_training:'', 
    fec_inicio_mem:'', 
    fec_fin_mem: ''
}
export const ModalExtensionRegalo = ({show, onHide, id_cli, dataUltimaMembresia}) => {
    const {formState, dias_habiles, observacion, onResetForm, onInputChange, onInputChangeReact} = useForm(registerExRegalos)
    const { postExtension, obtenerUltimaMembresiaxIdCli } = useExtensionStore()
    
    const [loadingUltimaMembresia, setloadingUltimaMembresia] = useState(false)
	const { tb_ProgramaTraining, tb_semana_training, fec_inicio_mem, fec_fin_mem } = dataUltimaMembresia[0]
    useEffect(() => {
        obtenerUltimaMembresiaxIdCli(id_cli)
    }, [])
    
    const cancelarExtensionRegalo = ()=>{
        onHide()
        onResetForm()
    }   
    const submitExtensionRegalo = (e)=>{
        e.preventDefault()
        postExtension(formState, 'REG', dataUltimaMembresia.id, fec_inicio_mem, fec_fin_mem)
        console.log(formState);
        cancelarExtensionRegalo()
    }
  return (
    <Dialog
        visible={show}
        style={{ width: '50rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Nuevo Regalo"
        modal
        className="p-fluid"
        onHide={cancelarExtensionRegalo}
        >
            {
                (loadingUltimaMembresia||id_cli)?(
                    <>
                        <form onSubmit={submitExtensionRegalo}>
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
                                <Col lg={6}>
                                <Row>
                                    <Col lg={6}>
                                        {/* <Button label="Cancelar" icon="pi pi-times" severity="danger" text /> */}
                                        <Button label="Cancelar" icon="pi pi-times" severity="danger" outlined onClick={cancelarExtensionRegalo} />
                                    </Col>
                                    <Col lg={6}>
                                        <Button label="Guardar" icon="pi pi-check" severity='success' type='submit' />
                                    </Col>
                                </Row>
                                </Col>
                            </Row>
                            <br/>
                            <div><strong>ULTIMA MEMBRESIA: </strong>{tb_ProgramaTraining?.name_pgm} | {tb_semana_training?.semanas_st} SEMANAS</div>
                            <div><strong>FECHA EN LA QUE SE TERMINA SU MEMBRESIA: </strong><DateMask date={sumarDiasHabiles(fec_fin_mem, dias_habiles)} format={"dddd D [de] MMMM [del] YYYY"}/></div>
                        </form>
                    </>
                ):(
                    <>
                    Cargando...
                    </>
                )
            }
    </Dialog>
  )
}

function sumarDiasHabiles(fecha, n_dia) {
    if(!fecha){
        return 'No fue posible cargar la fecha';
    }
  // Convertir la cadena de fecha a un objeto Date
  let date = new Date(fecha);
  
  // Crear un arreglo de tamaño n_dia
  let dias = Array.from({ length: n_dia }, (_, i) => i);

  // Usar forEach para iterar sobre los días
  dias.forEach(() => {
    // Incrementar la fecha en un día
    date.setDate(date.getDate() + 1);

    // Obtener el día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
    let diaSemana = date.getDay();

    // Si el día es fin de semana (Sábado o Domingo), saltar hasta el lunes
    if (diaSemana === 5) { // Sábado
      date.setDate(date.getDate() + 2); // Saltar a lunes
    } else if (diaSemana === 0) { // Domingo
      date.setDate(date.getDate() + 1); // Saltar a lunes
    }
  });

  // Retornar la nueva fecha en formato ISO 8601
  return date.toISOString().split('T')[0];
  }