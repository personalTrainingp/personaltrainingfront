import { PTApi } from '@/common';
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs';
import { useFlujoCaja } from '../FlujoCaja/hook/useFlujoCajaStore';

export const useOrdenCompra = () => {
	const { dataGastosxFecha, dataIngresosxFecha, obtenerEgresosxFecha, obtenerIngresosxFecha } =
		useFlujoCaja();
	return {
		dataGastosxFecha,
		dataIngresosxFecha,
		obtenerEgresosxFecha,
		obtenerIngresosxFecha,
	};
};
