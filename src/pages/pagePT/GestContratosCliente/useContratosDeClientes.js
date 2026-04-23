import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useContratosDeClientes = () => {
	const dispatch = useDispatch();
	const [dataContratos, setdataContratos] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [isLoadingAvtr, setisLoadingAvtr] = useState(false);
	const [dataAvataresxUID, setdataAvataresxUID] = useState({});
	const obtenerContratoxIDVENTA = async (idventa) => {
		try {
			const { data } = await PTApi.get(`/venta/obtener-contrato/${idventa}`);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerContratosDeClientes = async () => {
		try {
			setisLoading(false);
			const { data } = await PTApi.get('/venta/obtener-contratos-clientes/598');
			const dataContratos = data.datacontratosConMembresias?.map((dc) => {
				const membresia = dc.detalle_ventaMembresia[0];
				return {
					id: dc.id,
					tb_cliente: dc.tb_cliente,
					id_cli: dc.id_cli,
					nombre_apellidos: dc.tb_cliente.nombres_apellidos_cli,
					images_cli: dc.tb_cliente.tb_images,
					asesor: dc.tb_empleado.nombres_apellidos_empl,
					detalle_ventaMembresia: dc.detalle_ventaMembresia,
					createdAt: dc.createdAt,
					pgmYsem: `${membresia?.tb_ProgramaTraining?.name_pgm} / ${membresia.tb_semana_training.semanas_st} SEMANAS`,
					firmado: `${membresia.tarifa_monto !== 0 && membresia.firma_cli == null ? '' : 'SI'}`,
					conFoto: dc.images_cli?.length === 0 ? 'NO' : 'SI',
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
			setisLoadingAvtr(false);
			const { data } = await PTApi.get(`/storage/blob/upload/get-upload/${uidAvtr}`);
			console.log(data, 'data');
			setdataAvataresxUID(data.name_image);
			setisLoadingAvtr(true);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerContratoxIDVENTA,
		isLoadingAvtr,
		obtenerAvataresxUidCli,
		obtenerContratosDeClientes,
		postAvatarImagesCliente,
		dataAvataresxUID,
		isLoading,
		dataContratos,
	};
};
