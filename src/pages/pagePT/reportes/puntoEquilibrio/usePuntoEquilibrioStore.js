import { PTApi } from '@/common';
import { useState } from 'react';
import dayjs from 'dayjs';

export const usePuntoEquilibrioStore = () => {
	const [dataIngresos_FC, setdataIngresos_FC] = useState([]);
	const [dataGastosxANIO, setdataGastosxANIO] = useState([]);
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
	const obtenerGastosxEmpresa = async (id_enterprice) => {
		try {
			const { data } = await PTApi.get(`/egreso/get-egresos/${id_enterprice}`);
			// const { data } = await PTApi.get(`/flujo-caja/get-gasto-x-grupo/${enterprice}/${anio}`);
			console.log({ gas: data.gastos });

			// const { data: dataParametrosGastos } = await PTApi.get(
			// 	`/terminologia/terminologiaxEmpresa/${enterprice}`
			// );

			// setdataGastosxANIO(
			// 	agruparPorGrupoYConcepto(data.gastos, dataParametrosGastos.termGastos)
			// );
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
		obtenerGastosxEmpresa,
		obtenerCreditoFiscalxANIO,
		dataIngresos_FC,
		dataCreditoFiscal,
		dataGastosxANIO,
	};
};

function ordenarDatosPorGrupo(datos) {
	let resultado = [];
	// Recorrer cada elemento en el array de datos
	datos.forEach((item) => {
		const mes = new Date(item.fec_comprobante).getMonth() + 1; // Extraer el mes de fec_comprobante (1 - 12)

		// Ignorar ítems con moneda en USD
		if (item.moneda === 'USD') {
			return; // Salta este ítem si la moneda es USD
		}

		// Buscar si ya existe el grupo en el resultado
		let grupoExistente = resultado.find((gr) => gr.grupo === item.tb_parametros_gasto.grupo);

		if (!grupoExistente) {
			// Si no existe el grupo, crearlo
			grupoExistente = {
				grupo: item.tb_parametros_gasto.grupo,
				conceptos: [],
			};
			resultado.push(grupoExistente);
		}

		// Buscar si ya existe el concepto dentro del grupo
		let conceptoExistente = grupoExistente.conceptos.find(
			(c) => c.concepto === item.tb_parametros_gasto.nombre_gasto
		);

		if (!conceptoExistente) {
			// Si no existe el concepto, crearlo
			conceptoExistente = {
				concepto: item.tb_parametros_gasto.nombre_gasto,
				items: [],
			};
			grupoExistente.conceptos.push(conceptoExistente);
		}

		// Agregar el item a la lista de items del mes
		conceptoExistente.items.push({
			id: item.id,
			cod_trabajo: item.cod_trabajo,
			descripcion: item.descripcion,
			fec_comprobante: item.fec_comprobante,
			mes: mes,
			fec_pago: item.fec_pago,
			fec_registro: item.fec_registro,
			monto: item.monto,
			moneda: item.moneda,
		});
	});
	resultado = resultado.map((r) => {
		return {
			...r,
			conceptos: r.conceptos.map((c) => {
				return {
					...c,
					items: Array.from({ length: 12 }, (_, index) => {
						const month = index + 1;
						const itemsInMonth = c.items.filter((item) => item.mes === month);
						// Sumar los montos de los items en el mes actual
						const montoTotal = itemsInMonth.reduce(
							(total, item) => total + item.monto,
							0
						);
						return {
							mes: month,
							items: itemsInMonth.length > 0 ? itemsInMonth : [],
							monto_total: montoTotal, // Agregar monto_total
						};
					}),
				};
			}),
		};
	});
	return resultado;
}
function ordenarDatos(dataGastos, dataTipoCambio) {
	dataGastos = dataGastos.filter((f) => f.tb_parametros_gasto?.id_empresa === 598);
	dataGastos = dataGastos.map((eg) => {
		const tipoCambio = dataTipoCambio.find(
			(tc) => tc.fecha === eg.fec_pago && eg.moneda === 'USD'
		);
		if (tipoCambio) {
			return {
				...eg,
				moneda: 'PEN',
				monto: eg.monto * parseFloat(tipoCambio.precio_venta),
			};
		}
		return eg;
	});
	function agruparPorMesYMoneda(data) {
		return data.reduce((acc, item) => {
			const mes = new Date(item?.fec_comprobante)?.toISOString().slice(5, 7); // Extraer el mes en formato 'MM'
			const { moneda, monto } = item;

			let mesGroup = acc.find((group) => group.mes === mes);
			if (!mesGroup) {
				mesGroup = { mes, monto: [] };
				acc.push(mesGroup);
			}
			let monedaGroup = mesGroup.monto.find((m) => m.moneda === moneda);
			if (!monedaGroup) {
				monedaGroup = { moneda, monto_total: 0 };
				mesGroup.monto.push(monedaGroup);
			}

			monedaGroup.monto_total += monto;

			return acc;
		}, []);
	}
	function agruparPorMesEnGastos(data) {
		return data
			.filter((c) => c.n_comprabante?.length > 4)
			.reduce((acc, curr) => {
				const mes = curr.fec_pago.slice(5, 7); // Obtiene el año y mes en formato 'YYYY-MM'
				const found = acc.find((item) => item.mes === mes);

				if (found) {
					found.monto += curr.monto;
				} else {
					acc.push({ mes, monto: curr.monto, data: [acc] });
				}

				return acc;
			}, []);
	}
	function EncontrarElItemDeGastoPorMes(mes) {
		return agruparPorMesEnGastos(dataGastos).find((item) => item.mes === mes)
			? agruparPorMesEnGastos(dataGastos).find((item) => item.mes === mes).monto
			: 0;
	}

	function agruparPorNombreGasto(data) {
		const groupedData = data.reduce((acc, item) => {
			// const mes = item.fec_pago.getMonth() + 1; // Obtener el mes (de 0 a 11)

			const nombre_gasto = item.tb_parametros_gasto?.nombre_gasto;

			const existingGroup = acc.find(
				(group) =>
					// group.mes === mes &&
					group.nombre_gasto === nombre_gasto
			);

			if (existingGroup) {
				existingGroup.data.push(item);
				// existingGroup.monto_total += item.monto;
			} else {
				acc.push({ nombre_gasto, data: [item] });
			}

			return acc;
		}, []);
		return groupedData;
	}

	function agruparPorMesYGrupo(data) {
		// Agrupar los datos por mes y grupo
		const agrupado = data.reduce((result, item) => {
			// const mes = obtenerMes(item.fec_pago);
			const grupo = item.tb_parametros_gasto?.grupo;

			// Buscar si ya existe una entrada para la combinación de mes y grupo
			let mesGrupoExistente = result.find((mesGrupo) => mesGrupo?.grupo === grupo);

			if (mesGrupoExistente) {
				// Si ya existe, agrega el item al array `data`
				mesGrupoExistente.data.push(item);
			} else {
				// Si no existe, crea una nueva entrada en el resultado
				result.push({
					// mes: mes,
					grupo: grupo,
					data: [item],
				});
			}

			return result;
		}, []);

		// Ordenar el resultado por mes y grupo
		return agrupado.sort((a, b) => {
			if (a.mes !== b.mes) {
				return a?.mes?.localeCompare(b.mes);
			}
			return a?.grupo?.localeCompare(b.grupo);
		});
	}
	const dataGastos2 = agruparPorMesYGrupo(dataGastos).map((e) => {
		return {
			grupo: e.grupo,
			dataConceptos: agruparPorNombreGasto(e.data),
		};
	});

	return dataGastos2;
}

function agruparPorGrupoYConcepto(dataGastos, dataGrupos) {
	const meses = Array.from({ length: 12 }, (_, i) => i + 1);

	// Agrupar grupos únicos
	const gruposMap = {};

	dataGrupos.forEach((grupo) => {
		const nombreGrupo = grupo.grupo?.trim()?.toUpperCase() || 'SIN GRUPO';
		if (!gruposMap[nombreGrupo]) gruposMap[nombreGrupo] = [];
		gruposMap[nombreGrupo].push(grupo);
	});

	const resultado = Object.entries(gruposMap).map(([grupoNombre, conceptosUnicos]) => {
		// obtener conceptos únicos (nombre_gasto)
		const conceptosUnicosPorNombre = [
			...new Set(conceptosUnicos.map((c) => c.nombre_gasto?.trim()?.toUpperCase())),
		];

		const conceptos = conceptosUnicosPorNombre.map((nombreConcepto) => {
			// Filtrar los gastos que coincidan con el grupo y concepto
			const itemsDelConcepto = dataGastos.filter((g) => {
				const pg = g.tb_parametros_gasto || {};
				const grupoGasto = pg.grupo?.trim()?.toUpperCase();
				const nombreGasto = pg.nombre_gasto?.trim()?.toUpperCase();
				return grupoGasto === grupoNombre && nombreGasto === nombreConcepto;
			});

			const itemsPorMes = meses.map((mes) => {
				const itemsMes = itemsDelConcepto.filter(
					(item) => dayjs(item.fec_comprobante).month() + 1 === mes
				);

				// Aquí puedes ajustar el monto según qué campo quieras sumar
				const monto_total = itemsMes.reduce((sum, g) => sum + (g.monto || 0), 0);

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

	return resultado;
}
