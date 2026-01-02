import { PTApi } from '@/common';
import { useState } from 'react';

export const useNuevaVentaStore = () => {
	const [dataProductosActivos, setdataProductosActivos] = useState([]);
	const obtenerProductosActivos = async (idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/producto/combo-activos/${idEmpresa}`);
			setdataProductosActivos(data.productos);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMembresiasActivas = () => {};
	return {
		obtenerProductosActivos,
		dataProductosActivos,
	};
};
