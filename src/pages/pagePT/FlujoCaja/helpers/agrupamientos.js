import { DateMask, DateMaskString } from '@/components/CurrencyMask';
import dayjs from 'dayjs';

export function generarVentasOrdenadas(gruposData, anioFiltro) {
	return gruposData?.map(({ grupo, data }) => {
		const conceptos = agruparPorProducto(data).map((producto) => {
			return {
				...producto,
				items: agruparPorMes(producto.items, anioFiltro),
			};
		});

		const mesesSuma = Array(12).fill(0);
		let totalAnual = 0;

		conceptos.forEach((concepto) => {
			concepto.items.forEach((mesObj, i) => {
				mesesSuma[i] += mesObj.monto_total;
				totalAnual += mesObj.monto_total;
			});
		});

		return {
			grupo,
			conceptos,
			mesesSuma,
			totalAnual,
		};
	});
}

export function obtenerRangoAnual(anio) {
	const desde = `${anio}-01-01`;
	const hasta = `${anio}-12-31`;
	return [desde, hasta];
}
function agruparPorMes(data) {
	const agrupado = {};

	data.forEach((item) => {
		const fecha = DateMaskString(item.fecha);
		const anio = fecha.getUTCFullYear();
		const mes = fecha.getUTCMonth() + 1;

		const key = `${anio}-${mes}`;
		if (!agrupado[key]) {
			agrupado[key] = {
				anio,
				mes,
				monto_total: 0,
				items: [],
			};
		}

		agrupado[key].items.push(item);
		agrupado[key].monto_total += item.tarifa_monto || 0;
	});

	// Obtener todos los años presentes
	const añosUnicos = [
		...new Set(data.map((item) => DateMaskString(item.fecha).getUTCFullYear())),
	];

	// Generar los 12 meses para cada año
	const resultado = [];
	añosUnicos.forEach((anio) => {
		for (let mes = 1; mes <= 12; mes++) {
			const key = `${anio}-${mes}`;
			if (agrupado[key]) {
				resultado.push(agrupado[key]);
			} else {
				resultado.push({
					anio,
					mes,
					monto_total: 0,
					items: [],
				});
			}
		}
	});

	// Ordenar por año y mes
	resultado.sort((a, b) => a.anio - b.anio || a.mes - b.mes);

	return resultado;
}

export function aplicarTipoDeCambio(dataTC, dataGastos) {
	return dataGastos?.map((gasto) => {
		const fechaGasto = DateMaskString(gasto.fec_pago);

		const tcMatch = dataTC.find((tc) => {
			if (tc.moneda === gasto.moneda) return false;

			const inicio = DateMaskString(tc.fecha_inicio_tc);
			// Debe ser posterior o igual al inicio
			if (fechaGasto < inicio) return false;

			// Si hay fecha_fin_tc, también debe ser ≤ fin
			if (tc.fecha_fin_tc) {
				const fin = DateMaskString(tc.fecha_fin_tc);
				if (fechaGasto > fin) return false;
			}
			// Si fecha_fin_tc es null, este tramo sigue abierto
			return true;
		});

		const resultado = { tc: 1, ...gasto };
		if (tcMatch) resultado.tc = tcMatch.multiplicador;
		return resultado;
	});
}

export function agruparPorGrupoYConcepto(dataGastos, dataGrupos, epsi = '') {
	const meses = Array.from({ length: 12 }, (_, i) => i + 1);
	const gruposMapTemp = {};

	dataGrupos.forEach((entry) => {
		const nombreGrupo = entry.grupo?.trim()?.toUpperCase() || 'SIN GRUPO';
		if (!gruposMapTemp[nombreGrupo]) gruposMapTemp[nombreGrupo] = [];
		gruposMapTemp[nombreGrupo].push(entry);
	});

	const gruposOrdenados = Object.entries(gruposMapTemp).sort(([, entradasA], [, entradasB]) => {
		const ordenA = entradasA[0].parametro_grupo?.orden;
		const ordenB = entradasB[0].parametro_grupo?.orden;
		return (ordenA ?? Infinity) - (ordenB ?? Infinity);
	});

	const resultado = gruposOrdenados.map(([grupoNombre, entradasDeGrupo]) => {
		entradasDeGrupo.sort((a, b) => (a.orden ?? Infinity) - (b.orden ?? Infinity));

		const conceptosUnicosPorNombre = [];
		entradasDeGrupo.forEach((c) => {
			const nombreConcepto = c.nombre_gasto?.trim()?.toUpperCase() || 'SIN CONCEPTO';
			if (!conceptosUnicosPorNombre.includes(nombreConcepto)) {
				conceptosUnicosPorNombre.push(nombreConcepto);
			}
		});

		const conceptos = conceptosUnicosPorNombre.map((nombreConcepto) => {
			const itemsDelConcepto = dataGastos?.filter((g) => {
				const pg = g.tb_parametros_gasto || {};
				const grupoGasto = pg.grupo?.trim()?.toUpperCase();
				const nombreGasto = pg.nombre_gasto?.trim()?.toUpperCase();
				return grupoGasto === grupoNombre && nombreGasto === nombreConcepto;
			});

			const itemsPorMes = meses.map((mes) => {
				const itemsMes =
					itemsDelConcepto?.filter(
						(item) => dayjs.utc(item.fec_comprobante).month() + 1 === mes
					) || [];
				const monto_total = itemsMes.reduce((sum, g) => sum + (g.monto * g.tc || 0), 0);

				return {
					mes,
					monto_total,
					items: itemsMes,
					lenthItems: itemsMes.length,
				};
			});

			return {
				concepto: nombreConcepto,
				items: itemsPorMes,
			};
		});

		// ✅ Totales por grupo (sumando todos los conceptos mes a mes)
		const totalMontoxMes = meses.map((mes) =>
			conceptos.reduce((sum, c) => {
				const mesObj = c.items.find((x) => x.mes === mes);
				return sum + (mesObj?.monto_total || 0);
			}, 0)
		);

		const totalCantxMes = meses.map((mes) =>
			conceptos.reduce((sum, c) => {
				const mesObj = c.items.find((x) => x.mes === mes);
				return sum + (mesObj?.lenthItems || 0);
			}, 0)
		);

		return {
			grupo: grupoNombre,
			totalMontoxMes,
			totalCantxMes,
			movimientosTotalDeConceptos: totalCantxMes.reduce((total, item) => total + item, 0),
			totalMes: totalMontoxMes.flatMap((v, i) => [v, totalCantxMes[i]]),
			conceptos,
		};
	});

	return resultado;
}

export function agruparPor(params) {
	
}