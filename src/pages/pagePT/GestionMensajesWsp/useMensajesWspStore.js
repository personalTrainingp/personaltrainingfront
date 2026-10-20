import { PTApi } from '@/common';
import { useState } from 'react';

const msgError = (error, msg) => error.response?.data?.msg || msg;

export const useMensajesWspStore = () => {
	const [dataChats, setdataChats] = useState([]);
	const [dataMensajes, setdataMensajes] = useState([]);
	const [hayMas, sethayMas] = useState(false);
	const [isLoadingChats, setisLoadingChats] = useState(false);
	const [isLoadingMensajes, setisLoadingMensajes] = useState(false);
	const [error, seterror] = useState('');

	// Conversaciones con su ultimo mensaje; silencioso = refresco sin spinner
	const obtenerChats = async (busqueda, silencioso = false) => {
		try {
			if (!silencioso) setisLoadingChats(true);
			seterror('');
			const { data } = await PTApi.get('/wsp/chats', { params: { busqueda } });
			setdataChats(data.chats);
		} catch (error) {
			console.log(error);
			seterror(msgError(error, 'No se pudieron obtener los chats'));
		} finally {
			setisLoadingChats(false);
		}
	};

	// Ultimos mensajes del chat
	const obtenerMensajes = async (chat, silencioso = false) => {
		try {
			if (!silencioso) setisLoadingMensajes(true);
			seterror('');
			const { data } = await PTApi.get(`/wsp/mensajes/${encodeURIComponent(chat)}`);
			setdataMensajes(data.mensajes);
			sethayMas(data.hayMas);
		} catch (error) {
			console.log(error);
			seterror(msgError(error, 'No se pudieron obtener los mensajes'));
		} finally {
			setisLoadingMensajes(false);
		}
	};

	// Mensajes anteriores al primero que se esta mostrando
	const obtenerMensajesAnteriores = async (chat) => {
		if (!dataMensajes.length) return;
		try {
			const { data } = await PTApi.get(`/wsp/mensajes/${encodeURIComponent(chat)}`, {
				params: { antesDe: dataMensajes[0].id },
			});
			setdataMensajes((prev) => [...data.mensajes, ...prev]);
			sethayMas(data.hayMas);
		} catch (error) {
			console.log(error);
			seterror(msgError(error, 'No se pudieron obtener los mensajes anteriores'));
		}
	};

	// El usuario conectado toma el chat como su lead; retorna { ok, msg, gestionadoPor }
	const agregarAMiLead = async (chat) => {
		try {
			const { data } = await PTApi.put(`/wsp/chats/${encodeURIComponent(chat)}/gestionar`);
			setdataChats((prev) => prev.map((c) => (c.chat === chat ? { ...c, gestionadoPor: data.gestionadoPor } : c)));
			return data;
		} catch (error) {
			console.log(error);
			return { ok: false, msg: msgError(error, 'No se pudo agregar a tu lead') };
		}
	};

	return {
		dataChats,
		dataMensajes,
		hayMas,
		isLoadingChats,
		isLoadingMensajes,
		error,
		obtenerChats,
		obtenerMensajes,
		obtenerMensajesAnteriores,
		agregarAMiLead,
	};
};
