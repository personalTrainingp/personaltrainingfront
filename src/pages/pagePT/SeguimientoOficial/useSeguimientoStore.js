import { PTApi } from '@/common';
import { DateMaskStr, DateMaskStr1, DateMaskString } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
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
			const dataAlter = data.dataSeguimiento
				.map((m) => {
					const ultimaMembresia = m?.cli_seguimiento.sort(
						(a, b) => b.id_membresia - a.id_membresia
					)[0];
					return {
						nombres_cli: m.nombre_cli,
						apPaterno_cli: m.apPaterno_cli,
						apMaterno_cli: m.apMaterno_cli,
						id_cli: m.id_cli,
						fecha_inicio: ultimaMembresia?.venta?.fecha_inicio,
						...m.cli_seguimiento[0],
						fecha_vencimiento_: DateMaskStr1(ultimaMembresia.fecha_vencimiento),
						fecha_vencimiento: DateMaskStr1(ultimaMembresia.fecha_vencimiento),
					};
				})
				.map((m) => {
					return {
						...m,
						countDias: diasEntreFechas(
							DateMaskStr1(new Date()),
							DateMaskStr1(m.fecha_vencimiento_)
						),
						fecha_vencimiento_: DateMaskStr(
							m?.fecha_vencimiento_,
							'dddd DD [DE] MMMM [DEL] YYYY'
						),
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

const diasEntreFechas = (inicio, fin) => {
	const f1 = dayjs(inicio).startOf('day');
	const f2 = dayjs(fin).startOf('day');

	const diff = f2.diff(f1, 'day');

	if (diff === 0) return 1;

	return diff > 0 ? diff + 1 : diff - 1;
};
