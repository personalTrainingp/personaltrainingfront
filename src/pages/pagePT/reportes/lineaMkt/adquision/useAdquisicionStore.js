// import { PTApi } from '@/common';
// import { DateMaskString } from '@/components/CurrencyMask';
// import { onDataFail, onSetDataView } from '@/store/data/dataSlice';
// import dayjs from 'dayjs';
// import 'dayjs/locale/es';
// import { useState } from 'react';
// import { useDispatch } from 'react-redux';

// dayjs.locale('es');
// function formatDateToSQLServerWithDayjs(date) {
// 	return dayjs(date).toISOString(); // Asegurar que esté en UTC
// 	// .format('YYYY-MM-DD HH:mm:ss.SSS0000 +00:00');
// }

// function eliminarDuplicadosPorId(data) {
// 	const idsProcesados = new Set();
// 	return data
// 		.filter(({ detalle_ventaMembresium }) => {
// 			const idVenta = detalle_ventaMembresium?.tb_ventum?.id;
// 			if (idVenta && !idsProcesados.has(idVenta)) {
// 				idsProcesados.add(idVenta);
// 				return true;
// 			}
// 			return false;
// 		})
// 		.map((orig) => {
// 			const venta = orig.detalle_ventaMembresium?.tb_ventum;
// 			if (!venta) return orig;

// 			// formateo
// 			const fechaFormateada = venta.fecha_venta
// 				? DateMaskString(venta.fecha_venta)
// 				: venta.fecha_venta;

// 			// clonar sólo el nivel que necesitamos cambiar
// 			const nuevoVentum = {
// 				...venta,
// 				fecha_venta: fechaFormateada,
// 			};

// 			const nuevaMembresia = {
// 				...orig.detalle_ventaMembresium,
// 				tb_ventum: nuevoVentum,
// 			};

// 			// devolvemos un item completamente “nuevo”
// 			return {
// 				...orig,
// 				detalle_ventaMembresium: nuevaMembresia,
// 			};
// 		});
// }

// function agruparPorMesYAnio(data) {
// 	const inicio = dayjs('2024-09-01'); // Empezar desde septiembre 2024
// 	const fin = dayjs(); // Fecha actual

// 	const meses = [];
// 	let fechaIteracion = inicio;

// 	// Generamos los meses en orden cronológico
// 	while (fechaIteracion.isBefore(fin) || fechaIteracion.isSame(fin, 'month')) {
// 		meses.push({
// 			anio: fechaIteracion.format('YYYY'),
// 			mes: fechaIteracion.format('MMMM'),
// 			fecha: fechaIteracion.format('MMMM YYYY'),
// 			items: [],
// 		});
// 		fechaIteracion = fechaIteracion.add(1, 'month');
// 	}

// 	// Agrupar datos por mes
// 	data?.forEach((item) => {
// 		const mesVenta = DateMaskString(
// 			item.detalle_ventaMembresium?.tb_ventum.fecha_venta,
// 			'MMMM YYYY'
// 		);
// 		const grupo = meses.find((m) => m.fecha === mesVenta);

// 		if (grupo) {
// 			grupo.items.push(item);
// 		}
// 	});
// 	const nuevaData = meses.map((m) => {
// 		return {
// 			...m,
// 			itemsDia: [],
// 		};
// 	});

// 	return nuevaData;
// }

// function agruparPorMesYAnioYDia(data) {
// 	const generarMeses = (anio, mes) => {
// 		const meses = [];
// 		for (let dia = 1; dia <= 31; dia++) {
// 			const param = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio}`;
// 			meses.push({
// 				dia,
// 				mes: mes.toString().padStart(2, '0'),
// 				anio,
// 				param,
// 				data,
// 				items: [],
// 			});
// 		}
// 		return meses;
// 	};

// 	const grouped = data.reduce((acc, item) => {
// 		const fecha = new Date(item.detalle_ventaMembresium.tb_ventum.fecha_venta);
// 		const dia = fecha.getDate();
// 		const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
// 		const anio = fecha.getFullYear();
// 		const param = `${dia.toString().padStart(2, '0')}-${mes}-${anio}`;

// 		let group = acc.find((group) => group.param === param);
// 		if (!group) {
// 			group = {
// 				dia,
// 				mes,
// 				anio,
// 				param,
// 				items: [],
// 			};
// 			acc.push(group);
// 		}

// 		group.items.push(item);
// 		return acc;
// 	}, []);

// 	// Asegúrate de que todos los días del mes estén presentes
// 	const anio = 2024;
// 	const mes = 9; // Septiembre
// 	const todosLosDias = generarMeses(anio, mes);

// 	// Combina ambos arreglos para asegurar que todos los días estén presentes
// 	const resultadoFinal = todosLosDias.map((dia) => {
// 		const grupoExistente = grouped.find(
// 			(group) => group.dia === dia.dia && group.mes === dia.mes && group.anio === dia.anio
// 		);

// 		return grupoExistente ? grupoExistente : dia;
// 	});
// 	console.log({ todosLosDias });
// 	// console.log({ todosLosDias, grouped }, 'grr');

// 	return resultadoFinal;
// }

// export const useAdquisicionStore = () => {
// 	const [data, setdata] = useState([]);
// 	const dispatch = useDispatch();
// 	const obtenerTodoVentas = async () => {
// 		try {
// 			const RANGE_DATE = [new Date(2024, 8, 16), new Date()];
// 			const { data: dataCom } = await PTApi.get(
// 				'/venta/reporte/obtener-comparativo-resumen',
// 				{
// 					params: {
// 						arrayDate: [
// 							formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
// 							formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
// 						],
// 					},
// 				}
// 			);
// 			const { data: dataFechas } = await PTApi.get(
// 				'/parametros/get_params_periodo/reporte-ventas/comparativaFechas'
// 			);

// 			const ventasSinCero = dataCom.ventasProgramas.filter(
// 				(f) => f.detalle_ventaMembresium.tarifa_monto !== 0
// 			);
// 			// const test = eliminarDuplicadosPorId(ventasSinCero).map(
// 			// 	(v) => v.detalle_ventaMembresium.tb_ventum
// 			// );
// 			// console.log(eliminarDuplicadosPorId(ventasSinCero), test, 'aqui 177');

// 			// dispatch(onDataFail(ventasSinCero));
// 			dispatch(
// 				onSetDataView(
// 					filtrarPorIntervalos(eliminarDuplicadosPorId(ventasSinCero), dataFechas)
// 				)
// 			);

// 			setdata([]);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};
// 	return {
// 		obtenerTodoVentas,
// 		data,
// 	};
// };
// function filtrarPorIntervalos(tb_data, tb_fechas) {
// 	return tb_fechas.map(({ fecha_desde_param, fecha_hasta_param }) => {
// 		const desde = new Date(fecha_desde_param);
// 		const hasta = new Date(fecha_hasta_param);

// 		const items_filters = tb_data.filter((item) => {
// 			const venta = new Date(item.detalle_ventaMembresium.tb_ventum.fecha_venta);
// 			return venta >= desde && venta <= hasta;
// 		});
// 		const items = groupByDate(items_filters)[0];

// 		return {
// 			fechas: {
// 				fecha_desde: fecha_desde_param,
// 				fecha_hasta: fecha_hasta_param,
// 			},
// 			items_filters: items,
// 		};
// 	});
// }

// function groupByDate(data) {
// 	// 1) Agrupa los elementos por clave "YYYY-MM"
// 	const temp = {};
// 	data.forEach((item) => {
// 		// Extraemos fecha “YYYY-MM-DD”
// 		const fechaStr = item.detalle_ventaMembresium.tb_ventum.fecha_venta.split('T')[0];
// 		const [anioStr, mesStr, diaStr] = fechaStr.split('-');
// 		const anio = parseInt(anioStr, 10);
// 		const mes = mesStr; // dos dígitos
// 		const dia = parseInt(diaStr, 10);
// 		const key = `${anioStr}-${mesStr}`;

// 		if (!temp[key]) {
// 			temp[key] = { anio, mes, byDay: {} };
// 		}
// 		if (!temp[key].byDay[dia]) {
// 			temp[key].byDay[dia] = [];
// 		}
// 		temp[key].byDay[dia].push(item);
// 	});

// 	// 2) Para cada mes, construye un array de 31 días
// 	return Object.values(temp).map(({ anio, mes, byDay }) => {
// 		const dias = [];
// 		for (let day = 1; day <= 31; day++) {
// 			dias.push({
// 				dia: day,
// 				mes,
// 				anio,
// 				items: byDay[day] || [],
// 			});
// 		}
// 		return dias;
// 	});
// }

import { PTApi } from '@/common';
import { DateMaskString } from '@/components/CurrencyMask';
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

function eliminarDuplicadosPorId(data) {
	const idsProcesados = new Set();
	return data
		.filter(({ detalle_ventaMembresium }) => {
			const idVenta = detalle_ventaMembresium?.tb_ventum?.id;
			const fecha_venta = detalle_ventaMembresium?.tb_ventum?.fecha_venta;
			if (idVenta && !idsProcesados.has(idVenta)) {
				idsProcesados.add(idVenta);
				return true;
			}
			return false;
		}) // 2) Formateamos la fecha de venta
		.map((orig) => {
			const venta = orig.detalle_ventaMembresium?.tb_ventum;
			if (!venta) return orig;

			// formateo
			const fechaFormateada = venta.fecha_venta
				? DateMaskString(venta.fecha_venta)
				: venta.fecha_venta;

			// clonar sólo el nivel que necesitamos cambiar
			const nuevoVentum = {
				...venta,
				fecha_venta: fechaFormateada,
			};

			const nuevaMembresia = {
				...orig.detalle_ventaMembresium,
				tb_ventum: nuevoVentum,
			};

			// devolvemos un item completamente “nuevo”
			return {
				...orig,
				detalle_ventaMembresium: nuevaMembresia,
			};
		});
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

	// Agrupar datos por mes
	data?.forEach((item) => {
		const mesVenta = DateMaskString(
			item.detalle_ventaMembresium?.tb_ventum.fecha_venta,
			'MMMM YYYY'
		);
		const grupo = meses.find((m) => m.fecha === mesVenta);

		if (grupo) {
			grupo.items.push(item);
		}
	});
	const nuevaData = meses.map((m) => {
		return {
			...m,
			itemsDia: [],
		};
	});
	console.log({ nuevaData });

	return nuevaData;
}

function agruparPorMesYAnioYDia(data) {
	const generarMeses = (anio, mes) => {
		const meses = [];
		for (let dia = 1; dia <= 31; dia++) {
			const param = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio}`;
			meses.push({
				dia,
				mes: mes.toString().padStart(2, '0'),
				anio,
				param,
				data,
				items: [],
			});
		}
		return meses;
	};

	const grouped = data.reduce((acc, item) => {
		const fecha = new Date(item.detalle_ventaMembresium.tb_ventum.fecha_venta);
		const dia = fecha.getDate();
		const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
		const anio = fecha.getFullYear();
		const param = `${dia.toString().padStart(2, '0')}-${mes}-${anio}`;

		let group = acc.find((group) => group.param === param);
		if (!group) {
			group = {
				dia,
				mes,
				anio,
				param,
				items: [],
			};
			acc.push(group);
		}

		group.items.push(item);
		return acc;
	}, []);

	// Asegúrate de que todos los días del mes estén presentes
	const anio = 2024;
	const mes = 9; // Septiembre
	const todosLosDias = generarMeses(anio, mes);

	// Combina ambos arreglos para asegurar que todos los días estén presentes
	const resultadoFinal = todosLosDias.map((dia) => {
		const grupoExistente = grouped.find(
			(group) => group.dia === dia.dia && group.mes === dia.mes && group.anio === dia.anio
		);

		return grupoExistente ? grupoExistente : dia;
	});
	console.log({ todosLosDias });
	// console.log({ todosLosDias, grouped }, 'grr');

	return resultadoFinal;
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
			const agregarItemsDias = agruparPorMesYAnio(
				eliminarDuplicadosPorId(ventasSinCero),
				'2024-09-01',
				9
			).map((f) => {
				return {
					...f,
					itemsDia: Object.values(groupByDate(f.items)[0]),
				};
			});
			console.log(
				{ agregarItemsDias },
				eliminarDuplicadosPorId(ventasSinCero),
				agruparPorMesYAnioYDia(eliminarDuplicadosPorId(ventasSinCero), '2024-09-01', 9),
				agruparPorMesYAnio(eliminarDuplicadosPorId(ventasSinCero), '2024-09-01', 9),
				'holi'
			);

			setdata(agregarItemsDias);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTodoVentas,
		data,
	};
};

function groupByDate(data) {
	// 1) Agrupa los elementos por clave "YYYY-MM"
	const temp = {};
	data.forEach((item) => {
		// Extraemos fecha “YYYY-MM-DD”
		const fechaStr = item.detalle_ventaMembresium.tb_ventum.fecha_venta.split('T')[0];
		const [anioStr, mesStr, diaStr] = fechaStr.split('-');
		const anio = parseInt(anioStr, 10);
		const mes = mesStr; // dos dígitos
		const dia = parseInt(diaStr, 10);
		const key = `${anioStr}-${mesStr}`;

		if (!temp[key]) {
			temp[key] = { anio, mes, byDay: {} };
		}
		if (!temp[key].byDay[dia]) {
			temp[key].byDay[dia] = [];
		}
		temp[key].byDay[dia].push(item);
	});

	// 2) Para cada mes, construye un array de 31 días
	return Object.values(temp).map(({ anio, mes, byDay }) => {
		const dias = [];
		for (let day = 1; day <= 31; day++) {
			dias.push({
				dia: day,
				mes,
				anio,
				items: byDay[day] || [],
			});
		}
		return { ...dias };
	});
}
