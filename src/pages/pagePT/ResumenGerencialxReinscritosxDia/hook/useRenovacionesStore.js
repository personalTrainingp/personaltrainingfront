import { PTApi } from '@/common';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const useRenovacionesStore = () => {
	const [dataVentasMembresia, setdataVentasMembresia] = useState([]);
	const [loading, setloading] = useState(false);
	const { corte } = useSelector((e) => e.DATA);
	const obtenerVentas = async () => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas/598');
			console.log({ data });

			const dataVentasMembresiasMap = data.ventas
				.filter((e) => e.detalle_ventaMembresia.length !== 0 && e.id_origen === 692)
				.map((m) => {
					return {
						id_cli: m.id_cli,
						id_origen: m.id_origen,
						id_venta: m.id,
						fecha_venta: m.fecha_venta,
						empl: m.tb_empleado.nombres_apellidos_empl,
						monto: m.detalle_ventaMembresia[0]?.tarifa_monto,
						// membresia_monto: m.detalle_ventaMembresia[0].tarifa_monto,
						id_membresia: m.detalle_ventaMembresia[0]?.id,
						fecha_inicio: m.detalle_ventaMembresia[0]?.fecha_inicio,
					};
				})
				.filter((e) => e.monto !== 0);
			setdataVentasMembresia(dataVentasMembresiasMap);
		} catch (error) {
			console.log(error);
		} finally {
			setloading(false);
		}
	};
	return {
		obtenerVentas,
		dataVentasMembresia,
		corte,
		loading,
	};
};
