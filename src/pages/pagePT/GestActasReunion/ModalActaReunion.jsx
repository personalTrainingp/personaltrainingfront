import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'

const registrarActaReunion = {
    FechaActa: '',
}
export const ModalActaReunion = ({show, onHide}) => {
    const { formState, precio_venta, fecha_cambio, precio_compra, moneda, onInputChange, onResetForm } = useForm(registrarActaReunion)
    const onCancelButton = ()=>{
        onHide()
        onResetForm()
    }
  return (
    <Dialog header="Registrar acta de reunion" visible={show} style={{ width: '50vw' }} onHide={onHide}>
        <form>
            <Row>
                <Col xxl={12}>
                    <div className="mb-2">
                        <label htmlFor="precio_venta" className="form-label">
                            PRECIO DE VENTA*
                        </label>
                        <input
                            className="form-control"
                            name="precio_venta"
                            value={precio_venta}
                            onChange={onInputChange}
                            id="precio_venta"
                            placeholder="PRECIO DE VENTA"
                            required
                        />
                    </div>
                </Col>
                <Col xxl={12}>
                    <div className="mb-2">
                        <label htmlFor="precio_compra" className="form-label">
                            PRECIO DE COMPRA*
                        </label>
                        <input
                            className="form-control"
                            name="precio_compra"
                            value={precio_compra}
                            onChange={onInputChange}
                            id="precio_compra"
                            placeholder="PRECIO DE VENTA"
                            style={{ maxHeight: '100px' }}
                            required
                        />
                    </div>
                </Col>
                <Col xxl={12}>
                    <div className="mb-2">
                        <label htmlFor="precio_compra" className="form-label">
                            Fecha de cambio*
                        </label>
                        <input
                            type='date'
                            className="form-control"
                            name="precio_compra"
                            value={precio_compra}
                            onChange={onInputChange}
                            id="precio_compra"
                            placeholder="PRECIO DE VENTA"
                            style={{ maxHeight: '100px' }}
                            required
                        />
                    </div>
                </Col>
                <Col xxl={12}>
                    <Button type="submit">AGREGAR</Button>
                    <a onClick={onCancelButton} style={{cursor: 'pointer'}} className='text-danger m-3'>Cancelar</a>
                </Col>
            </Row>
        </form>
    </Dialog>
  )
}
