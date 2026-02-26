import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { ViewTablesFlujoCaja } from './ViewTablesFlujoCaja'
import { TablesResumenTotal } from './view/TablesResumenTotal'
import { ColorEmpresa } from '@/components/ColorEmpresa'

export const AppFlujoCaja = () => {
  return (
    <div>
      <ColorEmpresa
        childrenChange={
          <TabView>
            <TabPanel header={'2026'}>
              <ViewTablesFlujoCaja arrayFecha={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </TabPanel>
            <TabPanel header={'2025'}>
              <ViewTablesFlujoCaja arrayFecha={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </TabPanel>
            <TabPanel header={'2024'}>
              <ViewTablesFlujoCaja arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </TabPanel>
            <TabPanel header={'RESUMEN GENERAL'}>
              <TablesResumenTotal classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={800}/>
            </TabPanel>
          </TabView>
        }
        childrenCircus={
          <TabView>
            <TabPanel header={'2026'}>
              <ViewTablesFlujoCaja arrayFecha={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={601}/>
            </TabPanel>
            <TabPanel header={'2025'}>
              <ViewTablesFlujoCaja arrayFecha={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={601}/>
            </TabPanel>
            <TabPanel header={'2024'}>
              <ViewTablesFlujoCaja arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={601}/>
            </TabPanel>
            <TabPanel header={'RESUMEN GENERAL'}>
              <TablesResumenTotal classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={601}/>
            </TabPanel>
          </TabView>
        }
        childrenReducto={
          <TabView>
            <TabPanel header={'2026'}>
              <ViewTablesFlujoCaja arrayFecha={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={599}/>
            </TabPanel>
            <TabPanel header={'2025'}>
              <ViewTablesFlujoCaja arrayFecha={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={599}/>
            </TabPanel>
            <TabPanel header={'2024'}>
              <ViewTablesFlujoCaja arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={599}/>
            </TabPanel>
            <TabPanel header={'RESUMEN GENERAL'}>
              <TablesResumenTotal classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={599}/>
            </TabPanel>
          </TabView>
        }
        childrenRal = {
          <TabView>
            <TabPanel header={'2026'}>
              <ViewTablesFlujoCaja arrayFecha={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={800}/>
            </TabPanel>
            <TabPanel header={'2025'}>
              <ViewTablesFlujoCaja arrayFecha={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={800}/>
            </TabPanel>
            <TabPanel header={'2024'}>
              <ViewTablesFlujoCaja arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={800}/>
            </TabPanel>
            <TabPanel header={'RESUMEN GENERAL'}>
              <TablesResumenTotal classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={800}/>
            </TabPanel>
          </TabView>
        }
      />
    </div>
  )
}
