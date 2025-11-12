import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useAlertasUsuarios } from './useAlertasUsuarios'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Button } from 'primereact/button'

const customAlertaUsuario ={
  mensaje: '',
  tipo_alerta: 0,
  id_user: 0,     // se usará solo como “placeholder”; realmente enviaremos 1 por iteración
  fecha: '',      // idem; enviaremos la fecha de la iteración
  id_estado: 0
}

export const ModalCustomAlertasUsuarios = ({show=false, onHide, id=0}) => {
  const { dataUsuarios, obtenerUsuarios, onPostAlertaUsuario } = useAlertasUsuarios()
  const { DataGeneral:dataTipoAlerta, obtenerParametroPorEntidadyGrupo:obtenerTiposAlerta } = useTerminoStore()

  const { formState, mensaje, tipo_alerta, id_estado, onInputChange, onInputChangeReact, onResetForm } = useForm(customAlertaUsuario)

  // -------- local state para múltiple fecha y usuarios ----------
  const [fechaInput, setFechaInput] = useState('')
  const [fechas, setFechas] = useState([])                 // array de 'YYYY-MM-DD'
  const [usuariosSel, setUsuariosSel] = useState([])       // array de opciones {value,label}
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if(show){
      obtenerUsuarios()
      obtenerTiposAlerta('alertas-wsp', 'usuarios')
      // limpiar estados locales al abrir
      setFechaInput('')
      setFechas([])
      setUsuariosSel([])
      onResetForm()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  // ---- manejar fechas (agregar / eliminar) ----
  const addFecha = (e) => {
    e?.preventDefault?.()
    if(!fechaInput) return
    if(!fechas.includes(fechaInput)){
      setFechas(prev => [...prev, fechaInput].sort())
    }
    setFechaInput('')
  }
  const removeFecha = (f) => {
    setFechas(prev => prev.filter(x => x !== f))
  }

  // ---- Guardar: for usuarios × fechas → onPostAlertaUsuario ----
  const onClickCustomAlertaUsuario = async (e)=>{
    e.preventDefault()
    if(id !== 0){
      // si en el futuro agregas edición, lo manejas aquí
      return
    }

    // Validaciones mínimas
    if(!mensaje?.trim()) return
    if(!tipo_alerta && tipo_alerta!==0) return
    if(!usuariosSel?.length) return
    if(!fechas?.length) return

    try{
      setSaving(true)
      // Ejecutar por cada combinación usuario × fecha
      for(const u of usuariosSel){
        for(const f of fechas){
          await onPostAlertaUsuario({
            ...formState,
            id_user: u.value,
            fecha: f,
            tipo_alerta,
            id_estado,
            mensaje: mensaje?.trim()
          })
        }
      }
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
            options={[{value: 0, label: 'Inactivo'}, {value: 1, label: 'Activo'} ]}
            placeholder='Selecciona el estado'
            onChange={(e)=>onInputChangeReact(e, 'id_estado')}
            className="react-select"
            classNamePrefix="react-select"
            name='id_estado'
            value={[{value: 0, label: 'Inactivo'}, {value: 1, label: 'Activo'} ].find(op=>op.value===id_estado)}
            required
          />
        </div>

        <div className='m-1'>
          <label>TIPO DE ALERTA</label>
          <Select
            options={dataTipoAlerta}
            placeholder='Selecciona el tipo de alerta'
            onChange={(e)=>onInputChangeReact(e, 'tipo_alerta')}
            className="react-select"
            classNamePrefix="react-select"
            name='tipo_alerta'
            value={dataTipoAlerta.find(op=>op.value===tipo_alerta)}
            required
          />
        </div>

        <div className='m-1'>
          <label>USUARIOS</label>
          <Select
            options={dataUsuarios}
            placeholder='Selecciona uno o más usuarios'
            onChange={(vals)=>setUsuariosSel(vals || [])}
            className="react-select"
            classNamePrefix="react-select"
            name='id_user'
            value={usuariosSel}
            required
            isMulti
          />
        </div>

        <div className='m-1'>
          <label>FECHAS</label>
          <div className='d-flex gap-2'>
            <input
              type='date'
              name='fecha'
              onChange={(e)=>setFechaInput(e.target.value)}
              className='form-control'
              value={fechaInput}
            />
            <Button type="button" icon="pi pi-plus" onClick={addFecha} outlined />
          </div>

          {/* listado de fechas agregadas */}
          {!!fechas.length && (
            <div className='mt-2 d-flex flex-wrap gap-2'>
              {fechas.map(f=>(
                <span key={f} className="badge bg-primary d-inline-flex align-items-center gap-2" style={{fontSize: '0.9rem'}}>
                  {f}
                  <Button type="button" icon="pi pi-times" text rounded onClick={()=>removeFecha(f)} />
                </span>
              ))}
            </div>
          )}
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
