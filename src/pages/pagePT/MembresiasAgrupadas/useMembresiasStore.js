import { PTApi } from '@/common';
import React, { useState } from 'react';

export const useMembresiasStore = () => {
	const [dataMembresias, setdataMembresias] = useState([]);
	const obtenerVentaMembresias = async () => {
		try {
			const { data } = await PTApi.get('/venta/membresias/empresa/598');
			const dataMemMAP = agruparPorCliente(data.ventas)
				.filter((d) => d.items.length > 1)
				.map((m) => {
					const items = m.items.map((i) => {
						return {
							fecha_venta: i.fecha_venta,
							detalle_ventaMembresia: i.detalle_ventaMembresia,
						};
					});
					return {
						...m,
						label: m.items[0].tb_cliente.nombres_apellidos_cli,
						items,
						change: m.items.filter(
							(f) =>
								f.detalle_ventaMembresia[0]?.tb_ProgramaTraining?.name_pgm ===
								'CHANGE 45'
						),
						fs: m.items.filter(
							(f) =>
								f.detalle_ventaMembresia[0]?.tb_ProgramaTraining?.name_pgm ===
								'FS 45'
						),
						fisioMuscle: m.items.filter(
							(f) =>
								f.detalle_ventaMembresia[0]?.tb_ProgramaTraining?.name_pgm ==
								'FISIO MUSCLE'
						),
					};
				});
			setdataMembresias(dataMemMAP);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataMembresias,
		obtenerVentaMembresias,
	};
};
const agruparPorCliente = (data) => {
	const map = {};

	data.forEach((item) => {
		const id = item.id_cli;

		if (!map[id]) {
			map[id] = {
				label: item?.id_cli || `Cliente ${id}`,
				items: [],
			};
		}

		map[id].items.push(item);
	});

	return Object.values(map);
};
