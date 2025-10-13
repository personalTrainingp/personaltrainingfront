import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import Select from 'react-select'
import { useParientesStore } from './useParientesStore'
const customPariente={
     id_tipo_pariente:0, nombres:'', telefono:'', email:'', comentario:''
}
export const ModalCustom = ({show, onHide, uid_contactsEmergencia, id, data}) => {
    const { obtenerParametroPorEntidadyGrupo: obtenerTipoFamilia, DataGeneral:dataTipoFamilia } = useTerminoStore()
    const { onPostParientes, onUpdatePariente, onGetParientexId, dataPariente } = useParientesStore()
    const { formState, id_tipo_pariente, nombres, telefono, email, comentario, onInputChangeReact, onInputChange, onResetForm } = useForm(id?dataPariente:customPariente)
    useEffect(() => {
        if(show){
            obtenerTipoFamilia('familia', 'familia')    
            onGetParientexId(id)
        }
    }, [show])
    const onClickSubmitParientes = (e)=>{
        e.preventDefault()
        if(id==0){
            onPostParientes(formState, uid_contactsEmergencia, 'EMPLEADO')
            onCancelContactoEmergencia()
            return;
        }else{
            onUpdatePariente(formState, id, uid_contactsEmergencia, 'EMPLEADO')
            onCancelContactoEmergencia()
            return;
        }
    }
    const onCancelContactoEmergencia= ()=>{
        onHide()
        onResetForm()
    }
  return (
    <Dialog visible={show} onHide={onHide} header={id==0?'AGREGAR PARIENTE':'EDITAR PARIENTE'} style={{width: '30rem', height: '40rem'}}>
        {/* {JSON.stringify(dataPariente, null, 2)} */}
        <form>
            <div className='mb-2'>
                <label>PARENTESCO:</label>
                <Select
                    placeholder={'Selecciona el parentesco'}
                    onChange={(e)=>onInputChangeReact(e, 'id_tipo_pariente')}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={dataTipoFamilia}
                    name='id_tipo_pariente'
                    value={dataTipoFamilia.find((op)=>op.value===id_tipo_pariente)}
                    required
                />
            </div>
            <div className='mb-2'>
            <label>NOMBRE:</label>
            <input
                name='nombres'
                value={nombres}
                onChange={onInputChange}
                className='form-control'
                type='text'
            />
            </div>
            <div className='mb-2'>
                <label>TELEFONO:</label>
                <input
                    name='telefono'
                    value={telefono}
                    onChange={onInputChange}
                    className='form-control'
                    type='text'
                />
            </div>
            <div className='mb-2'>
                <label>EMAIL:</label>
                <input
                    name='email'
                    value={email}
                    onChange={onInputChange}
                    className='form-control'
                    type='text'
                />
            </div>
            <div className='mb-2'>
                <label>COMENTARIO:</label>
                <textarea
                    name='comentario'
                    value={comentario}
                    onChange={onInputChange}
                    className='form-control'
                    
                />
            </div>
            <Button label='AGREGAR' onClick={onClickSubmitParientes}/>
            <Button label='CANCELAR' text onClick={onCancelContactoEmergencia}/>
        </form>
    </Dialog>
  )
}
