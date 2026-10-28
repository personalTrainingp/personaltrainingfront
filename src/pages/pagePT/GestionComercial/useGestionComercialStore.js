import { PTApi } from '@/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewComercial } from './dataComercialSlice';
import Swal from 'sweetalert2';
import { arrayEstadoComercial } from '@/types/type';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

dayjs.extend(utc);

export const useGestionComercialStore = () => {
	const [dataEmpleados, setdataEmpleados] = useState([]);
	const [dataCanales, setdataCanales] = useState([]);
	const [dataMedioComunicacion, setdataMedioComunicacion] = useState([]);
	const [dataEstadoComercial, setdataEstadoComercial] = useState([]);
	const [dataNivelInteres, setdataNivelInteres] = useState([]);
	const [dataDistritos, setdataDistritos] = useState([]);
	const [dataTareas, setdataTareas] = useState([]);
	const [dataClientes, setdataClientes] = useState([]);
	const [dataMembresiasCliente, setdataMembresiasCliente] = useState([]);
	const [dataTareasReporte, setdataTareasReporte] = useState([]);
	const [isLoadingTareasReporte, setisLoadingTareasReporte] = useState(false);
	const [dataUltimasMetas, setdataUltimasMetas] = useState([]);
	const [isLoadingMembresias, setisLoadingMembresias] = useState(false);
	const [prospectosHastaAyer, setprospectosHastaAyer] = useState(null);
	const [dataProspectosMes, setdataProspectosMes] = useState([]);
	const [dataSociosSinProspecto, setdataSociosSinProspecto] = useState([]);
	const dispatch = useDispatch();
	// Prospectos por redes (tb_leadsDia): total de ayer y el detalle del mes actual
	const obtenerProspectosHastaAyer = async () => {
		try {
			const { data } = await PTApi.get('/prospectos-redes');
			const ayer = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
			const mesActual = dayjs().format('YYYY-MM');
			// fecha llega como 2026-10-14T00:00:00.000Z: se compara solo el dia
			const prospectos = data.prospectosRedes.map((p) => ({
				...p,
				fecha: String(p.fecha).slice(0, 10),
				cantidad: Number(p.cantidad ?? 0),
				monto: Number(p.monto ?? 0),
			}));
			const total = prospectos.reduce((acc, p) => (p.fecha === ayer ? acc + p.cantidad : acc), 0);
			setprospectosHastaAyer(total);
			setdataProspectosMes(
				prospectos
					.filter((p) => p.fecha.startsWith(mesActual))
					.sort((a, b) => a.fecha.localeCompare(b.fecha))
			);
		} catch (error) {
			console.log(error);
		}
	};
	const postGestionComercial = async (formState) => {
		try {
			const { data } = await PTApi.post('/prospecto/lead/', formState);
			obtenerGestionComercial();
			return true;
		} catch (error) {
			console.log(error);
			Swal.fire({ icon: 'error', title: error.response?.data?.msg || 'No se pudo registrar el lead' });
			return false;
		}
	};
	// el backend revisa si el id_empl del lead es el colaborador del usuario logueado
	const validarEdicionLead = async (id) => {
		try {
			await PTApi.get(`/prospecto/lead/puede-editar/${id}`);
			return true;
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: error.response?.data?.msg || 'No se pudo validar el lead',
			});
			return false;
		}
	};
	const putGestionComercial = async (id, formState) => {
		try {
			const { data } = await PTApi.put(`/prospecto/lead/id/${id}`, formState);
			obtenerGestionComercial();
		} catch (error) {
			console.log(error);
			if (error.response?.status === 403) {
				Swal.fire({ icon: 'error', title: error.response.data?.msg });
			}
		}
	};
	const obtenerGestionComercial = async () => {
		try {
			const { data } = await PTApi.get('/prospecto/lead/');
			dispatch(onSetDataViewComercial(data.prospectosLeads));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerEmpleadosVendedores = async () => {
		try {
			const { data } = await PTApi.get(`/empleado/departamento/2/id_empresa/598`);
			const dataMap = data.empleados.map((f) => {
				return {
					label: f.nombre_empl,
					value: f.id_empl,
				};
			});
			console.log({ data: dataMap });

			setdataEmpleados(dataMap);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCanales = async () => {
		try {
			const { data } = await PTApi.get('/terminologia/term1/comercial/canal');
			const dataMap = data.terminologia.map((t) => {
				return {
					label: t.label_param,
					value: t.id_param,
				};
			});
			setdataCanales(dataMap);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMedioComunicacion = async () => {
		try {
			const { data } = await PTApi.get('/terminologia/term1/comercial/medio-comunicacion');
			const dataMap = data.terminologia.map((t) => {
				return {
					label: t.label_param,
					value: t.id_param,
				};
			});
			setdataMedioComunicacion(dataMap);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerClientes = async () => {
		try {
			const { data } = await PTApi.get('/parametros/get_params/clientes/598');
			setdataClientes([{ label: 'SIN HISTORIAL', value: 0 }, ...data]);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerEstadosComerciales = async () => {
		try {
			const { data } = await PTApi.get('/terminologia/term1/comercial/estado');
			const dataMap = data.terminologia.map((t) => {
				return {
					label: t.label_param,
					value: t.id_param,
				};
			});
			setdataEstadoComercial(ordenarEstadosComerciales(dataMap));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerNivelesInteres = async () => {
		try {
			const { data } = await PTApi.get('/terminologia/term1/comercial/nivel-interes');
			const dataMap = data.terminologia.map((t) => {
				return {
					label: t.label_param,
					value: t.id_param,
				};
			});
			setdataNivelInteres(dataMap);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDistritosDeLima = async () => {
		try {
			const { data: dataLima } = await PTApi.get(`/parametros/get_params/distritos/15/1501`);
			const { data: dataCallao } = await PTApi.get(`/parametros/get_params/distritos/7/701`);

			const dataDistritoMAP = [...dataLima, ...dataCallao];
			setdataDistritos(dataDistritoMAP);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDistritosxDepxProvincia = async (id_provincia, id_departamento) => {
		try {
			const { data } = await PTApi.get(
				`/parametros/get_params/distritos/${id_departamento}/${id_provincia}`
			);
			setdataDistritos(data);
		} catch (error) {
			console.log(error);
		}
	};
	// Excel de clientes en seguimiento que no estan en prospectos (sin repetidos)
	const descargarClientesSinProspecto = async () => {
		try {
			const { data } = await PTApi.get('/prospecto/lead/clientes-sin-prospecto');
			const hoy = dayjs().format('YYYY-MM-DD');
			const wb = new ExcelJS.Workbook();
			const ws = wb.addWorksheet('Sin prospecto');
			ws.columns = [
				{ header: 'ID CLIENTE', key: 'id_cli', width: 12 },
				{ header: 'NOMBRES', key: 'nombres', width: 22 },
				{ header: 'APELLIDOS', key: 'apellidos', width: 28 },
				{ header: 'DNI', key: 'dni', width: 13 },
				{ header: 'CELULAR', key: 'celular', width: 14 },
				{ header: 'EMAIL', key: 'email', width: 30 },
				{ header: 'ULTIMO PROGRAMA', key: 'programa', width: 18 },
				{ header: 'MONTO ULT. MEMBRESIA', key: 'monto', width: 20 },
				{ header: 'FECHA VENTA', key: 'fecha_venta', width: 14 },
				{ header: 'VENDEDOR', key: 'vendedor', width: 30 },
				{ header: 'FECHA VENCIMIENTO', key: 'fecha_vencimiento', width: 18 },
				{ header: 'ESTADO', key: 'estado', width: 10 },
				{ header: 'N° MEMBRESIAS', key: 'cantidad_membresias', width: 15 },
			];
			data.clientes.forEach((c) => {
				// fecha_vencimiento es "solo fecha" (medianoche UTC): se toma el dia en UTC
				const vencimiento = c.fecha_vencimiento ? dayjs.utc(c.fecha_vencimiento).format('YYYY-MM-DD') : '';
				ws.addRow({
					id_cli: c.id_cli,
					nombres: (c.nombre_cli ?? '').trim(),
					apellidos: [c.apPaterno_cli, c.apMaterno_cli].map((a) => (a ?? '').trim()).filter(Boolean).join(' '),
					dni: (c.numDoc_cli ?? '').trim(),
					celular: c.tel_cli,
					email: c.email_cli,
					programa: c.name_pgm ?? '',
					monto: Number(c.tarifa_monto) || 0,
					fecha_venta: c.fecha_venta ? dayjs(c.fecha_venta).format('DD/MM/YYYY') : '',
					vendedor: (c.vendedor ?? '').trim(),
					fecha_vencimiento: vencimiento ? dayjs(vencimiento).format('DD/MM/YYYY') : '',
					estado: vencimiento && vencimiento >= hoy ? 'ACTIVO' : 'VENCIDO',
					cantidad_membresias: c.cantidad_membresias,
				});
			});
			ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
			ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
			ws.getColumn('monto').numFmt = '"S/ "#,##0.00';
			ws.views = [{ state: 'frozen', ySplit: 1 }];
			ws.autoFilter = { from: 'A1', to: 'M1' };
			const buffer = await wb.xlsx.writeBuffer();
			saveAs(new Blob([buffer]), `clientes_seguimiento_sin_prospecto_${dayjs().format('DDMMYYYY')}.xlsx`);
		} catch (error) {
			console.log(error);
			Swal.fire({ icon: 'error', title: 'No se pudo descargar el Excel' });
		}
	};
	// Socios de seguimiento (activos e inactivos) que no estan en prospectos, uno por id_cli
	const obtenerSociosActivosSinProspecto = async () => {
		try {
			const { data } = await PTApi.get('/prospecto/lead/clientes-sin-prospecto');
			const hoy = dayjs().format('YYYY-MM-DD');
			const socios = new Map();
			data.clientes.forEach((c) => {
				const vencimiento = c.fecha_vencimiento ? dayjs.utc(c.fecha_vencimiento).format('YYYY-MM-DD') : '';
				if (!c.id_cli) return;
				// si se repite el id_cli se queda el de vencimiento mas reciente
				const previo = socios.get(c.id_cli);
				if (!previo || vencimiento > previo.vencimiento)
					socios.set(c.id_cli, { ...c, vencimiento, activo: vencimiento !== '' && vencimiento >= hoy });
			});
			setdataSociosSinProspecto([...socios.values()]);
		} catch (error) {
			console.log(error);
			setdataSociosSinProspecto([]);
		}
	};
	const obtenerTareasReporte = async () => {
		try {
			setisLoadingTareasReporte(true);
			const { data } = await PTApi.get('/prospecto/lead/tareas/reporte');
			setdataTareasReporte(data.tareas);
		} catch (error) {
			console.log(error);
		} finally {
			setisLoadingTareasReporte(false);
		}
	};
	// Ultima meta registrada de cada asesor (gestion de metas)
	const obtenerUltimasMetasAsesores = async () => {
		try {
			const { data } = await PTApi.get('/meta/meta_asesor/ultimas');
			setdataUltimasMetas(data.ultimasMetas);
		} catch (error) {
			console.log(error);
			setdataUltimasMetas([]);
		}
	};
	const obtenerMembresiasxCliente = async (id_cli) => {
		try {
			setisLoadingMembresias(true);
			setdataMembresiasCliente([]);
			const { data } = await PTApi.get(`/prospecto/lead/cliente/${id_cli}/membresias`);
			setdataMembresiasCliente(data.membresias);
		} catch (error) {
			console.log(error);
		} finally {
			setisLoadingMembresias(false);
		}
	};
	const obtenerTareasxProspecto = async (id_prospecto) => {
		try {
			setdataTareas([]);
			const { data } = await PTApi.get(`/prospecto/lead/tarea/${id_prospecto}`);
			setdataTareas(data.tareas);
		} catch (error) {
			console.log(error);
		}
	};
	const postTareaProspecto = async (formState) => {
		try {
			await PTApi.post('/prospecto/lead/tarea', formState);
			await obtenerTareasxProspecto(formState.id_prospecto);
			return true;
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL REGISTRAR LA TAREA',
				showConfirmButton: false,
				timer: 1500,
			});
			return false;
		}
	};
	return {
		validarEdicionLead,
		obtenerProspectosHastaAyer,
		prospectosHastaAyer,
		dataProspectosMes,
		obtenerTareasxProspecto,
		obtenerMembresiasxCliente,
		descargarClientesSinProspecto,
		obtenerSociosActivosSinProspecto,
		dataSociosSinProspecto,
		obtenerTareasReporte,
		dataTareasReporte,
		isLoadingTareasReporte,
		obtenerUltimasMetasAsesores,
		dataUltimasMetas,
		dataMembresiasCliente,
		isLoadingMembresias,
		postTareaProspecto,
		dataTareas,
		obtenerDistritosxDepxProvincia,
		obtenerDistritosDeLima,
		obtenerEmpleadosVendedores,
		postGestionComercial,
		putGestionComercial,
		obtenerGestionComercial,
		obtenerCanales,
		obtenerMedioComunicacion,
		obtenerEstadosComerciales,
		dataDistritos,
		dataEstadoComercial,
		obtenerNivelesInteres,
		dataNivelInteres,
		obtenerClientes,
		dataClientes,
		dataMedioComunicacion,
		dataEmpleados,
		dataCanales,
	};
};

// Ordena segun arrayEstadoComercial; los estados no listados van al final
export const ordenarEstadosComerciales = (estados) => {
	const orden = (value) => {
		const i = arrayEstadoComercial.findIndex((e) => e.value === value);
		return i === -1 ? arrayEstadoComercial.length : i;
	};
	return [...estados].sort((a, b) => orden(a.value) - orden(b.value));
};
