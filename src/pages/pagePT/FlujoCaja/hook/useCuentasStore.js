import { PTApi } from '@/common';
import React, { useState } from 'react';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientos';
import dayjs, { utc } from 'dayjs';

dayjs.extend(utc);
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs.utc(date);
	return isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');
}

export const useCuentasStore = () => {
	const [dataCuentasBalance, setdataCuentasBalance] = useState([]);
	const obtenerCuentasBalance = async (arrayDate, idEmpresa, tipo) => {
		try {
			const { data } = await PTApi.get(`/cuenta-balance/fecha-comprobante/${idEmpresa}/${tipo}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			/*
				createdAt: "2025-12-23T21:39:13.909Z",
				descripcion: "MES DE MARZO", 
				fec_comprobante: "2025-03-05T00:00:00.000Z",
				fec_pago: "2025-03-06T00:00:00.000Z",
				fec_registro: null,
				flag: true,
				id: 12,
				id_banco: 50,
				id_empresa: 800,
				id_forma_pago: 39,
				id_gasto: 1153,
				id_prov: 1775,
				id_tarjeta: 0,
				id_tipo_comprobante: 509,
				moneda: "USD",
				monto: 5000,
				n_comprabante: "S/D",
				n_operacion: "0",
				tb_Proveedor: {razon_social_prov: 'el trebol del prado sa'}
				tb_parametros_gasto: {
					grupo: "ARRENDAMIENTO", 
					id_empresa: 800, 
					id_tipoGasto: 250, 
					nombre_gasto: "ESTACIONAMIENTO", 
					parametro_grupo: {id: 118, id_empresa: 800, param_label: 'ARRENDAMIENTO', orden: 1, flag: true, …}
					[[Prototype]]: Object
				}
				updatedAt: "2025-12-23T21:39:13.909Z"
			*/

			// TODO: CUENTAS BALANCES
			/*
concepto: {id_param: 1576, entidad_param: 'PorCobrar', grupo_param: 'concepto', sigla_param: null, label_param: 'PRESTAMOS', …},
createdAt: "2026-01-07T22:02:43.765Z",
descripcion: "abono prestamo",
fecha_comprobante: "2025-11-05T00:00:00.000Z",
flag: true,
id: 5,
id_banco: 50,
id_concepto: 1576,
id_empresa: 800,
id_prov: 1787,
moneda: "PEN",
monto: 2200,
n_operacion: "2600",
tb_Proveedor: {id: 1787, uid: '1a56deb1-b70c-4eb8-890d-356eac3738e9', nombre_contacto: '', ruc_prov: '20601185765', id_tarjeta: 1230, …},
tipo: "PorCobrar",
updatedAt: "2026-01-07T22:02:43.765Z"
			*/
			console.log({ cu: data.cuentasBalances });
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
						nombre_gasto: cu.tb_Proveedor.razon_social_prov,
						id_tipoGasto: 250,
						parametro_grupo: {
							id: cu.concepto.id_param,
							param_label: cu.concepto.label_param,
							id_tipoGasto: 250,
						},
					},
				};
			});
			console.log({
				dataAlter1: aplicarTipoDeCambio(dataTCs, dataAlter3),
				idEmpresa,
				tipo,
				dataAlter: agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, dataAlter3),
					[
						{
							id: 1576,
							grupo: 'PRESTAMOS',
							orden: 1,
							nombre_gasto: 'INVERSIONES LUROGA SAC.',
							parametro_grupo: { label_param: 'PRESTAMOS', orden: 1 },
						},
						{
							id: 1576,
							grupo: 'PRESTAMOS',
							orden: 1,
							nombre_gasto: 'INVERSIONES SAN EXPEDITO',
							parametro_grupo: { label_param: 'PRESTAMOS', orden: 1 },
						},
						{
							id: 1577,
							grupo: 'SUELDO',
							orden: 2,
							nombre_gasto: 'INVERSIONES SAN EXPEDITO',
							parametro_grupo: { label_param: 'SUELDO', orden: 2 },
						},
						{
							id: 1577,
							grupo: 'SUELDO',
							orden: 2,
							nombre_gasto: 'INVERSIONES LUROGA SAC.',
							parametro_grupo: { label_param: 'SUELDO', orden: 2 },
						},
						{
							id: 1578,
							grupo: 'TARJETA DE CREDITO',
							orden: 3,
							parametro_grupo: { label_param: 'TARJETA DE CREDITO', orden: 3 },
						},
						{
							id: 1579,
							grupo: 'OTROS',
							orden: 4,
							parametro_grupo: { label_param: 'OTROS', orden: 4 },
						},
					],
					tipo
				),
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
							nombre_gasto: 'INVERSIONES LUROGA SAC.',
							parametro_grupo: { label_param: 'PRESTAMOS', orden: 1 },
						},
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
							id: 1579,
							grupo: 'OTROS',
							tipo: 'PorPagar',
							orden: 4,
							parametro_grupo: { label_param: 'OTROS', orden: 4 },
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
