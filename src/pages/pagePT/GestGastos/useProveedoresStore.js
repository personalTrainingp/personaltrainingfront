import { PTApi } from '@/common';
import { useState } from 'react';

export const useProveedoresStore = () => {
	const [dataTrabajosProv, setdataTrabajosProv] = useState([]);
	const obtenerTrabajosxProv = async (id_prov) => {
		try {
			const { data } = await PTApi.get(`/contrato-prov/combo-id-prov/${id_prov}`);
			// console.log(data.contratos);
			console.log('ddd', { id_prov });
			setdataTrabajosProv(data.contratosProv);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataTrabajosProv,
		obtenerTrabajosxProv,
	};
};
