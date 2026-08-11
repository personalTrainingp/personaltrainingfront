import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useDispatch } from 'react-redux';

export const useTcStore = () => {
	const dispatch = useDispatch();
	const postTc = async (formState, monedaDestino, monedaOrigen) => {
		try {
			const { data } = await PTApi.post(
				`/tipoCambio/${monedaOrigen}/${monedaDestino}`,
				formState
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTcs = async () => {
		try {
			const { data } = await PTApi.get(`/tipoCambio/`);
			dispatch(onSetDataView(data.tipoCambios));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		postTc,
		obtenerTcs,
	};
};
