import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useRef } from 'react'
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { InputText } from 'primereact/inputtext';
import { Col, Row } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { TabPanel, TabView } from 'primereact/tabview';
import { InputMask } from "primereact/inputmask";
import Select from 'react-select';
import { useForm } from '@/hooks/useForm';
import { usePlanillaStore } from './usePlanillaStore';
dayjs.extend(utc);
const registrarNomina = {
  fecha_desde: null,
  fecha_hasta: null,
  observacion: '',
}
export const ModalAgregarNomina = ({show, onHide, uid_empl}) => {
    const stepperRef = useRef(null);
    const { fecha_desde, fecha_hasta, observacion, formState, onInputChange, onResetForm } = useForm(registrarNomina)

    const { postPlanillaxEMPL, obtenerAsistenciasxEmpl } = usePlanillaStore()
    
    const onClickModalClose = ()=>{
      onHide()
      onResetForm()
    }
    const onClickSubmitPlanilla = ()=>{
      postPlanillaxEMPL(formState, uid_empl)//PLANILLA DEL MES DE NOVIEMBRE 2024
      onClickModalClose()
    }
    useEffect(() => {
      obtenerAsistenciasxEmpl(uid_empl, 4)
    }, [])
    

    return (
      <Dialog
          visible={show}
          onHide={onHide}
          position='top'
          style={{width: '40rem'}}
          header='AGREGAR PLANILLA'
          >
            <form>
              <Row>
                <Col xxl={6}>
                  <div className="mb-4">
                      <label htmlFor="fecha_desde" className="form-label">FECHA DESDE</label>
                      <input
                        type='date'
                        className='form-control'
                        name="fecha_desde"
                        value={fecha_desde}
                        onChange={onInputChange}
                      />
                  </div>
                </Col>
                <Col xxl={6}>
                  <div className="mb-4">
                      <label htmlFor="periodo_desde" className="form-label">FECHA HASTA</label>
                      <input
                        type='date'
                        className='form-control'
                        name="fecha_hasta"
                        value={fecha_hasta}
                        onChange={onInputChange}
                      />
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="mb-4">
                    <label htmlFor="periodo_desde" className="form-label">OBSERVACION</label>
                    <textarea
                        className='form-control'
                        name="observacion"
                        value={observacion}
                        onChange={onInputChange}
                      />
                  </div>
                </Col>
              </Row>
              <br />
              <Button type='button' label='Agregar' className='p-button-primary' onClick={onClickSubmitPlanilla} />
            </form>
      </Dialog>
    )
}
