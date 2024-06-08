import { useForm } from '@/hooks/useForm'
import { onSetComentario } from '@/store/usuario/usuarioSlice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
const registraComentario = {
    comentario_com: ''
}
export const LayoutComentario = () => {
    const dispatch = useDispatch()
    const { comentario_com, formState, onInputChange } = useForm(registraComentario)
    useEffect(() => {
        dispatch(onSetComentario(formState))
    }, [comentario_com])
    
  return (
    <>
    <textarea
        className='form-control'
        placeholder='Agrega un comentario o observacion aqui'
        name='comentario_com'
        value={comentario_com}
        onChange={onInputChange}
    />
    </>
  )
}
