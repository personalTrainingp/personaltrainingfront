import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewContratoProv } from './ContratoProvSlice';
import dayjs from 'dayjs';

export const useContratosProveedores = () => {
	const [dataContratoProveedor, setdataContratoProveedor] = useState({
		id_prov: 0,
		fecha_inicio: '',
		fecha_fin: '',
		hora_fin: '',
		monto_contrato: 0.0,
		estado_contrato: 0,
		uid_presupuesto: '',
		uid_contrato: '',
		uid_compromisoPago: '',
		id_empresa: 0,
		mano_obra_soles: 0.0,
		mano_obra_dolares: 0.0,
		id_zona: 0,
		observacion: '',
	});
	const dispatch = useDispatch();
	const obtenerContratosProveedores = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/contrato-prov/${id_empresa}`);
			dispatch(onSetDataViewContratoProv(data.contratosProv));
		} catch (error) {
			console.log(error);
		}
	};
	const onPostContratosProveedores = async (
		formState,
		id_empresa,
		file_compromisoPago,
		file_contrato
	) => {
		try {
			const { data } = await PTApi.post(`/contrato-prov/`, formState);
			console.log({ data });

			if (file_compromisoPago) {
				await PTApi.post(
					`/storage/blob/create/${data.contratoProv.uid_compromisoPago}?container=compromiso-pago-proveedores`,
					file_compromisoPago
				);
			}
			if (file_contrato) {
				await PTApi.post(
					`/storage/blob/create/${data.contratoProv.uid_contrato}?container=contratos-proveedores`,
					file_contrato
				);
			}
			await obtenerContratosProveedores(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerContratosProveedoresxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/contrato-prov/id/${id}`);
			console.log({ data });
			const dataAlter = {
				...data.contratosProv,
				hora_fin: dayjs.utc(data.contratosProv?.hora_fin).format('HH:mm'),
			};
			setdataContratoProveedor(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const onUpdateContratosProveedoresxID = async (
		id,
		id_empresa,
		formState,
		file_compromisoPago,
		file_contrato
	) => {
		try {
			const { data } = await PTApi.put(`/contrato-prov/${id}`, formState);
			console.log({ data });

			if (file_compromisoPago) {
				await PTApi.post(
					`/storage/blob/create/${data?.contratosProv.uid_compromisoPago}?container=compromiso-pago-proveedores`,
					file_compromisoPago
				);
			}
			if (file_contrato) {
				await PTApi.post(
					`/storage/blob/create/${data?.contratosProv.uid_contrato}?container=contratos-proveedores`,
					file_contrato
				);
			}
			await obtenerContratosProveedores(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteContratosProveedoresxID = async (id, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/contrato-prov/delete/${id}`);
			await obtenerContratosProveedores(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};

	return {
		onDeleteContratosProveedoresxID,
		onUpdateContratosProveedoresxID,
		dataContratoProveedor,
		obtenerContratosProveedores,
		onPostContratosProveedores,
		obtenerContratosProveedoresxID,
	};
};
