import { PTApi } from '@/common';
import { useState } from 'react';

export const useExtensionStore = () => {
	const [dataExtension, setdataExtension] = useState([]);
	const postExtension = async (
		formState,
		tipo_extension,
		id_venta,
		extension_inicio,
		extension_fin
	) => {
		try {
			const { data } = await PTApi.post(
				`/extension-membresia/post-extension/${tipo_extension}/${id_venta}`,
				{
					...formState,
					extension_inicio,
                    extension_fin,
				}
			);
		} catch (error) {
			console.log(error);
		}
	};
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
		postExtension,
		obtenerExtensionEnTabla,
		dataExtension,
	};
};
