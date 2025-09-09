import { PTApi } from '@/common';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { onSetDataView } from '@/store/data/dataSlice';
import dayjs, { utc } from 'dayjs';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useTipoCambioStore } from './useTipoCambioStore';
dayjs.extend(utc);

function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');

	return formatted;
}
function desestructurarVentas(ventas) {
	const resultado = {
		membresias: [],
		productos: [],
		citas: [],
	};

	ventas.forEach((venta) => {
		// Calcular total de tarifa_monto por cada tipo
		const totalMembresia = (venta.detalle_ventaMembresia || []).reduce(
			(acc, m) => acc + (m.tarifa_monto || 0),
			0
		);
		const totalProducto = (venta.detalle_ventaProductos || []).reduce(
			(acc, p) => acc + (p.tarifa_monto || 0),
			0
		);
		const totalCita = (venta.detalle_ventaCitas || []).reduce(
			(acc, c) => acc + (c.tarifa_monto || 0),
			0
		);

		const base = {
			id: venta.id,
			id_cli: venta.id_cli,
			id_empl: venta.id_empl,
			id_tipoFactura: venta.id_tipoFactura,
			id_origen: venta.id_origen,
			numero_transac: venta.numero_transac,
			flag: venta.flag,
			fecha_venta: venta.fecha_venta,
			cliente: venta.tb_cliente || {},
			empleado: venta.tb_empleado || {},
			pagos: venta.detalle_ventaPagoVenta || [],
			tarifa_monto_total: totalMembresia + totalProducto + totalCita,
		};

		(venta.detalle_ventaMembresia || []).forEach((membresia) => {
			resultado.membresias.push({
				...base,
				membresia: {
					...membresia,
					programa: membresia.tb_programa_training || {},
					semana: membresia.tb_semanas_training || {},
				},
				tarifa_monto: membresia.tarifa_monto || 0,
			});
		});

		(venta.detalle_ventaProductos || []).forEach((producto) => {
			resultado.productos.push({
				...base,
				producto: {
					...producto,
					producto: producto.tb_producto || {},
				},
				tarifa_monto: producto.tarifa_monto || 0,
			});
		});

		(venta.detalle_ventaServicios || []).forEach((servicio) => {
			resultado.servicios.push({
				...base,
				servicios: {
					...servicio,
					servicio: servicio.tb_producto || {},
				},
				tarifa_monto: producto.tarifa_monto || 0,
			});
		});

		(venta.detalle_ventaCitas || []).forEach((cita) => {
			resultado.citas.push({
				...base,
				cita: {
					...cita,
					servicio: cita.tb_servicio || {},
				},
				tarifa_monto: cita.tarifa_monto || 0,
			});
		});
	});

	return resultado;
}

export const useVentasStore = () => {
	const dispatch = useDispatch();
	const [dataVentas, setDataVentas] = useState([]);
	const [dataVentaxID, setdataVentaxID] = useState({});
	const [isLoading, setisLoading] = useState(false);
	const [loadingVenta, setloadingVenta] = useState(false);
	const [msgBox, setmsgBox] = useState({});
	const [dataVentaxFecha, setdataVentaxFecha] = useState({});
	const [IngresosSeparados_x_Fecha, setIngresosSeparados_x_Fecha] = useState([]);
	const [loadingMessage, setloadingMessage] = useState('');
	const [dataContratos, setdataContratos] = useState([]);
	const { base64ToFile } = helperFunctions();
	const { obtenerTipoCambioPorFecha, dataTipoCambio } = useTipoCambioStore()
	const obtenerContratosDeClientes = async () => {
		try {
			dispatch(onSetDataView([]));
			const { data } = await PTApi.get('/venta/obtener-contratos-clientes/598');
			dispatch(onSetDataView(data.datacontratosConMembresias));
			setdataContratos(data.datacontratosConMembresias);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const agregarFirmaEnContratoCliente = async (file, idVenta) => {
		try {
			const formData = new FormData();
			const lector = new FileReader();
			lector.readAsDataURL(file);
			formData.append('file', file);
			setloadingMessage('CARGANDO');
			const { data: dataVentaMembresia } = await PTApi.get(`/venta/get-id-ventas/${idVenta}`);
			const { data: blobFirma } = await PTApi.post(
				`/storage/blob/create/${dataVentaMembresia.venta[0].detalle_ventaMembresia[0].uid_firma}?container=firmasmembresia`,
				formData
			);
			setloadingMessage('FIRMA AGREGADA');
			setTimeout(() => {}, 3000);
			setloadingMessage('ENVIANDO A SU CORREO');

			const { data: dataMail } = await PTApi.post(`/venta/invoice-mail/${idVenta}`, {
				firma_base64: lector.result,
			});
			setloadingMessage('CORREO ENVIADO');
			setTimeout(() => {}, 3000);
			setloadingMessage('GUARDANDO CONTRATO');
			const file_contratoPDF = base64ToFile(
				dataMail.base64_contratoPDF,
				`contrato_${dataVentaMembresia.id_cli}.pdf`
			);
			const formData_contratoPDF = new FormData();
			formData_contratoPDF.append('file', file_contratoPDF);

			const { data: blobContrato } = await PTApi.post(
				`/storage/blob/create/${dataVentaMembresia.venta[0].detalle_ventaMembresia[0].uid_contrato}?container=contratos-cli`,
				formData_contratoPDF
			);
			obtenerContratosDeClientes();
			setloadingMessage('CONTRATO GUARDADO');
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerVentasPorFecha = async (arrayDate, id_empresa) => {
		try {
			console.log({
				arrayDate,
				arrayDates: [
					formatDateToSQLServerWithDayjs(arrayDate[0], true),
					formatDateToSQLServerWithDayjs(arrayDate[1], false),
				],
			});

			const { data } = await PTApi.get(`/venta/get-ventas-x-fecha/${id_empresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
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
			console.log({ resve: resultado, data, destr: desestructurarVentas(data.ventas) });

			setIngresosSeparados_x_Fecha(resultado);
			setdataVentaxFecha(desestructurarVentas(data.ventas));
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterVenta = async (formState, funToast) => {
		try {
			setloadingVenta(true);
			console.log(formState);

			const { data } = await PTApi.post('/venta/post-ventas/598', formState);

			if (formState.dataVenta.detalle_venta_programa[0]?.firmaCli) {
				const file = base64ToFile(
					formState.dataVenta.detalle_venta_programa[0].firmaCli,
					`firma_cli${formState.detalle_cli_modelo.id_cli}.png`
				);
				const formData = new FormData();
				formData.append('file', file);
				const { data: blobFirma } = await PTApi.post(
					`/storage/blob/create/${data.uid_firma}?container=firmasmembresia`,
					formData
				);
				const { data: dataMail } = await PTApi.post(`/venta/invoice-mail/${data.idVenta}`, {
					firma_base64: formState.dataVenta.detalle_venta_programa[0].firmaCli,
				});
				const file_contratoPDF = base64ToFile(
					dataMail.base64_contratoPDF,
					`contrato_${formState.detalle_cli_modelo.id_cli}.pdf`
				);
				const formData_contratoPDF = new FormData();
				formData_contratoPDF.append('file', file_contratoPDF);
				// console.log(formData_contratoPDF);

				const { data: blobContrato } = await PTApi.post(
					`/storage/blob/create/${data.uid_contrato}?container=contratos-cli`,
					formData_contratoPDF
				);
			}
			setloadingVenta(false);

			if (data.ok == false) {
				return Swal.fire('Error', 'Error, el socio es nuevo', 'error');
			}
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
			setloadingVenta(false);
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
	const obtenerVentasDeMembresiasxEmpresa = async () => {
		try {
			setLoading(true);
			const { data } = await PTApi.get('/programaTraining/membresias-empresa');
			setLoading(false);
			setdataMembresiasEmpresa(data.membresias);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTablaVentas = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/venta/get-ventas/${id_empresa}`);
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
			console.log(formState);

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
		agregarFirmaEnContratoCliente,
		startRegisterVenta,
		obtenerTablaVentas,
		obtenerPDFCONTRATOgenerado,
		obtenerVentaporId,
		obtenerVentasPorFecha,
		obtenerContratosDeClientes,
		loadingMessage,
		dataVentaxFecha,
		IngresosSeparados_x_Fecha,
		loadingVenta,
		msgBox,
		isLoading,
		dataVentas,
		dataVentaxID,
		dataContratos,
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
