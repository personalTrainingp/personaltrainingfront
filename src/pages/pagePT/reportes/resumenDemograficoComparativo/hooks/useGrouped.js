import { arrayDistritoTest, arrayEstadoCivil, arrayOrigenDeCliente, arraySexo } from '@/types/type';
import React from 'react';

export const useGrouped = () => {
	function agruparPorSexo(detalledata) {
		return arraySexo?.map(({ label, value, order }) => {
			const items = detalledata?.filter(
				(cliente) => cliente?.tb_ventum?.tb_cliente.sexo_cli === value
			);
			return {
				propiedad: label,
				order,
				value,
				items,
			};
		});
	}
	function agruparPorDistrito(detalledata) {
		const arrayDistritos = detalledata?.map((d) => d.tb_ventum.tb_cliente.tb_distrito.distrito);
		// console.log(detalledata, arrayDistritos, "detalledata");
		return arrayDistritoTest?.map(({ label, value, order }) => {
			const items = detalledata?.filter(
				(cliente) => cliente.tb_ventum.tb_cliente.tb_distrito.distrito === label
			);
			return {
				propiedad: label,
				order,
				value,
				items,
			};
		});
	}
	function agruparPorTarifas(data) {
		const resultado = [];

		data?.forEach((item) => {
			// console.log(item, "items");
			const { sesiones } = item.tb_semana_training;
			const { nombreTarifa_tt, descripcionTarifa_tt, tarifaCash_tt, id_tt } =
				item.tarifa_venta;
			const labelTarifa = `${nombreTarifa_tt}-${sesiones}`;
			// Verificar si ya existe un grupo con la misma cantidad de sesiones
			let grupo = resultado?.find((g) => g.unif === labelTarifa);

			if (!grupo) {
				// Si no existe, crear un nuevo grupo
				grupo = {
					propiedad: nombreTarifa_tt,
					unif: labelTarifa,
					tarifaCash_tt,
					sesiones,
					semanas: (sesiones / 5).toFixed(0),
					items: [],
				};
				resultado.push(grupo);
			}

			// Agregar el item al grupo correspondiente
			grupo.items.push(item);
		});

		return resultado.sort((a, b) => b.items.length - a.items.length);
	}
	function agruparPorVendedores(data) {
		const resultado = [];

		data?.forEach((item) => {
			const { id_empl, apMaterno_empl, apPaterno_empl, nombre_empl } =
				item.tb_ventum.tb_empleado;

			// Verificar si ya existe un grupo con la misma cantidad de sesiones
			let grupo = resultado?.find((g) => g.propiedad === nombre_empl);

			if (!grupo) {
				// Si no existe, crear un nuevo grupo
				grupo = { propiedad: nombre_empl, items: [] };
				resultado.push(grupo);
			}

			// Agregar el item al grupo correspondiente
			grupo.items.push(item);
		});

		return resultado.sort((a, b) => b.items.length - a.items.length);
	}
	function agruparPorProcedencia(detalledata) {
		return arrayOrigenDeCliente?.map(({ label, value, order }) => {
			const items = detalledata?.filter((cliente) => cliente.tb_ventum.id_origen === value);
			return {
				propiedad: label,
				order,
				value,
				items,
			};
		});
	}
	function agruparPorEstCivil(detalledata) {
		return arrayEstadoCivil?.map(({ label, value, order }) => {
			const items = detalledata?.filter(
				(cliente) => cliente.tb_ventum.tb_cliente.estCivil_cli === value
			);
			return {
				propiedad: label,
				order,
				value,
				items,
			};
		});
	}
	return {
		agruparPorDistrito,
		agruparPorEstCivil,
		agruparPorProcedencia,
		agruparPorSexo,
		agruparPorTarifas,
		agruparPorVendedores,
	};
};
