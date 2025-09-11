import { PTApi } from '@/common';
import { useState } from 'react';

export const useProveedoresStore = () => {
	const [dataTrabajosProv, setdataTrabajosProv] = useState([]);
	const obtenerTrabajosxProv = async (id_prov) => {
		try {
			const { data } = await PTApi.get(`/proveedor/trabajos/${id_prov}`);
			// console.log(data.contratos);
			const dataAlter = data?.contratos?.map((contrato) => {
				return {
					value: contrato.id,
					label: contrato.observacion,
				};
			});
			setdataTrabajosProv(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataTrabajosProv,
		obtenerTrabajosxProv,
	};
};
