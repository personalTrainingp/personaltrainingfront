import { PTApi } from '@/common';
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs';
import { useFlujoCaja } from '../FlujoCaja/hook/useFlujoCajaStore';
import { useState } from 'react';

export const useOrdenCompra = () => {
	const [dataFacturas, setdataFacturas] = useState([]);
	const { dataGastosxFecha, dataIngresosxFecha, obtenerEgresosxFecha, obtenerIngresosxFecha } =
		useFlujoCaja();
	const obtenerGastosxFactura = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/egreso/facturado/${id_empresa}`);
			setdataFacturas(data.gastos);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataFacturas,
		obtenerGastosxFactura,
		dataGastosxFecha: dataGastosxFecha.flujoxGrupo,
		dataIngresosxFecha: dataIngresosxFecha.flujoxGrupo,
		obtenerEgresosxFecha,
		obtenerIngresosxFecha,
	};
};
