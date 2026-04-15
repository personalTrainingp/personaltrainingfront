import { PTApi } from '@/common';
import config from '@/config';
import { useState } from 'react';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { arrayFacturas } from '@/types/type';

export const useGestVentasStore = () => {
	const [dataVentasxEmpresa, setdataVentasxEmpresa] = useState([]);
	const putVentas = async (id_origen, id_venta, obtenerVentaxID) => {
		try {
			await PTApi.put(`/venta/put-venta/${id_venta}`, {
				id_origen: id_origen,
			});
			obtenerVentaxID(id_venta);
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerVentasxEmpresa = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/venta/get-ventas/${id_empresa}`);
			// console.log(data);
			const ventaMap = data.ventas
				?.filter((f) => f.detalle_ventaMembresia.length != 0)
				?.filter((f) => f.id_origen === 691)
				.map((v) => {
					const avatarCli = v.tb_cliente?.tb_images[0]?.name_image;
					const combinedArray = [
						...v?.detalle_ventaCitas,
						...v?.detalle_ventaMembresia,
						...v?.detalle_ventaProductos,
						...v?.venta_venta,
					];

					// Calcular la suma total de tarifa_monto
					const sumaTotal = combinedArray.reduce(
						(total, item) => total + item.tarifa_monto,
						0
					);

					return {
						id: v.id,
						fechaP: v.fecha_venta,
						id_cli: v.id_cli,
						tb_cliente: {
							nombres_cliente: v.tb_cliente.nombres_apellidos_cli,
							urlAvatar:
								v.tb_cliente?.tb_images.length === 0
									? sinAvatar
									: `${config.API_IMG.AVATAR_CLI}${avatarCli}`,
						},
						nombre_empleado: v.tb_empleado.nombres_apellidos_empl,
						n_comprobante: v.numero_transac,
						comprobante: arrayFacturas.find((e) => e.value === v.id_tipoFactura)?.label,
						observacion: v.observacion,
						montoTotal: sumaTotal,
					};
				})
				.filter((f) => f.montoTotal !== 0);
			setdataVentasxEmpresa(agruparPorFecha(ventaMap));
		} catch (error) {
			console.log(error);
		}
	};
	return { putVentas, obtenerVentasxEmpresa, dataVentasxEmpresa };
};
const agruparPorFecha = (data = []) => {
	const map = {};

	data.forEach((item) => {
		const fecha = new Date(item.fechaP);

		const dia = fecha.getDate();
		const mes = fecha.getMonth() + 1;
		const anio = fecha.getFullYear();

		const key = `${anio}-${mes}-${dia}`;

		if (!map[key]) {
			map[key] = {
				fecha: {
					dia,
					mes,
					anio,
					mesAcumulado: 0,
				},
				// items: [],
				cantidadItems: 0,
				montoTotal: 0,
			};
		}

		// map[key].items.push(item);
		map[key].cantidadItems += 1;
		map[key].montoTotal += Number(item.montoTotal || 0);
	});

	// ordenar por fecha asc
	const result = Object.values(map).sort((a, b) => {
		const fa = new Date(a.fecha.anio, a.fecha.mes - 1, a.fecha.dia);
		const fb = new Date(b.fecha.anio, b.fecha.mes - 1, b.fecha.dia);
		return fa - fb;
	});

	let acumuladoGeneral = 0;
	const acumuladoPorMes = {};

	result.forEach((item) => {
		const { mes, anio } = item.fecha;
		const keyMes = `${anio}-${mes}`;

		// acumulado general
		acumuladoGeneral += item.montoTotal;
		item.montoAcumulado = acumuladoGeneral;

		// acumulado por mes
		if (!acumuladoPorMes[keyMes]) {
			acumuladoPorMes[keyMes] = 0;
		}

		acumuladoPorMes[keyMes] += item.montoTotal;
		item.fecha.mesAcumulado = acumuladoPorMes[keyMes];
	});

	return result;
};
