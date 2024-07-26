import React, { useEffect, useRef, useState } from 'react'
import { ResumenReporteGeneral } from './ResumenReporteGeneral/ResumenReporteGeneral'
import { PageBreadcrumb } from '@/components'
import { Toast } from 'primereact/toast'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { Calendar } from 'primereact/calendar'
import { TabPanel, TabView } from 'primereact/tabview'
import { Card } from 'react-bootstrap'

export const ReporteGerenciales = () => {
  const toast = useRef(null)
  const [rangoFechas, setrangoFechas] = useState([new Date(new Date().getFullYear(), 0, 1), new Date()])
  const { obtenerReporteDeResumenUTILIDAD, reportegerencial_resumenGeneral } = useReporteStore()
  useEffect(() => {
    if(rangoFechas[0]===null) return;
    if(rangoFechas[1]===null) return;
    obtenerReporteDeResumenUTILIDAD(rangoFechas)
  }, [rangoFechas])
  const showToast = (severity, summary, detail, label) => {
    toast.current.show({ severity, summary, detail, label });
  };
  return (
    <>
    <PageBreadcrumb title="Reporte gerencial" subName="reporte-gerenciales" />
    <div className='flex-auto mb-2'>
      <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      RANGO DE FECHAS
      </label>
      <Calendar value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/>
    </div>
      <ResumenReporteGeneral/>
    </>
  )
}
