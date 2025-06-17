import { PTApi } from '@/common';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useFlujoCajaStore } from './useFlujoCajaStore';

export const useGastosCIRCUSYSE = () => {
	const [dataGasto, setdataGasto] = useState([]);
	const { obtenerGastosxANIO: obtenerGastosxANIOCIRCUS, dataGastosxANIO: dataGastosxANIOCIRCUS } =
		useFlujoCajaStore();
	const { obtenerGastosxANIO: obtenerGastosxANIOSE, dataGastosxANIO: dataGastosxANIOSE } =
		useFlujoCajaStore();
	useEffect(() => {
		obtenerGastosxANIOCIRCUS(2025, 599);
		obtenerGastosxANIOSE(2025, 601);
	}, []);
	const obtenerGastosxANIOCIRCUSYSE = async (anio, enterprice) => {
		try {
			const unirGrupos = unirPorGrupoYConcepto(dataGastosxANIOCIRCUS, dataGastosxANIOSE);
			console.log({ unirGrupos });
			setdataGasto(unirGrupos);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataGasto,
		obtenerGastosxANIOCIRCUSYSE,
	};
};

function unirPorGrupoYConcepto(data1, data2) {
	// Paso 0: helpers para indexar por nombre de grupo y por nombre de concepto
	const indexBy = (arr, keyField) => {
		const map = new Map();
		arr.forEach((obj) => map.set(obj[keyField], obj));
		return map;
	};

	// Paso 1: índice de grupos en cada data
	const grupos1 = indexBy(data1, 'grupo');
	const grupos2 = indexBy(data2, 'grupo');

	// Paso 2: construir el conjunto (Set) de todos los nombres de grupo
	const todosGrupos = new Set([...grupos1.keys(), ...grupos2.keys()]);

	const resultado = [];

	todosGrupos.forEach((grupoName) => {
		const g1 = grupos1.get(grupoName) || null;
		const g2 = grupos2.get(grupoName) || null;

		// Si existe en ambos, los fusionamos
		if (g1 && g2) {
			// 2.1: Indexar conceptos por nombre dentro de cada grupo
			const conceptos1 = indexBy(g1.conceptos, 'concepto');
			const conceptos2 = indexBy(g2.conceptos, 'concepto');

			// 2.2: conjunto de todos los nombres de concepto en este grupo
			const todosConceptos = new Set([...conceptos1.keys(), ...conceptos2.keys()]);

			const conceptosFusionados = [];

			todosConceptos.forEach((conceptoNombre) => {
				const c1 = conceptos1.get(conceptoNombre) || null;
				const c2 = conceptos2.get(conceptoNombre) || null;

				// Caso A: existe en ambos -> fusionamos mes a mes
				// Caso A: existe en ambos -> fusionamos mes a mes
				if (c1 && c2) {
					const itemsCombinados = c1.items.map((mesObj1, idx) => {
						const mes = mesObj1.mes;
						const mesObj2 = c2.items[idx] || { monto_total: 0, items: [] };

						return {
							mes,
							monto_total: (mesObj1.monto_total || 0) + (mesObj2.monto_total || 0),
							items: [...(mesObj1.items || []), ...(mesObj2.items || [])],
						};
					});

					conceptosFusionados.push({
						concepto: `${conceptoNombre} (AMBOS)`, // ← aquí está el cambio
						items: itemsCombinados,
					});
				}
				// Caso B: sólo existe en data1 -> renombrar con "(data 1)"
				else if (c1 && !c2) {
					const itemsCopiados = c1.items.map((mesObj) => ({
						mes: mesObj.mes,
						monto_total: mesObj.monto_total,
						items: [...mesObj.items],
					}));
					conceptosFusionados.push({
						concepto: `${conceptoNombre} (CIRCUS)`,
						items: itemsCopiados,
					});
				}
				// Caso C: sólo existe en data2 -> renombrar con "(data 2)"
				else if (!c1 && c2) {
					const itemsCopiados = c2.items.map((mesObj) => ({
						mes: mesObj.mes,
						monto_total: mesObj.monto_total,
						items: [...mesObj.items],
					}));
					conceptosFusionados.push({
						concepto: `${conceptoNombre} (SANEX)`,
						items: itemsCopiados,
					});
				}
			});

			resultado.push({
				grupo: grupoName,
				conceptos: conceptosFusionados,
			});
		}
		// Si sólo existe en data1, lo copiamos tal cual, pero renombramos cada concepto con "(data 1)"
		else if (g1 && !g2) {
			const conceptosCopiados = g1.conceptos.map((c) => ({
				concepto: `${c.concepto} (CIRCUS)`,
				items: c.items.map((m) => ({
					mes: m.mes,
					monto_total: m.monto_total,
					items: [...m.items],
				})),
			}));

			resultado.push({
				grupo: grupoName,
				conceptos: conceptosCopiados,
			});
		}
		// Si sólo existe en data2, lo copiamos tal cual, pero renombramos cada concepto con "(data 2)"
		else if (!g1 && g2) {
			const conceptosCopiados = g2.conceptos.map((c) => ({
				concepto: `${c.concepto} (SANEX)`,
				items: c.items.map((m) => ({
					mes: m.mes,
					monto_total: m.monto_total,
					items: [...m.items],
				})),
			}));

			resultado.push({
				grupo: grupoName,
				conceptos: conceptosCopiados,
			});
		}
	});

	return resultado;
}
