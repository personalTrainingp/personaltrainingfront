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
    tipo_hora_especial: 847
}
export const ModalPermisos = ({show, onHide}) => {
    const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
    const { formState, id_tipo_hora, observacion, fecha_desde, fecha_antes, cantidad_minutos, con_goce_sueldo, onInputChangeReact, onInputChange, onResetForm } = useForm(registrarHorasEspeciales)
    useEffect(() => {
        obtenerParametroPorEntidadyGrupo("horas_especiales", 847)
    }, [])

    

    
  return (
  <Dialog
    visible={show}
    onHide={onHide}
    position='top'
    style={{width: '40rem'}}
    header='AGREGAR PERMISOS'
    >
      <div>
        <Row>
            <Col lg={12}>
                <div className="mb-4">
                    <label htmlFor="id_tipo_hora" className="form-label">
                        TIPO DE PERMISO
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
            <Col lg={6}>
                <div className="mb-4">
                    <label htmlFor="imgAvatar_BASE64" className="form-label">
                        FECHA DESDE
                    </label>
                    <input
                            className="form-control"
                            type='date'
                            name="fecha_desde"
                            value={fecha_desde}
                            onChange={onInputChange} 
                        />
                </div>
            </Col>
            <Col lg={6}>
                <div className="mb-4">
                    <label htmlFor="imgAvatar_BASE64" className="form-label">
                        FECHA HASTA
                    </label>
                    <input
                            className="form-control"
                            type='date'
                            value={fecha_antes}
                            name="fecha_antes"
                            onChange={onInputChange} 
                        />
                </div>
            </Col>
            <Col lg={6}>
                <div className="mb-4">
                    <input
                            className="m-1"
                            type='checkbox'
                            value={con_goce_sueldo}
                            name="con_goce_sueldo"
                            onChange={onInputChange} 
                        />
                    <label htmlFor="con_goce_sueldo" className="form-label">
                        ¿ES CON GOCE DE SUELDO?
                    </label>
                </div>
            </Col>
            <Col lg={12}>
                <div className="mb-4">
                  <label htmlFor="periodo_desde" className="form-label">OBSERVACION</label>
                  <textarea
                            className="form-control"
                            id={'observacion'}
                            value={observacion}
                            name="observacion"
                            onChange={onInputChange} 
                        />
                </div>
              </Col>
        </Row>
      </div>
</Dialog>
  )
}
