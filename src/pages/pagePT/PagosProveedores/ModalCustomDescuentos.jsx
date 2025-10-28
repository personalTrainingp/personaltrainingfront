import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import Select from 'react-select'
import { usePagoProveedoresStore } from './usePagoProveedoresStore'

const customDescuentos = {
  id_tipo_penalidad: 0,
  monto: 0,
  observacion: null,
  fecha: null
}

export const ModalCustomDescuentos = ({show, onHide, data, trabajo, idContrato}) => {
  const { formState, id_tipo_penalidad, monto, observacion, fecha, onInputChange, onInputChangeReact, onResetForm } = useForm(customDescuentos)
  const { obtenerParametroPorEntidadyGrupo:obtenerDataTipoPenalidades, DataGeneral:dataTipoPenalidades } = useTerminoStore()
  const {postPenalidades} = usePagoProveedoresStore()
  useEffect(() => {
    if(show){
      obtenerDataTipoPenalidades('penalidad','tipo')
    }
  }, [show])
  
  const onCancelCustomDesc = ()=>{
    e.preventDefault()
    onHide()
    onResetForm()
  }
  const onClickCustomDesc = (e)=>{
    e.preventDefault()
    postPenalidades(formState, idContrato)
    onCancelCustomDesc()
  }
  return (
    <Dialog visible={show} onHide={onHide} header={<>AGREGAR PENALIDAD EN CONTRATO <br/><span className='text-primary'>{idContrato} - {trabajo}</span></>}>
        <form>
          <div className='mb-2'>
            <label className='form-label'>TIPO DE PENALIDAD</label>
            <Select
              name='id_tipo_penalidad'
              value={id_tipo_penalidad}
              placeholder={'SELECCIONAR LAS PENALIDADES'}
              onChange={(e)=>onInputChangeReact(e.value, 'id_tipo_penalidad')}
              options={dataTipoPenalidades}
            />
          </div>
          <div className='mb-2'>
            <label className='form-label'>FECHA</label>
            <input
              className='form-control'
              onChange={onInputChange}
              value={fecha}
              name='fecha'
              type='date'
            />
          </div>
          <div className='mb-2'>
            <label className='form-label'>MONTO A DESCONTAR</label>
            <input
              className='form-control'
              onChange={onInputChange}
              value={monto}
              name='monto'
            />
          </div>
          <div className='mb-2'>
            <label className='form-label'>OBSERVACION</label>
            <textarea
              className='form-control'
              onChange={onInputChange}
              value={observacion}
              name='observacion'
            />
          </div>
          <div>
            <Button label='AGREGAR' type='submit' onClick={onClickCustomDesc}/>
            <Button label='CANCELAR' text onClick={onCancelCustomDesc}/>
          </div>
        </form>
    </Dialog>
  )
}
