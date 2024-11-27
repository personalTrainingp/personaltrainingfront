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
        header='PERIODO DE ASISTENCIA'
        >
          <form>
            <Row>
              <Col lg={6}>
                <label htmlFor="periodo_desde">PERIODO DESDE</label>
                <InputMask mask="99/99/9999" placeholder="DD/MM/YYYY" name="periodo_desde" readOnly />
              </Col>
              <Col lg={6}>
                <label htmlFor="periodo_hasta">PERIODO HASTA</label>
                <InputMask mask="99/99/9999" placeholder="DD/MM/YYYY" name="periodo_hasta" readOnly />
              </Col>
              <Col lg={6}>
                <label htmlFor="periodo_hasta">JORNADA</label>
                <Select />
              </Col>
            </Row>
            <br />
            <Button type='button' label='Agregar' className='p-button-primary' onClick={() => stepperRef.current.next()} />
          </form>
    </Dialog>
  )
}
