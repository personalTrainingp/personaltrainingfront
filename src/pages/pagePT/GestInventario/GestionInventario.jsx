import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { DataInventario } from './DataInventario'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import ImgproyCircus3 from '@/assets/images/pr_tercer_nivel.jpeg'
import ImgproyCircus2 from '@/assets/images/pr_segundo_nivel.jpeg'
import ImgproyCircus1 from '@/assets/images/pr_primer_nivel.png'
import ImgproyRedN1 from '@/assets/images/pr/nivel 1.png'
import ImgproyRedN2 from '@/assets/images/pr/nivel 2.png'
import ImgproyRedN3 from '@/assets/images/pr/nivel 3.png'
import { Image } from 'primereact/image'
import { DataInventario2 } from './DataInventario2'
import { ColorEmpresa } from '@/components/ColorEmpresa'
export const GestionInventario = () => {
  return (
    <>
    
    <PageBreadcrumb title={'GESTION DE INVENTARIO'} subName={'T'}/>
    <ColorEmpresa
      childrenChange={
            <TabView>
                  <TabPanel header={<>INVENTARIO <br/> MARZO 2024 <br/> MANOJ</>}>
                        <DataInventario id_enterprice={600} id_zona={600}/>
                  </TabPanel>
                  <TabPanel header={<>INVENTARIO <br/> MAYO 2025</>}>
                        <DataInventario id_enterprice={2598} id_zona={598}/>
                  </TabPanel>
                  <TabPanel header={<>INVENTARIO<br/> AGOSTO 2026 </>}>
                        <DataInventario id_enterprice={598} id_zona={598}/>
                  </TabPanel>
            </TabView>
      }
      childrenReducto={
            <TabView>
                  <TabPanel header={<>INVENTARIO <br/> MAYO 2025</>}>
                        <DataInventario ImgproyCircus3={ImgproyRedN3} ImgproyCircus2={ImgproyRedN2} ImgproyCircus1={ImgproyRedN1} id_enterprice={599} id_zona={599}/>
                  </TabPanel>
                  <TabPanel header={<>INVENTARIO <br/> OCTUBRE 2025</>}>
                        <DataInventario id_enterprice={1599} id_zona={599}/>
                  </TabPanel>
                  <TabPanel header={<>INVENTARIO <br/> SEPTIEMBRE 2026 <br/>(3 y 3 1/2)</>}>
                        <DataInventario id_enterprice={2599} id_zona={599}/>
                  </TabPanel>
            </TabView>
      }
      childrenCircus={
            <TabView>
                  <TabPanel header={<>INVENTARIO SIN INCLUIR <br/> CIRCUS BUSSINESS</>}>
                        <DataInventario id_enterprice={610} id_zona={599}/>
                  </TabPanel> 
                  <TabPanel header={<>CIRCUS<br/> BUSSINESS</>}>
                        <DataInventario ImgproyCircus3={ImgproyCircus3} ImgproyCircus2={ImgproyCircus2} ImgproyCircus1={ImgproyCircus1} id_enterprice={602} id_zona={599}/>
                  </TabPanel>
            </TabView>
      }
      childrenRal={
            <TabView>
                  <TabPanel header={<>CHORRILLOS<br/>ALMACEN</>}>
                        <DataInventario id_enterprice={601} id_zona={601}/>
                  </TabPanel>
            </TabView>
      }
    />
    {/* <Card className=''>
      <TabView>
            <TabPanel header={<>INVENTARIO <br/> MAYO 2025</>}>
                  <TabView>
                  <TabPanel header={<>CHANGE<br/> INVENTARIO TOTAL</>}>
                        <DataInventario id_enterprice={598} id_zona={598}/>
                  </TabPanel>
                  <TabPanel header={<>REDUCTO<br/>INVENTARIO TOTAL</>}>
                        <DataInventario id_enterprice={599} id_zona={599}/>
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
            </TabPanel>
            <TabPanel header={<>INVENTARIO NIVEL 3ER - 3 1/2  </>}>
                  <TabView>
                        <TabPanel header={<>INVENTARIO <br/> OCTUBRE 2025</>}>
                              <DataInventario id_enterprice={1599} id_zona={599}/>
                        </TabPanel>
                        <TabPanel header={<>INVENTARIO NIVEL 3ER - 3 1/2  <br/> SEPTIEMBRE 2026</>}>
                              <DataInventario id_enterprice={2599} id_zona={599}/>
                        </TabPanel>
                  </TabView>
            </TabPanel>
            <TabPanel header='BACKUPS'>
                  <TabView>
                        <TabPanel header={<>CHANGE<br/> INVENTARIO TOTAL FEBRERO 2026</>}>
                              <DataInventario id_enterprice={2598} id_zona={598}/>
                        </TabPanel>
                        <TabPanel header={<>CIRCUS EXTRA</>}>
                              <DataInventario2 etiquetas={[1833]} id_enterprice={599} id_zona={599}/>
                        </TabPanel>
                        <TabPanel header={<>PROYECTO 1</>}>
                              <DataInventario id_enterprice={5992} id_zona={599}/>
                        </TabPanel>
                        <TabPanel header={<>PROYECTO 1 13/06/2026</>}>
                              <DataInventario id_enterprice={5991306} id_zona={599}/>
                        </TabPanel>
                        <TabPanel header={<>PROYECTO 4</>}>
                              <DataInventario id_enterprice={5993} id_zona={599}/>
                        </TabPanel>
                        <TabPanel header={<>PROYECTO 2</>}>
                              <DataInventario id_enterprice={5994} id_zona={599}/>
                        </TabPanel>
                        <TabPanel header={<>AREAS COMUNES</>}>
                              <DataInventario id_enterprice={5998} id_zona={599}/>
                        </TabPanel>
                        <TabPanel header={<>PROYECTO 7</>}>
                              <DataInventario id_enterprice={5997} id_zona={599}/>
                        </TabPanel>
                  </TabView>
            </TabPanel>
      </TabView>
    </Card> */}
    </>
  )
}
