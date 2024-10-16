import { SectionComentario } from '@/components/Comentario/SectionComentario'
import React from 'react'

export const SectionComentarios = ({data}) => {
  return (
    <SectionComentario uid_comentario={data?.uid_comentario}/>
  )
}
