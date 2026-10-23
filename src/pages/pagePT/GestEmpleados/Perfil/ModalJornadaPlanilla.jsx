import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { usePlanillaStore } from './usePlanillaStore';

// Columnas de tb_jornada_semanas: <DIA>_ENTRADA / <DIA>_SALIDA ("HH:mm"; "00:00" = no trabaja)
const dias = [
  {key: 'LUNES', label: 'LUNES'},
  {key: 'MARTES', label: 'MARTES'},
  {key: 'MIERCOLES', label: 'MIÉRCOLES'},
  {key: 'JUEVES', label: 'JUEVES'},
  {key: 'VIERNES', label: 'VIERNES'},
  {key: 'SABADO', label: 'SÁBADO'},
  {key: 'DOMINGO', label: 'DOMINGO'},
]
const HORA_DESCANSO = '00:00'
const horarioVacio = Object.fromEntries(dias.map(d=>[d.key, {trabaja: false, entrada: '', salida: ''}]))

// Horario semanal del contrato: se repite todas las semanas del periodo
export const ModalJornadaPlanilla = ({show, onHide, id_planilla}) => {
    const { obtenerJornadaxPlanilla, actualizarJornadaxPlanilla } = usePlanillaStore()
    const [horario, sethorario] = useState(horarioVacio)
    const [msgError, setmsgError] = useState('')
    const [isSaving, setisSaving] = useState(false)

    useEffect(() => {
      if(!show || !id_planilla) return;
      sethorario(horarioVacio)
      obtenerJornadaxPlanilla(id_planilla).then(jornada=>{
        if(!jornada) return;
        sethorario(Object.fromEntries(dias.map(d=>{
          const entrada = jornada[`${d.key}_ENTRADA`]
          const salida = jornada[`${d.key}_SALIDA`]
          const trabaja = !!entrada && entrada!==HORA_DESCANSO
          return [d.key, {trabaja, entrada: trabaja?entrada:'', salida: trabaja?salida:''}]
        })))
      })
    }, [show, id_planilla])

    const onChangeDia = (key, campo, valor)=>{
      sethorario(prev=>({...prev, [key]: {...prev[key], [campo]: valor}}))
    }
    const onClickModalClose = ()=>{
      onHide()
      setmsgError('')
    }
    const onClickGuardar = async()=>{
      const body = {}
      for (const d of dias) {
        const {trabaja, entrada, salida} = horario[d.key]
        if(trabaja && (!entrada || !salida)){
          return setmsgError(`Ingresa la hora de entrada y salida del ${d.label}`)
        }
        if(trabaja && entrada>=salida){
          return setmsgError(`La hora de entrada del ${d.label} debe ser menor a la de salida`)
        }
        body[`${d.key}_ENTRADA`] = trabaja?entrada:HORA_DESCANSO
        body[`${d.key}_SALIDA`] = trabaja?salida:HORA_DESCANSO
      }
      setisSaving(true)
      const ok = await actualizarJornadaxPlanilla(id_planilla, body)
      setisSaving(false)
      if(ok){
        onClickModalClose()
      }
    }

    return (
      <Dialog
          visible={show}
          onHide={onClickModalClose}
          position='top'
          style={{width: '40rem'}}
          header={`EDITAR JORNADA - PLANILLA ${id_planilla}`}
          >
            <p className='mb-2'>Horario de cada día. Se repite todas las semanas del contrato.</p>
            <Table className="table-centered mb-3" responsive>
                <thead className="bg-primary">
                    <tr>
                        <th className='text-white p-1'>DIA</th>
                        <th className='text-white p-1'>TRABAJA</th>
                        <th className='text-white p-1'>ENTRADA</th>
                        <th className='text-white p-1'>SALIDA</th>
                    </tr>
                </thead>
                <tbody>
                    {dias.map(d=>{
                      const {trabaja, entrada, salida} = horario[d.key]
                      return (
                        <tr key={d.key}>
                          <th>{d.label}</th>
                          <td>
                            <input type='checkbox' className='form-check-input' checked={trabaja} onChange={(e)=>onChangeDia(d.key, 'trabaja', e.target.checked)}/>
                          </td>
                          <td>
                            <input type='time' className='form-control' value={entrada} disabled={!trabaja} onChange={(e)=>onChangeDia(d.key, 'entrada', e.target.value)}/>
                          </td>
                          <td>
                            <input type='time' className='form-control' value={salida} disabled={!trabaja} onChange={(e)=>onChangeDia(d.key, 'salida', e.target.value)}/>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
            </Table>
            {msgError && <p className='text-danger fw-bold'>{msgError}</p>}
            <Button type='button' label='Guardar jornada' className='p-button-primary' loading={isSaving} onClick={onClickGuardar} />
            <Button type='button' label='Cancelar' className='p-button-text' onClick={onClickModalClose} />
      </Dialog>
    )
}
