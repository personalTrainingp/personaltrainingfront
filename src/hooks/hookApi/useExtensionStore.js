import { PTApi } from '@/common';
import { useState } from 'react';

export const useExtensionStore = () => {
	const [dataExtension, setdataExtension] = useState([]);
	const obtenerExtensionEnTabla = async (tipo) => {
		try {
			const { data } = await PTApi.get(`/extension-membresia/get-extension/${tipo}`);
			console.log(data);
			setdataExtension(data.extensiones);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerExtensionEnTabla,
		dataExtension,
	};
};
