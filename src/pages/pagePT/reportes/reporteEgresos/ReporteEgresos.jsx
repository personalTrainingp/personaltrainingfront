import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { TableEgresosProveedor } from './EgresosProveedor/TableEgresosProveedor'
import { Calendar } from 'primereact/calendar'
import { useForm } from '@/hooks/useForm'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { TableEgresosPorGasto } from './EgresosPorGasto/TableEgresosPorGasto'
import { TableEgresosPorGrupo } from './EgresosPorGrupo/TableEgresosPorGrupo'

export const ReporteEgresos = () => {
  const [rangoFechas, setrangoFechas] = useState([new Date(new Date().getFullYear(), 0, 1), new Date()])
  const { obtenerReporteDeEgresos, egresosPorFecha_PROVEEDOR, egresosPorFecha_GASTO, egresosPorFecha_GRUPO } = useReporteStore()
  useEffect(() => {
    if(rangoFechas[0]===null) return;
    if(rangoFechas[1]===null) return;
    obtenerReporteDeEgresos(rangoFechas)
  }, [rangoFechas])
  return (
    <>
    <PageBreadcrumb title="Reporte de egresos" subName="reporte-egresos" />
    <div className='flex-auto mb-2'>
      <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      RANGO DE FECHAS
      </label>
      <Calendar value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/>
    </div>
    <Card>
      <Card.Header>
        <Card.Title>EGRESOS POR PROVEEDOR</Card.Title>
      </Card.Header>
      <Card.Body>
        <TabView>
          <TabPanel leftIcon="pi pi-table mr-2">
            <TableEgresosProveedor data={egresosPorFecha_PROVEEDOR}/>
          </TabPanel>
          <TabPanel leftIcon="pi pi-chart-bar mr-2">

          </TabPanel>
        </TabView>
      </Card.Body>
    </Card>
    <Card>
      <Card.Header>
        <Card.Title>EGRESOS POR GASTO</Card.Title>
      </Card.Header>
      <Card.Body>
        <TabView>
          <TabPanel leftIcon="pi pi-table mr-2">
            <TableEgresosPorGasto data={egresosPorFecha_GASTO}/>
          </TabPanel>
          <TabPanel leftIcon="pi pi-chart-bar mr-2">
          </TabPanel>
        </TabView>
      </Card.Body>
    </Card>
    <Card>
      <Card.Header>
        <Card.Title>EGRESOS POR GRUPO</Card.Title>
      </Card.Header>
      <Card.Body>
        <TabView>
          <TabPanel leftIcon="pi pi-table mr-2">
            <TableEgresosPorGrupo data={egresosPorFecha_GRUPO}/>
          </TabPanel>
          <TabPanel leftIcon="pi pi-chart-bar mr-2">
          </TabPanel>
        </TabView>
      </Card.Body>
    </Card>
    </>
  )
}
