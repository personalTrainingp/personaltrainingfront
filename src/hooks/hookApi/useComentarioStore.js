import { PTApi } from '@/common';
import { onSetComentarios } from '@/store/dataComentario/comentarioSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useComentarioStore = () => {
	const [comentarioxLOC, setcomentarioxLOC] = useState([]);
	const dispatch = useDispatch();
	const deleteComentario = async (id, uid_comentario) => {
		try {
			const { data } = await PTApi.put(`/servicios/comentario/delete/${id}`);
			await obtenerComentarioxLOCATION(uid_comentario);
		} catch (error) {
			console.log(error);
		}
	};
	const updateComentario = async (formState, id, uid_comentario) => {
		try {
			console.log(id, formState);

			const { data } = await PTApi.put(`/servicios/comentario/put/${id}`, {
				comentario_com: formState,
			});
			await obtenerComentarioxLOCATION(uid_comentario);
		} catch (error) {
			console.log(error);
		}
	};
	const postComentario = async (formState) => {
		try {
			const { data } = await PTApi.post('/servicios/comentario/post', formState);
			await obtenerComentarioxLOCATION(formState.uid_location);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerComentarioxLOCATION = async (location) => {
		try {
			const { data } = await PTApi.get(`/servicios/comentario/${location}`);
			dispatch(onSetComentarios(data.comentarios));
		} catch (error) {
			console.log(error);
		}
	};

	return {
		obtenerComentarioxLOCATION,
		postComentario,
		updateComentario,
		deleteComentario,
	};
};
