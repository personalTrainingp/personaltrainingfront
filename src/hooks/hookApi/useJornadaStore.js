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
	const startRegisterJornada = async (formState, id_enterprice, observacion) => {
		try {
			const { data } = await PTApi.post(`/jornada/post-jornada/${id_enterprice}`, {
				formState,
				observacion,
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
			const { data } = await PTApi.get(`/jornada/obtener-jornadas/${598}`);
			// console.log(data, );
			dispatch(onSetDataView(ordenarJornadasxUID(data.jornadas)));

			// setIsLoading(false);
			// await obtenerArticulos(id_enterprice);
			// setmessage({ msg: data.msg, ok: data.ok });
		} catch (error) {
			console.log(error);
		}
	};
	return {
		startRegisterJornada,
		obtenerTablaJornada,
	};
};

const ordenarJornadasxUID = (d) => {
	return Object.values(
		d.reduce((acc, item) => {
			const uid = item.uid_jornada;

			if (!acc[uid]) {
				acc[uid] = {
					uid_jornada: uid,
					items: [],
				};
			}

			acc[uid].items.push(item);

			return acc;
		}, {})
	);
};
