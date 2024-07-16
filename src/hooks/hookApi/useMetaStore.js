import { PTApi } from '@/common';
import { onGetMetas } from '@/store/uiMeta/metaSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useMetaStore = () => {
	const dispatch = useDispatch();
	const [DataAsesorxMeta, setDataAsesorxMeta] = useState([]);
	const [dataMeta, setdataMeta] = useState({});
	const [isLoading, setisLoading] = useState(false);
	const startRegistrarMeta = async (formState) => {
		try {
			const { data } = await PTApi.post('/meta/post_meta', formState);
			console.log(data);
			obtenerMetas();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMetas = async () => {
		try {
			const { data } = await PTApi.get('/meta/getMetas');
			dispatch(onGetMetas(data.metas));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMeta = async (id) => {
		try {
			setisLoading(true);
			const { data } = await PTApi.get(`/meta/getOneMeta/${id}`);
			setdataMeta(data.meta);
			setisLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterMetaAsesor = async (id_meta, formState) => {
		console.log(formState, id_meta);
		try {
			const { data } = await PTApi.post(`/meta/meta_asesor/post_meta/${id_meta}`, formState);
			// console.log(data);
			// obtenerMetas();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMetasAsesorxMetas = async (id_meta) => {
		try {
			const { data } = await PTApi.get(`/meta/meta_asesor/get_metas_asesor/${id_meta}`);
			setDataAsesorxMeta(data.metavsAsesor);
		} catch (error) {
			console.log(error);
		}
	};

	return {
		obtenerMeta,
		obtenerMetas,
		startRegistrarMeta,
		obtenerMetasAsesorxMetas,
		startRegisterMetaAsesor,
		isLoading,
		DataAsesorxMeta,
		dataMeta,
	};
};
