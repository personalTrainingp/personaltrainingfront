import { PTApi } from '@/common';
import { onGetMetas } from '@/store/uiMeta/metaSlice';
import { onSetNutricionDIETA } from '@/store/usuario/usuarioClienteSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useNutricionCliente = () => {
	const dispatch = useDispatch();
	const [isLoading, setisLoading] = useState(true);
	const startRegisterDieta = async (formData, id_cli, formState) => {
		try {
			setisLoading(true);
			const { data: dataDieta } = await PTApi.post(`/dieta/post-dieta/${id_cli}`, {
				...formState,
			});
			const { data } = await PTApi.post(
				`/storage/blob/create/${dataDieta.uid_dieta}?container=nutricion-dietas`,
				formData
			);
			setisLoading(false);
			obtenerDietasxCliente(id_cli);
		} catch (error) {
			console.log(error);
			setisLoading(false);
		}
	};
	const obtenerDietasxCliente = async (id_cli) => {
		try {
			const { data } = await PTApi.get(`/dieta/get-dietas/${id_cli}`);
			dispatch(onSetNutricionDIETA(data.dietasxCliente));
		} catch (error) {
			console.log(error);
		}
	};
	const EliminarDietaxID = async (id, id_cli) => {
		try {
			setisLoading(false);
			const { data } = await PTApi.put(`/dieta/delete-dieta/${id}`);
			setisLoading(false);
			obtenerDietasxCliente(id_cli);
		} catch (error) {
			console.log(error);
		}
	};

	return {
		startRegisterDieta,
		obtenerDietasxCliente,
		EliminarDietaxID,
		isLoading,
	};
};
