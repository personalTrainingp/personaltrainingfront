import { SectionComentario } from '@/components/Comentario/SectionComentario'
import { PTApi } from '@/common'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'

export const ModalComentario = ({show, onHide, uid_comentario='', id_cli=null}) => {
  // Comentarios del cliente (gestion de socios, tb_clientes.uid_comentario) vinculado al prospecto por id_cli: solo se muestran
  const [comentariosCliente, setcomentariosCliente] = useState([])
  useEffect(() => {
    setcomentariosCliente([])
    if (!show || !id_cli) return
    PTApi.get(`/usuario/get-cliente/id/${id_cli}`)
      .then(({data})=>{
        const uid = data.cliente?.uid_comentario
        // si el comentario del prospecto ya es el del cliente no se repite
        if (!uid || uid===uid_comentario) return
        return PTApi.get(`/servicios/comentario/${uid}`).then(({data})=>setcomentariosCliente(data.comentarios ?? []))
      })
      .catch((error)=>console.log(error))
  }, [show, id_cli, uid_comentario])
  // van despues de los comentarios del prospecto
  const bloqueCliente = comentariosCliente.length > 0 && (
    <div>
      <h5>COMENTARIOS DE SOCIO</h5>
      {comentariosCliente.map(e=>(
        <div key={e.id_comentario} className='card mb-2'>
          <div className='card-header bg-secondary text-white py-1'>
            <strong>CLI{id_cli}</strong> · {e.auth_user?.nombres_apellidos_user} · {dayjs(e.fec_registro).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A')}
          </div>
          <div className='card-body py-2'>{e.comentario_com}</div>
        </div>
      ))}
    </div>
  )
  return (
    <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header>
            <Modal.Title>
                COMENTARIOS
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <SectionComentario uid_comentario={uid_comentario} antesDeComentarios={bloqueCliente}/>
        </Modal.Body>
    </Modal>
  )
}
