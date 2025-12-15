import { useEffect, useState } from 'react';
import { PTApi } from '@/common';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';

export const useFetchTerminosOnShow = (show, entidad, grupo) => {
	const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore();

	useEffect(() => {
		if (show) obtenerParametroPorEntidadyGrupo(entidad, grupo);
	}, [show, entidad, grupo]);

	return DataGeneral;
};
export const useFetchTerminosOnShowxEMPRESA = (show, entidad, grupo, empresa) => {
	const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore();

	useEffect(() => {
		if (show) obtenerParametroPorEntidadyGrupo(entidad, grupo);
	}, [show, entidad, grupo]);

	return DataGeneral;
};
export const obtenerClientesxEmpresaOnShow = (show, id_empresa) => {
	const { obtenerClientesxEmpresa, dataClientes } = useTerminosStore();
	useEffect(() => {
		if (show) obtenerClientesxEmpresa(id_empresa);
	}, [id_empresa]);

	return dataClientes;
};
export const obtenerLugarOnShow = (show, id_empresa) => {
	const { lugar } = useTerminosStore();
	useEffect(() => {
		if (show) obtenerClientesxEmpresa(id_empresa);
	}, [id_empresa]);

	return dataClientes;
};
export const obtenerTermMovimientoxEmpresaOnShow = (show, id_empresa) => {
	const { obtenerClientesxEmpresa, dataClientes } = useTerminosStore();
	useEffect(() => {
		if (show) obtenerClientesxEmpresa(id_empresa);
	}, [id_empresa]);

	return dataClientes;
};
export const obtenerEmpleadosxEmpresaOnShow = (show, id_empresa) => {
	const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore();
	useEffect(() => {
		if (show) obtenerClientesxEmpresa(id_empresa);
	}, [id_empresa]);

	return dataClientes;
};
const useTerminosStore = () => {
	const [dataZonasxEmpresa, setdataGeneral] = useState([]);
	const [dataClientes, setdataClientes] = useState([]);
	const obtenerZonasxEmpresa = async (id_enterprice) => {
		try {
			let { data } = await PTApi.get(
				`/parametros/get_params/articulo/zonas/${id_enterprice}`
			);

			const dataAlter = data.map((z) => {
				return {
					label: `${z.nombre_zona} - NIVEL ${z.nivel}`,
					value: z.id,
				};
			});
			setdataGeneral(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerClientesxEmpresa = async (id_enterprice) => {
		try {
			let { data } = await PTApi.get(
				`/parametros/get_params/clientes/clientes/${id_enterprice}`
			);
			setdataClientes(data);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerZonasxEmpresa,
		dataZonasxEmpresa,
		dataClientes,
		obtenerClientesxEmpresa,
	};
};
export const TerminosOnShow = (show) => {
	const { dataZonasxEmpresa, obtenerZonasxEmpresa, obtenerClientesxEmpresa, dataClientes } =
		useTerminosStore();
	const dataClientesChange = obtenerClientesxEmpresaOnShow(show, 598);
	const dataRolUsuario = useFetchTerminosOnShow(show, 'usuario', 'rol');
	const dataKardexMovimiento = useFetchTerminosOnShow(show, 'kardex');
	const dataSubOrigen = useFetchTerminosOnShow(show, 'venta', 'sub-origen');
	const dataVendedores = useFetchTerminosOnShow(show, 'empleados-departamento', 'vendedores');
	
	const dataEstadosBoleanos = [{ value: 1, label: 'Activo' }];
	const dataEmpresas = [
		{ label: 'CHANGE', value: 598 },
		{ label: 'REDUCTO', value: 599 },
		{ label: 'CIRCUS', value: 601 },
		{ label: 'CHORRILLOS', value: 605 },
	];
	const dataEstadoContrato = [
		{ label: 'Por Aprobar', value: 505, severity: 'warning' },
		{ label: 'Aprobado', value: 500, severity: 'success' },
		{ label: 'Cancelado', value: 501, severity: 'danger' },
		{ label: 'Retencion', value: 506, severity: 'secondary' },
	];
	const dataOrigen = [
		{ value: 686, label: 'Walking', order: 7 }, //998
		{ value: 687, label: 'Mail', order: 10 }, //1000

		// { value: 688, label: 'USO DE IMAGEN (RAFAEL PIZARRO)', order: 11 },
		// { value: 697, label: 'USO DE IMAGEN (LANDING)', order: 12 },
		// { value: 698, label: '(RAL)', order: 13 },

		{ value: 690, label: 'Referidos', order: 6 }, //997
		{ value: 691, label: 'Cartera de renovacion', order: 4 }, //995
		{ value: 692, label: 'Cartera de reinscripcion', order: 5 }, //996
		{ value: 693, label: 'Instagram', order: 1 }, //992
		{ value: 694, label: 'facebook', order: 2 }, //993
		{ value: 695, label: 'tiktok', order: 3 }, //994
		{ value: 696, label: 'EX-PT reinscripcion', order: 8 }, //TODO LOS TRASPASOS SON EX-PT //999
		{ value: 689, label: 'Wsp organico', order: 11 }, //1001
		// { value: 690, label: 'EX-PT Cartera de reinscripcion', order: 5 }, //996
		// { value: 690, label: 'INFLUENCER POR VISIBILIDAD', order: 14 },
		// { value: 691, label: 'INFLUENCER DE POSICIONAMIENTO', order: 15 },
		// { value: 692, label: 'INFLUENCER DE VENTAS', order: 16 },
		//{ value: 1470, label: 'CORPORATIVOS BBVA' },
	];
	return {
		dataKardexMovimiento,
		dataClientesChange,
		dataEstadoContrato,
		obtenerZonasxEmpresa,
		obtenerClientesxEmpresa,
		dataZonasxEmpresa,
		dataRolUsuario,
		dataEstadosBoleanos,
		dataEmpresas,
		dataOrigen,
		dataSubOrigen,
		dataVendedores,
	};
};
