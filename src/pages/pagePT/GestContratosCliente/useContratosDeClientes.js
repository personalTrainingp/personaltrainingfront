import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useContratosDeClientes = () => {
	const dispatch = useDispatch();
	const [dataContratos, setdataContratos] = useState([]);
	const obtenerContratosDeClientes = async () => {
		try {
			dispatch(onSetDataView([]));
			const { data } = await PTApi.get('/venta/obtener-contratos-clientes/598');
			console.log(data.datacontratosConMembresias, 'asdf');

			const dataContratos = data.datacontratosConMembresias.map((dc) => {
				return {
					id: dc.id,
					id_cli: dc.tb_cliente.id_cli,
					nombre_apellidos: dc.tb_cliente.nombres_apellidos_cli,
					images_cli: dc.tb_cliente.tb_images,
					asesor: dc.tb_empleado.nombres_apellidos_empl,
					detalle_ventaMembresia: dc.detalle_ventaMembresia,
					createdAt: dc.createdAt,
					pgmYsem: `${dc.detalle_ventaMembresia[0]?.tb_ProgramaTraining?.name_pgm} | ${dc.detalle_ventaMembresia[0].tb_semana_training.semanas_st} SEMANAS`,
				};
			});
			dispatch(onSetDataView(dataContratos));
			setdataContratos(dataContratos);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerContratosDeClientes,
		dataContratos,
	};
};
