import { PTApi } from '@/common';
import { useState } from 'react';
import dayjs, { utc } from 'dayjs';
import { agruparPorMesAnio } from './helpers/agruparPorMesAnio';
dayjs.extend(utc);

function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS');

	return formatted;
}

export const useResumenEjecutivoStore = () => {
	const [dataLead, setDataLead] = useState([]);
	const [dataLeadPorMesAnio, setdataLeadPorMesAnio] = useState([]);
	const [dataVentaxFecha, setdataVentaxFecha] = useState([]);

	const obtenerLeads = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/lead/leads/${id_empresa}`);
			setDataLead(data.leads);
			// Agrupar leads por mes/año en la forma esperada por los gráficos
			try {
				const agruparPorMes = (arr = []) => {
					return Object.values(
						(arr || []).reduce((acc, item) => {
							const key = dayjs.utc(item.fecha).format('YYYY-MMMM');
							if (!acc[key]) acc[key] = { fecha: key, items: [] };
							acc[key].items.push(item);
							return acc;
						}, {})
					);
				};
				setdataLeadPorMesAnio(agruparPorMes(data.leads));
			} catch (e) {
				console.warn('No se pudo agrupar leads por mes:', e?.message || e);
			}
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVentasPorFecha = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas-x-fecha/598', {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			console.log({ data: data.ventas });
			setdataVentaxFecha(agruparPorMesAnio(data.ventas));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerLeads,
		dataLeadPorMesAnio,
		obtenerVentasPorFecha,
		dataLead,
		dataVentaxFecha,
	};
};

//TRATCH

// if (formState.dataVenta.detalle_traspaso.length > 0) {
// 	const { data: dataSesiones } = await PTApi.post(
// 		'/programaTraining/sesiones/post-sesion',
// 		formState
// 	);
// 	console.log(dataSesiones);

// 	if (!dataSesiones.id_tt && !dataSesiones.id_st) {
// 		return Swal.fire('Error', 'Error, el socio es nuevo', 'error');
// 	}
// 	const { data } = await PTApi.post('/venta/traspaso-membresia', {
// 		formState,
// 		dataSesiones,
// 	});
// } else {
// 	// const { } = await PTApi.post('/venta/post-ventas')
// 	if (formState.dataVenta.detalle_venta_programa.length > 0) {
// 		const { base64ToFile } = helperFunctions();
// 		if (formState.dataVenta.detalle_venta_programa[0].firmaCli) {
// 			const file = base64ToFile(
// 				formState.dataVenta.detalle_venta_programa[0].firmaCli,
// 				`firma_cli${formState.detalle_cli_modelo.id_cli}.png`
// 			);
// 			const formData = new FormData();
// 			formData.append('file', file);
// 			const { data: blobFirma } = await PTApi.post(
// 				`/storage/blob/create/${data.uid_firma}?container=firmasmembresia`,
// 				formData
// 			);
// 			// const { } = await PTApi.post(`/venta/send-email/${}`)
// 		}
// 	}
// }

// const { data: dataMail } = await PTApi.post(`/venta/invoice-mail/15488`, {
// 	firma_base64: formState.dataVenta.detalle_venta_programa[0].firmaCli,
// });
// console.log(dataMail);
