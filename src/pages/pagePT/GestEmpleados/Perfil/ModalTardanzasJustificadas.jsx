import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useRef, useState } from 'react'
import { Col, Table, Row } from 'react-bootstrap';
import Select from 'react-select'

export const ModalTardanzasJustificadas = ({show, onHide}) => {
  return (
  <Dialog
    visible={show}
    onHide={onHide}
    position='top'
    style={{width: '40rem'}}
    header='AGREGAR TARDANZAS'
    >
      <div>
        <Row>
            <Col lg={12}>
                <div className="mb-4">
                    <label htmlFor="marca" className="form-label">
                        TIPO DE PERMISO
                    </label>
                    <Select
                        // onChange={(e) => onInputChangeReact(e, 'id_marca')}
                        name="id_marca"
                        placeholder={''}
                        className="react-select"
                        classNamePrefix="react-select"
                        // options={dataMarcas}
                        // value={dataMarcas.find(
                        //     (option) => option.value === id_marca
                        // )||0}
                        
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
                            name="imgAvatar_BASE64"
                            // onChange={} 
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
        </Row>
      </div>
</Dialog>
  )
}
