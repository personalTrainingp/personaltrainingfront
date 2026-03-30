import React, { useState } from 'react'
import { PageBreadcrumb } from '@/components'
import { ViewTerminosGrupo } from './View/ViewTerminosGrupo'
import { TabPanel, TabView } from 'primereact/tabview'
import { ColorEmpresa } from '@/components/ColorEmpresa'

export const AppTermGrupos = () => {
  return (
    <div>
            <PageBreadcrumb title={'TERM. GRUPOS'}/>
            <ColorEmpresa
                            childrenChange={
                              <ViewTerminosGrupo id_empresa={598} titulo={'GRUPO'}/>
                            }
                            childrenReducto={
                              <ViewTerminosGrupo id_empresa={599} titulo={'GRUPO'}/>
                            }
                            childrenCircus={
                                <ViewTerminosGrupo id_empresa={601} titulo={'GRUPO'}/>
                            }
                            childrenRal={
                                <ViewTerminosGrupo id_empresa={800} titulo={'GRUPO'}/>
                            }
                          />
    </div>
  )
}
