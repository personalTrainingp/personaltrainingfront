import { PTApi } from '@/common';
import { useState } from 'react';
import config from '@/config';

const CONTAINER = 'calendario-marketing';
export const soloFecha = (f) => (f ? String(f).slice(0, 10) : f);
const esArchivoImagen = (file) => (file?.type ?? '').startsWith('image/');
// fotos (uid_images) y documentos (uid_file) del evento en una sola lista
export const archivosDelEvento = (ev) => [...(ev?.imagenes ?? []), ...(ev?.archivos ?? [])];
export const urlArchivo = (img) => `${config.API_IMG.CALENDARIO_MARKETING}${img.name_image}`;

export const useCalendarioMarketing = () => {
	const [dataCalendario, setDataCalendario] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const obtenerCalendario = async (id_empresa) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.get(`/calendario-marketing/empresa/${id_empresa}`);
			// MSSQL devuelve los DATE como "2026-11-11T00:00:00.000Z": nos quedamos solo con "YYYY-MM-DD"
			// (si no, el input date no lo acepta y dayjs lo pasa a hora Peru y resta un dia)
			setDataCalendario(
				(data.calendario ?? []).map((d) => ({
					...d,
					fecha_inicio: soloFecha(d.fecha_inicio),
					fecha_fin: soloFecha(d.fecha_fin),
				}))
			);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	// fotos -> tb_image con uid_location = uid_images; documentos -> uid_location = uid_file
	const subirArchivos = async ({ uid_file, uid_images }, files = []) => {
		for (const file of files) {
			const formData = new FormData();
			formData.append('file', file);
			const uid = esArchivoImagen(file) ? uid_images : uid_file;
			await PTApi.post(`/storage/blob/create/${uid}?container=${CONTAINER}`, formData);
		}
	};

	const postCalendario = async (formState, files, id_empresa) => {
		try {
			const { data } = await PTApi.post(`/calendario-marketing/empresa/${id_empresa}`, formState);
			await subirArchivos(data, files);
			await obtenerCalendario(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};

	const updateCalendario = async (id, formState, files, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/calendario-marketing/id/${id}`, formState);
			await subirArchivos(data, files);
			await obtenerCalendario(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteCalendario = async (id, id_empresa) => {
		try {
			await PTApi.put(`/calendario-marketing/delete/${id}`);
			await obtenerCalendario(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteArchivo = async (id_image, id_empresa) => {
		try {
			await PTApi.put(`/calendario-marketing/archivo/delete/${id_image}`);
			await obtenerCalendario(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};

	return {
		dataCalendario,
		isLoading,
		obtenerCalendario,
		postCalendario,
		updateCalendario,
		deleteCalendario,
		deleteArchivo,
	};
};
