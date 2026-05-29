import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';
const rangos = [
	{ rango_edad: '76 a mas', min: 56, max: Infinity },
	{ rango_edad: '76 a mas', min: 52, max: 55 },
	{ rango_edad: '76 a mas', min: 48, max: 51 },
	{ rango_edad: '76 a mas', min: 44, max: 47 },
	{ rango_edad: '76 a mas', min: 40, max: 43 },
	{ rango_edad: '76 a mas', min: 36, max: 39 },
	{ rango_edad: '58 - 75', min: 32, max: 35 },
	{ rango_edad: '50 - 57', min: 28, max: 31 },
	{ rango_edad: '40 - 49', min: 24, max: 27 },
	{ rango_edad: '30 - 39', min: 20, max: 23 },
	{ rango_edad: '22 - 29', min: 16, max: 19 },
	{ rango_edad: '12 - 21', min: 12, max: 15 },
	{ rango_edad: '0 - 11', min: 0, max: 11 },
];
export const useResumenComparativoStore = () => {
	const [dataVentas, setdataVentas] = useState([]);
	const obtenerVentas = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas-x-fecha/membresias/598', {
				params: {
					arrayDate,
				},
			});
			const dataV = data.ventas
				.map((m) => {
					const pgm = m.detalle_ventaMembresia[0].tb_ProgramaTraining.name_pgm;
					return {
						...m,
						pgm,
						cat: `${m.id_origen === 691 ? 'RENOVACION' : m.id_origen === 692 ? 'REINSCRIPCIONES' : 'NUEVO'}`,
						fecha_nacimiento: m.tb_cliente.fecha_nacimiento,
						edad: calcularEdadReal(
							new Date(m.tb_cliente.fecha_nacimiento),
							new Date(m.fecha_venta)
						),
					};
				})
				.map((item) => {
					const edad = Number(item.edad);
					const rangoEncontrado = rangos.find((r) => edad >= r.min && edad <= r.max);
					return {
						...item,
						rango_edad:
							`${rangoEncontrado?.min} - ${rangoEncontrado.max === Infinity ? 'A MAS' : rangoEncontrado.max}` ||
							'Sin rango',
					};
				});

			setdataVentas(dataV);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataVentas,
		obtenerVentas,
	};
};

// Usamos tu función más precisa para calcular la edad real
const calcularEdadReal = (fechaNacimiento, fechaVenta) => {
	if (!fechaNacimiento) return -1;
	const nacimiento = new Date(fechaNacimiento);
	const venta = fechaVenta ? new Date(fechaVenta) : new Date();
	let edad = venta.getFullYear() - nacimiento.getFullYear();
	if (
		venta.getMonth() < nacimiento.getMonth() ||
		(venta.getMonth() === nacimiento.getMonth() && venta.getDate() < nacimiento.getDate())
	) {
		edad--;
	}
	return edad;
};
