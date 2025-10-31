import { PTApi } from '@/common';
import dayjs from 'dayjs';
import React, { useState } from 'react';

export const useDiasLaborablesColaboradorStore = () => {
	const [dataDiasLaborablesxIDcontrato, setdataDiasLaborablesxIDcontrato] = useState([]);
	const obtenerDiasLaborablesColaboradorxContrato = async (id_contrato) => {
		try {
			const { data } = await PTApi.get(`/jornada/dias-laborables/idContrato/${id_contrato}`);
			const dataAlter = data.diasLaborablesEnContrato.sort((a,b)=>new Date(a.fecha)-new Date(b.fecha)).map((dia) => {
				return {
					...dia,
					fecha: dayjs.utc(dia.fecha).format('YYYY-MM-DD'),
                    hora_inicio: dayjs.utc(dia.hora_inicio).format('hh:mm')
				};
			});
			setdataDiasLaborablesxIDcontrato(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerDiasLaborablesColaboradorxContrato,
		dataDiasLaborablesxIDcontrato,
	};
};
