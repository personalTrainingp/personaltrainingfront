import { PTApi } from '@/common';
import { onDataFail, onSetDataView } from '@/store/data/dataSlice';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

dayjs.locale('es');
function formatDateToSQLServerWithDayjs(date) {
	return dayjs(date).toISOString(); // Asegurar que esté en UTC
	// .format('YYYY-MM-DD HH:mm:ss.SSS0000 +00:00');
}

const agruparPorMes = (data) => {
	const inicio = dayjs('2024-09-01'); // Empezar desde septiembre 2024
	const fin = dayjs(); // Fecha actual

	const meses = [];
	let fechaIteracion = inicio;

	// Generamos los meses en orden cronológico
	while (fechaIteracion.isBefore(fin) || fechaIteracion.isSame(fin, 'month')) {
		meses.push({
			fecha: fechaIteracion.format('MMMM YYYY'),
			items: [],
		});
		fechaIteracion = fechaIteracion.add(1, 'month');
	}
	console.log(data);

	// Agrupar datos por mes
	data?.forEach((item) => {
		const mesVenta = dayjs(item.detalle_ventaMembresium?.tb_ventum.fecha_venta).format(
			'MMMM YYYY'
		);
		const grupo = meses.find((m) => m.fecha === mesVenta);
		if (grupo) {
			grupo.items.push(item);
		}
	});

	return meses;
};

function agruparPorVenta(data) {
	if (!Array.isArray(data)) {
		console.error("La variable 'data' no es un array válido.");
		return [];
	}

	const resultado = data?.reduce((acc, item) => {
		const idVenta = item?.detalle_ventaMembresium?.tb_ventum?.id; // Usar el operador de encadenamiento opcional
		if (!acc.has(idVenta)) {
			acc.set(idVenta, item);
		}
		return acc;
	}, new Map());

	// Convertir el Map en un array
	return Array.from(resultado?.values());
}

function agruparPorMesYAnio(data) {
	const inicio = dayjs('2024-09-01'); // Empezar desde septiembre 2024
	const fin = dayjs(); // Fecha actual

	const meses = [];
	let fechaIteracion = inicio;

	// Generamos los meses en orden cronológico
	while (fechaIteracion.isBefore(fin) || fechaIteracion.isSame(fin, 'month')) {
		meses.push({
			anio: fechaIteracion.format('YYYY'),
			mes: fechaIteracion.format('MMMM'),
			fecha: fechaIteracion.format('MMMM YYYY'),
			items: [],
		});
		fechaIteracion = fechaIteracion.add(1, 'month');
	}
	console.log(data);

	// Agrupar datos por mes
	data?.forEach((item) => {
		const mesVenta = dayjs(item.detalle_ventaMembresium?.tb_ventum.fecha_venta).format(
			'MMMM YYYY'
		);
		const grupo = meses.find((m) => m.fecha === mesVenta);
		if (grupo) {
			grupo.items.push(item);
		}
	});

	return meses;
}

function eliminarDuplicadosPorId(data) {
	const idsProcesados = new Set();
	return data.filter(({ detalle_ventaMembresium }) => {
		const idVenta = detalle_ventaMembresium?.tb_ventum?.id;
		if (idVenta && !idsProcesados.has(idVenta)) {
			idsProcesados.add(idVenta);
			return true;
		}
		return false;
	});
}

export const useAdquisicionStore = () => {
	const [data, setdata] = useState([]);
	const dispatch = useDispatch();
	const obtenerTodoVentas = async () => {
		try {
			const RANGE_DATE = [new Date(2024, 8, 16), new Date()];
			const { data } = await PTApi.get('/venta/reporte/obtener-comparativo-resumen', {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
						formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
					],
				},
			});
			const ventasSinCero = data.ventasProgramas.filter(
				(f) => f.detalle_ventaMembresium.tarifa_monto !== 0
			);
			dispatch(onDataFail(ventasSinCero));
			// console.log(
			// 	agruparPorMesYAnio(eliminarDuplicadosPorId(ventasSinCero), '2024-09-01', 9),
			// 	'holi'
			// );

			setdata(agruparPorMesYAnio(eliminarDuplicadosPorId(ventasSinCero), '2024-09-01', 9));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTodoVentas,
		data,
	};
};
