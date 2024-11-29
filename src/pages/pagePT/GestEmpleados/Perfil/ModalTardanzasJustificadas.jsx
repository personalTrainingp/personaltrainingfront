import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useForm } from '@/hooks/useForm';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Table, Row } from 'react-bootstrap';
import Select from 'react-select'
const registrarHorasEspeciales = {
    id_tipo_hora: 0,
    observacion: '',
    fecha_desde: '',
    fecha_antes: '',
    cantidad_minutos: 0,
    con_goce_sueldo: false,
    tipo_hora_especial: 848
}
export const ModalTardanzasJustificadas = ({show, onHide}) => {
    const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
    const { formState, id_tipo_hora, observacion, fecha_desde, fecha_antes, cantidad_minutos, con_goce_sueldo, tipo_hora_especial, onInputChange, onResetForm } = useForm(registrarHorasEspeciales)
    useEffect(() => {
        obtenerParametroPorEntidadyGrupo("horas_especiales", 848)
    }, [])

  return (
  <Dialog
    visible={show}
    onHide={onHide}
    position='top'
    style={{width: '40rem'}}
    header='AGREGAR AGREGAR TARDANZAS'
    >
      <div>
        <Row>
            <Col lg={12}>
                <div className="mb-4">
                    <label htmlFor="marca" className="form-label">
                        TIPO DE TARDANZAS
                    </label>
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
            <Col lg={12}>
                <div className="mb-4">
                    <label htmlFor="imgAvatar_BASE64" className="form-label">
                        FECHA
                    </label>
                    <input
                            className="form-control"
                            type='date'
                            name="imgAvatar_BASE64"
                            // onChange={} 
                        />
                </div>
            </Col>
            <Col lg={12}>
                <div className="mb-4">
                    <label htmlFor="imgAvatar_BASE64" className="form-label">
                        MINUTOS TARDE
                    </label>
                    <input
                            className="form-control"
                            type='date'
                            name="imgAvatar_BASE64"
                            // onChange={} 
                        />
                </div>
            </Col>
            <Col lg={6}>
                <div className="mb-4">
                    <input
                            className="m-1"
                            type='checkbox'
                            id={'check_goce_sueldo'}
                            value={'asdf'}
                            name="imgAvatar_BASE64"
                            // onChange={} 
                        />
                    <label htmlFor="check_goce_sueldo" className="form-label">
                        ¿ES CON GOCE DE SUELDO?
                    </label>
                </div>
            </Col>
            <Col lg={12}>
                <div className="mb-4">
                    <label htmlFor="periodo_desde" className="form-label">OBSERVACION</label>
                    <textarea
                            className="form-control"
                            id={'check_goce_sueldo'}
                            value={observacion}
                            name="observacion"
                            // onChange={} 
                        />
                </div>
            </Col>
        </Row>
      </div>
</Dialog>
  )
}
