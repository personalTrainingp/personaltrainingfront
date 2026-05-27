import { PTApi } from '@/common';
import { DateMaskStr, DateMaskStr1, DateMaskString } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import { useState } from 'react';

export const useSeguimientoOficialStore = () => {
	const [dataSeguimientoxFecha, setdataSeguimientoxFecha] = useState([]);
	const obtenerSeguimientoxFecha = async (rangeDate) => {
		try {
			const { data } = await PTApi.get('/seguimiento/');
			const dataAlter = data.dataSeguimiento
				.map((m) => {
					const ultimaMembresia = m?.cli_seguimiento.sort(
						(a, b) => b.id_membresia - a.id_membresia
					)[0];
					const ultimoPrograma =
						ultimaMembresia.venta.cambio_programa.length === 0
							? ultimaMembresia.venta.tb_ProgramaTraining.name_pgm
							: ultimaMembresia.venta.cambio_programa[0].pgm.name_pgm;
					const ultimoHorario =
						ultimaMembresia.venta.cambio_programa.length === 0
							? ultimaMembresia.venta.horario
							: ultimaMembresia.venta.horario;
					return {
						horario: DateMaskStr(ultimoHorario, 'HH:mm'),
						nombre_programa: `${ultimoPrograma}`,
						nombres_cli: m.nombre_cli,
						apPaterno_cli: m.apPaterno_cli,
						apMaterno_cli: m.apMaterno_cli,
						nombres_apellidos_cli: `${m.nombre_cli} ${m.apPaterno_cli} ${m.apMaterno_cli}`,
						id_cli: m.id_cli,
						fecha_inicio: ultimaMembresia?.venta?.fecha_inicio,
						ultimoPrograma: ultimoPrograma,
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
			setdataSeguimientoxFecha(
				dataAlter.filter((f) => {
					const fecha = new Date(f.fecha_vencimiento);
					const fechaInicio = new Date(rangeDate[0]);

					const fechaFin = new Date(rangeDate[1]);
					fechaFin.setHours(15, 59, 59, 999);

					return fecha >= fechaInicio && fecha <= fechaFin;
				})
			);
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
