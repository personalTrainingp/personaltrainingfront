import { useForm } from '@/hooks/useForm'
import dayjs from 'dayjs'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { EgresosxGrupo } from './EgresosxGrupo'

// Obtener la fecha de hoy
let today = new Date();

// Crear una nueva fecha sumando 30 días
let futureDate = new Date();
futureDate.setDate(today.getDate() - 30);

// Convertir la fecha a un formato legible (opcional)
let formattedDate = futureDate.toISOString().slice(0, 10);

const registerFecha = {
  rango_fec: [futureDate, today],
}
export const ReporteEgresos = () => {
  const { formState, rango_fec, onInputChange, onInputChangeReact } = useForm(registerFecha)
  const filtrarButton=()=>{

  }

  return (
    <> 
            <div className='d-flex'>
                <div className="flex-auto">
                    <label htmlFor="buttondisplay" className="font-bold block mb-2">
                        Desde
                    </label>
                    {/* <Calendar id="buttondisplay" value={fec_inicio} name='fec_inicio' onChange={(e)=>onInputChangeReact(e, 'fec_inicio')} showIcon /> */}
                    <Calendar value={rango_fec} onChange={(e)=>onInputChangeReact(e, 'rango_fec')} selectionMode="range" readOnlyInput hideOnRangeSelection />
                    <Button className='mx-4' onClick={filtrarButton}>Ver</Button>
                </div>
            </div>
            <div className='mt-3'>
              <EgresosxGrupo/>
            </div>
    </>
  )
}
