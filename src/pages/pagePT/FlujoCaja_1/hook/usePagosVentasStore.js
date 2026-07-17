import { PTApi } from '@/common';
import { DateMaskString } from '@/components/CurrencyMask';
import { useState } from 'react';

export const usePagosVentasStore = () => {
	const [dataPagosVentas, setdataPagosVentas] = useState([]);
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
			setdataPagosVentas(dataPagos);
			return {
				dataPagos,
			};
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataPagosVentas,
		obtenerPagosVentas,
	};
};
