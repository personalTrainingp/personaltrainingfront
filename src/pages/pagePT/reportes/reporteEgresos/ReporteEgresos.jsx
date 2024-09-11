import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React, { useEffect, useRef, useState } from 'react'
import { Card, Row } from 'react-bootstrap'
import { TableEgresosProveedor } from './EgresosProveedor/TableEgresosProveedor'
import { Calendar } from 'primereact/calendar'
import { useForm } from '@/hooks/useForm'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { TableEgresosPorGasto } from './EgresosPorGasto/TableEgresosPorGasto'
import { TableEgresosPorGrupo } from './EgresosPorGrupo/TableEgresosPorGrupo'
import { Toast } from 'primereact/toast'
import { ExportToExcel } from './BtnExportExcel'
import { FormatoDateMask } from '@/components/CurrencyMask'
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'
import { BtnExportExcelFlujoCaja } from '../../GestGastos/BtnExportExcelFlujoCaja'

export const ReporteEgresos = () => {
  const toast = useRef(null)
  const [rangoFechas, setrangoFechas] = useState([new Date(new Date().getFullYear(), 0, 1), new Date()])
  const { obtenerReporteDeEgresos, reporte_FlujoCaja, egresosPorFecha_PROVEEDOR, egresosPorFecha_GASTO, egresosPorFecha_GRUPO } = useReporteStore()
  useEffect(() => {
    if(rangoFechas[0]===null) return;
    if(rangoFechas[1]===null) return;
    obtenerReporteDeEgresos(rangoFechas)
  }, [rangoFechas])
  const showToast = (severity, summary, detail, label) => {
    toast.current.show({ severity, summary, detail, label });
  };
  console.log(egresosPorFecha_PROVEEDOR, "proveedor");
  console.log(egresosPorFecha_GASTO, "concepto");
  
  return (
    <>
    <PageBreadcrumb title="Reporte de egresos" subName="reporte-egresos" />
    
    <Toast ref={toast}/>
    <div className='flex-auto mb-2'>
      <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      RANGO DE FECHAS
      </label>
      <Calendar value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} locale='es' showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/>
      <FormatRangoFecha rangoFechas={rangoFechas}/>
      {/* <BtnExportExcelFlujoCaja data={reporte_FlujoCaja}/> */}
    </div>
    <Card>
      <Card.Header className='d-flex align-items-center justify-content-between'>
        <Card.Title>
          <div>
            GASTOS POR PROVEEDOR
          </div>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <TabView>
          <TabPanel leftIcon="pi pi-table mr-2">
            <TableEgresosProveedor showToast={showToast} data={egresosPorFecha_PROVEEDOR}/>
          </TabPanel>
          <TabPanel leftIcon="pi pi-chart-bar mr-2">

          </TabPanel>
        </TabView>
      </Card.Body>
    </Card>

    <Card>
      <Card.Header>
        <Card.Title>GASTOS POR CONCEPTOS</Card.Title>
      </Card.Header>
      <Card.Body>
        <TabView>
          <TabPanel leftIcon="pi pi-table mr-2">
            <TableEgresosPorGasto data={egresosPorFecha_GASTO} showToast={showToast}/>
          </TabPanel>
          <TabPanel leftIcon="pi pi-chart-bar mr-2">
          </TabPanel>
        </TabView>
      </Card.Body>
    </Card>
    <Card>
      <Card.Header>
        <Card.Title>GASTOS POR GRUPO</Card.Title>
      </Card.Header>
      <Card.Body>
        <TabView>
          <TabPanel leftIcon="pi pi-table mr-2">
            <TableEgresosPorGrupo data={egresosPorFecha_GRUPO} showToast={showToast}/>
          </TabPanel>
          <TabPanel leftIcon="pi pi-chart-bar mr-2">
          </TabPanel>
        </TabView>
      </Card.Body>
    </Card>
    </>
  )
}
