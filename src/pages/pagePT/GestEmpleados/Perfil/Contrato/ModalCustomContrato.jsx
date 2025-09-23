import { useForm } from '@/hooks/useForm'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { useContratoColaboradorStore } from './useContratoColaboradorStore'
const customContrato = {
  fecha_inicio: null,
  fecha_fin: null,
  sueldo: 0.00,
  observacion: ''
}
export const ModalCustomContrato = ({show, onHide, id_empleado}) => {
  const { formState, fecha_inicio, fecha_fin, sueldo, observacion, onInputChange, onResetForm } = useForm(customContrato)
  const { postContratoColaborador } = useContratoColaboradorStore()
  const onCancelCustomContrato = ()=>{
    onHide()
    onResetForm()
  }
  const onClickCustomContrato = (e)=>{
    e.preventDefault()
    postContratoColaborador(formState, id_empleado)
    onCancelCustomContrato()
  }
  return (
    <Dialog visible={show} onHide={onCancelCustomContrato} header={'AGREGAR CONTRATO'}>
      <form>
        <div className='mb-4'>
          <label>SUELDO*: </label>
          <input
            name='sueldo'
            value={sueldo}
            className='form-control'
            onChange={onInputChange}
          />
        </div>
        <div className='mb-4'>
          <label>FECHA INICIO*: </label>
          <input
            name='fecha_inicio'
            type='date'
            value={fecha_inicio}
            className='form-control'
            onChange={onInputChange}
          />
        </div>
        <div className='mb-4'>
          <label>FECHA FIN*: </label>
          <input
            name='fecha_fin'
            type='date'
            value={fecha_fin}
            className='form-control'
            onChange={onInputChange}
          />
        </div>
        
        <div className='mb-4'>
          <label>OBSERVACION*: </label>
          <textarea
            name='observacion'
            value={observacion}
            className='form-control'
            onChange={onInputChange}
          />
        </div>
        <div className='mb-4'>
          <Button label='AGREGAR CONTRATO' type='submit' onClick={onClickCustomContrato}/>
          <Button label='CANCELAR' text/>
        </div>
      </form>
    </Dialog>
  )
}
