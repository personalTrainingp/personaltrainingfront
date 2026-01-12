import { PTApi } from '@/common';
import { useState } from 'react';

export const useRenovacionesStore = () => {
	const [dataMembresias, setdataMembresias] = useState([]);
	const [dataSeguimientos, setdataSeguimientos] = useState([]);
	const [dataSeguimientosConReno, setdataSeguimientosConReno] = useState([]);
	const [dataVentasMembresiaReno, setdataVentasMembresiaReno] = useState([]);
	const [dataVentasMembresiaRei, setdataVentasMembresiaRei] = useState([]);
	const obtenerSeguimientos = async () => {
		try {
			const { data } = await PTApi.get('/seguimiento/');
			// console.log({ds: data.seguimiento});

			const dataSeguimientoRenovados = data.seguimiento.map((d) => {
				const {
					id_cambio,
					id_extension,
					sesiones_pendientes,
					status_periodo,
					flag,
					createdAt,
					updatedAt,
					...valor
				} = d;
				return {
					...valor,
					id_cli: valor.venta.tb_ventum.id_cli,
				};
			});
			setdataSeguimientos(data.seguimiento);
			setdataSeguimientosConReno(agruparPorMesFechaVencimiento(dataSeguimientoRenovados));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVentas = async () => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas/598');
			const dataVentasMembresiasMap = data.ventas
				.filter((e) => e.detalle_ventaMembresia.length !== 0 && e.id_origen === 691)
				.map((m) => {
					return {
						id_cli: m.id_cli,
						id_origen: m.id_origen,
						id_venta: m.id,
						fecha_venta: m.fecha_venta,
						membresia_monto: m.detalle_ventaMembresia[0].tarifa_monto,
						id_membresia: m.detalle_ventaMembresia[0].id,
						fecha_inicio: m.detalle_ventaMembresia[0].fecha_inicio,
						id_membresia_anterior: m.detalle_ventaMembresia[0]?.id_membresia_anterior,
					};
				})
				.filter((me) => me.membresia_monto !== 0);

			const dataVentasMembresiasRei = data.ventas
				.filter((e) => e.detalle_ventaMembresia.length !== 0 && e.id_origen === 692)
				.map((m) => {
					return {
						id_cli: m.id_cli,
						id_origen: m.id_origen,
						id_venta: m.id,
						fecha_venta: m.fecha_venta,
						membresia_monto: m.detalle_ventaMembresia[0].tarifa_monto,
						id_membresia: m.detalle_ventaMembresia[0].id,
						fecha_inicio: m.detalle_ventaMembresia[0].fecha_inicio,
						id_membresia_anterior: m.detalle_ventaMembresia[0]?.id_membresia_anterior,
					};
				})
				.filter((me) => me.membresia_monto !== 0);

			setdataMembresias(
				data.ventas
					.filter((e) => e.detalle_ventaMembresia.length !== 0)
					.map((m) => {
						return {
							id_cli: m.id_cli,
							id_origen: m.id_origen,
							id_venta: m.id,
							fecha_venta: m.fecha_venta,
							// membresia_monto: m.detalle_ventaMembresia[0].tarifa_monto,
							id_membresia: m.detalle_ventaMembresia[0].id,
							fecha_inicio: m.detalle_ventaMembresia[0].fecha_inicio,
							id_membresia_anterior:
								m.detalle_ventaMembresia[0]?.id_membresia_anterior,
						};
					})
			);
			setdataVentasMembresiaReno(agruparPorMesFechaVenta(dataVentasMembresiasMap));
			setdataVentasMembresiaRei(agruparPorMesFechaVenta(dataVentasMembresiasRei));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentas,
		obtenerSeguimientos,
		dataVentasMembresiaRei,
		dataMembresias,
		dataSeguimientosConReno,
		dataVentasMembresiaReno,
		dataSeguimientos,
	};
};

const agruparPorMesFechaVenta = (data) => {
	const map = {};

	data.forEach((item) => {
		const fecha = new Date(item.fecha_venta);
		const mes = fecha.getUTCMonth() + 1; // 1–12
		const anio = fecha.getUTCFullYear();
		const key = `${anio}-${mes}`;

		if (!map[key]) {
			map[key] = {
				mes,
				anio,
				items: [],
			};
		}

		map[key].items.push(item);
	});

	return Object.values(map).map((e) => {
		return {
			...e,
			items: e.items,
		};
	});
};
const agruparPorMesFechaVencimiento = (data) => {
	const map = {};

	data.forEach((item) => {
		const fecha = new Date(item.fecha_vencimiento);
		const mes = fecha.getUTCMonth() + 1; // 1–12
		const anio = fecha.getUTCFullYear();
		const key = `${anio}-${mes}`;

		if (!map[key]) {
			map[key] = {
				mes,
				anio,
				items: [],
			};
		}

		map[key].items.push(item);
	});

	return Object.values(map).map((e) => {
		return {
			...e,
			items: e.items,
		};
	});
};
