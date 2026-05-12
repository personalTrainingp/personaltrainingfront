import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewPagosVentas } from './dataPagosSlice';
import { DateMaskStr, DateMaskStr1, DateMaskStr2, DateMaskString } from '@/components/CurrencyMask';

export const useVentasPagosStore = () => {
	const [dataPagosVentas, setdataPagosVentas] = useState([]);
	const [dataPagosxID, setdataPagosxID] = useState({});
	const dispatch = useDispatch();
	const obtenerPagosVentas = async () => {
		try {
			const { data } = await PTApi.get('/venta/pagos-venta');
			const { data: dataPago } = await PTApi.get('/operadores-pago/');
			const alterPago = dataPago?.operadoresPago?.map((f) => {
				return {
					id_operador: f.id_operador,
					id_forma_pago: f.id_forma_pago,
					id_tarjeta: f.id_marca_tarjeta,
					id_tipo_tarjeta: f.id_tipo_tarjeta,
					id_banco: f.id_banco,
					n_cuotas: f.cuota,
					porcentaje: f.porcentaje_comision,
				};
			});
			const dataPagos = data.ventasConPagos?.flatMap(({ detalleVenta_pagoVenta, ...venta }) =>
				detalleVenta_pagoVenta.map((pago) => {
					const identificador = `${pago?.id_operador}|${pago?.id_forma_pago}|${pago?.id_tarjeta}|${pago?.id_tipo_tarjeta}|${pago?.id_banco}|${pago?.n_cuotas}`;
					return {
						...venta,
						pago,
						n_operacion: pago.n_operacion,
						label_operador: pago.parametro_operador?.label_param,
						label_forma_pago: pago.parametro_forma_pago?.label_param,
						label_tipo_tarjeta: pago?.parametro_tipo_tarjeta?.label_param,
						label_banco: pago?.parametro_banco?.label_param,
						fecha_p: venta?.fecha_venta,
						identificador,
						fecha_pago_1: DateMaskString(
							venta?.fecha_venta,
							'dddd DD MMMM YYYY [A LAS] hh:mm A'
						),
						identificador,
						porcentaje:
							alterPago.find(
								(f) =>
									`${f.id_operador}|${f.id_forma_pago}|${f.id_tarjeta}|${f.id_tipo_tarjeta}|${f.id_banco}|${f.n_cuotas}` ===
									identificador
							)?.porcentaje || 0,
					};
				})
			);
			console.log({ alterPago, dataPago, dataPagos: dataPagos.filter((f) => f.id == 17774) });

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
