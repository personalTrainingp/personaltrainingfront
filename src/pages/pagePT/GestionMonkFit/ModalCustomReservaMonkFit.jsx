import { useForm } from '@/hooks/useForm'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { useGestionMonkFitStore } from './useGestionMonkFitStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import Select from 'react-select'
const customReservaMonkFit = {
    fecha: null,
    cantidad: 0,
    monto: 0,
    id_red: 0
}
export const ModalCustomReservaMonkFit = ({show, onHide, id, id_empresa=598, formUpdating}) => {
    const { postLead, updateLead } = useGestionMonkFitStore()
    const {formState, fecha, cantidad, monto, id_red, onInputChange, onResetForm} = useForm(id===0?customReservaMonkFit:formUpdating)
    const { DataGeneral:dataRedesInvertidas, obtenerParametroPorEntidadyGrupo:obtenerRedesInvertidas } = useTerminoStore()
    useEffect(() => {
        if(show){
            obtenerRedesInvertidas('inversion', 'redes')
        }
    }, [show])
    
    const onCancelCustomReservaMonkFit = (e)=>{
        // e.preventDefault()
        onHide()
        onResetForm()
    }
    const onClickCustomReservaMonkFit = (e)=>{
        e.preventDefault()
        if(id!==0){
            updateLead(id, formState, id_empresa)
        }else{
            postLead(id_empresa, formState)
        }
        onCancelCustomReservaMonkFit()
    }
    console.log({fecha});
    
  return (
    <Dialog visible={show} onHide={onHide} header={`${id!==0?'EDITAR LEAD': 'AGREGAR LEAD'}`}>
        <form>
            <div className='mb-2'>
                <Select
                    options={dataRedesInvertidas}
                />
            </div>
            <div className='mb-2'>
                <label>CANTIDAD</label>
                <input
                    className='form-control'
                    name='cantidad'
                    value={cantidad}
                    type='text'
                    onChange={onInputChange}
                />
            </div>
            <div className='mb-2'>
                <label>FECHA</label>
                <input
                    className='form-control'
                    name='fecha'
                    value={fecha}
                    type='date'
                    onChange={onInputChange}
                />
            </div>
            <div className='mb-2'>
                <label>MONTO</label>
                <input
                    className='form-control'
                    name='monto'
                    value={monto}
                    type='text'
                    onChange={onInputChange}
                />
            </div>
            <div className='mb-2'>
                <Button label='AGREGAR' type='submit' onClick={(e)=>onClickCustomReservaMonkFit(e)} />
                <Button label='CANCELAR' text onClick={(e)=>onCancelCustomReservaMonkFit(e)}/>
            </div>
        </form>
    </Dialog>
  )
}
