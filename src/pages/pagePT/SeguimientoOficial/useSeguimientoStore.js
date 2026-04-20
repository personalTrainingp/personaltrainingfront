import { PTApi } from '@/common';
import { useState } from 'react';

export const useSeguimientoStore = () => {
	const [dataSeguimientoxFecha, setdataSeguimientoxFecha] = useState([]);
	const obtenerSeguimientoxFecha = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/seguimiento/xcliente');
			console.log({
				data: data.dataSeguimiento
					.filter((f) => f.id_cli === 6934)[0]
					.cli_seguimiento.sort((a, b) => b.id_membresia - a.id_membresia),
			});
			const dataAlter = data.dataSeguimiento.map((m) => {
				return {
					nombres_cli: m.nombre_cli,
					apPaterno_cli: m.apPaterno_cli,
					apMaterno_cli: m.apMaterno_cli,
					id_cli: m.id_cli,
					fecha_inicio: m?.cli_seguimiento.sort(
						(a, b) => b.id_membresia - a.id_membresia
					)[0]?.venta?.fecha_inicio,
					...m.cli_seguimiento[0],
				};
			});
			setdataSeguimientoxFecha(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerSeguimientos = async () => {
		try {
			const { data } = await PTApi.get('/seguimiento/');
			console.log({ data });
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerSeguimientoxFecha,
		obtenerSeguimientos,
		dataSeguimientoxFecha,
	};
};

function agruparPorCliente(data) {
	const resultado = Object.values(
		data.reduce((acc, item) => {
			const { id_cli } = item;

			if (!acc[id_cli]) {
				acc[id_cli] = {
					id_cli,
					items: [],
				};
			}

			acc[id_cli].items.push(item);

			return acc;
		}, {})
	);

	return resultado;
}
