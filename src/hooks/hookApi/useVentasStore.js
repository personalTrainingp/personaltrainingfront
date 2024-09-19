import { PTApi } from '@/common';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useVentasStore = () => {
	const dispatch = useDispatch();
	const [dataVentas, setDataVentas] = useState([]);
	const [dataVentaxID, setdataVentaxID] = useState({});
	const [isLoading, setisLoading] = useState(false);
	const [loadingVenta, setloadingVenta] = useState(false);
	const [msgBox, setmsgBox] = useState({});
	const [dataVentaxFecha, setdataVentaxFecha] = useState([]);
	const [IngresosSeparados_x_Fecha, setIngresosSeparados_x_Fecha] = useState([]);

	const obtenerVentasPorFecha = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas-x-fecha', {
				params: {
					arrayDate,
				},
			});
			let ingresosSeparados = data.ventas.map((e) => {
				return {
					fitology:
						e.detalle_ventaCitas?.reduce((total, item) => {
							// Sumar tarifa_monto solo si el producto pertenece a la categoría 18
							if (item.tb_servicio.tipo_servicio === 'FITOL') {
								return total + (item.tarifa_monto || 0);
							}
							return total;
						}, 0) || 0, // Valor inicial 0 para evitar errores
					nutricion:
						e.detalle_ventaCitas?.reduce((total, item) => {
							// Sumar tarifa_monto solo si el producto pertenece a la categoría 18
							if (item.tb_servicio.tipo_servicio === 'NUTRI') {
								return total + (item.tarifa_monto || 0);
							}
							return total;
						}, 0) || 0, // Valor inicial 0 para evitar errores
					accesorios:
						e.detalle_ventaProductos?.reduce((total, item) => {
							// Sumar tarifa_monto solo si el producto pertenece a la categoría 18
							if (item.tb_producto.id_categoria === 18) {
								return total + (item.tarifa_monto || 0);
							}
							return total;
						}, 0) || 0, // Valor inicial 0 para evitar errores
					suplementos:
						e.detalle_ventaProductos?.reduce((total, item) => {
							// Sumar tarifa_monto solo si el producto pertenece a la categoría 18
							if (item.tb_producto.id_categoria === 17) {
								return total + (item.tarifa_monto || 0);
							}
							return total;
						}, 0) || 0, // Valor inicial 0 para evitar errores
					programas: e.detalle_ventaMembresia.reduce((total, item) => {
						return total + (item.tarifa_monto || 0);
					}, 0),
				};
			});

			const resultado = ingresosSeparados.reduce(
				(acc, obj) => {
					// Sumar cada propiedad
					acc.accesorios += obj.accesorios;
					acc.fitology += obj.fitology;
					acc.nutricion += obj.nutricion;
					acc.programas += obj.programas;
					acc.suplementos += obj.suplementos;

					return acc;
				},
				{ accesorios: 0, fitology: 0, nutricion: 0, programas: 0, suplementos: 0 }
			);

			setIngresosSeparados_x_Fecha(resultado);
			setdataVentaxFecha(data.ventas);
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterVenta = async (formState, funToast) => {
		try {
			setloadingVenta(true);
			const { data } = await PTApi.post('/venta/post-ventas', formState);
			if (formState.dataVenta.detalle_venta_programa.length > 0) {
				const { base64ToFile } = helperFunctions();
				if (formState.dataVenta.detalle_venta_programa[0].firmaCli) {
					const file = base64ToFile(
						formState.dataVenta.detalle_venta_programa[0].firmaCli,
						`firma_cli${formState.detalle_cli_modelo.id_cliente}.png`
					);
					const formData = new FormData();
					formData.append('file', file);
					const { data: blobFirma } = await PTApi.post(
						`/storage/blob/create/${data.uid_firma}?container=firmasmembresia`,
						formData
					);
				}
				// const { data: dataEmail } = await PTApi.post('/venta/send-email', { formState });
			}
			setloadingVenta(false);
			// console.log(data, blobFirma);
			// console.log(blobFirma);
			funToast('success', 'Venta', 'Venta agregada con exitos', 'success', 5000);
		} catch (error) {
			console.log(error);
			funToast(
				'error',
				'ERROR(Tomar captura si es necesario)',
				'HUBO UN ERROR',
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
			link.setAttribute('download', 'CONTRATO-CLIENTE.pdf');
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
		obtenerVentasPorFecha,
		dataVentaxFecha,
		IngresosSeparados_x_Fecha,
		loadingVenta,
		msgBox,
		isLoading,
		dataVentas,
		dataVentaxID,
	};
};
