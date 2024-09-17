import { PTApi } from '@/common';
import { useState } from 'react';
function agruparYOrdenar(array) {
	const resultado = [];

	array.forEach((item) => {
		// Buscar si ya existe un objeto con el mismo id_forma_pago
		let grupo = resultado.find((grp) => grp.id_forma_pago === item.id_forma_pago);

		// Si no existe, lo creamos
		if (!grupo) {
			grupo = {
				id_forma_pago: item.id_forma_pago,
				label_param: item.FormaPagoLabel?.label_param || null,
				dataTarjetas: [],
				dataTipoTarjetas: [],
				databancos: [],
			};
			resultado.push(grupo);
		}

		// Agregar tarjeta si id_tarjeta no es 0
		if (item.id_tarjeta !== 0) {
			grupo.dataTarjetas.push({
				id_tarjeta: item.id_tarjeta,
				label_param: item.TarjetaLabel?.label_param || null,
			});
		}

		// Agregar tipo de tarjeta si id_tipo_tarjeta no es 0
		if (item.id_tipo_tarjeta !== 0) {
			grupo.dataTipoTarjetas.push({
				id_tipo_tarjeta: item.id_tipo_tarjeta,
				label_param: item.TipoTarjetaLabel?.label_param || null,
			});
		}

		// Agregar banco si id_banco no es 0
		if (item.id_banco !== 0) {
			grupo.databancos.push({
				id_banco: item.id_banco,
				label_param: item.BancoLabel?.label_param || null,
			});
		}
	});

	return resultado;
}
export const useTerminoMetodoPagoStore = () => {
    
	const obtenerFormaDePagosActivos = async () => {
		try {
			let { data } = await PTApi.get('/parametros/get_params/forma_pago');
			setdataFormaPagoActivoVentas(agruparYOrdenar(data.formaPago));
		} catch (error) {
			console.log(error);
		}
	};
	return {
        obtenerFormaDePagosActivos
    };
};
