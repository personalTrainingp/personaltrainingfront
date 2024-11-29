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
dayjs.extend(utc);

export const ModalHorasEspeciales = ({show, onHide}) => {
  const stepperRef = useRef(null);
  
  return (
    <Dialog
        visible={show}
        onHide={onHide}
        position='top'
        style={{width: '40rem'}}
        header='HORAS DE ASISTENCIAS'
        >
          <form>
            <Row>
              <Col xxl={12}>
                <div className="mb-4">
                    <label htmlFor="periodo_desde" className="form-label">TIPO DE MINUTOS EXTRAS</label>
                    <InputMask className="form-control" mask="99/99/9999" placeholder="DD/MM/YYYY" name="periodo_desde" readOnly />
                </div>
              </Col>
              <Col xxl={6}>
                <div className="mb-4">
                    <label htmlFor="periodo_desde" className="form-label">FECHA</label>
                    <InputMask className="form-control" mask="99/99/9999" placeholder="DD/MM/YYYY" name="periodo_desde" readOnly />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-4">
                  <label htmlFor="periodo_desde" className="form-label">MINUTOS EXTRA</label>
                  <InputMask className="form-control" mask="9999" placeholder="9999" name="periodo_desde" readOnly />
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-4">
                  <label htmlFor="periodo_desde" className="form-label">OBSERVACION</label>
                  <InputMask className="form-control" mask="9999" placeholder="9999" name="periodo_desde" readOnly />
                </div>
              </Col>
            </Row>
            <br />
            <Button type='button' label='Agregar' className='p-button-primary' onClick={() => stepperRef.current.next()} />
          </form>
    </Dialog>
  )
}
