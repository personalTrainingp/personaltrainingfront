import { PTApi } from '@/common';
import { useState } from 'react';

export const useProveedoresStore = () => {
	const [dataTrabajosProv, setdataTrabajosProv] = useState([]);
	const obtenerTrabajosxProv = async (id_prov) => {
		try {
			const { data } = await PTApi.get(`/proveedor/trabajos/${id_prov}`);
			// console.log(data.contratos);
			console.log('ddd', { data });
			const dataAlter = data?.contratos
				?.map((contrato) => {
					return {
						value: contrato.id,
						label: `${contrato.id} | ${contrato.observacion}`,
					};
				})
				.filter((e) => e.estado_contrato === 505);

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
