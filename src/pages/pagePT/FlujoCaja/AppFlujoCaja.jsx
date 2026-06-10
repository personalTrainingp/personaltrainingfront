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
            <TabPanel header={<div className='fs-1'>1ER TRIMESTRE</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <Trimestre1Total header={'1ER TRIMESTRE'} mesDiaDesde='01-01' mesDiaDespues='03-31' link={'link-change'} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>2DO TRIMESTRE</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <Trimestre1Total header={'2DO TRIMESTRE'} mesDiaDesde='04-01' mesDiaDespues='06-30' link={'link-change'} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>3ER TRIMESTRE</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <Trimestre1Total header={'3ER TRIMESTRE'} mesDiaDesde='07-01' mesDiaDespues='09-30' link={'link-change'} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>4TO TRIMESTRE</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <Trimestre1Total header={'4TO TRIMESTRE'} mesDiaDesde='10-01' mesDiaDespues='12-31' link={'link-change'} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>COMPARATIVO ANUAL</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <TablesResumenTotal header={'4TO TRIMESTRE'} mesDiaDesde='01-01' mesDiaDespues='12-31' link={'link-change'} classNameEmpresa={'bg-change text-white'} bgPastel={'bg-change-pastel text-white'} id_empresa={598}/>
            </div>
            </TabPanel>
          </TabView>
        }
        childrenCircus={
          <TabView> 
            <TabPanel header={<div className='fs-1'>2026</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-circus'} textEmpresa={'text-circus'} arrayFecha={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-circus text-white'} bgPastel={'bg-circus-pastel text-white'} id_empresa={601}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>2025</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-circus'} textEmpresa={'text-circus'} arrayFecha={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} anio={2025} classNameEmpresa={'bg-circus text-white'} bgPastel={'bg-circus-pastel text-white'} id_empresa={601}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>2024</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-circus'} textEmpresa={'text-circus'} arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} anio={2024} classNameEmpresa={'bg-circus text-white'} bgPastel={'bg-circus-pastel text-white'} id_empresa={601}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>COMPARATIVO ANUAL</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <TablesResumenTotal link={'link-circus'} textEmpresa={'text-circus'} classNameEmpresa={'bg-circus text-white'} bgPastel={'bg-circus-pastel text-white'} id_empresa={601}/>
            </div>
            </TabPanel>
          </TabView>
        }
        childrenReducto={
          <TabView>
            <TabPanel header={<div className='fs-1'>2026</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-isesac'} textEmpresa={'text-isesac'} arrayFecha={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-greenISESAC text-white'} bgPastel={'bg-greenISESAC-pastel text-white'} id_empresa={599}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>2025</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-isesac'} textEmpresa={'text-isesac'} arrayFecha={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} anio={2025} classNameEmpresa={'bg-greenISESAC text-white'} bgPastel={'bg-greenISESAC-pastel text-white'} id_empresa={599}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>2024</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-isesac'} textEmpresa={'text-isesac'} arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} anio={2024} classNameEmpresa={'bg-greenISESAC text-white'} bgPastel={'bg-greenISESAC-pastel text-white'} id_empresa={599}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>COMPARATIVO ANUAL</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <TablesResumenTotal link={'link-isesac'} classNameEmpresa={'bg-greenISESAC text-white'} bgPastel={'bg-greenISESAC-pastel text-white'} id_empresa={599}/>
            </div>
            </TabPanel>
          </TabView>
        }
        childrenRal = {
          <TabView>
            <TabPanel header={<div className='fs-1'>2026</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-ral'} textEmpresa={'text-ral'} arrayFecha={['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']} anio={2026} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={800}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>2025</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-ral'} textEmpresa={'text-ral'} arrayFecha={['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']} anio={2025} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={800}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>2024</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <ViewTablesFlujoCaja link={'link-ral'} textEmpresa={'text-ral'} arrayFecha={['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']} anio={2024} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={800}/>
            </div>
            </TabPanel>
            <TabPanel header={<div className='fs-1'>RESUMEN GENERAL</div>}>
            <div  className='' style={{overflowY: 'scroll', height: '800px'}}>
              <TablesResumenTotal link={'link-ral'} classNameEmpresa={'bg-ral text-white'} bgPastel={'bg-ral-pastel text-white'} id_empresa={800}/>
            </div>
            </TabPanel>
          </TabView>
        }
      />
    </div>
  )
}
