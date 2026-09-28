import { PTApi } from '@/common';
import { useState } from 'react';

export const useEventosAsistenciaStore = () => {
	const [dataEventos, setdataEventos] = useState([]);
	const [dataHuelleros, setdataHuelleros] = useState([]);
	const [minutosOffline, setminutosOffline] = useState(3);
	const [isLoading, setisLoading] = useState(false);
	const [error, seterror] = useState('');
	const [dataPersonas, setdataPersonas] = useState([]);
	const [borradosPendientes, setborradosPendientes] = useState([]);
	const [estadoHuelleros, setestadoHuelleros] = useState({}); // SN -> 'online' | 'offline'
	const [isLoadingPersonas, setisLoadingPersonas] = useState(false);
	const [errorPersonas, seterrorPersonas] = useState('');

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

	// Personas registradas en los huelleros, con los dedos que tienen huella y si tienen
	// cambios pendientes de sincronizar. Con silencioso=true no muestra el "cargando" (auto-actualización).
	const obtenerPersonas = async (silencioso = false) => {
		try {
			if (!silencioso) setisLoadingPersonas(true);
			seterrorPersonas('');
			const { data } = await PTApi.get('/eventos-asistencia/personas');
			setdataPersonas(data.personas);
			setborradosPendientes(data.borradosPendientes || []);
			setestadoHuelleros(Object.fromEntries((data.huelleros || []).map((h) => [h.DeviceSN, h.estado])));
		} catch (error) {
			console.log(error);
			if (!silencioso) setdataPersonas([]);
			seterrorPersonas(error.response?.data?.msg || 'No se pudieron obtener las personas');
		} finally {
			if (!silencioso) setisLoadingPersonas(false);
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

	// Elimina la huella de un dedo en la BD y en los huelleros. Retorna { ok, msg, huelleros }
	const eliminarHuella = async (pin, dedo) => {
		try {
			const { data } = await PTApi.delete(`/eventos-asistencia/personas/${pin}/huellas/${dedo}`);
			return data;
		} catch (error) {
			console.log(error);
			return {
				ok: false,
				msg: error.response?.data?.msg || 'No se pudo eliminar la huella',
			};
		}
	};

	// Elimina a la persona y sus huellas en la BD y en los huelleros. Retorna { ok, msg, huelleros }
	const eliminarPersona = async (pin) => {
		try {
			const { data } = await PTApi.delete(`/eventos-asistencia/personas/${pin}`);
			return data;
		} catch (error) {
			console.log(error);
			return {
				ok: false,
				msg: error.response?.data?.msg || 'No se pudo eliminar la persona',
			};
		}
	};

	// Pide a los huelleros en línea todas sus personas y huellas para importarlas al sistema.
	// Retorna { ok, msg, solicitados, omitidos }
	const sincronizarHuelleros = async () => {
		try {
			const { data } = await PTApi.post('/eventos-asistencia/sincronizar');
			return data;
		} catch (error) {
			console.log(error);
			return {
				ok: false,
				msg: error.response?.data?.msg || 'No se pudo sincronizar con el huellero',
			};
		}
	};

	// Sistema -> huellero: reenvía la persona con sus huellas y acceso 24 h. Retorna { ok, msg, huellas, huelleros }
	const reenviarPersona = async (pin) => {
		try {
			const { data } = await PTApi.post(`/eventos-asistencia/personas/${pin}/reenviar`);
			return data;
		} catch (error) {
			console.log(error);
			return {
				ok: false,
				msg: error.response?.data?.msg || 'No se pudo reenviar la persona al huellero',
			};
		}
	};

	return {
		reenviarPersona,
		sincronizarHuelleros,
		obtenerEventosAsistencia,
		obtenerEstadoHuelleros,
		obtenerPersonas,
		agregarPersona,
		eliminarHuella,
		eliminarPersona,
		dataEventos,
		dataHuelleros,
		minutosOffline,
		isLoading,
		error,
		dataPersonas,
		borradosPendientes,
		estadoHuelleros,
		isLoadingPersonas,
		errorPersonas,
	};
};
