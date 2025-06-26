import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useForm } from '@/hooks/useForm'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Col, Row } from 'react-bootstrap'
import { useKardexStore } from './hook/useKardexStore';
import { Sidebar } from 'primereact/sidebar'
const regRegistro = {
    cantidad:  0,
    id_motivo: 0, 
    observacion: '',
    fecha_cambio: '',
    id_lugar_destino: 0
}
export const ModalCustomMovimientoKardex = ({onHide, show, movimiento, idArticulo, id_enterprice}) => {
        const { postKardexxMovimientoxArticulo, dataArticulos } = useKardexStore()
        const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
            const { obtenerZonas, dataZonas } =  useTerminoStore()
        const { formState, cantidad, fecha_cambio, id_motivo, observacion, id_lugar_destino, onInputChange, onInputChangeReact, onResetForm } = useForm(regRegistro)
        useEffect(() => {
            if(show){
                obtenerParametroPorEntidadyGrupo('kardex', movimiento)
                obtenerZonas(id_enterprice)
            }
        }, [show])
        const onCancelModal = ()=>{
            onHide()
            onResetForm()
        }
    const onSubmitKardex = (e)=>{
        e.preventDefault()
        postKardexxMovimientoxArticulo(movimiento, id_enterprice, {...formState, id_item: idArticulo})
        // onCancelModal()
    }

  return (
    <Dialog onHide={onHide} visible={show} header={`AGREGAR ${movimiento}`} style={{width: '30rem', height: '40rem'}}>
        {id_enterprice}
        <form onSubmit={onSubmitKardex}>
        <Row>
            <Col lg={12}>
                <div className='m-2'>
                    <label>CANTIDAD</label>
                    <input type='text' name='cantidad' onChange={onInputChange} value={cantidad} className='form-control'/>
                </div>
                <div className='m-2'>
                    <label>FECHA DE SALIDA</label>
                    <input type='date' name='fecha_cambio' onChange={onInputChange} value={fecha_cambio} className='form-control'/>
                </div>
                <div className='m-2'>
                    <label>MOTIVO</label>
                    <Select
                        options={DataGeneral}
                        onChange={(e) => onInputChangeReact(e, 'id_motivo')}
                        name="id_motivo"
                        placeholder={'Selecciona el motivo'}
                        className="react-select"
                        classNamePrefix="react-select"
                        value={DataGeneral.find(
                            (option) => option.value === id_motivo
                        )}
                        required
                    />
                </div>
                {
                    movimiento === 'traspaso' && (
                        <div className='m-2'>
                            <label>ZONAS</label>
                            <Select
                                options={dataZonas}
                                onChange={(e) => onInputChangeReact(e, 'id_lugar_destino')}
                                name="id_lugar_destino"
                                placeholder={'Selecciona la zona'}
                                className="react-select"
                                classNamePrefix="react-select"
                                value={dataZonas.find(
                                    (option) => option.value === id_lugar_destino
                                )}
                                required
                            />
                        </div>
                    )
                }
                {/* {
                    movimiento === 'traspaso' && (
                        <div className='m-2'>
                            <label>EMPRESA</label>
                            <Select
                                options={dataZonas}
                                onChange={(e) => onInputChangeReact(e, 'id_lugar_destino')}
                                name="id_lugar_destino"
                                placeholder={'Selecciona la zona'}
                                className="react-select"
                                classNamePrefix="react-select"
                                value={dataZonas.find(
                                    (option) => option.value === id_lugar_destino
                                )}
                                required
                            />
                        </div>
                    )
                } */}
                <div className='m-2'>
                    <label>OBSERVACION</label>
                    <textarea className='form-control' onChange={onInputChange} id="" value={observacion} name='observacion'></textarea>
                </div>
            </Col>
        </Row>
            <Button label='AGREGAR' type='submit'/>
            <Button label='cancelar' text onClick={onCancelModal}/>
        </form>
    </Dialog>
  )
}
