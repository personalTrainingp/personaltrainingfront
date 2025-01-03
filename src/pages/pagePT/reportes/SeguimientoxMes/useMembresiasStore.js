import { PTApi } from '@/common';
import {
	formateo_Moneda,
	FUNFormatterCom,
	FUNMoneyFormatter,
	NumberFormatMoney,
} from '@/components/CurrencyMask';
import { useState } from 'react';

export const useComparativoAnualStore = () => {
	const [viewDataMembresias, setviewDataMembresias] = useState([]);
	const obtenerMembresiasClientes = async () => {
		try {
			console.log('funciona');

			const { data } = await PTApi.get('/venta/reporte/obtener-todo-membresias');
			console.log(agruparPorMesesConCeros(data.membresias));
			setviewDataMembresias(agruparPorMesesConCeros(data.membresias));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerMembresiasClientes,
		viewDataMembresias,
	};
};
function agruparPorMesesConCeros(data) {
	const mesInicioFijo = 9; // Septiembre
	const anioInicioFijo = 2024; // Año 2024

	const resultado = [];

	data.forEach((item) => {
		item.detalle_ventaMembresia.forEach((membresia) => {
			const { id_pgm, fec_inicio_mem, fec_fin_mem } = membresia;

			// Crear fechas de inicio (fijo) y fin (última fecha de membresía)
			const fechaInicio = new Date(
				Math.max(
					new Date(anioInicioFijo, mesInicioFijo - 1).getTime(),
					new Date(fec_inicio_mem).getTime()
				)
			);
			const fechaFin = new Date(fec_fin_mem);

			// Inicializar el grupo para este id_pgm si no existe
			let grupo = resultado.find((grupo) => grupo.id_pgm === id_pgm);
			if (!grupo) {
				grupo = { id_pgm, items: [] };
				resultado.push(grupo);
			}

			// Rellenar meses del rango con sus items
			let fechaActual = new Date(fechaInicio);
			while (fechaActual <= fechaFin) {
				const mes = fechaActual.getMonth() + 1; // Mes (1-12)
				const anio = fechaActual.getFullYear();

				// Buscar o agregar un mes y año al grupo
				let itemMes = grupo.items.find((i) => i.mes === mes && i.anio === anio);
				if (!itemMes) {
					itemMes = { mes, anio, items: [], total: 0 };
					grupo.items.push(itemMes);
				}

				// Agregar información relevante al mes actual
				itemMes.items.push(membresia);

				// Sumar el monto al total del mes
				itemMes.total += 1; // Aquí puedes cambiar por la lógica para calcular el total según lo que desees

				// Avanzar al siguiente mes
				fechaActual.setMonth(fechaActual.getMonth() + 1);
			}
		});
	});

	// Ajustar los meses para incluir desde la fecha fija hasta el último mes de datos
	resultado.forEach((grupo) => {
		const mesesExistentes = grupo.items.map((item) => ({ mes: item.mes, anio: item.anio }));
		const ultimoMes = mesesExistentes[mesesExistentes.length - 1] || {
			mes: mesInicioFijo,
			anio: anioInicioFijo,
		};

		let fechaActual = new Date(anioInicioFijo, mesInicioFijo - 1); // Inicio fijo
		const fechaFinal = new Date(ultimoMes.anio, ultimoMes.mes - 1); // Último mes de datos

		while (fechaActual <= fechaFinal) {
			const mes = fechaActual.getMonth() + 1;
			const anio = fechaActual.getFullYear();

			if (!grupo.items.some((item) => item.mes === mes && item.anio === anio)) {
				grupo.items.push({ mes, anio, items: [], total: 0 });
			}

			// Avanzar al siguiente mes
			fechaActual.setMonth(fechaActual.getMonth() + 1);
		}

		// Ordenar los meses dentro del grupo
		grupo.items.sort((a, b) => a.anio - b.anio || a.mes - b.mes);

		// Calcular la variación porcentual
		for (let i = 0; i < grupo.items.length; i++) {
			const actual = grupo.items[i];
			const anterior = grupo.items[i - 1];
			// console.log(anterior);
			if (i === 0) {
				if (actual.total == 0) {
					actual.variacion_porcent = 0;
				} else {
					actual.variacion_porcent = 100;
				}
				// console.log(anterior.total);
				// Forzar la variación porcentual del segundo elemento a 100%
			} else if (anterior) {
				actual.variacion_porcent =
					anterior.total >= 0
						? anterior.total == 0
							? 100
							: ((actual.total - anterior.total) / anterior.total) * 100
						: null;
			} else {
				actual.variacion_porcent = null; // No hay mes anterior
			}
		}
	});

	// Crear grupo con id_pgm: 0 (total de todos los id_pgms)
	const grupoTotal = { id_pgm: 0, items: [] };
	const mesesUnicos = new Set();

	resultado.forEach((grupo) => {
		grupo.items.forEach((item) => {
			const key = `${item.mes}-${item.anio}`;
			if (!mesesUnicos.has(key)) {
				mesesUnicos.add(key);
				grupoTotal.items.push({ mes: item.mes, anio: item.anio, items: [], total: 0 });
			}
		});
	});

	grupoTotal.items.forEach((itemTotal) => {
		resultado.forEach((grupo) => {
			const itemGrupo = grupo.items.find(
				(item) => item.mes === itemTotal.mes && item.anio === itemTotal.anio
			);
			if (itemGrupo) {
				itemTotal.total += itemGrupo.total;
				itemTotal.items.push(...itemGrupo.items);
			}
		});
	});

	// Calcular la variación porcentual para el grupo total
	for (let i = 0; i < grupoTotal.items.length; i++) {
		const actual = grupoTotal.items[i];
		const anterior = grupoTotal.items[i - 1];
		// console.log(anterior);

		// if(anterior.total === 0) {
		// 	anterior.variacion_porcent = 100
		// }
		if (i === 0) {
			// Forzar la variación porcentual del segundo elemento a 100%
			actual.variacion_porcent = 100;
		} else if (anterior) {
			actual.variacion_porcent =
				anterior.total > 0
					? ((actual.total - anterior.total) / anterior.total) * 100
					: null;
		} else {
			actual.variacion_porcent = null; // No hay mes anterior
		}
	}

	resultado.push(grupoTotal);

	return resultado;
}

/*

if (i === 0) {
				// Forzar la variación porcentual del segundo elemento a 100%
				actual.variacion_porcent = 100;
			} else if (anterior) {
				actual.variacion_porcent =
					anterior.total > 0
						? ((actual.total - anterior.total) / anterior.total) * 100
						: null;
			} else {
				actual.variacion_porcent = null; // No hay mes anterior
			}
const mesInicioFijo = 9; // Septiembre
	const anioInicioFijo = 2024; // Año 2024

	const resultado = [];

	data.forEach((item) => {
		item.detalle_ventaMembresia.forEach((membresia) => {
			const { id_pgm, fec_inicio_mem, fec_fin_mem } = membresia;

			// Crear fechas de inicio (fijo) y fin (última fecha de membresía)
			const fechaInicio = new Date(
				Math.max(
					new Date(anioInicioFijo, mesInicioFijo - 1).getTime(),
					new Date(fec_inicio_mem).getTime()
				)
			);
			const fechaFin = new Date(fec_fin_mem);

			// Inicializar el grupo para este id_pgm si no existe
			let grupo = resultado.find((grupo) => grupo.id_pgm === id_pgm);
			if (!grupo) {
				grupo = { id_pgm, items: [] };
				resultado.push(grupo);
			}

			// Rellenar meses del rango con sus items
			let fechaActual = new Date(fechaInicio);
			while (fechaActual <= fechaFin) {
				const mes = fechaActual.getMonth() + 1; // Mes (1-12)
				const anio = fechaActual.getFullYear();

				// Buscar o agregar un mes y año al grupo
				let itemMes = grupo.items.find((i) => i.mes === mes && i.anio === anio);
				if (!itemMes) {
					itemMes = { mes, anio, items: [], total: 0 };
					grupo.items.push(itemMes);
				}

				// Agregar información relevante al mes actual
				itemMes.items.push(membresia);

				// Sumar el monto al total del mes
				itemMes.total += 1; // Aquí puedes cambiar por la lógica para calcular el total según lo que desees

				// Avanzar al siguiente mes
				fechaActual.setMonth(fechaActual.getMonth() + 1);
			}
		});
	});

	// Ajustar los meses para incluir desde la fecha fija hasta el último mes de datos
	resultado.forEach((grupo) => {
		const mesesExistentes = grupo.items.map((item) => ({ mes: item.mes, anio: item.anio }));
		const ultimoMes = mesesExistentes[mesesExistentes.length - 1] || {
			mes: mesInicioFijo,
			anio: anioInicioFijo,
		};

		let fechaActual = new Date(anioInicioFijo, mesInicioFijo - 1); // Inicio fijo
		const fechaFinal = new Date(ultimoMes.anio, ultimoMes.mes - 1); // Último mes de datos

		while (fechaActual <= fechaFinal) {
			const mes = fechaActual.getMonth() + 1;
			const anio = fechaActual.getFullYear();

			if (!grupo.items.some((item) => item.mes === mes && item.anio === anio)) {
				grupo.items.push({ mes, anio, items: [], total: 0 });
			}

			// Avanzar al siguiente mes
			fechaActual.setMonth(fechaActual.getMonth() + 1);
		}

		// Ordenar los meses dentro del grupo
		grupo.items.sort((a, b) => a.anio - b.anio || a.mes - b.mes);

		// Calcular la variación porcentual
		for (let i = 0; i < grupo.items.length; i++) {
			const actual = grupo.items[i];
			const anterior = grupo.items[i - 1];

			if (anterior) {
				actual.variacion_porcent =
					anterior.total > 0
						? ((actual.total - anterior.total) / anterior.total) * 100
						: null;
			} else {
				actual.variacion_porcent = null; // No hay mes anterior
			}
		}
	});

	// Crear grupo con id_pgm: 0 (total de todos los id_pgms)
	const grupoTotal = { id_pgm: 0, items: [] };
	const mesesUnicos = new Set();

	resultado.forEach((grupo) => {
		grupo.items.forEach((item) => {
			const key = `${item.mes}-${item.anio}`;
			if (!mesesUnicos.has(key)) {
				mesesUnicos.add(key);
				grupoTotal.items.push({ mes: item.mes, anio: item.anio, items: [], total: 0 });
			}
		});
	});

	grupoTotal.items.forEach((itemTotal) => {
		resultado.forEach((grupo) => {
			const itemGrupo = grupo.items.find(
				(item) => item.mes === itemTotal.mes && item.anio === itemTotal.anio
			);
			if (itemGrupo) {
				itemTotal.total += itemGrupo.total;
				itemTotal.items.push(...itemGrupo.items);
			}
		});
	});

	// Calcular la variación porcentual para el grupo total
	for (let i = 0; i < grupoTotal.items.length; i++) {
		const actual = grupoTotal.items[i];
		const anterior = grupoTotal.items[i - 1];

		if (anterior) {
			actual.variacion_porcent =
				anterior.total > 0
					? ((actual.total - anterior.total) / anterior.total) * 100
					: null;
		} else {
			actual.variacion_porcent = null; // No hay mes anterior
		}
	}

	resultado.push(grupoTotal);

	return resultado;
*/
