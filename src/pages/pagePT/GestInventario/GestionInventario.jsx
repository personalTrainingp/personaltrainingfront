import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { DataInventario } from './DataInventario'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import ImgproyCircus3 from '@/assets/images/pr_tercer_nivel.jpeg'
import ImgproyCircus2 from '@/assets/images/pr_segundo_nivel.jpeg'
import ImgproyCircus1 from '@/assets/images/pr_primer_nivel.png'
import { Image } from 'primereact/image'
export const GestionInventario = () => {
  return (
    <>
    
    <PageBreadcrumb title={'GESTION DE INVENTARIO'} subName={'T'}/>
    <Card className='p-4 m-2'>
      <TabView>
        <TabPanel header={<>CHANGE<br/> INVENTARIO TOTAL</>}>
              <DataInventario id_enterprice={598} id_zona={598}/>
        </TabPanel>
        <TabPanel header={<>REDUCTO<br/>INVENTARIO TOTAL</>}>
              <DataInventario id_enterprice={599} id_zona={599}/>
        </TabPanel>
        <TabPanel header={<>PLANOS REDUCTO <br/> DEFENSA CIVIL</>}>
            <div>
                  
                                          <Image src={ImgproyCircus3}  className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="500">
                                          </Image>
            </div>
        </TabPanel>
        <TabPanel header={<>INVENTARIO SIN INCLUIR <br/> CIRCUS BUSSINESS</>}>
              <DataInventario id_enterprice={610} id_zona={599}/>
        </TabPanel>
        <TabPanel header={<>CIRCUS<br/> BUSSINESS</>}>
              <DataInventario ImgproyCircus3={ImgproyCircus3} ImgproyCircus2={ImgproyCircus2} ImgproyCircus1={ImgproyCircus1} id_enterprice={602} id_zona={599}/>
        </TabPanel>
        <TabPanel header={<>CHORRILLOS<br/>ALMACEN</>}>
              <DataInventario id_enterprice={601} id_zona={601}/>
        </TabPanel>
        <TabPanel header={<>MP<br/>TARATA</>}>
              <DataInventario id_enterprice={600} id_zona={600}/>
        </TabPanel>
      </TabView>
    </Card>
    </>
  )
}
