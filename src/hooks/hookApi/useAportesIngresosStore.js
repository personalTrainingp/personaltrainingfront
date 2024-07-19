import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import {
	onSetGastos,
	onSetParametrosGastos,
	onSetProveedoresUnicosxGasto,
} from '@/store/dataGastos/gastosSlice';
import {
	getGastosFijo,
	getGastosVariable,
	onRegisterGastoFijo,
	onRegisterGastoVariable,
} from '@/store/gfGv/gfGvSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useAportesIngresosStore = () => {
	const dispatch = useDispatch();
	const [aportexID, setaportexID] = useState({});
	const [isLoading, setisLoading] = useState(false);
	const obtenerAportexID = async (id) => {
		try {
			const { data } = await PTApi.get(`/aporte/get-aporte/${id}`);
			console.log(data);
			setaportexID(data.aporte);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerAportes = async () => {
		try {
			const { data } = await PTApi.get('/aporte/get-aportes');
			dispatch(onSetDataView(data.aportes));
		} catch (error) {
			console.log(error);
		}
	};
	const startRegistrarAportes = async (formState) => {
		try {
			const { data } = await PTApi.post('/aporte/post-aporte', {
				...formState,
			});
			console.log(data);
			obtenerAportes();
		} catch (error) {
			console.log(error);
		}
	};
	const startActualizarAportes = async (formState, id) => {
		try {
			const { data } = await PTApi.put(`/egreso/put-aporte/${id}`, {
				...formState,
			});
			obtenerAportes();
		} catch (error) {
			console.log(error);
		}
	};
	const startDeleteAportes = async (id) => {
		try {
			setisLoading(true);
			const { data } = await PTApi.put(`/egreso/delete-aporte/${id}`);
			setisLoading(false);
			obtenerAportes();
		} catch (error) {
			console.log(error);
		}
	};
	return {
		startRegistrarAportes,
		obtenerAportes,
		startActualizarAportes,
		startDeleteAportes,
		obtenerAportexID,
		aportexID,
		isLoading,
	};
};
