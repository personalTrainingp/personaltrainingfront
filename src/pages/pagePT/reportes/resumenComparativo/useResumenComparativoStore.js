import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';
const rangos = [
	{ rango_edad: '40 - 49', min: 40, max: 49 },
	{ rango_edad: '30 - 39', min: 30, max: 39 },
	{ rango_edad: '50 - 57', min: 50, max: 57 },
	{ rango_edad: '58 - 75', min: 58, max: 75 },
	{ rango_edad: '76 a mas', min: 76, max: Infinity },
	{ rango_edad: '22 - 29', min: 22, max: 29 },
	{ rango_edad: '12 - 21', min: 12, max: 21 },
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
						cat: `${m.id_origen===691?'RENOVACION': m.id_origen===692?'REINSCRIPCIONES':'NUEVO'}`,
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
						rango_edad: rangoEncontrado?.rango_edad || 'Sin rango',
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
