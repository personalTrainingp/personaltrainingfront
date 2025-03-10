import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { useGeneradorFechasStore } from './useGeneradorFechasStore'
const registerGenerarFechas = {
    nombre_fecha: '', 
    fecha_inicio: '',
    fecha_fin: '',
    orden: 0,
}
export const ModalGenerarFechas = ({show, onHide}) => {
    const { formState, nombre_fecha, fecha_inicio, fecha_fin, orden, onInputChange, onInputChangeReact, onResetForm } = useForm(registerGenerarFechas)
    const { registrarFechasInventarioxEmpresa } = useGeneradorFechasStore()
    const onCancelarCambioPrograma = ()=>{
        onHide()
        onResetForm()
    }
    const onSubmitCambioPrograma = (e)=>{
        e.preventDefault();
        registrarFechasInventarioxEmpresa(598, {...formState, fecha_fin: fecha_inicio})
    }
  return (
    <Dialog style={{width: '50rem'}} visible={show} onHide={onCancelarCambioPrograma} header={'AGREGAR FECHA PARA INVENTARIO'}>
        <form onSubmit={onSubmitCambioPrograma}>
        {/* <div className='mb-2'>
            <label>Nombre de la fecha:</label>
            <input
            className='form-control'
            name='nombre_fecha'
            value={nombre_fecha}
            onChange={onInputChange}
            />
        </div> */}
        <div className='mb-2'>
            <label>Fecha:</label>
            <input
                type='date'
                className='form-control'
                value={fecha_inicio}
                name='fecha_inicio'
                onChange={onInputChange}
                />
        </div>
        {/* <div className='mb-2'>
            <label>Fecha de fin:</label>
            <input
                type='date'
                className='form-control'
                value={fecha_fin}
                name='fecha_fin'
                onChange={onInputChange}
                />
        </div> */}
        <div className='mb-2'>
            <label>Orden:</label>
            <input
            className='form-control'
            name='orden'
            value={orden}
            onChange={onInputChange}
            />
        </div>
        <Button label='GUARDAR' type='submit'/> 
        <Button label='CANCELAR' text onClick={onCancelarCambioPrograma}/>
        </form>
    </Dialog>
  )
}
