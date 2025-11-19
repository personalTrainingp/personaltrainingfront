import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'

export const ColorEmpresa = (props) => {
    
  const tabs = [
    { key: 'childrenManicure', label: 'MANICURE', color: 'color-manicure-all', text: 'text-manicure link-manicure' },
    { key: 'childrenChange', label: 'CHANGE', color: 'color-change-all', text: 'link-change' },
    { key: 'childrenCircus', label: 'CIRCUS', color: 'color-circus-all', text: 'text-circus link-circus' },
    { key: 'childrenReducto', label: 'REDUCTO', color: 'color-reducto-all', text: 'text-ISESAC link-isesac' },
    { key: 'childrenOtrosRal', label: 'OTROS RAL', color: 'color-otros-ral-all', text: 'link-change' },
    { key: 'childrenRal', label: 'RAL', color: 'color-ral-all', text: 'link-change' },
    { key: 'childrenOtros', label: 'OTROS', color: 'color-otros-all', text: 'link-change' },
  ]
  
  return (
    <TabView activeIndex={1}>
      {tabs.map(({ key, label, color, text }) =>
        props[key] ? (
          <TabPanel
            key={key}
            className={color}
            header={<div className={`fs-1 ${text}`}>{label}</div>}
          >
            {props[key]}
          </TabPanel>
        ) : null
      )}
    </TabView>
  )
}
