import { PTApi } from '@/common';
import React, { useState } from 'react';

export const useDeudasProveedoresStore = () => {
	const [dataContratosProv, setdataContratosProv] = useState([]);
	const obtenerContratosProveedores = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/contrato-prov/${id_empresa}`);
			setdataContratosProv(agruparPorRUC(data.contratosProv));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerContratosProveedores,
		dataContratosProv,
	};
};
const agruparPorRUC = (data = []) => {
	const map = {};

	for (const item of data) {
		const ruc = item?.prov?.ruc_prov ?? 'SIN_RUC';

		if (!map[ruc]) {
			map[ruc] = {
				ruc,
				mano_obra_soles_total: 0,
				mano_obra_dolares_total: 0,
				monto_contratos_total: 0,
				gastos_monto_soles: 0,
				gastos_monto_dolares: 0,
				items: [],
			};
		}

		// Sumar mano de obra del contrato
		map[ruc].mano_obra_soles_total += item.mano_obra_soles || 0;
		map[ruc].mano_obra_dolares_total += item.mano_obra_dolares || 0;
		map[ruc].monto_contratos_total += item.monto_contrato || 0;

		// Sumar gastos del array gasto[]
		if (Array.isArray(item.gasto)) {
			for (const g of item.gasto) {
				const monto = g.monto || 0;

				if (g.moneda === 'PEN') {
					map[ruc].gastos_monto_soles += monto;
				} else if (g.moneda === 'USD') {
					map[ruc].gastos_monto_dolares += monto;
				}
			}
		}

		// Agregar item completo al array
		map[ruc].items.push(item);
	}

	return Object.values(map);
};
