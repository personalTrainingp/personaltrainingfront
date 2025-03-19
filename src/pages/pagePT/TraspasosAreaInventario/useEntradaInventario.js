import { PTApi } from '@/common';
import { FUNMoneyFormatter } from '@/components/CurrencyMask';
import config from '@/config';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useEntradaInventario = () => {
	const [dataArticulos, setdataArticulos] = useState([]);
	const [dataMotivos, setdataMotivos] = useState([]);
	const dispatch = useDispatch();
	const obtenerArticulosInventario = async (id_enterprice) => {
		try {
			const { data } = await PTApi.get(`/inventario/obtener-inventario/${id_enterprice}`);
			const dataAlter = data.articulos.map((a) => {
				return {
					value: a.id,
					category: a.parametro_lugar_encuentro.label_param,
					label: `${a.producto}`,
					label2: `ZONA: ${a.parametro_lugar_encuentro.label_param}`,
					cantidad: `CANTIDAD: ${a.cantidad}`,
					price: `PRECIO: ${FUNMoneyFormatter(a.costo_unitario)}`,
					image: `${config.API_IMG.AVATAR_ARTICULO}${a.tb_images[a.tb_images.length - 1].name_image}`,
					width: '150px',
				};
			});
			setdataArticulos(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTablePrincipal = async (action, id_enterprice) => {
		try {
			const { data } = await PTApi.get(
				`/inventario/obtener-kardex/${action}/${id_enterprice}`
			);
			dispatch(onSetDataView(data.kardex));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMotivos = async () => {
		try {
			const { data } = await PTApi.get('');
			setdataMotivos(data.articulos);
		} catch (error) {
			console.log(error);
		}
	};
	const postKardex = async (action, id_enterprice, formState) => {
		try {
			await PTApi.post(`/inventario/post-kardex/${action}/${id_enterprice}`, {
				...formState,
			});
			obtenerTablePrincipal(action, id_enterprice);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTablePrincipal,
		obtenerArticulosInventario,
		postKardex,
		dataArticulos,
		obtenerMotivos,
		dataMotivos,
	};
};
