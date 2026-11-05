import { useForm } from '@/hooks/useForm'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useMemo, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Select from 'react-select'
dayjs.extend(utc)

const aFechaInput = (fecha)=> fecha ? dayjs.utc(fecha).format('YYYY-MM-DD') : ''

// Devuelve el mensaje del primer dato inválido, o '' si todo está correcto
export const validarTiempoEspecial = ({id_tipo, fechaDesde, fechaHasta, minutos}, config, hayTipos)=>{
    if(hayTipos && !id_tipo) return 'Seleccione el tipo.'
    if(!fechaDesde) return config.rangoFechas ? 'Ingrese la fecha de inicio.' : 'Ingrese la fecha.'
    if(config.rangoFechas && !fechaHasta) return 'Ingrese la fecha final.'
    if(config.rangoFechas && fechaHasta < fechaDesde) return 'La fecha final no puede ser anterior a la de inicio.'
    if(config.usaMinutos && !(Number.isInteger(Number(minutos)) && Number(minutos) > 0)) return 'Los minutos deben ser un número entero mayor a 0.'
    return ''
}

export const ModalTiempoEspecial = ({config, registro, tipos, onGuardar, onHide}) => {
    const formInicial = useMemo(()=>({
        id_tipo: registro?.id_tipo || 0,
        fechaDesde: aFechaInput(registro?.fechaDesde),
        fechaHasta: aFechaInput(registro?.fechaHasta),
        minutos: registro?.minutos || '',
        conGoceSueldo: registro?.conGoceSueldo ?? false,
        observacion: registro?.observacion ?? '',
    }), [registro])
    const { formState, id_tipo, fechaDesde, fechaHasta, minutos, conGoceSueldo, observacion, onInputChange, onInputChangeReact } = useForm(formInicial)
    const [error, seterror] = useState('')
    const [guardando, setguardando] = useState(false)

    const onSubmit = async ()=>{
        const mensaje = validarTiempoEspecial(formState, config, tipos.length > 0)
        if(mensaje) return seterror(mensaje)
        setguardando(true)
        seterror('')
        try {
            await onGuardar(registro?.id, {
                id_tipo: Number(id_tipo) || 0,
                fechaDesde,
                // sin rango, el registro es de un solo día
                fechaHasta: config.rangoFechas ? fechaHasta : fechaDesde,
                minutos: config.usaMinutos ? Number(minutos) : 0,
                conGoceSueldo: config.usaGoce ? conGoceSueldo : false,
                observacion,
            })
            onHide()
        } catch (err) {
            console.log(err)
            seterror('No se pudo guardar. Intente nuevamente.')
            setguardando(false)
        }
    }

    return (
        <Dialog
            visible
            onHide={onHide}
            position='top'
            style={{width: '40rem'}}
            header={`${registro ? 'EDITAR' : 'AGREGAR'} ${config.titulo}`}
        >
            {error && <Alert variant='danger'>{error}</Alert>}
            <Row>
                <Col lg={12}>
                    <div className='mb-4'>
                        <label htmlFor='id_tipo' className='form-label'>TIPO</label>
                        <Select
                            inputId='id_tipo'
                            onChange={(e)=>onInputChangeReact(e, 'id_tipo')}
                            placeholder={tipos.length > 0 ? 'Seleccione el tipo' : 'No hay tipos configurados'}
                            className='react-select'
                            classNamePrefix='react-select'
                            options={tipos}
                            isDisabled={tipos.length === 0}
                            value={tipos.find(t=>t.value === id_tipo) ?? null}
                        />
                    </div>
                </Col>
                <Col lg={config.rangoFechas || config.usaMinutos ? 6 : 12}>
                    <div className='mb-4'>
                        <label htmlFor='fechaDesde' className='form-label'>{config.rangoFechas ? 'FECHA DE INICIO' : 'FECHA'}</label>
                        <input className='form-control' type='date' id='fechaDesde' name='fechaDesde' value={fechaDesde} onChange={onInputChange}/>
                    </div>
                </Col>
                {config.rangoFechas && (
                    <Col lg={6}>
                        <div className='mb-4'>
                            <label htmlFor='fechaHasta' className='form-label'>FECHA FINAL</label>
                            <input className='form-control' type='date' id='fechaHasta' name='fechaHasta' value={fechaHasta} min={fechaDesde || undefined} onChange={onInputChange}/>
                        </div>
                    </Col>
                )}
                {config.usaMinutos && (
                    <Col lg={6}>
                        <div className='mb-4'>
                            <label htmlFor='minutos' className='form-label'>MINUTOS</label>
                            <input className='form-control' type='number' min={1} step={1} id='minutos' name='minutos' value={minutos} onChange={onInputChange}/>
                        </div>
                    </Col>
                )}
                {config.usaGoce && (
                    <Col lg={12}>
                        <div className='mb-4'>
                            <input className='m-1' type='checkbox' id='conGoceSueldo' name='conGoceSueldo' checked={conGoceSueldo} onChange={onInputChange}/>
                            <label htmlFor='conGoceSueldo' className='form-label'>¿ES CON GOCE DE SUELDO?</label>
                        </div>
                    </Col>
                )}
                <Col lg={12}>
                    <div className='mb-4'>
                        <label htmlFor='observacion' className='form-label'>OBSERVACION</label>
                        <textarea className='form-control' id='observacion' name='observacion' maxLength={560} value={observacion} onChange={onInputChange}/>
                    </div>
                </Col>
            </Row>
            <Button type='button' label={guardando ? 'Guardando...' : 'Guardar'} disabled={guardando} onClick={onSubmit}/>
            <Button type='button' label='Cancelar' link disabled={guardando} onClick={onHide}/>
        </Dialog>
    )
}
