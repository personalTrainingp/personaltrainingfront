import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import Select from 'react-select'
import { useAlertasUsuarios } from './useAlertasUsuarios'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Button } from 'primereact/button'
const customAlertaUsuario ={
    mensaje: '',
    tipo_alerta: 0,
    id_user: 0,
    fecha: '',
    estado: 0
}
export const ModalCustomAlertasUsuarios = ({show=false, onHide, id=0}) => {
    const { dataUsuarios, obtenerUsuarios, onPostAlertaUsuario } = useAlertasUsuarios()
    const { DataGeneral:dataTipoAlerta, obtenerParametroPorEntidadyGrupo:obtenerTiposAlerta } = useTerminoStore()
    const {formState, mensaje, tipo_alerta, id_user, fecha, estado, onInputChange, onInputChangeReact, onResetForm} = useForm(customAlertaUsuario)
    useEffect(() => {
        if(show){
            obtenerUsuarios()
            obtenerTiposAlerta('alertas-wsp', 'usuarios')
        }
    }, [show])
    const onClickCustomAlertaUsuario = (e)=>{
        e.preventDefault()
        if(id==0){
            onPostAlertaUsuario(formState)
            onCancelCustomAlertaUsuario()
            return;
        }
    }
    const onCancelCustomAlertaUsuario = ()=>{
        onHide()
    }
  return (
    <Dialog visible={show} onHide={onHide} >
        <form>
            <div className='m-1'>
                <label>ESTADO</label>
                <Select
                    options={[{value: 0, label: 'Inactivo'}, {value: 1, label: 'Activo'} ]}
                    placeholder={'Selecciona el estado'}
                    onChange={(e)=>onInputChangeReact(e, 'estado')}
                    className="react-select"
                    classNamePrefix="react-select"
                    name='estado'
                    value={[{value: 0, label: 'Inactivo'}, {value: 1, label: 'Activo'} ].find((op)=>op.value===estado)}
                    required
                />
            </div>
            <div className='m-1'>
                <label>TIPO DE ALERTA</label>
                <Select
                    options={dataTipoAlerta}
                    placeholder={'Selecciona el tipo de alerta'}
                    onChange={(e)=>onInputChangeReact(e, 'tipo_alerta')}
                    className="react-select"
                    classNamePrefix="react-select"
                    name='tipo_alerta'
                    value={dataTipoAlerta.find((op)=>op.value===tipo_alerta)}
                    required
                />
            </div>
            <div className='m-1'>
                <label>usuarios</label>
                <Select
                    options={dataUsuarios}
                    placeholder={'Selecciona el usuario'}
                    onChange={(e)=>onInputChangeReact(e, 'id_user')}
                    className="react-select"
                    classNamePrefix="react-select"
                    name='id_user'
                    value={dataUsuarios.find((op)=>op.value===id_user)}
                    required
                />
            </div>
            <div className='m-1'>
                <label>FECHA</label>
                <input
                    type='date'
                    name='fecha'
                    onChange={onInputChange}
                    className='form-control'
                    value={fecha}
                />
            </div>
            <div className='m-1'>
                <label>MENSAJE</label>
                <textarea
                    name='mensaje'
                    value={mensaje}
                    onChange={onInputChange}
                    className='form-control'
                />
            </div>
            <Button label='AGREGAR'  onClick={onClickCustomAlertaUsuario}/>
                <Button label='CANCELAR' text onClick={onCancelCustomAlertaUsuario}/>
        </form>
    </Dialog>
  )
}
