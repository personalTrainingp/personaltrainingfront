import { PTApi } from '@/common';
import { onViewContratoxProv } from '@/store/dataProveedor/proveedorSlice';
import { useDispatch } from 'react-redux';

export const inventarioReporteStore = () => {
	const dispatch = useDispatch();
	const obtenerContratosPendientes = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(
				`/proveedor/obtener-trabajos-proveedores/${id_empresa}`
			);
			dispatch(onViewContratoxProv(data.dataContratos));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerContratosPendientes,
	};
};
