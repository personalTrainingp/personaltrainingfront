import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { AppTermGastos } from './TerminologiasGastos/AppTermGastos'
import { AppTermSistemas } from './TermSistema/AppTermSistemas'
import { AppTermGrupos } from './TermSistema/AppTermGrupos'
import { ColorEmpresa } from '@/components/ColorEmpresa'

export const AppTerminologias = () => {
  return (
    <div>
        <TabView>
            <TabPanel header={<div className='text-black' style={{fontSize: '25px'}}>TERMINOLOGIA DE GASTOS</div>}>
            <ColorEmpresa
              childrenChange={
                <AppTermGastos id_empresa={598} tipo={1573}/>
              }
              childrenReducto={
                <AppTermGastos id_empresa={599} tipo={1573}/>
              }
              childrenCircus={
                  <AppTermGastos id_empresa={601} tipo={1573}/>
              }
              childrenRal={
                  <AppTermGastos id_empresa={800} tipo={1573}/>
              }
            />
            </TabPanel>
            
            <TabPanel header={<div className='text-black' style={{fontSize: '25px'}}>TERMINOLOGIA DE INGRESOS</div>}>
              <ColorEmpresa
                childrenChange={
                  <AppTermGastos id_empresa={598} tipo={1574}/>
                }
                childrenReducto={
                  <AppTermGastos id_empresa={599} tipo={1574}/>
                }
                childrenCircus={
                    <AppTermGastos id_empresa={601} tipo={1574}/>
                }
                childrenRal={
                    <AppTermGastos id_empresa={800} tipo={1574}/>
                }
              />
            </TabPanel>
            
            <TabPanel header={<div className='text-black' style={{fontSize: '25px'}}>TERMINOLOGIA DE SISTEMAS</div>}>
                  <AppTermSistemas />
            </TabPanel>
            <TabPanel header={<div className='text-black' style={{fontSize: '25px'}}>TERMINOLOGIA DE GRUPO</div>}>
                  <AppTermGrupos />
            </TabPanel>
        </TabView>
    </div>
  )
}
