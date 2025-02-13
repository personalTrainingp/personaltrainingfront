import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useContratosDeClientes = () => {
	const dispatch = useDispatch();
	const [dataContratos, setdataContratos] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [dataAvataresxUID, setdataAvataresxUID] = useState('');
	const obtenerContratosDeClientes = async () => {
		try {
			setisLoading(false);
			dispatch(onSetDataView([]));
			const { data } = await PTApi.get('/venta/obtener-contratos-clientes/598');
			console.log(data.datacontratosConMembresias, 'asdf');

			const dataContratos = data.datacontratosConMembresias.map((dc) => {
				return {
					id: dc.id,
					tb_cliente: dc.tb_cliente,
					id_cli: dc.id_cli,
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
			setisLoading(true);
		} catch (error) {
			console.log(error);
		}
	};
	const postAvatarImagesCliente = async (blobAvtr, uidAvtr) => {
		try {
			const formData = new FormData();
			formData.append('file', blobAvtr);
			await PTApi.post(`/storage/blob/create/${uidAvtr}?container=avatarclientes`, formData);
			await obtenerContratosDeClientes();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerAvataresxUidCli = async (uidAvtr) => {
		try {
			const { data } = await PTApi.get(`/storage/blob/upload/get-upload/${uidAvtr}`);
			setdataAvataresxUID(data.name_image);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerAvataresxUidCli,
		obtenerContratosDeClientes,
		postAvatarImagesCliente,
		dataAvataresxUID,
		isLoading,
		dataContratos,
	};
};
