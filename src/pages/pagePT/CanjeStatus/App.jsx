import React, { useEffect } from 'react'
import { TabPanel, TabView } from 'primereact/tabview'
import { useCanjeStatus } from './useCanjeStatus'
import { TablaCanjeStatus } from './TablaCanjeStatus'
import { TablaPublicacionesCanje } from './TablaPublicacionesCanje'

export const App = ({ id_empresa }) => {
  const canje = useCanjeStatus(id_empresa)

  useEffect(() => {
    canje.obtenerTodo()
  }, [id_empresa])

  return (
    <TabView>
      <TabPanel header='STATUS DE CANJE'>
        <TablaCanjeStatus {...canje} />
      </TabPanel>
      <TabPanel header='PUBLICACIONES'>
        <TablaPublicacionesCanje {...canje} />
      </TabPanel>
    </TabView>
  )
}
