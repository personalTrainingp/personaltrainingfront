import { useDispatch } from 'react-redux';

export const usePlanillaStore = () => {
	const dispatch = useDispatch();
	const obtenerSemana = async (id_empresa) => {
		try {

		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerLeads: obtenerSemana,
	};
};
