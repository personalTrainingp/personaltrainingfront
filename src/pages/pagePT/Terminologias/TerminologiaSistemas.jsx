import { Menu } from 'primereact/menu';
import React from 'react'

export const TerminologiaSistemas = () => {
    const items = [
        {
            label: 'ARTICULOS',
        },
        {
            label: 'PRODUCTOS',
        }
    ];

  return (
    <Menu model={items}/>
  )
}
