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
import { UtilidadesMes } from './UtilidadesMes'
import { UtilidadesProgramas } from './UtilidadesProgramas'
import { ItemTotales } from './ItemTotales'
import { UtilidadesProductos } from './UtilidadesProductos'
import { UtilidadesCitas } from './UtilidadesCitas'
import SimpleBar from 'simplebar-react'
import { SelectButton } from 'primereact/selectbutton'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useDispatch } from 'react-redux';
import { EmpresaPuntoEquilibrio } from './EmpresaPuntoEquilibrio'
import { FechaRangeMES } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import { ModalConceptos } from './ModalConceptos'
// Componente reutilizable para iconos en los tabs
const TabIcon = ({ src, alt, width }) => (
    <div className='h-100'>
        <img
          src={src}
          alt={alt}
          width={width}
          className="h-auto object-contain align-items"
        />
    </div>
);
export const ReporteGerenciales = () => {
    const { RANGE_DATE, dataView } = useSelector(e=>e.DATA)
  return (
    <>
    <PageBreadcrumb title="PUNTO DE EQUILIBRIO" subName="reporte-gerenciales" />
        {/* <FechaRangeMES rangoFechas={RANGE_DATE}/> */}
    <TabView>
      <TabPanel style={{alignItems: 'flex-end', display: 'flex'}}  header={<TabIcon width={220} src='https://change-the-slim-studio-sigma.vercel.app/assets/mem_logo-be75730a.png'/>}>
        <EmpresaPuntoEquilibrio id_empresa={598} background={'bg-change'} bgHEX={'#CD1014'} textEmpresa={'text-change'} RANGE_DATE={RANGE_DATE}/>
      </TabPanel>
      <TabPanel style={{alignItems: 'flex-end', display: 'flex'}} className='mb-2' header={<TabIcon width={180} src='https://sistema-circus.vercel.app/assets/Positivo-transparente-c932a60a.png'/>}>
        <EmpresaPuntoEquilibrio id_empresa={599} background={'bg-circus'} bgHEX={'#EEBE00'} textEmpresa={'text-circus'} RANGE_DATE={RANGE_DATE}/>
      </TabPanel>
      <TabPanel style={{alignItems: 'flex-end', display: 'flex'}} className='mb-2' headerClassName="mi-tab-verde" header={<div style={{fontSize: '40px', color: '#17a700'}} className=' fw-medium'>INVERSIONES <br/> SAN EXPEDITO</div>} >
        <EmpresaPuntoEquilibrio id_empresa={601} background={'bg-greenISESAC'} textEmpresa={'text-ISESAC'} RANGE_DATE={RANGE_DATE}/>
      </TabPanel>
    </TabView>
    </>
  )
}
