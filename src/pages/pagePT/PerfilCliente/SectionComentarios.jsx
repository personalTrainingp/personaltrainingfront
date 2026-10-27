import { SectionComentario } from '@/components/Comentario/SectionComentario';
import { PTApi } from '@/common';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

export const SectionComentarios = ({data}) => {
  // Comentarios de los prospectos vinculados a este cliente (id_cli): solo se filtran, no se guardan en el cliente
  const [comentariosProspecto, setcomentariosProspecto] = useState([])
  useEffect(() => {
    if (!data?.id_cli) return
    PTApi.get(`/prospecto/lead/cliente/${data.id_cli}/comentarios`)
      .then(({data})=>setcomentariosProspecto(data.comentarios))
      .catch((error)=>console.log(error))
  }, [data?.id_cli])
  // van despues del input y antes de los comentarios del cliente
  const bloqueProspecto = comentariosProspecto.length > 0 && (
    <div>
      <h5>COMENTARIOS DE PROSPECTO</h5>
      {comentariosProspecto.map(e=>(
        <div key={e.id_comentario} className='card mb-2'>
          <div className='card-header bg-secondary text-white py-1'>
            <strong>PROS{e.id_prospecto}</strong> · {e.auth_user?.nombres_apellidos_user} · {dayjs(e.fec_registro).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A')}
          </div>
          <div className='card-body py-2'>{e.comentario_com}</div>
        </div>
      ))}
    </div>
  )
  return (
    <SectionComentario uid_comentario={data.uid_comentario} antesDeComentarios={bloqueProspecto}/>
  )
}
