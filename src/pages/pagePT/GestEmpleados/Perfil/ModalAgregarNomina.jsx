import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useRef } from 'react'
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
dayjs.extend(utc);
const registrarNomina = {
  fec_desde: null,
  fec_hasta: null,
  observacion: '',
}
export const ModalAgregarNomina = ({show, onHide}) => {
    const stepperRef = useRef(null);
    const { fec_desde, fec_hasta, observacion, formState, onInputChange } = useForm(registrarNomina)
    
    const onClickModalClose = ()=>{
      
    }

    return (
      <Dialog
          visible={show}
          onHide={onHide}
          position='top'
          style={{width: '40rem'}}
          header='AGREGAR NOMINA'
          >
            <form>
              <Row>
                <Col xxl={6}>
                  <div className="mb-4">
                      <label htmlFor="fec_desde" className="form-label">FECHA DESDE</label>
                      <input
                        type='date'
                        className='form-control'
                        name="fec_desde"
                        value={fec_desde}
                      />
                      {/* <InputMask className="form-control" mask="99/99/9999" placeholder="DD/MM/YYYY" name="periodo_desde" readOnly /> */}
                  </div>
                </Col>
                <Col xxl={6}>
                  <div className="mb-4">
                      <label htmlFor="periodo_desde" className="form-label">FECHA HASTA</label>
                      <input
                        type='date'
                        className='form-control'
                        name="fec_hasta"
                        value={fec_hasta}
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
              <Button type='button' label='Agregar' className='p-button-primary' onClick={onClickModalClose} />
            </form>
      </Dialog>
    )
}
