import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { usePlanillaStore } from './usePlanillaStore';
dayjs.extend(utc);

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
const PERIODOS_A_MOSTRAR = 6
const semanaVacia = ()=>Object.fromEntries(dias.map(d=>[d.key, {trabaja: false, entrada: '', salida: ''}]))
const semanaDesdeJornada = (jornada)=>Object.fromEntries(dias.map(d=>{
  const entrada = jornada[`${d.key}_ENTRADA`]
  const salida = jornada[`${d.key}_SALIDA`]
  const trabaja = !!entrada && entrada!==HORA_DESCANSO
  return [d.key, {trabaja, entrada: trabaja?entrada:'', salida: trabaja?salida:''}]
}))

// Semanas desde la fecha en que empezó el trabajo, como las cuenta el reporte de asistencia:
// la semana 1 va de fecha_desde al domingo siguiente; luego de lunes a domingo.
// Con intersemana se alternan: semana 1, semana 2, semana 1...
const periodosDesde = (fechaDesde, totalSemanas)=>{
  const periodos = []
  let inicio = dayjs.utc(fechaDesde)
  for (let i = 0; i < PERIODOS_A_MOSTRAR; i++) {
    const fin = inicio.day()===0 ? inicio : inicio.add(7 - inicio.day(), 'day')
    periodos.push({semana: (i % totalSemanas) + 1, inicio, fin})
    inicio = fin.add(1, 'day')
  }
  return periodos
}

const TablaSemana = ({semana, onChangeDia})=>(
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
            const {trabaja, entrada, salida} = semana[d.key]
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
)

// Horario del contrato: una semana que se repite, o dos que se alternan (intersemana)
export const ModalJornadaPlanilla = ({show, onHide, id_planilla}) => {
    const { obtenerJornadaxPlanilla, actualizarJornadaxPlanilla } = usePlanillaStore()
    const [semanas, setsemanas] = useState([semanaVacia(), semanaVacia()])
    const [intersemana, setintersemana] = useState(false)
    const [fechaDesde, setfechaDesde] = useState(null)
    const [msgError, setmsgError] = useState('')
    const [isSaving, setisSaving] = useState(false)

    useEffect(() => {
      if(!show || !id_planilla) return;
      setsemanas([semanaVacia(), semanaVacia()])
      setintersemana(false)
      setfechaDesde(null)
      obtenerJornadaxPlanilla(id_planilla).then(data=>{
        if(!data) return;
        setfechaDesde(data.fecha_desde)
        const guardadas = data.semanas || []
        setsemanas([
          guardadas[0] ? semanaDesdeJornada(guardadas[0]) : semanaVacia(),
          guardadas[1] ? semanaDesdeJornada(guardadas[1]) : semanaVacia(),
        ])
        setintersemana(guardadas.length > 1)
      })
    }, [show, id_planilla])

    const onChangeDia = (indice)=>(key, campo, valor)=>{
      setsemanas(prev=>prev.map((s, i)=>i===indice ? {...s, [key]: {...s[key], [campo]: valor}} : s))
    }
    const onClickModalClose = ()=>{
      onHide()
      setmsgError('')
    }
    const onClickGuardar = async()=>{
      const semanasAGuardar = intersemana ? semanas : [semanas[0]]
      const body = []
      for (const [i, semana] of semanasAGuardar.entries()) {
        const horario = {}
        const nombreSemana = intersemana ? ` (semana ${i + 1})` : ''
        for (const d of dias) {
          const {trabaja, entrada, salida} = semana[d.key]
          if(trabaja && (!entrada || !salida)){
            return setmsgError(`Ingresa la hora de entrada y salida del ${d.label}${nombreSemana}`)
          }
          if(trabaja && entrada>=salida){
            return setmsgError(`La hora de entrada del ${d.label}${nombreSemana} debe ser menor a la de salida`)
          }
          horario[`${d.key}_ENTRADA`] = trabaja?entrada:HORA_DESCANSO
          horario[`${d.key}_SALIDA`] = trabaja?salida:HORA_DESCANSO
        }
        body.push(horario)
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
          style={{width: intersemana?'75rem':'40rem'}}
          header={`EDITAR JORNADA - PLANILLA ${id_planilla}`}
          >
            <div className='form-check mb-2'>
              <input type='checkbox' className='form-check-input' id='intersemana' checked={intersemana} onChange={(e)=>setintersemana(e.target.checked)}/>
              <label className='form-check-label fw-bold' htmlFor='intersemana'>INTERSEMANA (alterna 2 semanas)</label>
            </div>
            {
              intersemana ? (
                <>
                  <p className='mb-1'>
                    Las semanas se cuentan desde la fecha en que inició el trabajo
                    {fechaDesde && <b> ({dayjs.utc(fechaDesde).format('DD/MM/YYYY')})</b>}
                    {' '}y se alternan: semana 1, semana 2, semana 1...
                  </p>
                  {fechaDesde && (
                    <ul className='mb-3'>
                      {periodosDesde(fechaDesde, 2).map((p)=>(
                        <li key={p.inicio.format('YYYY-MM-DD')}>
                          <b>SEMANA {p.semana}:</b> {p.inicio.format('DD/MM/YYYY')} - {p.fin.format('DD/MM/YYYY')}
                        </li>
                      ))}
                      <li>...</li>
                    </ul>
                  )}
                  <Row>
                    <Col xl={6}>
                      <h5>SEMANA 1</h5>
                      <TablaSemana semana={semanas[0]} onChangeDia={onChangeDia(0)}/>
                    </Col>
                    <Col xl={6}>
                      <h5>SEMANA 2</h5>
                      <TablaSemana semana={semanas[1]} onChangeDia={onChangeDia(1)}/>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <p className='mb-2'>
                    Horario de cada día. Se repite todas las semanas desde la fecha en que inició el trabajo
                    {fechaDesde && <b> ({dayjs.utc(fechaDesde).format('DD/MM/YYYY')})</b>}.
                  </p>
                  <TablaSemana semana={semanas[0]} onChangeDia={onChangeDia(0)}/>
                </>
              )
            }
            {msgError && <p className='text-danger fw-bold'>{msgError}</p>}
            <Button type='button' label='Guardar jornada' className='p-button-primary' loading={isSaving} onClick={onClickGuardar} />
            <Button type='button' label='Cancelar' className='p-button-text' onClick={onClickModalClose} />
      </Dialog>
    )
}
