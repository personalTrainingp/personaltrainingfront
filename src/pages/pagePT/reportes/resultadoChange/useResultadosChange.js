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
export const useResultadosChange = () => {
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
				(f) =>
					f.detalle_ventaMembresium.tarifa_monto !== 0 &&
					(f.detalle_ventaMembresium.tb_ventum.id_origen === 693 ||
						f.detalle_ventaMembresium.tb_ventum.id_origen === 694)
			);
			const dataAlter = agruparPorMes(agruparPorVenta(ventasSinCero)).map((g) => {
				const facturacionxProps = g.items.reduce(
					(total, item) => total + (item?.detalle_ventaMembresium.tarifa_monto || 0),
					0
				);
				const numero_cierre = g.items.length;

				return {
					fecha: g.fecha,
					facturacion: facturacionxProps,
					inversion: 0,
					numero_mensajes: 0,
					// conversor: 0,
					// cac: facturacionxProps / numero_cierre || 0,
					// roas: 0 / facturacionxProps,
					ticket_medio: facturacionxProps / numero_cierre || 0,
					numero_cierre: numero_cierre,
					items: g.items,
				};
			});
			dispatch(onDataFail(dataAlter));
			console.log(dataAlter);

			setdata(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTodoVentas,
		data,
	};
};
