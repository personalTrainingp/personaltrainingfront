import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewCuentasBalances } from '../Store/cuentasBalancesSlice';
import { DateMaskStr, DateMaskString, MaskDate } from '@/components/CurrencyMask';
import { arrayEmpresaFinanAbrev } from '@/types/type';

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
