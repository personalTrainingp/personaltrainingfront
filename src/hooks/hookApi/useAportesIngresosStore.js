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
import Swal from 'sweetalert2';

export const useAportesIngresosStore = () => {
	const dispatch = useDispatch();
	const [aportexID, setaportexID] = useState({});
	const [isLoading, setisLoading] = useState(false);
	const [dataAportes, setdataAportes] = useState([]);
	const obtenerAportexID = async (id) => {
		try {
			const { data } = await PTApi.get(`/aporte/get-aporte/${id}`);
			console.log(data);
			setaportexID(data.aporte);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerAportesPorFechas = async (arrayDate) => {
		try {
			const { data } = await PTApi.get(`/aporte/get-aportes-fecha`, {
				params: {
					dateRanges: arrayDate,
				},
			});
			setdataAportes(data.aportes);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerAportes = async () => {
		try {
			dispatch(onSetDataView([]));
			setisLoading(true);
			const { data } = await PTApi.get('/aporte/get-aportes');
			dispatch(onSetDataView(data.aportes));
			setisLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const startRegistrarAportes = async (formState) => {
		try {
			const { data } = await PTApi.post('/aporte/post-aporte', {
				...formState,
			});
			obtenerAportes();
			Swal.fire({
				icon: 'success',
				title: 'APORTE REGISTRADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			localStorage.setItem('APORTE_post_error', `${error.response.data}`);
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'OCURRIO UN PROBLEMA AL INGRESAR EL APORTE',
				showConfirmButton: false,
				timer: 5000,
			});
		}
	};
	const startActualizarAportes = async (formState, id) => {
		try {
			const { data } = await PTApi.put(`/egreso/put-aporte/${id}`, {
				...formState,
			});
			await obtenerAportes();
			Swal.fire({
				icon: 'success',
				title: 'APORTE REGISTRADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			localStorage.setItem('aporte_update_error', `${error.response.data}`);
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'OCURRIO UN PROBLEMA AL ACTUALIZAR EL APORTE',
				showConfirmButton: false,
				timer: 5000,
			});
		}
	};
	const startDeleteAportes = async (id) => {
		try {
			setisLoading(true);
			const { data } = await PTApi.put(`/egreso/delete-aporte/${id}`);
			setisLoading(false);
			await obtenerAportes();
			Swal.fire({
				icon: 'success',
				title: 'GASTO ELIMINADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 1500,
			});
		} catch (error) {
			localStorage.setItem('aportes_delete_error', `${error.response.data}`);
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'OCURRIO UN PROBLEMA AL ELIMINAR EL APORTE',
				showConfirmButton: false,
				timer: 5000,
			});
		}
	};
	return {
		obtenerAportesPorFechas,
		startRegistrarAportes,
		obtenerAportes,
		startActualizarAportes,
		startDeleteAportes,
		obtenerAportexID,
		dataAportes,
		aportexID,
		isLoading,
	};
};
