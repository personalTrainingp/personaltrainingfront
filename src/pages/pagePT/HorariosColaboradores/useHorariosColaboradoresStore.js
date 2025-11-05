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
				arrayDate: [dayjs.utc(arrayDate[0]).format(''), dayjs.utc(arrayDate[1]).format('')],
			});

			const { data } = await PTApi.get(
				`/recursosHumanos/dias-laborables/${id_empresa}/${arrayDate}`,
				{
					params: {
						arrayDate: [
							dayjs.utc(arrayDate[0]).format(''),
							dayjs.utc(arrayDate[1]).format(''),
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
