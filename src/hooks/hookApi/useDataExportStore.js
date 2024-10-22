import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useReporteStore = () => {
	const dispatch = useDispatch();
	// const [reporteSeguimiento, setreporteSeguimiento] = useState([]);
	const [reporteSeguimiento, setexportarVentas] = useState([]);
	const ExportarDataVentasEnExcel = async (rangoDate) => {};
	const ExportarDataSeguimientoEnExcel = async (rangoDate) => {
		try {
			const { data } = await PTApi.get('/exportar/data-seguimiento-exportar-excel', {
				params: {
					dateRanges: rangoDate,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};
	return {
		loading,
		ExportarDataSeguimientoEnExcel,
		ExportarDataVentasEnExcel,
	};
};
