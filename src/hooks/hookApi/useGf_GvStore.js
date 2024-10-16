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

export const useGf_GvStore = () => {
	const dispatch = useDispatch();
	const [gastoxID, setgastoxID] = useState({});
	const [ordenCompra, setOrdenCompra] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [isLoadingData, setisLoadingData] = useState(true);
	const [objetoToast, setobjetoToast] = useState({});
	const [dataGasto, setdataGasto] = useState([]);
	const obtenerProveedoresUnicos = async () => {
		try {
			const { data } = await PTApi.get('/egreso/get-proveedores-unicos');
			// console.log(data.proveedoresUnicos);
			dispatch(onSetProveedoresUnicosxGasto(data.proveedoresUnicos));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerNombreGastoUnicos = async () => {};
	const startRegistrarGastos = async (formState, id_enterprice) => {
		try {
			// setisLoadingData(true);
			const { data } = await PTApi.post('/egreso/post-egreso', {
				...formState,
				fec_registro: new Date(),
			});
			obtenerGastos(id_enterprice);
			Swal.fire({
				icon: 'success',
				title: 'GASTO REGISTRADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			localStorage.setItem('egreso_post_error', `${error.response.data}`);
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'OCURRIO UN PROBLEMA AL INGRESAR EL EGRESO',
				showConfirmButton: false,
				timer: 5000,
			});
		}
	};
	const startActualizarGastos = async (formState, id, id_enterprice) => {
		try {
			setisLoadingData(true);
			const { data } = await PTApi.put(`/egreso/put-egreso/${id}`, {
				...formState,
			});
			obtenerGastos(id_enterprice);
			setisLoadingData(false);
			Swal.fire({
				icon: 'success',
				title: 'GASTO ACTUALIZADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			localStorage.setItem('egreso_update_error', `${error.response.data}`);
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'OCURRIO UN PROBLEMA AL ACTUALIZAR EL EGRESO',
				showConfirmButton: false,
				timer: 5000,
			});
		}
	};
	const startDeleteGasto = async (id, id_enterprice) => {
		try {
			setisLoading(true);
			const { data } = await PTApi.put(`/egreso/delete-egreso/${id}`);
			await obtenerGastos(id_enterprice);
			setisLoading(false);
			Swal.fire({
				icon: 'success',
				title: 'GASTO ELIMINADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 1500,
			});
		} catch (error) {
			localStorage.setItem('egreso_delete_error', `${error.response.data}`);
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'OCURRIO UN PROBLEMA AL ELIMINAR EL EGRESO',
				showConfirmButton: false,
				timer: 5000,
			});
		}
	};
	const obtenerGastos = async (id_enterprice) => {
		try {
			setisLoadingData(true);
			console.log(id_enterprice);

			const { data } = await PTApi.get(`/egreso/get-egresos/${id_enterprice}`);
			dispatch(onSetGastos(data.gastos));
			setisLoadingData(false);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastoxID = async (id) => {
		try {
			setisLoading(true);
			const { data } = await PTApi.get(`/egreso/get-egreso/${id}`);
			const { data: dataParam } = await PTApi.get(
				`/parametros/get_param/param_gasto/${data.gasto.id_gasto}`
			);
			setisLoading(false);
			setgastoxID({ ...data.gasto, ...dataParam.paramGasto });
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerParametrosGastosFinanzas = async () => {
		try {
			let { data } = await PTApi.get(`/parametros/get_params/params-tb-finanzas`);

			dispatch(onSetDataView(data));
			data = data.reduce((acc, curr) => {
				let empresa = acc.find((e) => e.id_empresa === curr.id_empresa);
				if (!empresa) {
					empresa = {
						id_empresa: curr.id_empresa,
						tipo_gasto: [],
					};
					acc.push(empresa);
				}

				let tipoGasto = empresa.tipo_gasto.find(
					(tg) => tg.id_tipoGasto === curr.id_tipoGasto
				);
				if (!tipoGasto) {
					tipoGasto = {
						id_tipoGasto: curr.id_tipoGasto,
						grupos: [],
					};
					empresa.tipo_gasto.push(tipoGasto);
				}
				let grupo = tipoGasto.grupos.find((g) => g.label === curr.grupo);
				if (!grupo) {
					grupo = {
						label: curr.grupo,
						value: curr.grupo,
						conceptos: [],
					};
					tipoGasto.grupos.push(grupo);
				}
				grupo.conceptos.push({
					label: curr.nombre_gasto,
					value: curr.id,
				});
				return acc;
			}, []);
			dispatch(onSetParametrosGastos(data));
		} catch (error) {
			console.log('Error en useProductoStore', error);
		}
	};

	const obtenerGastosPorFecha = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-egresos', {
				params: {
					arrayDate,
				},
			});
			setdataGasto(data.reporte);
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerOrdenCompra = async (id_enterprice) => {
		try {
			setisLoadingData(true);

			const { data } = await PTApi.get(`/egreso/orden-compra/${id_enterprice}`);
			console.log(data);

			setOrdenCompra(data.gastos);
			setisLoadingData(false);
		} catch (error) {
			console.log(error);
		}
	};

	return {
		obtenerParametrosGastosFinanzas,
		startRegistrarGastos,
		obtenerGastos,
		obtenerGastoxID,
		obtenerProveedoresUnicos,
		obtenerNombreGastoUnicos,
		startActualizarGastos,
		startDeleteGasto,
		obtenerGastosPorFecha,
		obtenerOrdenCompra,
		dataGasto,
		ordenCompra,
		isLoadingData,
		setgastoxID,
		gastoxID,
		isLoading,
		objetoToast,
	};
};

// const obtenerGastosFijos = async () => {
// 	try {
// 		const { data } = await PTApi.get('/params_GF_vs_GV/get_gfs');
// 		dispatch(getGastosFijo(data));
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
// const startRegistrarGastoFijo = async ({ sigla_gf, nombre_gf, diaPago_gf }) => {
// 	try {
// 		const { data } = await PTApi.post('/params_GF_vs_GV/post_gf', {
// 			sigla_gf,
// 			nombre_gf,
// 			diaPago_gf,
// 		});
// 		obtenerGastosFijos();
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
// const obtenerGastoFijo = async (id_gf) => {
// 	try {
// 		const { data } = await PTApi.get(`/params_GF_vs_GV/get_gf/${id_gf}`);
// 		dispatch(onRegisterGastoFijo(data));
// 	} catch (error) {
// 		console.log('Error en useProductoStore', error);
// 	}
// };
// const startUpdateGastoFijo = async ({ id_gf, sigla_gf, nombre_gf, diaPago_gf }) => {
// 	try {
// 		const { data } = await PTApi.put(`/params_GF_vs_GV/put_gf/${id_gf}`, {
// 			sigla_gf,
// 			nombre_gf,
// 			diaPago_gf,
// 		});
// 		obtenerGastosFijos();
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
// const startDeleteGastoFijo = async (id_gf) => {
// 	try {
// 		const { data } = await PTApi.put(`/params_GF_vs_GV/delete_gf/${id_gf}`);
// 		obtenerGastosFijos();
// 	} catch (error) {
// 		console.log('Error en useProductoStore', error);
// 	}
// };

// const obtenerGastosVariables = async () => {
// 	try {
// 		const { data } = await PTApi.get('/params_GF_vs_GV/get_gvs');
// 		dispatch(getGastosVariable(data));
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
// const startRegistrarGastoVariable = async ({ sigla_gf, nombre_gf }) => {
// 	try {
// 		const { data } = await PTApi.post('/params_GF_vs_GV/post_gv', {
// 			sigla_gf,
// 			nombre_gf,
// 		});
// 		obtenerGastosVariables();
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
// const obtenerGastoVariable = async (id_gv) => {
// 	try {
// 		const { data } = await PTApi.get(`/params_GF_vs_GV/get_gv/${id_gv}`);
// 		dispatch(onRegisterGastoVariable(data));
// 	} catch (error) {
// 		console.log('Error en useProductoStore', error);
// 	}
// };
// const startUpdateGastoVariable = async ({ id_gv, sigla_gv, nombre_gv }) => {
// 	try {
// 		const { data } = await PTApi.put(`/params_GF_vs_GV/put_gv/${id_gv}`, {
// 			nombre_gv,
// 			sigla_gv,
// 		});
// 		obtenerGastosVariables();
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
// const startDeleteGastoVariable = async (id_gv) => {
// 	try {
// 		const { data } = await PTApi.put(`/params_GF_vs_GV/delete_gv/${id_gv}`);
// 		obtenerGastosVariables();
// 	} catch (error) {
// 		console.log('Error en useProductoStore', error);
// 	}
// };
