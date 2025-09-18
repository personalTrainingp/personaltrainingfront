import { PTApi } from '@/common';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import dayjs, { utc } from 'dayjs';
dayjs.extend(utc);

function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS');

	return formatted;
}
function desestructurarVentas(ventas) {
	const resultado = {
		servicios: [],
		productos: [],
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
			tarifa_monto_total: totalMembresia + totalProducto,
		};
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

		(venta.detalle_ventaservicios || []).forEach((serv) => {
			resultado.servicios.push({
				...base,
				serv: {
					...serv,
					servicio: serv.circus_servicio || {},
				},
				tarifa_monto: serv.tarifa_monto || 0,
			});
		});
	});

	return resultado;
}

const agruparPorMes = (arr) => {
	return Object.values(
		arr.reduce((acc, item) => {
			// clave YYYY-MMMM en zona horaria de Lima
			const key = dayjs.utc(item.fecha).tz('America/Lima').format('YYYY-MMMM');

			if (!acc[key]) {
				acc[key] = { fecha: key, items: [] };
			}
			acc[key].items.push(item);
			return acc;
		}, {})
	);
};

export const useVentasStore = () => {
	const dispatch = useDispatch();
	const [dataVentas, setDataVentas] = useState([]);
	const [dataLead, setDataLead] = useState([]);
	const [dataLeadPorMesAnio, setdataLeadPorMesAnio] = useState([]);
	const [dataVentaxID, setdataVentaxID] = useState({});
	const [isLoading, setisLoading] = useState(false);
	const [loadingVenta, setloadingVenta] = useState(false);
	const [msgBox, setmsgBox] = useState({});
	const [dataVentaxFecha, setdataVentaxFecha] = useState([]);
	const [IngresosSeparados_x_Fecha, setIngresosSeparados_x_Fecha] = useState([]);
	const [dataComprobante, setdataComprobante] = useState({});
	const [loadingMessage, setloadingMessage] = useState('');
	const [dataContratos, setdataContratos] = useState([]);
	const { base64ToFile } = helperFunctions();

	const obtenerLeads = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/lead/leads/${id_empresa}`);

			const dataAlter = agruparPorMes(data?.leads).map((lead) => {
				return {
					[lead.fecha]: {
						inversiones_redes: lead.items.reduce(
							(total, item) => item.monto + total,
							0
						),
						leads: lead.items.reduce((total, item) => Number(item.cantidad) + total, 0),
						cpl: Number(
							`${lead.items.reduce((total, item) => item.monto + total, 0) / lead.items.reduce((total, item) => Number(item.cantidad) + total, 0)}`
						).toFixed(2),
					},
				};
			});
			console.log({ data: data.leads, dataAl: agruparPorMes(data?.leads), dataAlter });
			setDataLead(data.leads);
			setdataLeadPorMesAnio(agruparPorMes(data?.leads));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVentasxComprobantes = async (id_comprobante) => {
		try {
			const { data } = await PTApi.get(
				`/venta/obtener-ventas-x-comprobante/${id_comprobante}/599`
			);
			setdataComprobante(data.ventas);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVentasPorFecha = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas-x-fecha/599', {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			// setIngresosSeparados_x_Fecha(resultado);
			setdataVentaxFecha(desestructurarVentas(data.ventas));
		} catch (error) {
			console.log(error);
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
	const obtenerTablaVentas = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/venta/get-ventas/598`);
			console.log({ dv: data.ventas });
			const dataAlter = data.ventas
				.filter((vt) => vt.id_tipoFactura !== 703)
				.map((venta) => {
					return {
						...venta,
						// fecha_venta: formatDateToSQLServerWithDayjs(venta.fecha_venta, false),
					};
				});
			setDataVentas(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerLeads,
		obtenerTablaVentas,
		obtenerVentaporId,
		obtenerVentasPorFecha,
		obtenerVentasxComprobantes,
		dataLeadPorMesAnio,
		dataLead,
		dataComprobante,
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
