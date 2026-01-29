import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { ViewTablesFlujoCaja } from './ViewTablesFlujoCaja'

export const AppFlujoCaja = () => {
  return (
    <div>
      <TabView>
        <TabPanel header={'CHANGE'}>
          <TabView>
            <TabPanel header={'2026'}>
              <ViewTablesFlujoCaja arrayFecha={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel'} id_empresa={598}/>
            </TabPanel>
            <TabPanel header={'2025'}>
              <ViewTablesFlujoCaja arrayFecha={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel'} id_empresa={598}/>
            </TabPanel>
            <TabPanel header={'2024'}>
              <ViewTablesFlujoCaja arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel'} id_empresa={598}/>
            </TabPanel>
            <TabPanel header={'RESUMEN GENERAL'}>
              <ViewTablesFlujoCaja arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel'} id_empresa={598}/>
            </TabPanel>
          </TabView>
        </TabPanel>
      </TabView>
    </div>
  )
}
