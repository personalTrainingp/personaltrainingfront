import { PTApi } from '@/common';
import { useState } from 'react';
import { agruparPorMesDiaFechaVenta } from './helpers/agruparPorMesDiaFechaVenta';
import { useSelector } from 'react-redux';
export const useInformeEjecutivoStoreRenovaciones = () => {
	const [dataVentasRenovaciones, setdataVentasRenovaciones] = useState({
		dataMembresias: [],
		dataProductos18: [],
		dataProductos17: [],
		dataVentasMap: [],
		dataMFMap: [],
	});
	const [dataLeads, setdataLeads] = useState([]);
	const obtenerVentasRenovaciones = async () => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas/598');
			const dataVentasMap = data.ventas
				.map((m) => {
					return {
						id_cli: m.id_cli,
						id_origen: m.id_origen,
						id_venta: m.id,
						fechaP: m.fecha_venta,
						empl: m.tb_empleado.nombres_apellidos_empl,
						detalle_membresias: m.detalle_ventaMembresia,
						detalle_productos: m.detalle_ventaProductos,
					};
				})
				.filter((d) => d.id_origen === 691);
			const dataMembresias = dataVentasMap
				.filter((dventa) => dventa.detalle_membresias.length !== 0)
				.map((v) => {
					return {
						...v,
						montoTotal: v.detalle_membresias[0]?.tarifa_monto,
						cantidadTotal: 1,
					};
				})
				.filter((f) => f.montoTotal !== 0);
			setdataVentasRenovaciones({
				dataMembresias: sumarMontoTotal(agruparPorMesDiaFechaVenta(dataMembresias)),
			});
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentasRenovaciones,
		dataVentasRenovaciones,
	};
};

function sumarMontoTotal(data) {
	return data.map((g) => {
		return {
			...g,
			montoTotal: g?.items?.reduce((total, item) => total + (item?.montoTotal || 0), 0),
		};
	});
}
