import { PTApi } from '@/common';
import { FUNMoneyFormatter, NumberFormatter } from '@/components/CurrencyMask';
import { useState } from 'react';

export const useNuevaVentaStore = () => {
	const [dataProductosActivos, setdataProductosActivos] = useState([]);
	const obtenerProductosActivos = async (idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/producto/combo-activos/${idEmpresa}`);
			const Alter = data.productos
				.filter((e) => e.id_cat === 17)
				.map((e) => {
					return {
						...e,
						label: `${e.label} | ${FUNMoneyFormatter(e.prec_venta, '')}`,
						nombre_producto: e.label,
						venta: e.prec_venta,
					};
				});
			setdataProductosActivos(Alter);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMembresiasActivas = () => {};
	return {
		obtenerProductosActivos,
		dataProductosActivos,
	};
};
