import React from 'react'
import { PageBreadcrumb } from '@/components'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { GastosProveedor } from './GastosProveedor'
import { ProveedoresTodo } from './ProveedoresTodo'
import { TabPanel, TabView } from 'primereact/tabview'

export const App = () => {
  return (
    <>
        <PageBreadcrumb title={'Reporte Proveedores'}/>
        <ColorEmpresa
            childrenTodo={
                <TabView>
                    <TabPanel header={<div className='fs-1'>2026</div>}>
                        <ProveedoresTodo arrayDate={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2025</div>}>
                        <ProveedoresTodo arrayDate={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2024</div>}>
                        <ProveedoresTodo arrayDate={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                </TabView>
            }
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
            childrenRal={
                <TabView>
                    <TabPanel header={<div className='fs-1'>2026</div>}>
                        <GastosProveedor id_empresa={800} arrayDate={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2025</div>}>
                        <GastosProveedor id_empresa={800} arrayDate={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>2024</div>}>
                        <GastosProveedor id_empresa={800} arrayDate={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} />
                    </TabPanel>
                </TabView>
            }
        />
    </>
  )
}
