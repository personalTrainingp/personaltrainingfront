import { useComentarioStore } from '@/hooks/hookApi/useComentarioStore'
import { useForm } from '@/hooks/useForm'
import dayjs from 'dayjs'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
const comentario = {
    
}
export const ItemComentario = ({e, user, id, uid_comentario}) => {
    
	const [viewTxtEdit, setviewTxtEdit] = useState(false)
    const {postComentario, updateComentario, deleteComentario} = useComentarioStore()
	const EditComentario = ()=>{
		setviewTxtEdit(!viewTxtEdit)
	}
	const DeleteComentario = async(e)=>{
        e.preventDefault()
        confirmDialog({
            header: 'Confirmar eliminación',
            message: '¿Está seguro de eliminar este comentario?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                deleteComentario(id, uid_comentario)
            },
            reject: () => {
                // nothing to do
            }
        })
	}
    const { formState, onInputChange, comentario_com } = useForm(e.comentario_com)
    const onEditarComentario = async(e)=>{
        e.preventDefault()
        
        await updateComentario(comentario_com, id, uid_comentario)
		setviewTxtEdit(false)
    }
  return (
      <div className="comment-main-level">
    <div className="comment-box" style={{width: '100%'}}>
        <div className="comment-head bg-primary" style={{width: '100%'}}>
            <h6 className="comment-name text-white">{e.auth_user?.nombres_apellidos_user}</h6>
            <span className='text-white'>{dayjs(e.fec_registro).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A')}</span>
            <div className='text-right'>
                {e.auth_user.uid==user.uid && (
                    <>
                        <Link to="" onClick={EditComentario} className="action-icon">
                            <i className="mdi mdi-square-edit-outline text-white"></i>
                        </Link>
                        <Link to="" onClick={DeleteComentario} className="action-icon">
                            <i className="mdi mdi-delete text-white"></i>
                        </Link>
                    </>
                )
                }
            </div>
        </div>
        <div className="comment-content" style={{width: '100%'}}>
            {viewTxtEdit?
            (
                
                <>
                <form onSubmit={onEditarComentario}>
                    <textarea
                    type='text'
                    className='form-control border-none'
                    onChange={onInputChange}
                    value={comentario_com}
                    name='comentario_com'
                    placeholder='Escribe un comentario'
                    autoFocus
                    required
                />
                    
                    <div>
                        <Button style={{width: 'fit-content', padding: '4px', margin: '10px'}} type='submit'>Editar</Button>
                    </div>
                </form>
                </>

            )
            :
                (
                    <p>
                    {e.comentario_com}
                    </p>
                )
            }
        </div>
    </div>
</div>
  )
}
