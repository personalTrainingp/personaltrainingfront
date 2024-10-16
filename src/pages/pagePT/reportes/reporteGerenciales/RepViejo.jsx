/*
import React, { useEffect, useRef, useState } from 'react'
import { ResumenReporteGeneral } from './ResumenReporteGeneral/ResumenReporteGeneral'
import { PageBreadcrumb } from '@/components'
import { Toast } from 'primereact/toast'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { Calendar } from 'primereact/calendar'
import { TabPanel, TabView } from 'primereact/tabview'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { ResumenUtilidadesProgramas } from './ResumenReporteGeneral copy/ResumenUtilidadesProgramas'
import { CardEstimado } from '@/components/CardTab/CardEstimado'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'
import { BtnExportExcelFlujoCaja } from '../../GestGastos/BtnExportExcelFlujoCaja'
import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore'

export const ReporteGerenciales = () => {
  const toast = useRef(null)
  const [rangoFechas, setrangoFechas] = useState([new Date(new Date().getFullYear(), 0, 1), new Date()])
  const { obtenerReporteDeResumenUTILIDAD, reportegerencial_resumenGeneral, utilidadesProgramas } = useReporteStore()
  const { dataVentaxFecha, obtenerVentasPorFecha, IngresosSeparados_x_Fecha } = useVentasStore()
  const { obtenerAportesPorFechas, dataAportes } = useAportesIngresosStore()
  const { obtenerGastosPorFecha, dataGasto } = useGf_GvStore()
  const { obtenerTipoCambioPorFecha, tipocambio, obtenerTipoDeCambiosPorRangoDeFechas, dataTipoCambio } = useTipoCambioStore()
  useEffect(() => {
    if(rangoFechas[0]===null) return;
    if(rangoFechas[1]===null) return;
    obtenerReporteDeResumenUTILIDAD(rangoFechas)
    obtenerVentasPorFecha(rangoFechas)
    obtenerAportesPorFechas(rangoFechas)
    obtenerGastosPorFecha(rangoFechas)
    obtenerTipoDeCambiosPorRangoDeFechas(rangoFechas)
    // obtenerTipoCambioPorFecha(rangoFechas)
  }, [rangoFechas])
  const showToast = (severity, summary, detail, label) => {
    toast.current.show({ severity, summary, detail, label });
  };
  
  return (
    <>
    <PageBreadcrumb title="Reporte gerencial" subName="reporte-gerenciales" />
    <TabView>
      <TabPanel header='CHANGE'>

      <div className='flex-auto mb-2'>
      <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      RANGO DE FECHAS
      </label>
      <Calendar value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/>
      <FormatRangoFecha rangoFechas={rangoFechas}/>
      <BtnExportExcelFlujoCaja id_empresa={598} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
    </div>
      <ResumenReporteGeneral data={reportegerencial_resumenGeneral} IngresosSeparados_x_Fecha={IngresosSeparados_x_Fecha}/>
      <ResumenUtilidadesProgramas data={utilidadesProgramas}/>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4>RESUMEN ACCESORIOS</h4>
              <CardEstimado backgroundColor={'bg-success'} title={'INGRESOS'} montoSoles={'S/2,125,943.00'}/>
              <CardEstimado backgroundColor={'bg-danger'} title={'EGRESO'} montoSoles={'S/2,125,943.00'}/>
              <CardEstimado backgroundColor={'bg-info'} title={'UTILIDADES'} montoSoles={'S/2,125,943.00'}/>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
              <CardBody>
                <h4>RESUMEN SUPLEMENTOS</h4>
                <CardEstimado backgroundColor={'bg-success'} title={'INGRESOS'} montoSoles={'S/2,125,943.00'}/>
                <CardEstimado backgroundColor={'bg-danger'} title={'EGRESO'} montoSoles={'S/2,125,943.00'}/>
                <CardEstimado backgroundColor={'bg-info'} title={'UTILIDADES'} montoSoles={'S/2,125,943.00'}/>
              </CardBody>
            </Card>
        </Col>
        <Col>
        <Card>
            <CardBody>
              <h4>RESUMEN TRATAMIENTOS ESTETICOS</h4>
              <CardEstimado backgroundColor={'bg-success'} title={'INGRESOS'} montoSoles={'S/2,125,943.00'}/>
              <CardEstimado backgroundColor={'bg-danger'} title={'EGRESO'} montoSoles={'S/2,125,943.00'}/>
              <CardEstimado backgroundColor={'bg-info'} title={'UTILIDADES'} montoSoles={'S/2,125,943.00'}/>
              {/* <CardEstimado backgroundColor={'bg-primary'} title={'INGRESOS DIRECTOS'} montoSoles={'S/2,125,943.00'}/>
              <CardEstimado backgroundColor={'bg-success'} title={'INGRESOS TOTALES'} montoSoles={'S/2,125,943.00'}/>
              <CardEstimado backgroundColor={'bg-danger'} title={'EGRESOS DIRECTOS'} items={[{label: 'IGV', monto: '1234.00'}, {label: 'POS', monto: '1234.00'},{label: 'RENTA', monto: '1234.00'},{label: 'COMISIONES', monto: '1234.00'}]} montoSoles={'S/2,125,943.00'}/>
              <CardEstimado backgroundColor={'bg-danger'} title={'TOTAL GASTOS'} montoSoles={'S/2,125,943.00'}/>
              <CardEstimado backgroundColor={'bg-info'} title={'UTILIDAD BRUTA'} montoSoles={'S/2,125,943.00'}/> 
              </CardBody>
              </Card>
            </Col>
          </Row>
          </TabPanel>
          <TabPanel header='CIRCUS'>
            <BtnExportExcelFlujoCaja id_empresa={599} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
          </TabPanel>
          <TabPanel header='PERSONAL TRAINING'>
            <BtnExportExcelFlujoCaja id_empresa={0} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
          </TabPanel>
        </TabView>
        </>
      )
    }
    
*/