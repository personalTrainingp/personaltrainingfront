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
			console.log({ data });

			dispatch(onSetDataView(data.diasLaborablesEnContrato));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerHorariosColaboradores,
	};
};
