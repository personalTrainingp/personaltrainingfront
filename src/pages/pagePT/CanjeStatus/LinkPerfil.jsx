import React from 'react'
import { urlExterna, esCanjeInfluencer } from './useCanjeStatus'

// botón que abre el perfil del influencer en otra pestaña (solo socios "canje influencer")
export const LinkPerfil = ({ link, tipoCli }) => {
  const url = esCanjeInfluencer(tipoCli) ? urlExterna(link) : null
  if (!url) return <span className='text-muted'>—</span>
  return (
    <a href={url} target='_blank' rel='noopener noreferrer' className='text-ISESAC' title={url}>
      <i className='pi pi-external-link me-1'></i>ABRIR
    </a>
  )
}
