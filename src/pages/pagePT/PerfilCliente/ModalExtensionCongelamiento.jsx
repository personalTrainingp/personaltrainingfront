import { useForm } from '@/hooks/useForm';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { DateMask } from '@/components/CurrencyMask';
import { helperFunctions } from '@/common/helpers/helperFunctions';

 // Función para sumar días hábiles a una fecha
 const addBusinessDays = (date, daysToAdd) => {
    let currentDate = dayjs(date);
    let addedDays = 0;
    while (addedDays < daysToAdd) {
      currentDate = currentDate.add(1, 'day');
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        addedDays++;
      }
    }
    return currentDate.format('YYYY-MM-DD');
  };

  // Función para calcular la diferencia de días hábiles entre dos fechas
  const differenceInBusinessDays = (start, end) => {
    let currentDate = dayjs(start);
    let endDate = dayjs(end);
    let businessDays = 0;
    while (currentDate.isBefore(endDate)) {
      currentDate = currentDate.add(1, 'day');
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        businessDays++;
      }
    }
    return businessDays;
  };
const registerExCongelamiento ={
    extension_inicio: '',
    extension_fin: '',
    dias_habiles: '',
}
const valorDef = {
    tb_ProgramaTraining:'', 
    tb_semana_training:'', 
    fec_inicio_mem:'', 
    fec_fin_mem: ''
}
export const ModalExtensionCongelamiento = ({show, onHide, id_cli, dataUltimaMembresia}) => {
    const {formState, extension_inicio, extension_fin, dias_habiles, observacion, img_prueba_extension, onResetForm, onInputChange, onInputChangeReact, onInputChangeFunction} = useForm(registerExCongelamiento)
    // const { obtenerUltimaMembresiaPorCliente, dataUltimaMembresia } = useTerminoStore()
    const [loadingUltimaMembresia, setloadingUltimaMembresia] = useState(false)
	// const { dataUltimaMembresiaPorCliente } = useSelector(e=>e.parametro)
	const { tb_ProgramaTraining, tb_semana_training, fec_inicio_mem, fec_fin_mem } = dataUltimaMembresia[0]||valorDef
    const cancelarExtensionCongelamiento = ()=>{
        onHide()
        onResetForm()
    }
    const submitExtensionCongelamiento = ()=>{

        cancelarExtensionCongelamiento()
    }
    const productDialogFooter = (
		<React.Fragment>
			<Button label="Cancel" icon="pi pi-times" severity='danger' outlined onClick={cancelarExtensionCongelamiento} />
			<Button label="Guardar" icon="pi pi-check" severity='success' onClick={submitExtensionCongelamiento} />
		</React.Fragment>
	);
      // Efecto para actualizar días cuando se seleccionan fechas
  useEffect(() => {
    if (extension_inicio && extension_fin) {
      const diffDays = differenceInBusinessDays(extension_inicio, extension_fin);
      onInputChangeFunction("dias_habiles", diffDays)
    }
  }, [extension_inicio, extension_fin]);

  // Efecto para actualizar fecha fin cuando se seleccionan días
  useEffect(() => {
    if (extension_inicio && dias_habiles) {
      const end = addBusinessDays(extension_inicio, parseInt(dias_habiles));
      onInputChangeFunction("extension_fin", end)
    }
  }, [extension_inicio, dias_habiles]);
  const { sumarDiasHabiles } = helperFunctions()
  return (
    <Dialog
        visible={show}
        style={{ width: '50rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Nuevo Congelamiento"
        modal
        className="p-fluid"
        // footer={productDialogFooter}
        onHide={cancelarExtensionCongelamiento}
        >
            {
                !loadingUltimaMembresia && (
                    
            <form onSubmit={submitExtensionCongelamiento}>
            <Row>
                <Col lg={12}>
                    <div className="field">
                        <label htmlFor="extension_inicio" className="font-bold">
                            Fecha inicio
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
                            Fecha fin
                        </label>
                        <input
                            id="extension_fin"
                            className='form-control'
                            value={extension_fin}
                            disabled={!extension_inicio}
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
                            disabled={!extension_inicio}
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
                <Col lg={6}>
                    <Row>
                        <Col lg={6}>
                            <Button label="Cancel" icon="pi pi-times" severity='danger' outlined onClick={cancelarExtensionCongelamiento} />
                        </Col>
                        <Col lg={6}>
                            <Button label="Guardar" icon="pi pi-check" severity='success' type='submit' />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br/>
            <div><strong>Ultima membresia: </strong>{tb_ProgramaTraining?.name_pgm} | {tb_semana_training?.semanas_st} SEMANAS</div>
            <div><strong>Fecha en la que termina su membresia: </strong><DateMask date={sumarDiasHabiles(fec_fin_mem, dias_habiles)} format={"dddd D [de] MMMM [de] YYYY"}/></div>
        </form>
                )
            }
    </Dialog>
  )
}
