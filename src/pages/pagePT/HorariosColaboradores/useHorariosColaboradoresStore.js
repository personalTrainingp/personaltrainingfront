import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import dayjs from 'dayjs';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useHorariosColaboradoresStore = () => {
	const dispatch = useDispatch();
	const obtenerHorariosColaboradores = async (id_empresa, arrayDate) => {
		try {
			console.log({
				id_empresa,
				arrayDate: [
					dayjs.utc(arrayDate[0]).format('YYYY-MM-DD'),
					dayjs.utc(arrayDate[1]).format('YYYY-MM-DD'),
				],
			});

			const { data } = await PTApi.get(
				`/recursosHumanos/dias-laborables/${id_empresa}/${arrayDate}`,
				{
					params: {
						arrayDate: [
							dayjs.utc(arrayDate[0]).format('YYYY-MM-DD'),
							dayjs.utc(arrayDate[1]).format('YYYY-MM-DD'),
						],
					},
				}
			);
			const dataAlter = data.diasLaborablesEnContrato.map((e) => {
				return {
					colaborador: e?.nombre_empl,
					diasLaborables: e?._empl[0]?.contrato_empl.map((r) => {
						return {
							fecha: dayjs.utc(r.fecha).format('YYYY-MM-DD 05:00:00.0000000 +00:00'),
							horario: dayjs.utc(r.hora_inicio).format('hh:mm:ss.0000000'),
							id_tipo_horario: r.id_tipo_horario,
							minutos: r.minutos
						};
					}),
				};
			});
			console.log({ data });

			dispatch(onSetDataView(dataAlter));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerHorariosColaboradores,
	};
};
