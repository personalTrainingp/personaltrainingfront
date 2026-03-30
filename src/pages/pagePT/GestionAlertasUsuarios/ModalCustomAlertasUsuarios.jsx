import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useAlertasUsuarios } from './useAlertasUsuarios'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Button } from 'primereact/button'
import { InputDate, InputSelect } from '@/components/InputText'

const customAlertaUsuario ={
  mensaje: '',
  id_tipo_alerta: 0,
  id_grupo_usuarios: 0,     // se usará solo como “placeholder”; realmente enviaremos 1 por iteración
  fecha: '',      // idem; enviaremos la fecha de la iteración
  id_estado: 0
}

export const ModalCustomAlertasUsuarios = ({show=false, onHide, id=0}) => {
  const { dataUsuarios, obtenerUsuarios, onPostAlertaUsuario } = useAlertasUsuarios()
  
  const { DataGeneral:dataTipoAlerta, obtenerParametroPorEntidadyGrupo:obtenerTiposAlerta } = useTerminoStore()
  const { DataGeneral:dataGrupoUsuariosAlerta, obtenerParametroPorEntidadyGrupo:obtenerDataGrupoUsuariosAlerta } = useTerminoStore()
  
  const { formState, id_grupo_usuarios, id_tipo_alerta, mensaje, id_estado, fecha, onInputChange, onInputChangeReact, onResetForm } = useForm(customAlertaUsuario)

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if(show){
      obtenerUsuarios()
      obtenerDataGrupoUsuariosAlerta('grupo-usuarios', 'alerta')
      obtenerTiposAlerta('alertas-wsp', 'usuarios')
      onResetForm()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])


  // ---- Guardar: for usuarios × fechas → onPostAlertaUsuario ----
  const onClickCustomAlertaUsuario = async (e)=>{
    e.preventDefault()
    if(id !== 0){
      // si en el futuro agregas edición, lo manejas aquí
      return
    }
    onPostAlertaUsuario({...formState, fecha: new Date(fecha)})
    // Validaciones mínimas
    if(!mensaje?.trim()) return

    try{
      setSaving(true)
      onCancelCustomAlertaUsuario()
    } finally{
      setSaving(false)
    }
  }

  const onCancelCustomAlertaUsuario = ()=>{
    onHide()
  }

  return (
    <Dialog visible={show} onHide={onHide} header="Alertas a Usuarios" style={{width: '42rem'}}>
      <form onSubmit={onClickCustomAlertaUsuario}>
        <div className='m-1'>
          <label>ESTADO</label>
          <Select
            options={[{value: 1, label: 'Activo'}, {value: 0, label: 'Inactivo'} ]}
            placeholder='Selecciona el estado'
            onChange={(e)=>onInputChangeReact(e, 'id_estado')}
            className="react-select"
            classNamePrefix="react-select"
            name='id_estado'
            value={[{value: 1, label: 'Activo'}, {value: 0, label: 'Inactivo'}].find(op=>op.value===id_estado)}
            required
          />
        </div> 
        
        <div className='m-1'>
          <InputSelect label={'TIPO DE ALERTA'} nameInput={'id_tipo_alerta'} onChange={onInputChange} options={dataTipoAlerta} value={id_tipo_alerta}/>
        </div>

        <div className='m-1'>
          <InputSelect label={'GRUPO'} nameInput={'id_grupo_usuarios'} onChange={onInputChange} options={dataGrupoUsuariosAlerta} value={id_grupo_usuarios}/>
        </div>
        <div className='m-1'>
          <InputDate label={'FECHA'} nameInput={'fecha'} onChange={onInputChange} value={fecha} type='datetime-local'/>
        </div>
        <div className='m-1'>
          <label>MENSAJE</label>
          <textarea
            name='mensaje'
            value={mensaje}
            onChange={onInputChange}
            className='form-control'
            rows={3}
            placeholder='Escribe el mensaje a enviar'
          />
        </div>

        <div className='mt-3 d-flex gap-2 justify-content-end'>
          <Button label={saving ? 'GUARDANDO...' : 'AGREGAR'} onClick={onClickCustomAlertaUsuario} disabled={saving}/>
          <Button label='CANCELAR' text onClick={onCancelCustomAlertaUsuario}/>
        </div>
      </form>
    </Dialog>
  )
}
