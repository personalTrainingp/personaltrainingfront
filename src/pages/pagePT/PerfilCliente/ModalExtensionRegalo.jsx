import { DateMask } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
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
import Swal from 'sweetalert2';
const registerExRegalos ={
    dias_habiles: 1,
    observacion: '',
}

export const ModalExtensionRegalo = ({show, onHide, id_cli}) => {
    const {formState, dias_habiles, observacion, onResetForm, onInputChange, onInputChangeReact} = useForm(registerExRegalos)
    const { postExtension, obtenerUltimaMembresiaxIdCli, dataUltimaMembresia } = useExtensionStore()
    
    const [loadingUltimaMembresia, setloadingUltimaMembresia] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
	// const { tb_ProgramaTraining, tb_semana_training, fec_inicio_mem, fec_fin_mem } = dataUltimaMembresia[0]||valorDef
    const cancelarExtensionRegalo = ()=>{
        onHide()
        onResetForm()
    }   
    useEffect(() => {
            obtenerUltimaMembresiaxIdCli(id_cli)
    }, [])
    console.log(dataUltimaMembresia);
    
    const submitExtensionRegalo = async (e)=>{
        e.preventDefault()
        if(!dataUltimaMembresia[0]){
            return Swal.fire({
                icon: 'error',
                title: 'NO HAY NINGUNA MEMBRESIA',
                showConfirmButton: false,
                timer: 2500,
            });
        }
        setLoadingSubmit(true)
        Swal.fire({
            title: 'Guardando regalo...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading()
            },
        });
        const { success, message } = await postExtension(formState.dias_habiles, formState.observacion, 'REG', dataUltimaMembresia[0].id_venta, dataUltimaMembresia[0].fecha_fin_mem, sumarDiasHabiles(dataUltimaMembresia[0]?.fecha_fin_mem, dias_habiles))
        setLoadingSubmit(false)
        if(!success){
            return Swal.fire({
                icon: 'error',
                title: message || 'NO SE PUDO CREAR EL REGALO',
                text: message ? 'Es posible que ya exista un regalo registrado en la última membresía.' : undefined,
                confirmButtonText: 'Aceptar',
            });
        }
        Swal.fire({
            icon: 'success',
            title: 'Regalo creado correctamente',
            showConfirmButton: false,
            timer: 2000,
        });
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
                                                  <Button label="Cancelar" icon="pi pi-times" severity="danger" outlined onClick={cancelarExtensionRegalo} disabled={loadingSubmit} />
                                              </Col>
                                              <Col lg={6}>
                                                  <Button label="Guardar" icon="pi pi-check" severity='success' type='submit' loading={loadingSubmit} disabled={loadingSubmit} />
                                              </Col>
                                          </Row>
                                          </Col>
                                      </Row>
                                      <br/>
          <div><strong>ULTIMA MEMBRESIA: </strong>{dataUltimaMembresia[0]?.nombre_membresia} | {dataUltimaMembresia[0]?.semanas_membresia} SEMANAS</div>
          <div><strong>FECHA EN LA QUE SE TERMINA SU MEMBRESIA: 
            </strong> <DateMask date={sumarDiasHabiles(dataUltimaMembresia[0]?.fecha_fin_mem, dias_habiles)} format={"dddd D [de] MMMM [del] YYYY"}/></div>
          </form>
    </Dialog>
  )
}

function sumarDiasHabiles(fecha, n_dia) {
    if(!fecha){
        return 'No fue posible cargar la fecha';
    }
  // Se opera siempre en UTC para no depender de la zona horaria del navegador
  let date = dayjs.utc(fecha);

  // Crear un arreglo de tamaño n_dia
  let dias = Array.from({ length: parseInt(n_dia) || 0 }, (_, i) => i);

  // Usar forEach para iterar sobre los días
  dias.forEach(() => {
    // Incrementar la fecha en un día
    date = date.add(1, 'day');

    // Obtener el día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
    let diaSemana = date.day();

    // Si el día es fin de semana (Sábado o Domingo), saltar hasta el lunes
    if (diaSemana === 6) { // Sábado
      date = date.add(2, 'day'); // Saltar a lunes
    } else if (diaSemana === 0) { // Domingo
      date = date.add(1, 'day'); // Saltar a lunes
    }
  });

  // Retornar la nueva fecha en formato ISO 8601
  return date.format('YYYY-MM-DD');
  }