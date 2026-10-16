import { PTApi } from '@/common';
import { useState } from 'react';

export const useColaboradoresActivos = () => {
	const [dataColaboradores, setdataColaboradores] = useState([]);
	//Colaboradores activos (flag=1) de todas las empresas
	const obtenerColaboradoresActivos = async () => {
		try {
			const { data } = await PTApi.get(`/usuario/get-empleados`, {
				params: { id_estado: true },
			});
			setdataColaboradores(
				data.empleados.map((e) => ({
					label: e.nombres_apellidos_empl,
					value: e.id_empl,
				}))
			);
		} catch (error) {
			console.log(error);
		}
	};
	return { obtenerColaboradoresActivos, dataColaboradores };
};
