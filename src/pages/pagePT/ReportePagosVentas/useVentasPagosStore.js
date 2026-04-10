import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewPagosVentas } from './dataPagosSlice';
import { DateMaskStr, DateMaskStr1, DateMaskStr2, DateMaskString } from '@/components/CurrencyMask';

export const impuestosBancos = [
	{
		id_forma_pago: 167,
		id_tipo_tarjeta: 0,
		id_banco: 0,
		n_cuotas: 0,
		porcentaje: 1.49,
		porcentaje_con_igv: 1.7582,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 35,
		id_banco: 50,
		n_cuotas: 0,
		porcentaje: 3,
		porcentaje_con_igv: 3.54,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 35,
		id_banco: 51,
		n_cuotas: 0,
		porcentaje: 3,
		porcentaje_con_igv: 3.54,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 35,
		id_banco: 57,
		n_cuotas: 0,
		porcentaje: 3,
		porcentaje_con_igv: 3.54,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 35,
		id_banco: 50,
		n_cuotas: 0,
		porcentaje: 3,
		porcentaje_con_igv: 3.54,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 35,
		id_banco: 49,
		n_cuotas: 0,
		porcentaje: 3,
		porcentaje_con_igv: 3.54,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 35,
		id_banco: 53,
		n_cuotas: 0,
		porcentaje: 3,
		porcentaje_con_igv: 3.54,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 37,
		id_banco: 50,
		n_cuotas: 3,
		porcentaje: 6.29,
		porcentaje_con_igv: 7.4222,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 37,
		id_banco: 52,
		n_cuotas: 3,
		porcentaje: 6.29,
		porcentaje_con_igv: 7.4222,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 37,
		id_banco: 52,
		n_cuotas: 6,
		porcentaje: 8.29,
		porcentaje_con_igv: 9.7822,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 37,
		id_banco: 50,
		n_cuotas: 6,
		porcentaje: 8.29,
		porcentaje_con_igv: 9.7822,
	},
	{
		id_forma_pago: 1389,
		id_tipo_tarjeta: 37,
		id_banco: 51,
		n_cuotas: 0,
		porcentaje: 3.29,
		porcentaje_con_igv: 3.8822,
	},
];
export const useVentasPagosStore = () => {
	const [dataPagosVentas, setdataPagosVentas] = useState([]);
	const [dataPagosxID, setdataPagosxID] = useState({});
	const dispatch = useDispatch();
	const obtenerPagosVentas = async () => {
		try {
			const { data } = await PTApi.get('/venta/pagos-venta');

			const dataPagos = data.ventasConPagos?.flatMap(({ detalleVenta_pagoVenta, ...venta }) =>
				detalleVenta_pagoVenta.map((pago) => {
					const identificador = `${pago?.id_forma_pago}|${pago?.id_tipo_tarjeta}|${pago?.id_banco}|${pago?.n_cuotas}`;
					return {
						...venta,
						pago,
						identificador,
						fecha_pago_1: DateMaskString(pago?.fecha_pago, 'dddd DD [DE] MMMM [DEL] YYYY'),
						porcentaje:
							impuestosBancos.find(
								(f) =>
									`${f.id_forma_pago}|${f.id_tipo_tarjeta}|${f.id_banco}|${f.n_cuotas}` ===
									identificador
							)?.porcentaje || 0,
					};
				})
			);
			dispatch(onSetDataViewPagosVentas(dataPagos));
		} catch (error) {
			console.log(error);
		}
	};
	const updatePagosVentas = async (id, formState) => {
		try {
			const { data } = await PTApi.put(`/venta/pagos/id/${id}`, formState);
			obtenerPagosVentas();
		} catch (error) {
			console.log(error);
		}
	};
	const postPagosVentas = async (formState) => {
		try {
			const { data } = await PTApi.post(`/venta/pagos/`, formState);
			obtenerPagosVentas();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerPagosVentasxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/venta/pagos/id/${id}`);
			console.log({ data });

			setdataPagosxID(data?.pago);
		} catch (error) {
			console.log(error);
		}
	};

	return {
		postPagosVentas,
		dataPagosxID,
		obtenerPagosVentasxID,
		updatePagosVentas,
		obtenerPagosVentas,
		dataPagosVentas,
	};
};
