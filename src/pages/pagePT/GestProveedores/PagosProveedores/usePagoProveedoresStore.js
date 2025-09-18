import { PTApi } from '@/common';
import { useImageStore } from '@/hooks/hookApi/useImageStore';
import { useState } from 'react';

export const usePagoProveedoresStore = () => {
	const [dataPagosContratos, setdataPagosContratos] = useState([]);
	const [dataContratosPendientes, setdataContratosPendientes] = useState([]);
	const obtenerTrabajosPendientes = async () => {
		try {
			const { data } = await PTApi.get('/egreso/obtener-pagos-contratos/598');
			// const {data:dataProvee} = await PTApi.get
			console.log(data);
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
			// const {data:dataProvee} = await PTApi.get
			console.log({ data: data.dataContratos });
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
	const obtenerPenalidades = async(id_empresa)=>{
		try {
			const {data} = await PTApi.get(`/proveedor/penalidad/${id_empresa}`)
		} catch (error) {
			console.log(error);
		}
	}
	return {
		obtenerTrabajosPendientes,
		dataPagosContratos,
		dataContratosPendientes,
		obtenerContratosPendientes,
		postPenalidades,
	};
};
