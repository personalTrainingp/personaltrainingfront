import { PTApi } from '@/common';
import { FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

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
					lugar: a.parametro_lugar_encuentro.label_param,
					producto: a.producto,
					costo_unitario: FUNMoneyFormatter(a.costo_unitario),
					label: `${a.parametro_lugar_encuentro.label_param} / ${a.producto} / PRECIO UNITARIO: S/. ${FUNMoneyFormatter(a.costo_unitario)}`,
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
	const postKardex = async (action, id_enterprice, formState, Lastfunction) => {
		try {
			await PTApi.post(`/inventario/post-kardex/${action}/${id_enterprice}`, {
				...formState,
			});
			obtenerTablePrincipal(action, id_enterprice);
			Swal.fire('¿Estas seguro de querer agregar este item?');
			Lastfunction();
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
