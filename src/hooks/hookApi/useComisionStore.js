import { PTApi } from '@/common';

const useComisionStore = () => {
	const onRegisterComision = async (formState) => {
		const { data } = await PTApi.post('/comision/post-comision', formState);
	};
	const obtenerHistoricoComisiones = async () => {
		const { data } = await PTApi.get('/comision/get-historicos');
	};
	return {
		onRegisterComision,
		obtenerHistoricoComisiones,
	};
};

export default useComisionStore;
