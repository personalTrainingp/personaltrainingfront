import { PTApi } from '@/common';
import { onGetMetas } from '@/store/uiMeta/metaSlice';
import { onSetHistorialClinico, onSetNutricionDIETA } from '@/store/usuario/usuarioClienteSlice';
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

	const startRegisterClinico = async (formState, formStateAp, formData, id_cli) => {
		try {
			const { data: dataClinico } = await PTApi.post(`/dieta/post-clinico/${id_cli}`, {
				formState,
			});
			const { data: clinico } = await PTApi.post(
				`/storage/blob/create/${dataClinico.uid_FILE}?container=nutricion-historialclinico`,
				formData
			);
			const keysWithTrue = Object.keys(formStateAp)
				.filter((key) => formStateAp[key]) // Filtrar solo los que son `true`
				.map((key) => parseInt(key.replace('PAT', ''))); // Extraer el número y convertirlo a entero
			await keysWithTrue.forEach(async (f) => {
				const { data: dataAntPenales } = await PTApi.post(
					`/parametros/post-param-3/ANT-PAT`,
					{
						id_1: dataClinico.id_hist_clinico,
						id_2: f,
						id_3: 0,
					}
				);
			});
			await obtenerHistClinico(id_cli);
		} catch (error) {
			console.log(error);
		}

		// console.log(formState, formStateAp, formData, id_cli);
		// const { } = await PTApi.
	};

	const obtenerHistClinico = async (id_cli) => {
		try {
			const { data } = await PTApi.get(`/dieta/get-h-clinico/${id_cli}`);

			dispatch(onSetHistorialClinico(data?.HcxCliente));
		} catch (error) {
			console.log(error);
		}
	};

	return {
		startRegisterDieta,
		obtenerDietasxCliente,
		EliminarDietaxID,
		startRegisterClinico,
		obtenerHistClinico,
		isLoading,
	};
};
