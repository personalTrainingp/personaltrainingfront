import { PTApi } from '@/common/api/';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export const useJornadaStore = () => {
	const dispatch = useDispatch();
	const [statusData, setstatus] = useState('');
	const [message, setmessage] = useState({ msg: '', ok: false });
	const [data, setdata] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const startRegisterJornada = async (formState, id_enterprice, LabelJornada) => {
		try {
			// setIsLoading(true);
			const { data: dataParametro } = await PTApi.post(
				'/parametros/post_param/empleado/jornada',
				{
					label_param: LabelJornada,
					sigla_param: '',
				}
			);

			const { data } = await PTApi.post(`/jornada/post-jornada/${id_enterprice}`, {
				formState,
				id_param: dataParametro.parametro.id_param,
			});
			// setIsLoading(false);
			// await obtenerArticulos(id_enterprice);
			// setmessage({ msg: data.msg, ok: data.ok });
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTablaJornada = async (id_empresa) => {
		try {
			// setIsLoading(true);
			const { data } = await PTApi.post(`/jornada/post-jornada/${id_enterprice}`, formState);
			// setIsLoading(false);
			// await obtenerArticulos(id_enterprice);
			// setmessage({ msg: data.msg, ok: data.ok });
		} catch (error) {
			console.log(error);
		}
	};
	return {
		startRegisterJornada,
	};
};
