import { PTApi } from '@/common';
import { useState } from 'react';
import {
	agruparPorGrupoYConcepto,
	agruparPorGrupoYConcepto2,
} from '../helpers/agrupamientosOficiales';
import { dataIngresosOrden } from '@/helper/dataIngresosOrden';
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs';
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio';
import { aplicarTipoDeCambio } from '@/helper/aplicarTipoCambio';

// Cache compartido (a nivel de módulo, no de componente) entre TODAS las
// instancias de useFlujoCaja() que haya montadas al mismo tiempo. Cada fila
// de las tablas de flujo de caja (TrItemVentas, TrItemEgresos, etc.) llama
// a este hook por su cuenta, así que es normal que varias filas pidan
// exactamente el mismo (empresa + rango de fechas) al mismo tiempo, por
// ejemplo la pestaña TODO, que muestra las 4 empresas juntas en varias
// tablas. Sin este cache, cada fila dispara su propio fetch y el navegador
// termina con cientos de requests duplicados en paralelo, lo que satura el
// límite de conexiones concurrentes del navegador y hace que la página
// tarde muchísimo (o nunca "cargue" con datos).
// El cache guarda la PROMESA en curso (no el resultado final): mientras esté
// pendiente, una segunda fila que pida lo mismo espera esa misma llamada en
// vez de disparar una nueva; apenas se resuelve (o falla), se saca del cache
// para que la próxima vez sí se pida de nuevo al backend (así una edición de
// gasto en otra pantalla se refleja al volver a este tab).
const cachePromesasIngresos = new Map();
const cachePromesasEgresos = new Map();

const claveCache = (enterprice, arrayDate) => `${enterprice}|${arrayDate[0]}|${arrayDate[1]}`;

// Envuelve `fetcher` en el cache de promesas `cache`, deduplicando llamadas
// simultáneas para la misma `clave` sin dejar datos viejos pegados para
// siempre (la entrada se limpia sola al terminar, éxito o error).
const conCachePromesa = (cache, clave, fetcher) => {
	if (!cache.has(clave)) {
		const promesa = fetcher().finally(() => {
			if (cache.get(clave) === promesa) {
				cache.delete(clave);
			}
		});
		cache.set(clave, promesa);
	}
	return cache.get(clave);
};

// Trae y arma los ingresos de una empresa en un rango de fechas. Es la misma
// lógica que antes vivía dentro de obtenerIngresosxFecha; se saca a una
// función de módulo para poder cachear la PROMESA entre instancias del hook.
const fetchIngresosxFecha = async (enterprice, arrayDate) => {
	const { data } = await PTApi.get(`/venta/fecha-venta/id_empresa/${enterprice}`, {
		params: {
			arrayDate: [
				formatDateToSQLServerWithDayjs(arrayDate[0], true),
				formatDateToSQLServerWithDayjs(arrayDate[1], false),
			],
		},
	});
	const { data: dataIngresos } = await PTApi.get(`/ingreso/fecha/${enterprice}`, {
		params: {
			arrayDate: [
				formatDateToSQLServerWithDayjs(arrayDate[0], true),
				formatDateToSQLServerWithDayjs(arrayDate[1], false),
			],
		},
	});
	const { data: dataMF } = await PTApi.get(`/reserva_monk_fit/fecha`, {
		params: {
			arrayDate: [
				formatDateToSQLServerWithDayjs(arrayDate[0], true),
				formatDateToSQLServerWithDayjs(arrayDate[1], false),
			],
		},
	});
	const { data: dataParametrosGastos } = await PTApi.get(
		`/terminologia/grupo-y-concepto/${enterprice}/1574`
	);
	const ingresosMAP = dataIngresos.ingresos.map((i) => {
		return {
			...i,
			fecha_comprobante: i.fec_comprobante,
			fecha_pago: i.fec_pago,
			fecha_primaria: i.fec_pago,
			monto: i.monto,
			id_gasto: i.id_gasto,
		};
	});
	const reservasMFMAP = dataMF.reservasMF?.map((m) => {
		return {
			moneda: 'PEN',
			monto: m.monto_total,
			cantidadTotal: 1,
			n_comprabante: '',
			fecha_primaria: m.fechaP,
			fecha_pago: m.fechaP,
			fecha_comprobante: m.fechaP,
			concepto: 'MONKEY-FIT',
			id_gasto: 1210,
			tb_parametros_gasto: {
				grupo: 'INGRESOS',
				id_empresa: 598,
				nombre_gasto: 'MONKEY-FIT',
				parametro_grupo: {
					param_label: 'INGRESOS',
					id_empresa: 598,
					id: 112,
				},
			},
		};
	});

	const dataTipoTC = await obtenerTipoDeCambio();
	const dataV = dataIngresosOrden([...data.ventas]);
	const arrayTotalIngresos = [
		...dataV.dataMembresias,
		...dataV.dataProductos17,
		...dataV.dataProductos18,
		...ingresosMAP,
		...reservasMFMAP,
	];
	const totalIngresos = arrayTotalIngresos.map((f) => {
		const fechaPrimaria = new Date(f.fecha_primaria);
		const mesP = fechaPrimaria.getUTCMonth() + 1;
		const anioP = fechaPrimaria.getUTCFullYear();
		const diaP = fechaPrimaria.getUTCDate();
		return {
			fechaP: { anioP, mesP, diaP },
			id_estado_gasto: 1423,
			...f,
		};
	});
	return {
		flujoxGrupo: agruparPorGrupoYConcepto(
			aplicarTipoDeCambio(dataTipoTC, totalIngresos),
			dataParametrosGastos.termGastos
		),
		items: aplicarTipoDeCambio(dataTipoTC, totalIngresos),
		terminologiasUsadas: dataParametrosGastos.termGastos,
	};
};

// Igual que fetchIngresosxFecha, pero para egresos. `dataPagosVentas` se usa
// como `[]`: la llamada que la llenaría (obtenerPagosVentas) ya estaba
// deshabilitada antes de este cache, así que este arreglo nunca tenía datos
// reales en la práctica.
const fetchEgresosxFecha = async (enterprice, arrayDate) => {
	const { data } = await PTApi.get(`/egreso/fecha-comprobante/${enterprice}`, {
		params: {
			arrayDate: [
				formatDateToSQLServerWithDayjs(arrayDate[0], true),
				formatDateToSQLServerWithDayjs(arrayDate[1], false),
			],
		},
	});
	const dataGastos = data.gastos
		.filter((f) => f.id_gasto !== 1053)
		.map((g) => {
			return {
				fecha_primaria: new Date(
					new Date(g.fecha_comprobante).setUTCHours(14, 0, 0, 0)
				).toISOString(),
				...g,
			};
		});
	const dataGastosOperadoresVentas = [];

	const dataTipoTC = await obtenerTipoDeCambio();
	const { data: dataParametrosGastos } = await PTApi.get(
		`/terminologia/grupo-y-concepto/${enterprice}/1573`
	);
	const dataGastosEnTotal = [...dataGastos, ...dataGastosOperadoresVentas].map((m) => {
		const fechaPrimaria = new Date(m.fecha_primaria);
		const mesP = fechaPrimaria.getUTCMonth() + 1;
		const anioP = fechaPrimaria.getUTCFullYear();
		const diaP = fechaPrimaria.getUTCDate();
		return {
			fechaP: { anioP, mesP, diaP },
			...m,
		};
	});
	return {
		flujoxGrupo: agruparPorGrupoYConcepto(
			aplicarTipoDeCambio(dataTipoTC, dataGastosEnTotal),
			dataParametrosGastos.termGastos
		),
		items: aplicarTipoDeCambio(dataTipoTC, dataGastosEnTotal),
		terminologiasUsadas: dataParametrosGastos.termGastos,
	};
};

export const useFlujoCaja = () => {
	const [dataGastosxFecha, setdataGastosxFecha] = useState({
		items: [],
		flujoxGrupo: [],
		terminologiasUsadas: [],
	});
	const [dataIngresosxFecha, setdataIngresosxFecha] = useState({
		items: [],
		flujoxGrupo: [],
		terminologiasUsadas: [],
	});
	const [dataFlujoCaja, setdataFlujoCaja] = useState([]);
	const [dataParametrosGastos, setdataParametrosGastos] = useState([]);

	const obtenerEgresosxFecha = async (enterprice, arrayDate, tt) => {
		try {
			const clave = claveCache(enterprice, arrayDate);
			const resultado = await conCachePromesa(cachePromesasEgresos, clave, () =>
				fetchEgresosxFecha(enterprice, arrayDate)
			);
			setdataGastosxFecha(resultado);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosGastos = async (enterprice, identificador = 1573) => {
		try {
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/grupo-y-concepto/${enterprice}/${identificador}`
			);
			setdataParametrosGastos(dataParametrosGastos.termGastos);
		} catch (error) {
			console.log({ error });
		}
	};
	const obtenerIngresosxFecha = async (enterprice, arrayDate) => {
		try {
			const clave = claveCache(enterprice, arrayDate);
			const resultado = await conCachePromesa(cachePromesasIngresos, clave, () =>
				fetchIngresosxFecha(enterprice, arrayDate)
			);
			setdataIngresosxFecha(resultado);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerFlujoCaja = async (enterprice, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/flujo-caja/fecha-comprobante/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const dataFlujoCaja = data.data.map((m) => {
				return {
					...m,
					fecha_primaria: m.fecha_comprobante,
				};
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/grupo-y-concepto/${enterprice}/1573`
			);
			setdataFlujoCaja(
				agruparPorGrupoYConcepto2(dataFlujoCaja, dataParametrosGastos.termGastos, 2026)
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastosxFecha = async (id_empresa, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/egreso/fecha-comprobante/${id_empresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const dataGastos = data.gastos
				.filter((f) => f.id_gasto !== 1053)
				.map((g) => {
					return {
						fecha_primaria: new Date(
							new Date(g.fecha_comprobante).setUTCHours(14, 0, 0, 0)
						).toISOString(),
						...g,
					};
				});
			const dataTipoTC = await obtenerTipoDeCambio();
			const dataGastosEnTotal = [...dataGastos].map((m) => {
				const fechaPrimaria = new Date(m.fecha_primaria);
				const mesP = fechaPrimaria.getUTCMonth() + 1;
				const anioP = fechaPrimaria.getUTCFullYear();
				const diaP = fechaPrimaria.getUTCDate();
				return {
					fechaP: { anioP, mesP, diaP },
					...m,
				};
			});

			setdataGastosxFecha({
				items: aplicarTipoDeCambio(dataTipoTC, dataGastosEnTotal),
			});
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerGastosxFecha,
		obtenerEgresosxFecha,
		dataGastosxFecha,
		obtenerIngresosxFecha,
		dataIngresosxFecha,
		obtenerParametrosGastos,
		dataParametrosGastos,
		obtenerFlujoCaja,
		dataFlujoCaja,
	};
};
