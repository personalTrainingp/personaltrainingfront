import { PTApi } from '@/common';
import { DateMaskStr2, MaskDate } from '@/components/CurrencyMask';
import config from '@/config';
import { useState } from 'react';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { arrayFacturas } from '@/types/type';

export const useGestVentasStore = () => {
	const [dataVentasxEmpresa, setdataVentasxEmpresa] = useState([]);
	const putVentas = async (id_origen, id_venta, obtenerVentaxID) => {
		try {
			await PTApi.put(`/venta/put-venta/${id_venta}`, {
				id_origen: id_origen,
			});
			obtenerVentaxID(id_venta);
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerVentasxEmpresa = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/venta/get-ventas/${id_empresa}`);
			// console.log(data);
			const ventaMap = data.ventas?.map((v) => {
				const avatarCli = v.tb_cliente?.tb_images[0]?.name_image;
				const combinedArray = [
					...v?.detalle_ventaCitas,
					...v?.detalle_ventaMembresia,
					...v?.detalle_ventaProductos,
					...v?.venta_venta,
				];

				// Calcular la suma total de tarifa_monto
				const sumaTotal = combinedArray.reduce(
					(total, item) => total + item.tarifa_monto,
					0
				);

				return {
					id: v.id,
					fecha_venta: MaskDate(
						v.fecha_venta,
						'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A'
					),
					id_cli: v.id_cli,
					tb_cliente: {
						nombres_cliente: v.tb_cliente.nombres_apellidos_cli,
						urlAvatar:
							v.tb_cliente?.tb_images.length === 0
								? sinAvatar
								: `${config.API_IMG.AVATAR_CLI}${avatarCli}`,
					},
					nombre_empleado: v.tb_empleado.nombres_apellidos_empl,
					n_comprobante: v.numero_transac,
					comprobante: arrayFacturas.find((e) => e.value === v.id_tipoFactura)?.label,
					observacion: v.observacion,
					montoTotal: sumaTotal,
				};
			});
			console.log({ data });
			setdataVentasxEmpresa(ventaMap);
		} catch (error) {
			console.log(error);
		}
	};
	return { putVentas, obtenerVentasxEmpresa, dataVentasxEmpresa };
};
