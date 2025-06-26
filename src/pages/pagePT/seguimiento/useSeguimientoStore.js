// import { PTApi } from '@/common';
// import { useState } from 'react';
// export const useSeguimientoStore = () => {
// 	const [dataSeguimientos, setdataSeguimientos] = useState([]);
// 	const obtenerTodoSeguimiento = async (id_empresa, isClienteActive) => {
// 		try {
// 			const { data } = await PTApi.get(`/reporte/reporte-seguimiento-clientes/${id_empresa}`);
// 			// const dataMem = data.newMembresias.map((m) => {
// 			// 	const diasExtendibles = m.dias;
// 			// 	return {
// 			// 		fecha_fin: m.fec_fin_mem,
// 			// 		// fec_fin_mem: agregarDiasHabiles(m.fec_fin_mem, diasExtendibles).toISOString(),
// 			// 		...m,
// 			// 	};
// 			// });
// 			const dataMembresias = data.membresias.map((m) => {
// 				return {
// 					...m,
// 				};
// 			});
// 			console.log(dataMembresias);
// 			// setdataSeguimientos(data);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};
// 	return { obtenerTodoSeguimiento, dataSeguimientos };
// };

import { PTApi } from '@/common';
import { useState } from 'react';
export const useSeguimientoStore = () => {
	const [dataSeguimientos, setdataSeguimientos] = useState([]);
	const obtenerTodoSeguimiento = async (id_empresa, isClienteActive) => {
		try {
			const { data } = await PTApi.get(
				`/reporte/reporte-seguimiento-membresia/${id_empresa}`,
				{
					params: { isClienteActive },
				}
			);
			const dataMem = data.newMembresias.map((m) => {
				const diasExtendibles = m.dias;
				return {
					fecha_fin: m.fec_fin_mem,
					// fec_fin_mem: agregarDiasHabiles(m.fec_fin_mem, diasExtendibles).toISOString(),
					...m,
				};
			});
			setdataSeguimientos(dataMem);
			console.log(data.newMembresias, dataMem);
		} catch (error) {
			console.log(error);
		}
	};
	return { obtenerTodoSeguimiento, dataSeguimientos };
};
