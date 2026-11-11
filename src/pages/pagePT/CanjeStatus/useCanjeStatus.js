import { PTApi } from '@/common';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { arrayTipoCliente } from '@/types/type';

export const TIPOS_PUBLICACION = [
	{ value: 1, label: 'REEL' },
	{ value: 2, label: 'HISTORIA' },
];
export const labelTipo = (id) => TIPOS_PUBLICACION.find((t) => t.value === id)?.label ?? '';
// agrega https:// si el link se guardó sin protocolo, para que abra como URL externa
export const urlExterna = (link) => {
	const l = (link ?? '').trim();
	if (!l) return null;
	return /^https?:\/\//i.test(l) ? l : `https://${l}`;
};
// tipo de socio (tb_cliente.tipoCli_cli); incluye los tipos antiguos que ya no se ofrecen en el formulario de clientes
const TIPOS_SOCIO_ANTIGUOS = [
	{ label: 'canje - influencer moda', value: 221 },
	{ label: 'canje - influencer educacion', value: 222 },
	{ label: 'canje - artista', value: 223 },
	{ label: 'canje - maratonista', value: 224 },
	{ label: 'canje - modelo', value: 225 },
	{ label: 'canje - actor', value: 226 },
	{ label: 'canje - influencer', value: 227 },
	{ label: 'canje - contacto LA', value: 228 },
];
// solo los socios "canje influencer" tienen link de perfil
export const TIPO_CANJE_INFLUENCER = 266;
export const esCanjeInfluencer = (tipoCli) => Number(tipoCli) === TIPO_CANJE_INFLUENCER;
export const labelTipoSocio = (id) =>
	[...arrayTipoCliente, ...TIPOS_SOCIO_ANTIGUOS].find((t) => t.value === Number(id))?.label?.toUpperCase() ?? '';
export const nombreCliente = (c) =>
	c ? `${c.nombre_cli ?? ''} ${c.apPaterno_cli ?? ''} ${c.apMaterno_cli ?? ''}`.trim() : '';

const mostrarError = (error) => {
	console.log(error);
	Swal.fire({
		icon: 'error',
		title: error?.response?.data?.msg ?? 'Ocurrió un error',
		timer: 4000,
		showConfirmButton: false,
	});
};

export const useCanjeStatus = (id_empresa) => {
	const [dataStatus, setDataStatus] = useState([]);
	const [dataPublicaciones, setDataPublicaciones] = useState([]);
	const [dataClientes, setDataClientes] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const obtenerStatus = async () => {
		try {
			const { data } = await PTApi.get(`/canje-marketing/canje-status/empresa/${id_empresa}`);
			setDataStatus(data.canjeStatus);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerPublicaciones = async () => {
		try {
			const { data } = await PTApi.get(`/canje-marketing/publicaciones-canje/empresa/${id_empresa}`);
			// MSSQL devuelve DATE como ISO con hora: se deja solo "YYYY-MM-DD"
			setDataPublicaciones((data.publicaciones ?? []).map((p) => ({ ...p, fecha: p.fecha ? String(p.fecha).slice(0, 10) : p.fecha })));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerClientes = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/clientes/clientes/${id_empresa}`);
			setDataClientes(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTodo = async () => {
		setIsLoading(true);
		await Promise.all([obtenerStatus(), obtenerPublicaciones(), obtenerClientes()]);
		setIsLoading(false);
	};

	// devuelven true si se guardó bien
	const guardarStatus = async (id, formState) => {
		try {
			if (id) await PTApi.put(`/canje-marketing/canje-status/id/${id}`, formState);
			else await PTApi.post(`/canje-marketing/canje-status/empresa/${id_empresa}`, formState);
			await obtenerStatus();
			return true;
		} catch (error) {
			mostrarError(error);
			return false;
		}
	};
	const eliminarStatus = async (id) => {
		try {
			await PTApi.put(`/canje-marketing/canje-status/delete/${id}`);
			await obtenerStatus();
		} catch (error) {
			mostrarError(error);
		}
	};

	const guardarPublicacion = async (id, formState) => {
		try {
			if (id) await PTApi.put(`/canje-marketing/publicaciones-canje/id/${id}`, formState);
			else await PTApi.post(`/canje-marketing/publicaciones-canje/empresa/${id_empresa}`, formState);
			await obtenerPublicaciones();
			return true;
		} catch (error) {
			mostrarError(error);
			return false;
		}
	};
	const eliminarPublicacion = async (id) => {
		try {
			await PTApi.put(`/canje-marketing/publicaciones-canje/delete/${id}`);
			await obtenerPublicaciones();
		} catch (error) {
			mostrarError(error);
		}
	};

	return {
		dataStatus,
		dataPublicaciones,
		dataClientes,
		isLoading,
		obtenerTodo,
		guardarStatus,
		eliminarStatus,
		guardarPublicacion,
		eliminarPublicacion,
	};
};
