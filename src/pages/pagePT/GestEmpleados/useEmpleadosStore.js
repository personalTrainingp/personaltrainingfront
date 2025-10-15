import { PTApi } from '@/common';
import { useState } from 'react';

export const useEmpleadosStore = () => {
	const [dataParientes, setdataParientes] = useState([]);
	const obtenerParientesEmpleados = async () => {
		try {
			const { data } = await PTApi.get('/usuario/pariente/entidad/EMPLEADO');

			setdataParientes(data.contactosEmergencia);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerParientesEmpleados,
		dataParientes,
	};
};
