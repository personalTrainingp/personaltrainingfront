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
import { useExtensionStore } from '@/hooks/hookApi/useExtensionStore';
const esDiaHabil = (fecha) => {
  const diaSemana = dayjs(fecha).day();
  return diaSemana !== 0 && diaSemana !== 6; // No es sábado ni domingo
};
 // Función para sumar días hábiles a una fecha
 const addBusinessDays = (date, daysToAdd) => {
    let currentDate = dayjs(date);
    let addedDays = 0;
      // Si el primer día es hábil, lo contamos
    if (esDiaHabil(currentDate)) {
      addedDays++;
    }
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
      // Si el primer día es hábil, lo contamos
      if (esDiaHabil(currentDate)) {
        businessDays++;
      }
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
    dias_habiles: 0,
}
const valorDef = {
    tb_ProgramaTraining:'', 
    tb_semana_training:'', 
    fec_inicio_mem:'', 
    fec_fin_mem: ''
}
export const ModalExtensionCongelamiento = ({show, onHide, id_cli}) => {
    const {formState, extension_inicio, extension_fin, dias_habiles, observacion, img_prueba_extension, onResetForm, onInputChange, onInputChangeReact, onInputChangeFunction} = useForm(registerExCongelamiento)
    // const { obtenerUltimaMembresiaPorCliente, dataUltimaMembresia } = useTerminoStore()
    const [loadingUltimaMembresia, setloadingUltimaMembresia] = useState(false)
	// const { dataUltimaMembresiaPorCliente } = useSelector(e=>e.parametro)
    const { postExtension, obtenerUltimaMembresiaxIdCli, dataUltimaMembresia } = useExtensionStore()
    useEffect(() => {
obtenerUltimaMembresiaxIdCli(id_cli)
    }, [])

    
    const cancelarExtensionCongelamiento = ()=>{
        onHide()
        onResetForm()
    }
    const submitExtensionCongelamiento = (e)=>{
        e.preventDefault()
        postExtension(formState.dias_habiles, formState.observacion, 'CON', dataUltimaMembresia[0].id_venta, formState.extension_inicio, formState.extension_fin)
        cancelarExtensionCongelamiento()
    }
      // Efecto para actualizar días cuando se seleccionan fechas
  useEffect(() => {
    if (extension_inicio && extension_fin) {
      let diffDays = differenceInBusinessDays(extension_inicio, extension_fin);
          // Si el día de inicio no es sábado ni domingo, contar ese día
            // Si el día de inicio es hábil, contar ese día
        
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
  console.log(sumarDiasHabiles(dataUltimaMembresia[0]?.fecha_fin_mem, dias_habiles));
  
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
            
                      <div><strong>ULTIMA MEMBRESIA: </strong>{dataUltimaMembresia[0]?.nombre_membresia} | {dataUltimaMembresia[0]?.semanas_membresia} SEMANAS</div>
                      <div><strong>FECHA EN LA QUE SE TERMINA SU MEMBRESIA: 
                        </strong> <DateMask date={sumarDiasHabiles(dataUltimaMembresia[0]?.fecha_fin_mem, dias_habiles)} format={"dddd D [de] MMMM [del] YYYY"}/></div>
        </form>
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