import { PTApi } from '@/common';
import React, { useState } from 'react';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientos';
import dayjs, { utc } from 'dayjs';

dayjs.extend(utc);
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs.utc(date);
	return isStart
		? base.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]')
		: base.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]');
}

export const useCuentasStore = () => {
	const [dataCuentasBalance, setdataCuentasBalance] = useState([]);
	const obtenerCuentasBalance = async (arrayDate, idEmpresa, tipo) => {
		try {
			const { data } = await PTApi.get(
				`/cuenta-balance/fecha-comprobante/${idEmpresa}/${tipo}`,
				{
					params: {
						arrayDate: [
							formatDateToSQLServerWithDayjs(arrayDate[0], true),
							formatDateToSQLServerWithDayjs(arrayDate[1], false),
						],
					},
				}
			);
			const { data: dataTC } = await PTApi.get('/tipoCambio/');
			const dataTCs = dataTC.tipoCambios.map((e, i, arr) => {
				const posteriores = arr
					.filter((item) => new Date(item.fecha) > new Date(e.fecha))
					.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

				const termino = posteriores.length ? posteriores[0].fecha : null;
				return {
					moneda: e.monedaDestino,
					multiplicador: e.precio_compra,
					// monedaOrigen: e.monedaOrigen,
					fecha_inicio_tc: e.fecha,
					fecha_fin_tc: termino, // null si no hay próximo cambio
				};
			});

			const dataAlter3 = data.cuentasBalances.map((cu) => {
				return {
					...cu,
					id_gasto: cu.id_concepto,
					fec_comprobante: cu.fecha_comprobante,
					fec_pago: cu.fecha_comprobante,
					tb_parametros_gasto: {
						grupo: cu.concepto.label_param,
						id_empresa: cu.id_empresa,
						nombre_gasto: cu.tb_Proveedor?.razon_social_prov,
						id_tipoGasto: 250,
						parametro_grupo: {
							id: cu.concepto.id_param,
							param_label: cu.concepto.label_param,
							id_tipoGasto: 250,
						},
					},
				};
			});
			setdataCuentasBalance(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, dataAlter3),
					[
						{
							id: 1576,
							grupo: 'PRESTAMOS',
							orden: 1,
							tipo: 'PorCobrar',
							nombre_gasto: 'INVERSIONES SAN EXPEDITO',
							parametro_grupo: { label_param: 'PRESTAMOS', orden: 1 },
						},
						{
							id: 1577,
							grupo: 'SUELDO',
							orden: 2,
							tipo: 'PorCobrar',
							nombre_gasto: 'INVERSIONES SAN EXPEDITO',
							parametro_grupo: { label_param: 'SUELDO', orden: 2 },
						},
						{
							id: 1577,
							grupo: 'SUELDO',
							tipo: 'PorCobrar',
							orden: 2,
							nombre_gasto: 'INVERSIONES LUROGA SAC.',
							parametro_grupo: { label_param: 'SUELDO', orden: 2 },
						},
						{
							id: 1578,
							tipo: 'PorPagar',
							grupo: 'TARJETA DE CREDITO',
							nombre_gasto: 'INVERSIONES LUROGA SAC.',
							orden: 3,
							parametro_grupo: { label_param: 'TARJETA DE CREDITO', orden: 3 },
						},
						{
							id: 1578,
							grupo: 'TARJETA DE CREDITO',
							tipo: 'PorPagar',
							nombre_gasto: 'INVERSIONES SAN EXPEDITO',
							orden: 3,
							parametro_grupo: { label_param: 'TARJETA DE CREDITO', orden: 3 },
						},
						{
							id: 1576,
							grupo: 'PRESTAMOS',
							tipo: 'PorPagar',
							orden: 4,
							nombre_gasto: 'RAL',
							parametro_grupo: { label_param: 'PRESTAMOS', orden: 6 },
						},
						{
							id: 1578,
							grupo: 'TARJETA DE CREDITO',
							tipo: 'PorPagar',
							orden: 4,
							nombre_gasto: 'RAL',
							parametro_grupo: { label_param: 'TARJETA DE CREDITO', orden: 7 },
						},
						{
							id: 1576,
							grupo: 'PRESTAMOS',
							tipo: 'PorCobrar',
							orden: 4,
							nombre_gasto: 'RAL',
							parametro_grupo: { label_param: 'PRESTAMOS', orden: 7 },
						},
					].filter((e) => e.tipo === tipo),
					tipo
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerCuentasBalance,
		dataCuentasBalance,
	};
};
