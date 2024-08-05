import { PTApi } from '@/common';
import {
	onSetParametro,
	onSetUltimaMembresiaPorCliente,
} from '@/store/dataParametros/parametroSlice';
import { getProgramaSPT } from '@/store/ventaProgramaPT/programaPTSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

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
	const [DataProductosSuplementos, setDataProductosSuplementos] = useState([]);
	const [DataProductosAccesorios, setDataProductosAccesorios] = useState([]);
	const [DataEmpleadosDepVentas, setDataEmpleadosDepVentas] = useState([]);
	const [DataSemanaPGM, setDataSemanaPGM] = useState([]);
	const [DataTarifaSM, setDataTarifaSM] = useState([]);
	const [DataHorarioPGM, setDataHorarioPGM] = useState([]);
	const [DataFormaPago, setDataFormaPago] = useState([]);
	const [DataBancos, setDataBancos] = useState([]);
	const [DataTarjetas, setDataTarjetas] = useState([]);
	const [DataTipoTarjetas, setDataTipoTarjetas] = useState([]);
	const [DataGeneral, setDataGeneral] = useState([]);
	const [dataxParametro, setdataxParametro] = useState('');
	const [programasActivos, setprogramasActivos] = useState([]);
	const [dataCitasxCli, setdataCitasxCli] = useState([]);
	const [dataVendedoresVendieron, setdataVendedoresVendieron] = useState([]);
	const [dataInversionistas, setdataInversionistas] = useState([]);
	const [dataColaboradores, setdataColaboradores] = useState([]);
	const [dataFormaPagoActivo, setdataFormaPagoActivo] = useState([]);
	const [dataUltimaMembresia, setdataUltimaMembresia] = useState([]);
	const obtenerFormaDePagosActivos = async () => {
		try {
			const { data } = await PTApi.get('/parametros/get_params/forma_pago');
			console.log(data);
			setdataFormaPagoActivo(data);
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
	const obtenerUltimaMembresiaPorCliente = async (id_cli) => {
		try {
			const { data } = await PTApi.get(
				`/parametros/get_params/get_estado_membresia_cli/${id_cli}`
			);
			console.log(data);
			// dispatch(onSetUltimaMembresiaPorCliente(data ? data.detalle_ventaMembresia[0] : []));
			setdataUltimaMembresia(data ? data.detalle_ventaMembresia[0] : []);
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
	const obtenerParametrosVendedores = async () => {
		try {
			setIsLoading(true);
			const { data: asesoresFit } = await PTApi.get(`/parametros/get_params/empleados/2`);
			const { data: personalFito } = await PTApi.get(`/parametros/get_params/empleados/4`);
			setDataVendedores([...asesoresFit, ...personalFito]);
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
			dispatch(getProgramaSPT(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerHorariosPorPrograma = async (id_pgm) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/horario_PGM/${id_pgm}`);
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
	return {
		obtenerParametrosProductoMarcas,
		obtenerParametrosProductoCategorias,
		obtenerParametrosProductoPresentacion,
		obtenerParametrosProductoProveedor,
		obtenerParametrosClientes,
		obtenerParametrosVendedores,
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
