import { PTApi } from '@/common';
import { useState } from 'react';

export const useEmpleadosStore = () => {
	const [dataParientes, setdataParientes] = useState([]);
	const [dataDocumentosInternosEmpl, setdataDocumentosInternosEmpl] = useState([]);
	const obtenerParientesEmpleados = async () => {
		try {
			const { data } = await PTApi.get('/usuario/pariente/entidad/EMPLEADO');

			setdataParientes(data.contactosEmergencia);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDocumentosDeEmpleados = async () => {
		try {
			const { data } = await PTApi.get('/fils/interno/tb/1517');

			setdataDocumentosInternosEmpl(data.documentosInternos);
		} catch (error) {
			console.log(error);
		}
	};
	const postAlertaUsuario = async()=>{
		
	}
	return {
		obtenerParientesEmpleados,
		obtenerDocumentosDeEmpleados,
		dataDocumentosInternosEmpl,
		dataParientes,
	};
};
