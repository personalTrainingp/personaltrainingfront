import { PTApi } from '@/common';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewCuentasBalances } from '../Store/cuentasBalancesSlice';
import { DateMaskStr, DateMaskString, MaskDate } from '@/components/CurrencyMask';
import { arrayEmpresaFinanAbrev } from '@/types/type';
import {
	normalizarMonto,
	normalizarOperacion,
	useGastosTodasEmpresas,
} from '../ModalCoincidenciasGastos';

const claveCoincidencia = (n_operacion, monto, moneda) =>
	`${normalizarOperacion(n_operacion)}|${normalizarMonto(monto)}|${moneda}`;

// Carga los gastos de todas las empresas y calcula una sola vez por cuenta (antes de llegar al jsx):
// coincidenciasGastos, cantidadCoincidencias y ultimoGastoEnlazado.
// Indexa los gastos por n_operacion + monto + moneda para no recorrer todos los gastos en cada cuenta.
export const useCoincidenciasGastos = (cuentas, activo = true) => {
	const gastos = useGastosTodasEmpresas(activo);
	const cuentasConCoincidencias = useMemo(() => {
		if (!activo) return cuentas;
		const gastosPorClave = new Map();
		const ultimoPorCuenta = new Map();
		// cantidad de gastos enlazados por id_porCuenta
		const enlazadosPorCuenta = new Map();
		gastos.forEach((g) => {
			if (normalizarOperacion(g.n_operacion) !== '') {
				const clave = claveCoincidencia(g.n_operacion, g.monto, g.moneda);
				if (!gastosPorClave.has(clave)) gastosPorClave.set(clave, []);
				gastosPorClave.get(clave).push(g);
			}
			const idPorCuenta = Number(g.id_porCuenta) || 0;
			if (idPorCuenta > 0) {
				enlazadosPorCuenta.set(idPorCuenta, (enlazadosPorCuenta.get(idPorCuenta) || 0) + 1);
				const ultimo = ultimoPorCuenta.get(idPorCuenta);
				if (!ultimo || new Date(g.updatedAt) > new Date(ultimo.updatedAt))
					ultimoPorCuenta.set(idPorCuenta, g);
			}
		});
		return (cuentas || []).map((cuenta) => {
			const candidatos =
				normalizarOperacion(cuenta.n_operacion) === ''
					? []
					: gastosPorClave.get(claveCoincidencia(cuenta.n_operacion, cuenta.monto, cuenta.moneda)) || [];
			// los gastos enlazados a otra cuenta no cuentan como coincidencia
			const coincidenciasGastos = candidatos.filter(
				(g) => !(Number(g.id_porCuenta) > 0) || Number(g.id_porCuenta) === Number(cuenta.id)
			);
			return {
				...cuenta,
				coincidenciasGastos,
				cantidadCoincidencias: coincidenciasGastos.length,
				// mismas secciones que ModalCoincidenciasGastos
				cantidadEnlazadosPorId: enlazadosPorCuenta.get(Number(cuenta.id)) || 0,
				cantidadSinEnlazar: coincidenciasGastos.filter((g) => Number(g.id_porCuenta) !== Number(cuenta.id)).length,
				ultimoGastoEnlazado: ultimoPorCuenta.get(Number(cuenta.id)) || null,
			};
		});
	}, [cuentas, gastos, activo]);
	return { cuentas: cuentasConCoincidencias, gastos };
};

export const useCuentasBalances = () => {
	const dispatch = useDispatch();
	const [dataCuentaBalance, setdataCuentaBalance] = useState({});
	const [dataProveedores, setdataProveedores] = useState([]);
	const obtenerCuentasBalancesxIdEmpresaxTipo = async (idEmpresa, tipo) => {
		try {
			const { data } = await PTApi.get(`/cuenta-balance/${idEmpresa}/${tipo}`);

			dispatch(onSetDataViewCuentasBalances(data.cuentasBalances));
		} catch (error) {
			console.log(error);
		}
	};
	const postCuentasBalancesxIdEmpresaxTipo = async (formState, idEmpresa, tipo) => {
		try {
			const { data } = await PTApi.post(`/cuenta-balance/${idEmpresa}/${tipo}`, formState);
			await obtenerCuentasBalancesxIdEmpresaxTipo(idEmpresa, tipo);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCuentaBalancexID = async (id) => {
		try {
			const { data } = await PTApi.get(`/cuenta-balance/id/${id}`);
			const dataAlter = {
				...data?.cuenta,
				fecha_comprobante: DateMaskStr(data.cuenta?.fecha_comprobante, 'YYYY-MM-DD'),
			};
			setdataCuentaBalance(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const putCuentaBalancexID = async (id, idEmpresa, tipo, formState) => {
		try {
			const { data } = await PTApi.put(`/cuenta-balance/id/${id}`, formState);
			await obtenerCuentasBalancesxIdEmpresaxTipo(idEmpresa, tipo);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteCuentaBalancexID = async (id, idEmpresa, tipo) => {
		try {
			const { data } = await PTApi.put(`/cuenta-balance/delete/id/${id}`);
			await obtenerCuentasBalancesxIdEmpresaxTipo(idEmpresa, tipo);
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerParametrosProveedor = async (idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/producto/proveedor/1574`);
			console.log({ datame: data, idEmpresa });

			const dataAlter = data
				.filter((f) => f?.id_empresa === idEmpresa)
				.map((term) => {
					const [firstPart = '', secondPart = ''] = term.label?.split('|') || [];
					const empresaLabel =
						arrayEmpresaFinanAbrev?.find((f) => f?.value === term?.id_empresa)?.label ||
						'';
					return {
						value: term.value,
						label: `${firstPart.trim()} | ${empresaLabel} | ${secondPart.trim()}`,
						id_oficio: term.id_oficio,
					};
				});
			console.log({ dataAlter });

			setdataProveedores(dataAlter);
			// setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerCuentasBalancesxIdEmpresaxTipo,
		postCuentasBalancesxIdEmpresaxTipo,
		obtenerCuentaBalancexID,
		putCuentaBalancexID,
		deleteCuentaBalancexID,
		dataCuentaBalance,
		obtenerParametrosProveedor,
		dataProveedores,
	};
};
