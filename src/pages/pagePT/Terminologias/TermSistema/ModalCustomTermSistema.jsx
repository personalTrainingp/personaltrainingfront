import { Dialog } from 'primereact/dialog'
import React from 'react'
import { useTerminoSistema } from './useTerminoSistema'
import { useForm } from '@/hooks/useForm'
import { Button } from 'primereact/button'
import { useTerminologiaStore } from '../useTerminologiaStore'

const customTerminos = {
  label_param: ''
}
export const ModalCustomTermSistema = ({show, onHide, entidad, grupo, id}) => {
  const {formState, label_param, onInputChange } = useForm(customTerminos)
  const {registrarTerminologiaxEntidadyGrupo} = useTerminologiaStore()
  const onSubmitTermino = (e)=>{
    e.preventDefault()
    if(id===0){
      registrarTerminologiaxEntidadyGrupo(formState, entidad, grupo)
    }else{
      
    }
    onHide()
  }
  return (
    <Dialog header={`${id==0?'AGREGAR TERMINO':'EDITAR TERMINO'}`} visible={show} onHide={onHide}>
        <form>
          <input
            className='form-control'
            name='label_param'
            onChange={onInputChange}
            value={label_param}
            type='text'
          />
          <Button label='AGREGAR' onClick={onSubmitTermino}/>
        </form>
    </Dialog>
  )
}
