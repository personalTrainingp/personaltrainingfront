import { PTApi } from '@/common';
import TopBarTheme from '@/components/ThemeCustomizer/TopBarTheme';
import { useState } from 'react';

export const useMembresiaxCliente = () => {
	const [data, setdata] = useState([]);
	const obtenerClientesMembretados = async () => {
		try {
			const { data: dataClientesxMembresia } = await PTApi.get('/venta/clientes-membresias');
			console.log('khe?');
			console.log(dataClientesxMembresia.clientesConMembresia);
			const dataNew = dataClientesxMembresia.clientesConMembresia.map((d) => {
				return {
					nombres_apellidos_cli: d.nombres_apellidos_cli,
					membresias: d.tb_venta.map((v) => {
						return {
							detalle_membresia: v.detalle_ventaMembresia[0],
							id_tipoFactura: v.id_tipoFactura,
							numero_transac: v.numero_transac,
							fecha_venta: v.fecha_venta,
						};
					}),
				};
			});
			setdata(dataNew);
			console.log(dataNew);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerClientesMembretados,
		data,
	};
};
