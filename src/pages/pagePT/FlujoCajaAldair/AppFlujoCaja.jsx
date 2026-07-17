import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { ViewTablesFlujoCaja } from './ViewTablesFlujoCaja'
import { TablesResumenTotal } from './view/TablesResumenTotal'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { PageBreadcrumb } from '@/components'
import { Trimestre1Total } from './view/Trimestre1Total'

export const AppFlujoCaja = () => {
  return (
    <div>
      <PageBreadcrumb title={'FLUJO DE CAJA'}/>
      <ColorEmpresa
        childrenChange={
          <TabView>
            <TabPanel header={<div className='fs-1'>2026</div>}>
            <div className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-change'} textEmpresa={'text-change'} arrayFecha={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>2025</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-change'} textEmpresa={'text-change'} arrayFecha={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} anio={2025} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>2024</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-change'} textEmpresa={'text-change'} arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} anio={2024} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>COMPARATIVO ANUAL</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <TablesResumenTotal header={'4TO TRIMESTRE'} mesDiaDesde='01-01' mesDiaDespues='12-31' link={'link-change'} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </div>
            </TabPanel>
          </TabView>
        }
      />
    </div>
  )
}
