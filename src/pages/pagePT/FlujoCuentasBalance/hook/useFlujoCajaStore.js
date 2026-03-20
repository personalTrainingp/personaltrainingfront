import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';
import { agruparPorGrupoYConcepto } from '../helpers/agrupamientosOficiales';
import { dataIngresosOrden } from '@/helper/dataIngresosOrden';
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs';
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio';
import { aplicarTipoDeCambio } from '@/helper/aplicarTipoCambio';

export const useFlujoCaja = () => {
	const [dataCuentasBalancexFecha, setdataCuentasBalancexFecha] = useState([]);
	const obtenerCuentasBalancexFecha = async (enterprice, arrayDate, tipo) => {
		try {
			const { data } = await PTApi.get(
				`/cuenta-balance/fecha-comprobante/${enterprice}/${tipo}`,
				{
					params: {
						arrayDate: [
							formatDateToSQLServerWithDayjs(arrayDate[0], true),
							formatDateToSQLServerWithDayjs(arrayDate[1], false),
						],
					},
				}
			);

			const dataGastos = data.cuentasBalances.map((g) => {
				return {
					...g,
					fecha_primaria: g.fecha_comprobante,
					tb_Proveedor: {
						razon_social_prov: g.descripcion.split(':')[0].trim(),
					},
					descripcion: g.descripcion.split(':')[1].trim(),
					id_estado_gasto: 1423,
					tb_parametros_gasto: {
						id: g.id_concepto,
						id_empresa: g.id_empresa,
						grupo: g.concepto?.label_param,
						nombre_gasto: g?.proveedor_empresa?.razon_social_prov,
						param_label: g?.proveedor_empresa?.razon_social_prov,
						orden: 1,
						parametro_grupo: {
							orden: 1,
							id_empresa: g.id_empresa,
							param_label: g.concepto?.label_param,
						},
					},
				};
			});
			const arrGrupos = [
				{
					id: 1576,
					grupo: 'PRESTAMOS',
					orden: 1,
					tipo: 'PorCobrar',
					nombre_gasto: 'INVERSIONES SAN EXPEDITO',
					parametro_grupo: { param_label: 'PRESTAMOS', orden: 1 },
				},
				{
					id: 1578,
					grupo: 'TARJETA DE CREDITO',
					tipo: 'PorPagar',
					nombre_gasto: 'INVERSIONES LUROGA SAC.',
					orden: 3,
					parametro_grupo: { param_label: 'TARJETA DE CREDITO', orden: 3 },
				},
				{
					id: 1578,
					grupo: 'TARJETA DE CREDITO',
					tipo: 'PorPagar',
					nombre_gasto: 'INVERSIONES SAN EXPEDITO',
					orden: 3,
					parametro_grupo: { param_label: 'TARJETA DE CREDITO', orden: 3 },
				},
				{
					id: 1576,
					grupo: 'PRESTAMOS',
					tipo: 'PorPagar',
					orden: 4,
					nombre_gasto: 'RAL',
					parametro_grupo: { param_label: 'PRESTAMOS', orden: 6 },
				},
				{
					id: 1578,
					grupo: 'TARJETA DE CREDITO',
					tipo: 'PorPagar',
					orden: 4,
					nombre_gasto: 'RAL',
					parametro_grupo: { param_label: 'TARJETA DE CREDITO', orden: 7 },
				},
				{
					id: 1576,
					grupo: 'PRESTAMOS',
					tipo: 'PorCobrar',
					orden: 4,
					nombre_gasto: 'RAL',
					parametro_grupo: { param_label: 'PRESTAMOS', orden: 7 },
				},
			];
			const arrGruposFiltrados =
				enterprice == 800
					? [
							{
								id: 1577,
								grupo: 'SUELDO',
								orden: 2,
								tipo: 'PorCobrar',
								nombre_gasto: 'INVERSIONES SAN EXPEDITO',
								parametro_grupo: { param_label: 'SUELDO', orden: 2 },
							},
						]
					: [
							{
								id: 1577,
								grupo: 'SUELDO',
								orden: 2,
								tipo: 'PorPagar',
								nombre_gasto: 'INVERSIONES SAN EXPEDITO',
								parametro_grupo: { param_label: 'SUELDO', orden: 2 },
							},
						];
			console.log([...arrGrupos, ...arrGruposFiltrados], { enterprice });

			const dataTipoTC = await obtenerTipoDeCambio();
			setdataCuentasBalancexFecha(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTipoTC, dataGastos),
					[...arrGruposFiltrados, ...arrGrupos].filter((e) => e.tipo === tipo)
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerCuentasBalancexFecha,
		dataCuentasBalancexFecha,
	};
};
