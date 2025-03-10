import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useDispatch } from 'react-redux';

export const useGeneradorFechasStore = () => {
	const dispatch = useDispatch();
	const obtenerFechasInventarioxEmpresa = async (id_empresa, entidad) => {
		try {
			const { data } = await PTApi.get(
				`/generador-fechas/get-fechas/${entidad}/${id_empresa}`
			);
			dispatch(onSetDataView(data.dataFechas));
		} catch (error) {
			console.log(error);
		}
	};
	const removerFechasInventario = async () => {
		try {
			const { data } = PTApi.put();
		} catch (error) {
			console.log(error);
		}
	};
	const registrarFechasInventarioxEmpresa = async (id_empresa, formState) => {
		try {
			const { data } = PTApi.post(
				`/generador-fechas/post-generador-fechas/inventario/${id_empresa}`,
				formState
			);
			await obtenerFechasInventarioxEmpresa(598, 'inventario');
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerFechasInventarioxEmpresa,
		registrarFechasInventarioxEmpresa,
		removerFechasInventario,
	};
};
