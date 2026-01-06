import { PTApi } from '@/common';
import { useState } from 'react';

export const useRenovacionesStore = () => {
	const [dataSeguimientosSinReno, setdataSeguimientosSinReno] = useState([]);
	const [dataSeguimientosConReno, setdataSeguimientosConReno] = useState([]);
	const obtenerSeguimientos = async () => {
		try {
			const { data } = await PTApi.get('/seguimiento/');
			const dataSeguimientoRenovados = data.seguimiento.filter(
				(seg) => seg.venta.tb_ventum.id_origen === 691
			);
			const dataSeguimientoSinRenovados = data.seguimiento.filter(
				(seg) => seg.venta.tb_ventum.id_origen !== 691
			);
			setdataSeguimientosConReno(agruparPorMes(dataSeguimientoRenovados));
			setdataSeguimientosSinReno(agruparPorMes(dataSeguimientoSinRenovados));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVentas = async () => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas/598');
			const dataVentasMembresias = data.ventas.filter(
				(e) => e.detalle_ventaMembresia.length !== 0 && e.id_origen === 691
			);

			console.log({ dataVentasMembresias });
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentas,
		obtenerSeguimientos,
		dataSeguimientosSinReno,
		dataSeguimientosConReno,
	};
};

const agruparPorMes = (data) => {
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
			items: agruparPorIdCli(e.items),
		};
	});
};
const agruparPorIdCli = (data) => {
	const map = {};

	data.forEach((item) => {
		const id_cli = item?.venta?.tb_ventum?.id_cli;
		if (!id_cli) return;

		if (!map[id_cli]) {
			map[id_cli] = {
				id_cli,
				items: [],
			};
		}

		map[id_cli].items.push(item);
	});

	return Object.values(map);
};
