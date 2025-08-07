import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import Select from 'react-select'
import { useParientesStore } from './useParientesStore'
const customPariente={

}
export const ModalCustom = ({show, onHide}) => {
    const { obtenerParametroPorEntidadyGrupo: obtenerTipoFamilia, DataGeneral:dataTipoFamilia } = useTerminoStore()
    const { onPostParientes } = useParientesStore()
    const { formState, id_tipo_familia, nombre, telefono, email, observacion, onInputChangeReact, onInputChange } = useForm(customPariente)
    useEffect(() => {
        if(show){
            obtenerTipoFamilia('familia', 'familia')
        }
    }, [show])
    const onClickSubmitParientes = (e)=>{
        e.preventDefaul()
        onPostParientes(formState)
    }
  return (
    <Dialog visible={show} onHide={onHide} header={'AGREGAR PARIENTE'} style={{width: '30rem', height: '40rem'}}>
        <form onSubmit={onClickSubmitParientes}>
            <div className='mb-2'>
                <label>PARENTESCO:</label>
                <Select
                    placeholder={'Selecciona el parentesco'}
                    onChange={(e)=>onInputChangeReact(e.value, 'id_tipo_familia')}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={dataTipoFamilia}
                    name='id_tipo_familia'
                    value={dataTipoFamilia.find((op)=>op.value===id_tipo_familia)}
                    required
                />
            </div>
            <div className='mb-2'>
            <label>NOMBRE:</label>
            <input
                name='nombre'
                value={nombre}
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
                    name='observacion'
                    value={observacion}
                    onChange={onInputChange}
                    className='form-control'
                    
                />
            </div>
            <Button label='AGREGAR' type='submit'/>
            <Button label='CANCELAR' text/>
        </form>
    </Dialog>
  )
}
