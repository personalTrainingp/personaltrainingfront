import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'

export const ColorEmpresa = (props) => {
    
  const tabs = [
    { key: 'childrenManicure', label: 'MANICURE', color: 'color-manicure-all', text: 'text-manicure link-manicure', BackgroundHeretary: 'link-manicure' },
    { key: 'childrenChange', label: 'CHANGE', color: 'color-change-all', text: 'link-change', BackgroundHeretary: 'link-change' },
    { key: 'childrenCircus', label: 'CIRCUS', color: 'color-circus-all', text: 'text-circus link-circus', BackgroundHeretary: 'link-circus' },
    { key: 'childrenReducto', label: 'REDUCTO', color: 'color-reducto-all', text: 'text-ISESAC link-isesac', BackgroundHeretary: 'link-isesac' },
    { key: 'childrenOtrosRal', label: 'OTROS RAL', color: 'color-otros-ral-all', text: 'link-change', BackgroundHeretary: 'link-change' },
    { key: 'childrenRal', label: 'RAL', color: 'color-ral-all', text: 'link-ral', BackgroundHeretary: 'link-ral' },
    { key: 'childrenOtros', label: 'OTROS', color: 'color-otros-all', text: 'link-change', BackgroundHeretary: 'link-change' },
    { key: 'childenBUSSINESS', label: 'Circus Bussiness', color: 'color-otros-all', text: 'link-change', BackgroundHeretary: 'link-change' },
    { key: 'childrenInventarioSinIncluirCircusBussiness', label: 'Inventario sin incluir circus bussiness', color: 'color-otros-all', text: 'link-change', BackgroundHeretary: 'link-change' },
    { key: 'childrenChorrillos', label: 'Chorrillos Almacen', color: 'color-otros-all', text: 'link-change', BackgroundHeretary: 'link-change' },
    { key: 'childrenmpTarata', label: 'MP TARATA', color: 'color-otros-all', text: 'link-change', BackgroundHeretary: 'link-change' },
  ]
  
  return (
    <TabView activeIndex={1}>
      {tabs.map(({ key, label, color, text, BackgroundHeretary }) =>
        props[key] ? (
          <TabPanel
            key={key}
            className={color}
            header={<div className={`fs-1 ${text}`}>{label}</div>}
          >
            <div className={BackgroundHeretary}>
              {props[key]}
            </div>
          </TabPanel>
        ) : null
      )}
    </TabView>
  )
}
