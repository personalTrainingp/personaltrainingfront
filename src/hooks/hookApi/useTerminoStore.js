import { PTApi } from '@/common';
import {
	onSetParametro,
	onSetUltimaMembresiaPorCliente,
} from '@/store/dataParametros/parametroSlice';
import { getProgramaSPT } from '@/store/ventaProgramaPT/programaPTSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTipoCambioStore } from './useTipoCambioStore';
import dayjs, { locale } from 'dayjs';
import { DateMaskString, FormatoDateMask } from '@/components/CurrencyMask';
locale('es');
function ordenarPorIdPgm(data) {
	const orden = [2, 4, 3];
	console.log(data);

	return data.sort((a, b) => {
		return orden.indexOf(a.id_pgm) - orden.indexOf(b.id_pgm);
	});
}
function agruparYOrdenar(datos) {
	// Agrupamos los datos por id_forma_pago
	const resultado = datos.reduce((acumulador, item) => {
		// Buscamos si ya existe el id_forma_pago en el acumulador
		let formaPagoExistente = acumulador.find((fp) => fp.id_forma_pago === item.id_forma_pago);

		if (!formaPagoExistente) {
			// Si no existe, lo creamos
			formaPagoExistente = {
				id_forma_pago: item.id_forma_pago,
				label_param: item.FormaPagoLabel?.label_param || '',
				dataTipoTarjeta: [],
			};
			acumulador.push(formaPagoExistente);
		}

		// Verificamos si id_tipo_tarjeta es diferente de 0
		if (item.id_tipo_tarjeta !== 0) {
			let tipoTarjetaExistente = formaPagoExistente.dataTipoTarjeta.find(
				(tt) => tt.id_tipo_tarjeta === item.id_tipo_tarjeta
			);

			if (!tipoTarjetaExistente) {
				tipoTarjetaExistente = {
					id_tipo_tarjeta: item.id_tipo_tarjeta,
					label_tipo_tarjeta: item.TipoTarjetaLabel?.label_param || '',
					dataTarjeta: [],
				};
				formaPagoExistente.dataTipoTarjeta.push(tipoTarjetaExistente);
			}

			// Verificamos si id_tarjeta es diferente de 0
			if (item.id_tarjeta !== 0) {
				let tarjetaExistente = tipoTarjetaExistente.dataTarjeta.find(
					(t) => t.id_tarjeta === item.id_tarjeta
				);

				if (!tarjetaExistente) {
					tarjetaExistente = {
						id_tarjeta: item.id_tarjeta,
						label_tarjeta: item.TarjetaLabel?.label_param || '',
						dataBancos: [],
					};
					tipoTarjetaExistente.dataTarjeta.push(tarjetaExistente);
				}

				// Verificamos si id_banco es diferente de 0
				if (item.id_banco !== 0) {
					let bancoExistente = tarjetaExistente.dataBancos.find(
						(b) => b.id_banco === item.id_banco
					);

					if (!bancoExistente) {
						bancoExistente = {
							id_banco: item.id_banco,
							label_banco: item.BancoLabel?.label_param || '',
							id: item.id,
						};
						tarjetaExistente.dataBancos.push(bancoExistente);
					}
				} else {
					// Si id_banco es 0, asignamos un array vacío
					tarjetaExistente.dataBancos = [];
				}
			} else {
				// Si id_tarjeta es 0, asignamos un array vacío
				tipoTarjetaExistente.dataTarjeta = [];
			}
		} else {
			// Si id_tipo_tarjeta es 0, asignamos un array vacío
			formaPagoExistente.dataTipoTarjeta = [];
		}

		return acumulador;
	}, []);

	return resultado;
}
export const useTerminoStore = () => {
	//USUARIOS
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const [DataProducMarca, setDataProducMarca] = useState([]);
	const [DataProducCategoria, setDataProducCategoria] = useState([]);
	const [DataProducPresentacion, setDataProducPresentacion] = useState([]);
	const [DataProducProveedor, setDataProducProveedor] = useState([]);
	const [DataClientes, setDataClientes] = useState([]);
	const [DataVendedores, setDataVendedores] = useState([]);
	const [DataAsesores, setDataAsesores] = useState([]);
	const [DataProductosSuplementos, setDataProductosSuplementos] = useState([]);
	const [DataProductosAccesorios, setDataProductosAccesorios] = useState([]);
	const [DataEmpleadosDepVentas, setDataEmpleadosDepVentas] = useState([]);
	const [DataEmpleadosDepNutricion, setDataEmpleadosDepNutricion] = useState([]);
	const [DataSemanaPGM, setDataSemanaPGM] = useState([]);
	const [DataTarifaSM, setDataTarifaSM] = useState([]);
	const [DataHorarioPGM, setDataHorarioPGM] = useState([]);
	const [DataFormaPago, setDataFormaPago] = useState([]);
	const [DataBancos, setDataBancos] = useState([]);
	const [DataTarjetas, setDataTarjetas] = useState([]);
	const [DataTipoTarjetas, setDataTipoTarjetas] = useState([]);
	const [DataGeneral, setDataGeneral] = useState([]);
	const [DataPeriodoParam, setDataPeriodoParam] = useState([]);
	const [dataxParametro, setdataxParametro] = useState('');
	const [programasActivos, setprogramasActivos] = useState([]);
	const [dataCitasxCli, setdataCitasxCli] = useState([]);
	const [dataVendedoresVendieron, setdataVendedoresVendieron] = useState([]);
	const [dataInversionistas, setdataInversionistas] = useState([]);
	const [dataColaboradores, setdataColaboradores] = useState([]);
	const [dataFormaPagoActivo, setdataFormaPagoActivoVentas] = useState([]);
	const [dataUltimaMembresia, setdataUltimaMembresia] = useState([]);
	const [dataTipoAporte, setdataTipoAporte] = useState([]);
	const [paquetesDeServicios, setpaquetesDeServicios] = useState([]);
	const [comboOficio, setcomboOficio] = useState([]);
	const [dataDistritos, setdataDistritos] = useState([]);
	const [dataZonas, setdataZonas] = useState([]);

	const getEtiquetasxEntidadGrupo = async (entidad, grupo) => {
		try {
			let { data } = await PTApi.get(`/parametros/get_params/etiquetas/${entidad}/${grupo}`);

			const etiquetasxValores = data.etiquetasxID.map((t) => {
				return {
					id_fila: t.id_fila,
					value: t.parametro_etiqueta?.id_param,
					label: t.parametro_etiqueta?.label_param,
				};
			});
			return etiquetasxValores;
		} catch (error) {
			console.log(error);
		}
	};
	const getEtiquetasxIdEntidadGrupo = async (entidad, grupo, id_fila) => {
		try {
			let { data } = await PTApi.get(
				`/parametros/get_params/etiquetas/${entidad}/${grupo}/${id_fila}`
			);

			const etiquetasxValores = data.etiquetasxID.map((t) => {
				return {
					value: t.parametro_etiqueta?.id_param,
					label: t.parametro_etiqueta?.label_param,
				};
			});
			return etiquetasxValores;
		} catch (error) {
			console.log(error);
		}
	};
	const putEtiquetaxEntidadxGrupo = async (entidad, grupo, id_fila, etiquetas) => {
		try {
			let { data } = await PTApi.put(
				`/parametros/get_params/etiquetas/${entidad}/${grupo}/${id_fila}`,
				{
					etiquetas,
				}
			);
			console.log('listo');
		} catch (error) {
			console.log(error);
		}
	};
	const postEtiquetaxEntidadxGrupo = async (entidad, grupo, id_fila, etiquetas) => {
		try {
			let { data } = await PTApi.post(
				`/parametros/get_params/etiquetas/${entidad}/${grupo}/${id_fila}`,
				{
					etiquetas,
				}
			);
			console.log('listo');
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerZonas = async (id_enterprice) => {
		try {
			console.log({ id_enterprice });

			let { data } = await PTApi.get(
				`/parametros/get_params/articulo/zonas/${id_enterprice}`
			);
			const dataAlter = data.map((z) => {
				return {
					label: `${z.nombre_zona} - NIVEL ${z.nivel}`,
					value: z.id,
				};
			});

			setdataZonas(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDepartamentos = async (id_provincia, id_departamento) => {
		try {
			const { data } = await PTApi.get(
				`/parametros/get_params/distritos/${id_departamento}/${id_provincia}`
			);
			setdataDistritos(data);
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
	const obtenerOficios = async () => {
		try {
			let { data } = await PTApi.get('/parametros/get_params/proveedor/tipo_oficio');
			setcomboOficio(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTiposDeAportes = async () => {
		try {
			let { data } = await PTApi.get('/parametros/get_params/tipo_aporte');
			setdataTipoAporte(data.tipo);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerFormaDePagosActivos = async () => {
		try {
			let { data } = await PTApi.get('/parametros/get_params/forma_pago');
			// console.log(agruparYOrdenar(data.formaPago));
			// data = data.map((e) => {
			// 	console.log(e);
			// });
			// obtenerTipoCambioPorFecha(new Date());
			// data = data.map((e) => {
			// 	return {
			// 		value: e.value,
			// 		label: `${e.label} ${e.value === 4 ? `| S/ ${tipocambio.precio_compra}` : ''}`,
			// 	};
			// });
			// const FormaPago = data.formaPago.map(f=>{
			// 	return{
			// 		value: f.id,
			//         label: f.descripcion
			// 	}
			// })
			setdataFormaPagoActivoVentas(agruparYOrdenar(data.formaPago));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDataColaboradores = async () => {
		try {
			const { data } = await PTApi.get('/parametros/get_params/colaboradores');
			setdataColaboradores(data.colaboradores);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerInversionistaRegistrados = async () => {
		try {
			const { data } = await PTApi.get('/parametros/get_params/inversionistas');
			setdataInversionistas(data.inversionistas);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerUltimaMembresiaPorCliente = async (uid_cli) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.get(
				`/parametros/get_params/get_estado_membresia_cli/${uid_cli}`
			);

			dispatch(onSetUltimaMembresiaPorCliente(data.membresias));
			setdataUltimaMembresia(data.membresias);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosxENTIDAD = async (entidad) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/${entidad}`);
			dispatch(onSetParametro(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametroPorEntidadyGrupo = async (entidad, grupo) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/${entidad}/${grupo}`);
			setDataGeneral(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametroPorEntidadyGrupo_PERIODO = async (entidad, grupo) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params_periodo/${entidad}/${grupo}`);
			setDataPeriodoParam(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosFormaPago = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/formapago/formapago`);
			setDataFormaPago(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosBancos = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/formapago/banco`);
			setDataBancos(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosTarjetas = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/formapago/tarjeta`);
			setDataTarjetas(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosTipoTarjeta = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/formapago/tipo_tarjeta`);
			setDataTipoTarjetas(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosProductoMarcas = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/producto/marca`);
			setDataProducMarca(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosProductoCategorias = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/producto/categoria`);
			setDataProducCategoria(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosProductoPresentacion = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/producto/presentacion`);
			setDataProducPresentacion(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosProductoProveedor = async () => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.get(`/parametros/get_params/producto/proveedor`);
			setDataProducProveedor(data);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosClientes = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/clientes`);
			// console.log(data);
			// console.log(data);
			setDataClientes(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosAsesores = async () => {
		try {
			setIsLoading(true);
			const { data: asesoresFit } = await PTApi.get(`/parametros/get_params/empleados/2`);
			setDataAsesores([...asesoresFit]);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosVendedores = async () => {
		try {
			setIsLoading(true);
			const { data: asesoresFit } = await PTApi.get(`/parametros/get_params/empleados/2`);
			const { data: personalFito } = await PTApi.get(`/parametros/get_params/empleados/4`);
			const { data: personalEntrenadores } = await PTApi.get(
				`/parametros/get_params/empleados/1`
			);
			const { data: personalNutricion } = await PTApi.get(
				`/parametros/get_params/empleados/3`
			);
			setDataVendedores([
				...asesoresFit,
				...personalFito,
				...personalEntrenadores,
				...personalNutricion,
			]);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerEmpleadosPorDepartamentoNutricion = async (id) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/empleados/3`);
			setDataEmpleadosDepNutricion(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosProductosCategoriaAccesorios = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/productos/18`);
			setDataProductosAccesorios(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosEmpleadosxDepartamentoVentas = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/empleados/36`);
			setDataEmpleadosDepVentas(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosProductosCategoriaSuplementos = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/productos/17`);
			setDataProductosSuplementos(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosLogosProgramas = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/programaslogos`);

			dispatch(getProgramaSPT(ordenarPorIdPgm(data)));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerHorariosPorPrograma = async (id_pgm) => {
		try {
			let { data } = await PTApi.get(`/parametros/get_params/horario_PGM/${id_pgm}`);

			data = data
				.map((d) => {
					return {
						...d,
						H: dayjs(d.horario.split('.000Z')[0]).locale('es').format('hh:mm A'),
						// horario: dayjs(d.horario.split('ZT')[1]).locale('es').format('hh:mm'),
						// label: dayjs(d.horario.trim()).format('LT'),
					};
				})
				.sort((a, b) => a.horario.localeCompare(b.horario))
				.map((r) => {
					return {
						...r,
						horario: r.H,
						//2024-01-01T08:00:00
						// R: r.horario.split('.000Z')[0],
						// H: dayjs(r.horario.split('.000Z')[0]).locale('es').format('hh:mm A'),
						label: `HORA DE INICIO: ${r.H} | aforo: ${r.aforo}`,
					};
				});
			console.log(data);
			setDataHorarioPGM(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerSemanasPorPrograma = async (id_pgm) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/semanas_PGM/${id_pgm}`);
			setDataSemanaPGM(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTarifasPorSemanas = async (id_sm) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/tarifa_sm/${id_sm}`);
			setDataTarifaSM(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametroPorID = async (id_param) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/${id_param}`);
			setdataxParametro(data.label_param);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProgramasActivos = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/programas-activos`);
			setprogramasActivos(data.programasActivos);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCitasDisponiblesXcli = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/programas-activos`);
			setdataCitasxCli(data.citasDisponibles);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVendedores_vendieron = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/vendedores_vendiendo`);
			setdataVendedoresVendieron(data.vendedores);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerPaqueteDeServicioParaVender = async (tipo_serv) => {
		try {
			const { data } = await PTApi.get(
				`/parametros/get_params/pack-venta-servicio/${tipo_serv}`
			);
			setpaquetesDeServicios(data.fitology);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		getEtiquetasxEntidadGrupo,
		putEtiquetaxEntidadxGrupo,
		getEtiquetasxIdEntidadGrupo,
		postEtiquetaxEntidadxGrupo,
		obtenerDistritosxDepxProvincia,
		obtenerParametrosProductoMarcas,
		obtenerParametrosProductoCategorias,
		obtenerParametrosProductoPresentacion,
		obtenerParametrosProductoProveedor,
		obtenerParametrosClientes,
		obtenerParametrosVendedores,
		obtenerParametrosAsesores,
		obtenerParametrosProductosCategoriaAccesorios,
		obtenerParametrosProductosCategoriaSuplementos,
		obtenerParametrosEmpleadosxDepartamentoVentas,
		obtenerParametrosLogosProgramas,
		obtenerHorariosPorPrograma,
		obtenerSemanasPorPrograma,
		obtenerTarifasPorSemanas,
		obtenerParametrosFormaPago,
		obtenerParametrosBancos,
		obtenerParametrosTarjetas,
		obtenerParametrosTipoTarjeta,
		obtenerParametroPorID,
		obtenerParametrosxENTIDAD,
		obtenerParametroPorEntidadyGrupo,
		obtenerProgramasActivos,
		obtenerCitasDisponiblesXcli,
		obtenerUltimaMembresiaPorCliente,
		obtenerVendedores_vendieron,
		obtenerInversionistaRegistrados,
		obtenerDataColaboradores,
		obtenerFormaDePagosActivos,
		obtenerTiposDeAportes,
		obtenerPaqueteDeServicioParaVender,
		obtenerEmpleadosPorDepartamentoNutricion,
		obtenerOficios,
		obtenerParametroPorEntidadyGrupo_PERIODO,
		obtenerZonas,
		dataZonas,
		DataPeriodoParam,
		DataAsesores,
		dataDistritos,
		comboOficio,
		DataEmpleadosDepNutricion,
		paquetesDeServicios,
		dataUltimaMembresia,
		dataFormaPagoActivo,
		dataColaboradores,
		dataInversionistas,
		dataVendedoresVendieron,
		dataCitasxCli,
		programasActivos,
		dataxParametro,
		DataBancos,
		DataTarjetas,
		DataTipoTarjetas,
		DataFormaPago,
		DataProducMarca,
		DataProducCategoria,
		DataProducPresentacion,
		DataProducProveedor,
		DataClientes,
		DataVendedores,
		DataProductosSuplementos,
		DataProductosAccesorios,
		DataEmpleadosDepVentas,
		DataSemanaPGM,
		DataTarifaSM,
		DataHorarioPGM,
		isLoading,
		DataGeneral,
	};
};
