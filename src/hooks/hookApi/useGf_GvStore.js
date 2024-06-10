import { PTApi } from '@/common';
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

export const useGf_GvStore = () => {
	const dispatch = useDispatch();
	const [gastoxID, setgastoxID] = useState({});
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
	const startRegistrarGastos = async (formState) => {
		try {
			const { data } = await PTApi.post('/egreso/post-egreso', {
				...formState,
				fec_registro: new Date(),
			});
			obtenerGastos();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastos = async () => {
		try {
			const { data } = await PTApi.get('/egreso/get-egresos');
			console.log(data);
			dispatch(onSetGastos(data.gastos));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/egreso/get-egreso/${id}`);
			const { data: dataParam } = await PTApi.get(
				`/parametros/get_param/param_gasto/${data.gasto.id_gasto}`
			);
			setgastoxID({ ...data.gasto, ...dataParam.paramGasto });
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerParametrosGastosFinanzas = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/params-tb-finanzas`);
			dispatch(onSetParametrosGastos(data));
		} catch (error) {
			console.log('Error en useProductoStore', error);
		}
	};

	return {
		obtenerParametrosGastosFinanzas,
		startRegistrarGastos,
		obtenerGastos,
		obtenerGastoxID,
		obtenerProveedoresUnicos,
		obtenerNombreGastoUnicos,
		gastoxID,
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
