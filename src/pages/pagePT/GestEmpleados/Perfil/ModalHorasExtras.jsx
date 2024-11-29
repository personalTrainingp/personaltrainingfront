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
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useForm } from 'react-hook-form';
dayjs.extend(utc);
const registrarHorasEspeciales = {
    id_tipo_hora: 0,
    observacion: '',
    fecha_desde: '',
    fecha_antes: '',
    cantidad_minutos: 0,
    con_goce_sueldo: false,
    tipo_hora_especial: 849
  }
export const ModalHorasExtras = ({show, onHide}) => {
    const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
  const { formState, id_tipo_hora, observacion, fecha_desde, fecha_antes, cantidad_minutos, con_goce_sueldo, tipo_hora_especial } = useForm(registrarHorasEspeciales)
  useEffect(() => {
      obtenerParametroPorEntidadyGrupo("horas_especiales", 849)
  }, [])

  return (
    <Dialog
        visible={show}
        onHide={onHide}
        position='top'
        style={{width: '40rem'}}
        header='AGREGAR MINUTOS EXTRAS'
        >
          <form>
            <Row>
              <Col xxl={12}>
                <div className="mb-4">
                    <label htmlFor="periodo_desde" className="form-label">TIPO DE MINUTOS EXTRAS</label>
                    <Select
                        onChange={(e) => onInputChangeReact(e, 'id_tipo_hora')}
                        name="id_tipo_hora"
                        placeholder={''}
                        className="react-select"
                        classNamePrefix="react-select"
                        options={DataGeneral}
                        value={DataGeneral.find(
                            (option) => option.value === id_tipo_hora
                        )||0}
                    />
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
                  <textarea 
                    className="form-control" 
                    mask="9999" 
                    placeholder="9999" 
                    name="periodo_desde" 
                  />
                </div>
              </Col>
            </Row>
            <br />
            <Button type='button' label='Agregar' className='p-button-primary' onClick={() => stepperRef.current.next()} />
          </form>
    </Dialog>
  )
}
