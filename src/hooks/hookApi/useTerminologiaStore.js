import { PTApi } from '@/common/api/';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useTerminologiaStore = () => {
	let dispatch = useDispatch();
	const [terminologiaPorId, setTerminologiaPorId] = useState({});
	const [dataTerminologiaPorEntidad, SetData] = useState({});
	const terminologiaPorEntidad = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/terminologia/terminologiaxEmpresa/${id_empresa}`);
			dispatch(onSetDataView(data.termGastos));
			// console.log({
			// 	...response.data.response,
			// 	articulosLugar: response.data.response.parametros
			// 		.filter((f) => f.entidad_param === 'articulo')[0]
			// 		.parametros.filter((f) => f.grupo_param === 'lugar_encuentro'),
			// 	// .parametros.filter((g) => g.grupo_param === 'lugar_encuentro'),
			// });

			//SetData(response.data.response);
		} catch (error) {
			console.log(error.message);
		}
	};

	const registrarTerminologia = async (parametro) => {
		try {
			const response = await PTApi.post('/parametros/postRegistrar', parametro);
			terminologiaPorEntidad();
			console.log(response);
		} catch (error) {
			console.log(error.message);
		}
	};

	const actualizarTerminologia = async (parametroPorEnviar) => {
		try {
			const response = await PTApi.post('/parametros/postActualizar', parametroPorEnviar);
			terminologiaPorEntidad();
			console.log(response);
		} catch (error) {
			console.log(error.message);
		}
	};

	const EliminarTerminologia = async (parametroPorEnviar) => {
		try {
			const response = await PTApi.post('/parametros/postEliminar', parametroPorEnviar);
			terminologiaPorEntidad();
			console.log(response);
		} catch (error) {
			console.log(error.message);
		}
	};

	const EliminarTerminologiaGasto = async (parametroGasto) => {
		try {
			const response = await PTApi.post(
				`/parametroGasto/eliminar-parametro-gasto`,
				parametroGasto
			);
			terminologiaPorEntidad();
			console.log(response);
		} catch (error) {
			console.log(error.message);
		}
	};

	const registrarTerminologiaGasto = async (parametroGasto) => {
		try {
			const response = await PTApi.post(
				'/parametroGasto/registrar-parametro-gasto',
				parametroGasto
			);
			terminologiaPorEntidad();
			console.log(response);
		} catch (error) {
			console.log(error.message);
		}
	};

	const actualizarTerminologiaGasto = async (ParametroGasto) => {
		try {
			const response = await PTApi.post(
				`/parametroGasto/actualizar-parametro-gasto`,
				ParametroGasto
			);
			terminologiaPorEntidad();
			console.log(response);
		} catch (error) {
			console.log(error.message);
		}
	};

	return {
		terminologiaPorEntidad,
		dataTerminologiaPorEntidad,
		registrarTerminologia,
		terminologiaPorId,
		setTerminologiaPorId,
		actualizarTerminologia,
		EliminarTerminologia,
		EliminarTerminologiaGasto,
		registrarTerminologiaGasto,
		actualizarTerminologiaGasto,
	};
};
