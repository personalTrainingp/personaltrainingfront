import React, { useEffect, useRef, useState } from 'react'
import { PageBreadcrumb } from '@/components'
import { Toast } from 'primereact/toast'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { Calendar } from 'primereact/calendar'
import { TabPanel, TabView } from 'primereact/tabview'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'
import { BtnExportExcelFlujoCaja } from '../../GestGastos/BtnExportExcelFlujoCaja'
import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore'
import { DataTablaFlujoCajaEgreso } from './DataTablaFlujoCajaEgreso'

export const FlujoCaja = () => {
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
<PageBreadcrumb title="FLUJO DE CAJA" subName="reporte-flikp" />
    <TabView>
        <TabPanel header='CHANGE'>

        <div className='flex-auto mb-2'>
            <label htmlFor="buttondisplay" className="font-bold block mb-2">
                            RANGO DE FECHAS
            </label>
            <Calendar value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/>
            <FormatRangoFecha rangoFechas={rangoFechas}/>
            <BtnExportExcelFlujoCaja id_empresa={598} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
            <DataTablaFlujoCajaEgreso id_empresa={598} dataEgreso={dataGasto}/>
        </div>
        </TabPanel>
        <TabPanel header='CIRCUS'>
            <div className='flex-auto mb-2'>
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                                RANGO DE FECHAS
                </label>
                <Calendar value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/>
                <FormatRangoFecha rangoFechas={rangoFechas}/>
                <BtnExportExcelFlujoCaja id_empresa={599} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
                <DataTablaFlujoCajaEgreso id_empresa={599} dataEgreso={dataGasto}/>

            </div>
        </TabPanel>
        <TabPanel header='PERSONAL TRAINING'>
            <div className='flex-auto mb-2'>
                <label htmlFor="buttondisplay" className="font-bold block mb-2">
                                RANGO DE FECHAS
                </label>
                <Calendar value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/>
                <FormatRangoFecha rangoFechas={rangoFechas}/>
                <BtnExportExcelFlujoCaja id_empresa={0} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
                <DataTablaFlujoCajaEgreso id_empresa={0} dataEgreso={dataGasto}/>
            </div>
        </TabPanel>
    </TabView>
    </>
  )
}
