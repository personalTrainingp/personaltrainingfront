import { PTApi } from '@/common';
import React, { useState } from 'react';

export const useGestionIngresantesStore = () => {
	const [dataIngresantes, setdataIngresantes] = useState(second);
	const obtenerProveedores = async (estado_prov, agente, id_empresa) => {
		try {
			const { data } = await PTApi.get('/proveedor/obtener-proveedores/1574', {
				params: {
					estado_prov: estado_prov,
					id_empresa: id_empresa,
				},
			});
			const dataProv = data.proveedores.sort((a, b) => {
				if (a.parametro_oficio === null && b.parametro_oficio !== null) return 1; // a al final
				if (a.parametro_oficio !== null && b.parametro_oficio === null) return -1; // b al final
				return 0; // mantiene el orden relativo entre iguales
			});
			setdataIngresantes(data.proveedores);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataIngresantes,
		obtenerProveedores,
	};
};
