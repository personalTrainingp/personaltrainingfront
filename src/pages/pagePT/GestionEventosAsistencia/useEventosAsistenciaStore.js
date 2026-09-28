import { PTApi } from '@/common';
import { useState } from 'react';

export const useEventosAsistenciaStore = () => {
	const [dataEventos, setdataEventos] = useState([]);
	const [dataHuelleros, setdataHuelleros] = useState([]);
	const [minutosOffline, setminutosOffline] = useState(3);
	const [isLoading, setisLoading] = useState(false);
	const [error, seterror] = useState('');

	// Marcaciones de los huelleros entre dos fechas (YYYY-MM-DD, hora de Perú)
	const obtenerEventosAsistencia = async (desde, hasta) => {
		try {
			setisLoading(true);
			seterror('');
			const { data } = await PTApi.get('/eventos-asistencia', {
				params: { desde, hasta },
			});
			setdataEventos(data.eventos);
		} catch (error) {
			console.log(error);
			setdataEventos([]);
			seterror(error.response?.data?.msg || 'No se pudieron obtener los eventos de asistencia');
		} finally {
			setisLoading(false);
		}
	};

	// Estado en línea / fuera de línea de cada huellero
	const obtenerEstadoHuelleros = async () => {
		try {
			const { data } = await PTApi.get('/eventos-asistencia/huelleros');
			setdataHuelleros(data.huelleros);
			setminutosOffline(data.minutosOffline);
		} catch (error) {
			console.log(error);
		}
	};

	// Alta manual: nombre + DNI + BinaryData (huella en base64). Retorna { ok, msg, huelleros }
	const agregarPersona = async (persona) => {
		try {
			const { data } = await PTApi.post('/eventos-asistencia/personas', persona);
			return data;
		} catch (error) {
			console.log(error);
			return {
				ok: false,
				msg: error.response?.data?.msg || 'No se pudo agregar la persona',
			};
		}
	};

	return {
		obtenerEventosAsistencia,
		obtenerEstadoHuelleros,
		agregarPersona,
		dataEventos,
		dataHuelleros,
		minutosOffline,
		isLoading,
		error,
	};
};
