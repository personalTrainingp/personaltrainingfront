import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { ViewPuntoEquilibrio } from './View/ViewPuntoEquilibrio'

export const AppPuntoEquilibrio = () => {
  return (
    <div>
        <TabView>
            <TabPanel header={'CHANGE'}>
                <ViewPuntoEquilibrio rangeDate={['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} bgTotal={'bg-change text-white'} id_empresa={598}/>
            </TabPanel>
            <TabPanel header={'REDUCTO'}>
                <ViewPuntoEquilibrio rangeDate={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} bgTotal={'bg-greenISESAC text-white'} id_empresa={599}/>
            </TabPanel>
            <TabPanel header={'CIRCUS'}>
                <ViewPuntoEquilibrio rangeDate={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} bgTotal={'bg-circus text-white'} id_empresa={600}/>
            </TabPanel>
            <TabPanel header={'RAL'}>
                <ViewPuntoEquilibrio rangeDate={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} bgTotal={'bg-ral text-white'} id_empresa={600}/>
            </TabPanel>
        </TabView>
    </div>
  )
}
