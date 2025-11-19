import { PTApi } from '@/common';
import { useImageStore } from '@/hooks/hookApi/useImageStore';
import { onSetDataPagosProv, onViewContratoxProv } from '@/store/dataProveedor/proveedorSlice';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const usePagoProveedoresStore = () => {
	const [dataPagosContratos, setdataPagosContratos] = useState([]);
	const [dataContratosPendientes, setdataContratosPendientes] = useState([]);
	const [dataContrato, setdataContrato] = useState({});
	const dispatch = useDispatch();
	const obtenerTrabajosPendientes = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/egreso/obtener-pagos-contratos/${id_empresa}`);
			// const {data:dataProvee} = await PTApi.get
			// console.log(data.gastos);
			dispatch(onSetDataPagosProv(data.gastos));
			setdataPagosContratos(data.gastos);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerContratosPendientes = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(
				`/proveedor/obtener-trabajos-proveedores/${id_empresa}`
			);

			dispatch(onViewContratoxProv(data.dataContratos));
			setdataContratosPendientes(data.dataContratos);
		} catch (error) {
			console.log(error);
		}
	};
	const postPenalidades = async (formState, idContrato) => {
		try {
			const { data } = await PTApi.post(`/proveedor/penalidad/${idContrato}`, formState);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerContratoxId = async (id) => {
		try {
			const { data } = await PTApi.get(`/proveedor/contrato/${id}`);
			const dataAlter = {
				...data.contratoProv,
				hora_fin: dayjs.utc(data.contratoProv?.hora_fin).format('HH:mm'),
			};
			setdataContrato(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const updateContratoxId = async (id, formState, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/proveedor/put-contrato-prov/${id}`, formState);
			await obtenerContratosPendientes(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerPenalidades = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/proveedor/penalidad/${id_empresa}`);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteContratoxId = async (id, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/proveedor/delete-contrato-prov/${id}`);
			await obtenerContratosPendientes(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTrabajosPendientes,
		obtenerContratoxId,
		dataPagosContratos,
		dataContratosPendientes,
		dataContrato,
		obtenerContratosPendientes,
		postPenalidades,
		updateContratoxId,
		deleteContratoxId,
	};
};
