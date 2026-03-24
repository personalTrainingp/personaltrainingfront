import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import logoChange from '@/assets/images/LOGO_EMPRESA/CHANGE.png'
import logoCircus from '@/assets/images/LOGO_EMPRESA/CIRCUS.png'
export const ColorEmpresa = (props) => {
    
  const tabs = [
    { 
      key: 'childrenManicure', 
      label: 'MANICURE', 
      text: 'text-manicure link-manicure', 
      BackgroundHeretary: 'link-manicure',
    },
    { 
      key: 'childrenChange', 
      label: 'CHANGE', 
      icon: logoChange,
      height: '70px',
      text: 'link-change', 
      BackgroundHeretary: 'link-change'
    },
    { 
      key: 'childrenCircus', 
      label: 'CIRCUS', 
      height: '70px',
      icon: logoCircus,
      text: 'text-circus link-circus', 
      BackgroundHeretary: 'link-circus' 
    },
    { 
      key: 'childrenReducto', 
      label: 'REDUCTO', 
      text: 'text-ISESAC link-isesac', 
      BackgroundHeretary: 'link-isesac' 
    },
    { 
      key: 'childrenOtrosRal', 
      label: 'OTROS RAL', 
      text: 'link-change', 
      BackgroundHeretary: 'link-change' 
    },
    { 
      key: 'childrenRal', 
      label: 'RAL', 
      text: 'link-ral', 
      BackgroundHeretary: 'link-ral' 
    },
    { 
      key: 'childrenOtros', 
      label: 'OTROS', 
      text: 'link-change', 
      BackgroundHeretary: 'link-change' 
    },
    { 
      key: 'childenBUSSINESS', 
      label: 'Circus Bussiness', 
      text: 'link-change', 
      BackgroundHeretary: 'link-change' 
    },
    { 
      key: 'childrenInventarioSinIncluirCircusBussiness', 
      label: 'Inventario sin incluir circus bussiness', 
      text: 'link-change', 
      BackgroundHeretary: 'link-change' 
    },
    { 
      key: 'childrenChorrillos', 
      label: 'Chorrillos Almacen', 
      text: 'link-change', 
      BackgroundHeretary: 'link-change' 
    },
    { 
      key: 'childrenmpTarata', 
      label: 'MP TARATA', 
      text: 'link-change', 
      BackgroundHeretary: 'link-change' 
    },
    { 
      key: 'childrenSoto', 
      label: 'SOTO', 
      text: 'link-change', 
      BackgroundHeretary: 'link-change'
    },
  ]
  return (
    <TabView activeIndex={1}>
      {tabs.map(({ key, label, icon, text, height, BackgroundHeretary }) =>
        props[key] ? (
          <TabPanel
            key={key}
            className={`${text}`}
            header={<div className={`fs-1 ${text}`} style={{height: '70px'}}>{icon?(<img src={icon} style={{height}}></img>):label} </div>}
          >
            <div className={BackgroundHeretary}>
              {props[key]}
              <a></a>
            </div>
          </TabPanel>
        ) : null
      )}
    </TabView>
  )
}
