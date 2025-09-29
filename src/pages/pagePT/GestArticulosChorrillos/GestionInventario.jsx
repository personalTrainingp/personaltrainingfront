import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { DataInventario } from './DataInventario'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'

import ImgproyCircus3 from '@/assets/images/pr_tercer_nivel.jpeg'
import ImgproyCircus2 from '@/assets/images/pr_segundo_nivel.jpeg'
import ImgproyCircus1 from '@/assets/images/pr_primer_nivel.png'
export const GestionInventario = () => {
  return (
    <>
    
    <PageBreadcrumb title={'INVENTARIOS'} subName={'T'}/>
    <Card className='p-4 m-2'>
    <TabView>
      <TabPanel header={<>CHANGE<br/> INVENTARIO TOTAL</>}>
              <DataInventario id_enterprice={598} id_empresa_zona={598} btnAdd btnDelete btnEdit/>
      </TabPanel>
      <TabPanel header={<>MP<br/>TARATA</>}>
              <DataInventario id_enterprice={600}/>
      </TabPanel>
      <TabPanel header={'CHORRILLOS'}>
              <DataInventario btnAdd btnDelete btnEdit id_enterprice={601} id_empresa_zona={601} />
      </TabPanel>
      <TabPanel header={<>REDUCTO<br/>INVENTARIO TOTAL</>}>
              <DataInventario id_enterprice={599} id_empresa_zona={599}/>
      </TabPanel>
      <TabPanel header={<>CIRCUS<br/> BUSSINESS</>}>
              <DataInventario ImgproyCircus1={ImgproyCircus1} ImgproyCircus2={ImgproyCircus2} ImgproyCircus3={ImgproyCircus3} id_enterprice={602} id_empresa_zona={599} btnAdd btnDelete btnEdit/>
      </TabPanel>
      <TabPanel header={<>INVENTARIO SIN INCLUIR <br/> CIRCUS BUSSINESS</>}>
              <DataInventario id_enterprice={610} id_empresa_zona={599} btnAdd btnDelete btnEdit/>
      </TabPanel>
    </TabView>
    </Card>
    </>
  )
}
