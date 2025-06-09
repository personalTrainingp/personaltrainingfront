import { PTApi } from '@/common';
import { useState } from 'react';
import dayjs from 'dayjs';
import { DateMaskString } from '@/components/CurrencyMask';

export const useFlujoCajaStore = () => {
	const [dataIngresos_FC, setdataIngresos_FC] = useState([]);
	const [dataGastosxANIO, setdataGastosxANIO] = useState([]);
	const [dataGastosxANIOCIRCUS, setdataGastosxANIOCIRCUS] = useState([]);
	const [dataGastosxANIOSE, setdataGastosxANIOSE] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [dataCreditoFiscal, setdataCreditoFiscal] = useState({
		msg: '',
		creditoFiscalAniosAnteriores: 0,
		facturas: [{ igv: 0, mes: 0, anio: 0, monto_final: 0 }],
		ventas: [{ igv: 0, mes: 0, anio: 0, monto_final: 0 }],
	});
	const obtenerIngresosxMes = async (mes, anio) => {
		try {
			const { data } = await PTApi.get('/flujo-caja/ingresos', {
				params: {
					mes,
					anio,
				},
			});
			console.log(data.data);

			setdataIngresos_FC(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastosxANIO = async (anio, enterprice) => {
		try {
			const { data } = await PTApi.get(`/flujo-caja/get-gasto-x-grupo/${enterprice}/${anio}`);

			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${enterprice}`
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

			setdataGastosxANIO(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, data.gastos),
					dataParametrosGastos.termGastos
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCreditoFiscalxANIO = async (anio, enterprice) => {
		try {
			const { data } = await PTApi.get(`/flujo-caja/credito-fiscal/${enterprice}`, {
				params: {
					anio,
				},
			});
			console.log(data);

			setdataCreditoFiscal(data);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerIngresosxMes,
		obtenerGastosxANIO,
		obtenerCreditoFiscalxANIO,
		dataIngresos_FC,
		dataCreditoFiscal,
		dataGastosxANIO,
	};
};
function aplicarTipoDeCambio(dataTC, dataGastos) {
	return dataGastos.map((gasto) => {
		const fechaGasto = new Date(gasto.fec_comprobante);

		const tcMatch = dataTC.find((tc) => {
			if (tc.moneda === gasto.moneda) return false;

			const inicio = new Date(tc.fecha_inicio_tc);
			// Debe ser posterior o igual al inicio
			if (fechaGasto < inicio) return false;

			// Si hay fecha_fin_tc, también debe ser ≤ fin
			if (tc.fecha_fin_tc) {
				const fin = new Date(tc.fecha_fin_tc);
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

function agruparPorGrupoYConcepto(dataGastos, dataGrupos) {
	const meses = Array.from({ length: 12 }, (_, i) => i + 1);
	console.log({ dataGastos });

	// 1. Construir un mapa temporal: grupoNombre → [ todos los objetos de dataGrupos que pertenecen a ese grupo ]
	const gruposMapTemp = {};
	dataGrupos.forEach((entry) => {
		const nombreGrupo = entry.grupo?.trim()?.toUpperCase() || 'SIN GRUPO';
		if (!gruposMapTemp[nombreGrupo]) {
			gruposMapTemp[nombreGrupo] = [];
		}
		gruposMapTemp[nombreGrupo].push(entry);
	});

	// 2. Convertir el mapa en un array de [grupoNombre, arrayDeEntradas], ordenado POR parametro_grupo.orden
	//    (asumimos que para todas las entradas de un mismo grupo, parametro_grupo.orden es igual)
	const gruposOrdenados = Object.entries(gruposMapTemp).sort(([, entradasA], [, entradasB]) => {
		// tomo el primer objeto de cada array para leer parametro_grupo.orden
		const ordenA = entradasA[0].parametro_grupo?.orden ?? 0;
		const ordenB = entradasB[0].parametro_grupo?.orden ?? 0;
		return ordenA - ordenB;
	});
	// 3. Para cada grupoOrdenado, ordenar sus conceptos internos según su propio "orden"
	const resultado = gruposOrdenados.map(([grupoNombre, entradasDeGrupo]) => {
		// a) ordenar las entradasDeGrupo por entry.orden (el orden del concepto dentro del grupo)
		entradasDeGrupo.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

		// b) extraer los nombres únicos de concepto (nombre_gasto) en ese orden
		const conceptosUnicosPorNombre = [];
		entradasDeGrupo.forEach((c) => {
			const nombreConcepto = c.nombre_gasto?.trim()?.toUpperCase() || 'SIN CONCEPTO';
			if (!conceptosUnicosPorNombre.includes(nombreConcepto)) {
				conceptosUnicosPorNombre.push(nombreConcepto);
			}
		});
		// c) construir la lista de conceptos con monto por mes
		const conceptos = conceptosUnicosPorNombre.map((nombreConcepto) => {
			// filtrar todos los gastos de dataGastos que coincidan con este grupo + concepto
			const itemsDelConcepto = dataGastos.filter((g) => {
				const pg = g.tb_parametros_gasto || {};
				const grupoGasto = pg.grupo?.trim()?.toUpperCase();
				const nombreGasto = pg.nombre_gasto?.trim()?.toUpperCase();
				return grupoGasto === grupoNombre && nombreGasto === nombreConcepto;
			});
			// para cada mes (1 a 12), sumar los montos
			const itemsPorMes = meses.map((mes) => {
				const itemsMes = itemsDelConcepto.filter(
					(item) => dayjs(item.fec_comprobante).month() + 1 === mes
				);
				const monto_total = itemsMes.reduce((sum, g) => sum + (g.monto * g.tc || 0), 0);
				return {
					mes,
					monto_total,
					items: itemsMes,
				};
			});

			return {
				concepto: nombreConcepto,
				items: itemsPorMes,
			};
		});

		return {
			grupo: grupoNombre,
			conceptos,
		};
	});

	console.log({ resultado });
	return resultado;
}
