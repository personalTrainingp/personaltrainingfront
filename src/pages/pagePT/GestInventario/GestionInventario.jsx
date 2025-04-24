import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { DataInventario } from './DataInventario'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import ImgproyCircus3 from '@/assets/images/pr_tercer_nivel.jpeg'
import ImgproyCircus2 from '@/assets/images/pr_segundo_nivel.jpeg'
import ImgproyCircus1 from '@/assets/images/pr_primer_nivel.jpeg'
export const GestionInventario = () => {
  return (
    <>
    
    <PageBreadcrumb title={'GESTION DE INVENTARIO'} subName={'T'}/>
    <Card className='p-4 m-2'>
      <TabView>
        <TabPanel header="CHANGE THE SLIM STUDIO">
              <DataInventario id_enterprice={598} id_zona={598}/>
        </TabPanel>
        <TabPanel header="MP">
              <DataInventario id_enterprice={600} id_zona={600}/>
        </TabPanel>
        <TabPanel header="REDUCTO INVENTARIO TOTAL">
              <DataInventario id_enterprice={599} id_zona={599}/>
        </TabPanel>
        <TabPanel header="CIRCUS CO.">
              <DataInventario ImgproyCircus3={ImgproyCircus3} ImgproyCircus2={ImgproyCircus2} ImgproyCircus1={ImgproyCircus1} id_enterprice={602} id_zona={599}/>
        </TabPanel>
        <TabPanel header="REDUCTO INFRAESTRUCTURA">
              <DataInventario id_enterprice={610} id_zona={599}/>
        </TabPanel>
        <TabPanel header="CHORRILLOS">
              <DataInventario id_enterprice={601} id_zona={601}/>
        </TabPanel>
      </TabView>
    </Card>
    </>
  )
}
