import { PTApi } from '@/common';
import { useState } from 'react';

const URL_BASE = '/recursosHumanos/tiempos-especiales';

// Permisos, tardanzas, horas extras y salidas tempranas de un colaborador (tabla rrhh_tiemposEspeciales)
export const useTiemposEspecialesStore = (entidad, id_empresa, id_colaborador) => {
	const [registros, setregistros] = useState([]);
	const [cargando, setcargando] = useState(true);
	const [error, seterror] = useState('');

	const obtenerRegistros = async () => {
		setcargando(true);
		try {
			const { data } = await PTApi.get(`${URL_BASE}/${id_empresa}/${entidad}`, {
				params: { id_colaborador },
			});
			setregistros(data.tiempoEspeciales);
			seterror('');
		} catch (err) {
			console.log(err);
			seterror('No se pudieron cargar los registros.');
		} finally {
			setcargando(false);
		}
	};

	// Si falla, lanza el error para que el formulario siga abierto y lo muestre
	const guardarRegistro = async (id, datos) => {
		if (id) {
			await PTApi.put(`${URL_BASE}/${id}`, datos);
		} else {
			await PTApi.post(`${URL_BASE}/${id_empresa}/${entidad}`, { ...datos, id_colaborador });
		}
		await obtenerRegistros();
	};

	const eliminarRegistro = async (id) => {
		try {
			await PTApi.put(`${URL_BASE}/delete/${id}`);
			await obtenerRegistros();
		} catch (err) {
			console.log(err);
			seterror('No se pudo eliminar el registro.');
		}
	};

	return { registros, cargando, error, obtenerRegistros, guardarRegistro, eliminarRegistro };
};
