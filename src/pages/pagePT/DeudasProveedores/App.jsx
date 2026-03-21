import React from 'react'
import { TableDeudasProveedores } from './TableDeudasProveedores'
import { PageBreadcrumb } from '@/components'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { GastosProveedor } from './GastosProveedor'
import { TabPanel, TabView } from 'primereact/tabview'

export const App = () => {
  return (
    <>
        <PageBreadcrumb title={'Deudas Proveedores'}/>
        <ColorEmpresa
            childrenChange={
                <TabView>
                    <TabPanel header={<div className='fs-1'>2026</div>}>
                        <GastosProveedor id_empresa={598} arrayDate={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2025</div>}>
                        <GastosProveedor id_empresa={598} arrayDate={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2024</div>}>
                        <GastosProveedor id_empresa={598} arrayDate={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                </TabView>
            }
            childrenCircus={
                <TabView>
                    <TabPanel header={<div className='fs-1'>2026</div>}>
                        <GastosProveedor id_empresa={601} arrayDate={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2025</div>}>
                        <GastosProveedor id_empresa={601} arrayDate={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2024</div>}>
                        <GastosProveedor id_empresa={601} arrayDate={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                </TabView>
            }
            childrenReducto={
                <TabView>
                    <TabPanel header={<div className='fs-1'>2026</div>}>
                        <GastosProveedor id_empresa={599} arrayDate={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2025</div>}>
                        <GastosProveedor id_empresa={599} arrayDate={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2024</div>}>
                        <GastosProveedor id_empresa={599} arrayDate={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                </TabView>
            }
        />
    </>
  )
}
