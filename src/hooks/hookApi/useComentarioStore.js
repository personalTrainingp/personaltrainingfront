import { PTApi } from '@/common';
import { onSetComentarios } from '@/store/dataComentario/comentarioSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useComentarioStore = () => {
	const [comentarioxLOC, setcomentarioxLOC] = useState([]);
	const dispatch = useDispatch();
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
	};
};
