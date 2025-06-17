import { PTApi } from '@/common/api/';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useTerminologiaStore = () => {
	let dispatch = useDispatch();
	const [terminologiaPorId, setTerminologiaPorId] = useState({});
	const [dataTerminologiaPorEntidad, SetData] = useState({});

	const PostFechasPeriodo = async (entidad, grupo, formState) => {
		try {
			const { data } = PTApi.post(
				`/parametros/post-parametros-periodo/${entidad}/${grupo}`,
				formState
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerFechasPeriodo = async (entidad, grupo) => {
		try {
			const { data } = PTApi.get(`/parametros/get_params_periodo/${entidad}/${grupo}`);
		} catch (error) {
			console.log(error);
		}
	};

	const terminologiaPorEntidad = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/terminologia/terminologiaxEmpresa/${id_empresa}`);

			const terminologiaGastos = data.termGastos.map((d) => {
				return {
					id_tipoGasto: d.id_tipoGasto,
					nombre_gasto: d.nombre_gasto,
					orden: d.orden || '',
					id_grupo: d.parametro_grupo?.id || d.parametro_grupo?.id,
					grupo:
						d.parametro_grupo?.param_label ||
						` ${d.parametro_grupo?.param_label} | ${d.grupo}`,
					id: d.id,
				};
			});
			dispatch(onSetDataView(terminologiaGastos));
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
			console.log({ parametroPorEnviar });

			const response = await PTApi.post('/parametros/postActualizar', parametroPorEnviar);
			terminologiaPorEntidad(parametroPorEnviar.id_empresa);
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

	const EliminarTerminologiaGasto = async (id, id_empresa) => {
		try {
			const response = await PTApi.put(`/parametroGasto/eliminar-parametro-gasto/${id}`);
			terminologiaPorEntidad(id_empresa);
			console.log(response);
		} catch (error) {
			console.log(error.message);
		}
	};

	const registrarTerminologiaGasto = async (parametroGasto) => {
		try {
			// console.log(parametroGasto);
			const response = await PTApi.post(
				'/parametroGasto/registrar-parametro-gasto',
				parametroGasto
			);
			await terminologiaPorEntidad(parametroGasto.id_empresa);
			console.log(response);
		} catch (error) {
			console.log(error.message);
		}
	};

	const actualizarTerminologiaGasto = async (ParametroGasto) => {
		try {
			const response = await PTApi.put(
				`/parametroGasto/actualizar-parametro-gasto`,
				ParametroGasto
			);
			terminologiaPorEntidad(ParametroGasto.id_empresa);
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
		PostFechasPeriodo,
		obtenerFechasPeriodo,
	};
};
