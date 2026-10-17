import { PTApi } from '@/common';
import { useState } from 'react';

const msgError = (error, msg) => error.response?.data?.msg || msg;

export const useMetasStore = () => {
	const [dataMetas, setdataMetas] = useState([]);
	const [dataAsesores, setdataAsesores] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [error, seterror] = useState('');

	// Metas mensuales del año, cada una con sus asesores y el total asignado
	const obtenerMetas = async (anio) => {
		try {
			setisLoading(true);
			seterror('');
			const { data } = await PTApi.get('/meta/getMetas', { params: { anio } });
			setdataMetas(data.metas);
		} catch (error) {
			console.log(error);
			setdataMetas([]);
			seterror(msgError(error, 'No se pudieron obtener las metas'));
		} finally {
			setisLoading(false);
		}
	};

	// Asesores fitness activos de la empresa 598
	const obtenerAsesores = async () => {
		try {
			const { data } = await PTApi.get('/parametros/get_params/empleados/2/598');
			setdataAsesores(data);
		} catch (error) {
			console.log(error);
		}
	};

	// Las funciones de guardado retornan { ok, msg }
	const guardarMeta = async (id_meta, meta) => {
		try {
			const { data } = id_meta
				? await PTApi.put(`/meta/update_meta/${id_meta}`, meta)
				: await PTApi.post('/meta/post_meta', meta);
			return data;
		} catch (error) {
			console.log(error);
			return { ok: false, msg: msgError(error, 'No se pudo guardar la meta') };
		}
	};
	const eliminarMeta = async (id_meta) => {
		try {
			const { data } = await PTApi.put(`/meta/delete_meta/${id_meta}`);
			return data;
		} catch (error) {
			console.log(error);
			return { ok: false, msg: msgError(error, 'No se pudo eliminar la meta') };
		}
	};
	const guardarMetaAsesor = async (id_meta, metaAsesor) => {
		try {
			const { data } = await PTApi.post(`/meta/meta_asesor/post_meta/${id_meta}`, metaAsesor);
			return data;
		} catch (error) {
			console.log(error);
			return { ok: false, msg: msgError(error, 'No se pudo guardar la meta del asesor') };
		}
	};
	const eliminarMetaAsesor = async (id) => {
		try {
			const { data } = await PTApi.delete(`/meta/meta_asesor/remove_meta_asesor/${id}`);
			return data;
		} catch (error) {
			console.log(error);
			return { ok: false, msg: msgError(error, 'No se pudo quitar el asesor') };
		}
	};

	return {
		dataMetas,
		dataAsesores,
		isLoading,
		error,
		obtenerMetas,
		obtenerAsesores,
		guardarMeta,
		eliminarMeta,
		guardarMetaAsesor,
		eliminarMetaAsesor,
	};
};
