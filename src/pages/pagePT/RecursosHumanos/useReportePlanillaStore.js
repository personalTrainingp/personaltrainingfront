import { PTApi } from '@/common';
import TopBarTheme from '@/components/ThemeCustomizer/TopBarTheme';
import { useState } from 'react';

export const useReportePlanillaStore = () => {
	const [dataMarcacionxFecha, setdataMarcacionxFecha] = useState([]);
	const [dataContratoxFecha, setdataContratoxFecha] = useState([]);
	const obtenerReportePlanilla = async () => {
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
	const obtenerMarcacionxFecha = async (arrayFecha, id_empresa) => {
		try {
			const { data } = await PTApi.get(
				`/marcacion/obtenerMarcacionFecha/${id_empresa}/${arrayFecha}`,
				{
					params: {
						arrayFecha: [arrayFecha[0], arrayFecha[1]],
					},
				}
			);
			setdataMarcacionxFecha(data.asistencia);
			console.log(data, arrayFecha);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerContratosDeEmpleados = async (arrayFecha) => {
		try {
			const { data } = await PTApi.get('/jornada/obtener-contratos', {
				params: {
					arrayFecha: [arrayFecha[0], arrayFecha[1]],
				},
			});
			setdataContratoxFecha(data.empleados);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerReportePlanilla,
		obtenerMarcacionxFecha,
		obtenerContratosDeEmpleados,
		dataMarcacionxFecha,
		dataContratoxFecha,
	};
};
