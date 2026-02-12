import { PTApi } from '@/common';
import { useState } from 'react';

export const useProveedoresStore = () => {
	const [dataTrabajosProv, setdataTrabajosProv] = useState([]);
	const [dataProveedorxTipoxEmpresa, setdataProveedorxTipoxEmpresa] = useState([]);
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
	const obtenerProveedorxTipoxEmpresa = async (id_empresa, tipo) => {
		try {
			const { data } = await PTApi.get(`/proveedor/empresa/${id_empresa}/tipo/${tipo}`);
			console.log({ data });
			console.log({ f: 1, data });

			setdataProveedorxTipoxEmpresa(data.dataProveedores);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataProveedorxTipoxEmpresa,
		dataTrabajosProv,
		obtenerTrabajosxProv,
		obtenerProveedorxTipoxEmpresa,
	};
};
