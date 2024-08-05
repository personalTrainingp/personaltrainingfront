import { PTApi } from '@/common';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useVentasStore = () => {
	const dispatch = useDispatch();
	const [dataVentas, setDataVentas] = useState([]);
	const [dataVentaxID, setdataVentaxID] = useState({});
	const [isLoading, setisLoading] = useState(false);
	const [msgBox, setmsgBox] = useState({});
	const startRegisterVenta = async (formState, funToast) => {
		try {
			const { base64ToFile } = helperFunctions();
			const file = base64ToFile(
				formState.dataVenta.detalle_venta_programa[0].firmaCli,
				`firma_cli${formState.detalle_cli_modelo.id_cliente}.png`
			);
			const formData = new FormData();
			formData.append('file', file);
			const { data } = await PTApi.post('/venta/post-ventas', formState);
			const { data: blobFirma } = await PTApi.post(
				`/storage/blob/create/${data.uid_firma}?container=firmasmembresia`,
				formData
			);
			// console.log(data, blobFirma);
			// console.log(blobFirma);
			funToast('success', 'Venta', 'Venta agregada con exitos', 'success', 5000);
		} catch (error) {
			console.log(error);
			funToast(
				'error',
				'ERROR(Tomar captura si es necesario)',
				error.response.data,
				'Error',
				60000
			);
		}
	};
	const obtenerVentaporId = async (id) => {
		try {
			setisLoading(true);
			const { data } = await PTApi.get(`/venta/get-id-ventas/${id}`);
			setisLoading(false);
			setdataVentaxID(data.venta);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTablaVentas = async () => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas');
			// console.log(data);
			setDataVentas(data.ventas);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerPDFCONTRATOgenerado = async (formState) => {
		try {
			// Convertir formState a cadena JSON
			const formData = JSON.stringify(formState);

			const response = await PTApi.post('/venta/invoice-PDFcontrato', formState, {
				responseType: 'blob', // Establecer el tipo de respuesta como blob (archivo binario)
			});
			// Crear un objeto URL para el archivo PDF
			const url = window.URL.createObjectURL(new Blob([response.data]));
			// Crear un enlace <a> temporal y simular un clic para descargar el archivo PDF
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'pdfcontrato.pdf');
			document.body.appendChild(link);
			link.click();

			// Liberar el objeto URL
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		startRegisterVenta,
		obtenerTablaVentas,
		obtenerPDFCONTRATOgenerado,
		obtenerVentaporId,
		msgBox,
		isLoading,
		dataVentas,
		dataVentaxID,
	};
};
