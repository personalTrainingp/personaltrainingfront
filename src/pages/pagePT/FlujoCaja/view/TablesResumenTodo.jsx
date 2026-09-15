import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import {
	TrItemVentas,
	TrItemEgresos,
	TrItemUtilidad,
	TrItemInventario,
	TrItemExtraordionario,
	TrItemUtilidadesSuma,
	TrItemEgresosNoPagados,
} from './TrItem'
import { ModalTableItems } from './ModalTableItems'
import { useFlujoCaja } from '../hook/useFlujoCajaStore'
import { useFlujoCajaConsolidado } from '../hook/useFlujoCajaConsolidado'
import { EMPRESAS_FLUJO_CAJA, ID_EMPRESA_TOTAL, ID_EMPRESA_CHANGE } from '../constants/empresas'
import { obtenerAnioMesDiaActualPeru } from '../helpers/fechaPeru'

// Rango de fechas "todo los años" (2024-2026) usado por los 4 cuadros de
// arriba del todo. A diferencia de PERIODOS[3] (TOTAL ACUMULADO) de más
// abajo, aquí SÍ se muestran los 12 meses: como el filtro de mes en
// TrItem.jsx compara solo el número de mes (no el año), cada columna ya
// suma automáticamente ese mes en los 3 años (ej. "ENERO" = enero-2024 +
// enero-2025 + enero-2026).
const ARRAY_FECHAS_TODOS_LOS_ANIOS = ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
// Sentinel para el prop `anio` de TrItem*: no es 2020 (así que sí muestra
// los montos mensuales), pero cae en el mismo caso "TOTAL ACUMULADO" que
// anio=2020 dentro de anioCantidad() (TrItem.jsx): el promedio se divide
// entre los meses realmente transcurridos de 2024-2026 (12+12+(mesActual-1)),
// no entre 12 fijo.
const ANIO_SENTINEL_ACUMULADO_CON_MESES = 9999

// Pestaña "TODO": junta a Change, Circus, Reducto y Ral en una sola vista de
// resultado anual. Cada tabla de abajo es un concepto (INGRESOS, EGRESOS,
// etc.) para UN período (2026, 2025, 2024 o el acumulado 2024-2026), con una
// fila por empresa (con su color de marca) más una fila TOTAL con la suma
// de las 4 (color gris/neutro, ver bg-todo en _bgEmpresa.scss).

// Un período = un rango de fechas que se muestra como su propia tabla.
// `anio` controla, además de qué año mostrar en el label, el sentinel 2020
// que ya usa TrItem.jsx para el acumulado. `soloTotal` es específico de esta
// pestaña: en el acumulado, cada tabla ya es su propio bloque (no comparte
// filas con otros años como en las pestañas individuales), así que ahí no
// tiene sentido mostrar 12 columnas de mes vacías — se ocultan del todo y
// solo queda EMPRESA | TOTAL ANUAL | PROMEDIO MENSUAL.
const PERIODOS = [
	{ label: '2026', anio: 2026, arrayFechas: ['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00'] },
	{ label: '2025', anio: 2025, arrayFechas: ['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00'] },
	{ label: '2024', anio: 2024, arrayFechas: ['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00'] },
	{ label: 'TOTAL ACUMULADO', anio: 2020, arrayFechas: ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00'], soloTotal: true },
]

// `colorMeses` solo se usa en las tablas de UNA empresa (RESULTADO ACUMULADO
// ANUAL de cada empresa): pinta el nombre del mes (ENERO, FEBRERO, ...) con
// el color de esa empresa. En las tablas consolidadas (4 empresas juntas) se
// deja vacío porque esas columnas no pertenecen a una sola empresa.
const HeaderConceptoTabla = ({ periodoLabel, soloTotal, colorMeses = 'bg-dark-3 text-white' }) => (
	<thead>
		<tr>
			<th style={{ width: '450px' }} className='fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center'>
				<div className='text-black text-center'>{periodoLabel}</div>
			</th>
			{!soloTotal && generarMesYanio(new Date('2026-01-01 15:45:47.6640000 +00:00'), new Date('2026-12-31 15:45:47.6640000 +00:00')).map((e) => (
				<td key={e.mes} className={`text-center ${colorMeses}`} style={{ width: '240px' }}>{e.mesSTR}</td>
			))}
			<td className={`text-center border-top-10 border-bottom-10 border-left-10 border-right-10 ${colorMeses}`} style={{ width: '340px' }}>TOTAL ACUMULADO</td>
			<td className={`text-center border-top-10 border-bottom-10 border-left-10 border-right-10 ${colorMeses}`} style={{ width: '340px' }}>PROMEDIO ACUMULADO</td>
		</tr>
	</thead>
)

// Una tabla = un concepto en un período. Filas: CHANGE, CIRCUS, REDUCTO, RAL
// (cada fila hace su propio fetch por id_empresa, igual que en las pestañas
// individuales) + TOTAL (recibe los datos ya consolidados de las 4 empresas).
const TablaConceptoConsolidada = ({
	titulo,
	periodo,
	RowComponent,
	dataConsolidada,
	onOpenModalDataItems,
	necesitaIngresos,
	necesitaGastos,
}) => (
	<div>
		<div style={{ fontSize: '70px' }} className='text-black text-center'>{titulo}</div>
		<div className='tab-scroll-container'>
			<Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
				<HeaderConceptoTabla periodoLabel={periodo.label} soloTotal={periodo.soloTotal} />
				<tbody>
					{EMPRESAS_FLUJO_CAJA.map((empresa) => (
						<RowComponent
							key={empresa.id_empresa}
							anio={periodo.anio}
							className='fs-2'
							classNameTotal='text-center border-left-10 border-right-10'
							label={empresa.label}
							arrayFechas={periodo.arrayFechas}
							id_empresa={empresa.id_empresa}
							onOpenModalDataItems={onOpenModalDataItems}
							ocultarMeses={periodo.soloTotal}
						/>
					))}
					{/* La fila TOTAL no recibe onOpenModalDataItems: el detalle mezcla
					   items de las 4 empresas y el botón de editar de ese modal
					   necesita un id_empresa real, que aquí no existe. */}
					<RowComponent
						anio={periodo.anio}
						className='fs-1'
						classNameTotal='text-center border-left-10 border-right-10 border-bottom-10'
						label='TOTAL'
						arrayFechas={periodo.arrayFechas}
						id_empresa={ID_EMPRESA_TOTAL}
						dataIngresosxFecha={necesitaIngresos ? dataConsolidada.dataIngresosxFecha : undefined}
						dataGastosxFecha={necesitaGastos ? dataConsolidada.dataGastosxFecha : undefined}
						ocultarMeses={periodo.soloTotal}
					/>
				</tbody>
			</Table>
		</div>
	</div>
)

// Última fila de "RESULTADO ANUAL": % de utilidad/pérdida = (utilidad*100)/ingresos,
// mes a mes y en el total anual. Ingresos y gastos se calculan igual que en
// TrItemVentas/TrItemEgresos/TrItemUtilidad (mismos filtros de grupo) para
// que cuadre con las filas de arriba en la misma tabla.
const TrItemMargenUtilidad = ({ anio = 2024, classNameTotal = '', className = '', dataIngresosxFecha: dataIngresosxFechaProp, dataGastosxFecha: dataGastosxFechaProp, ocultarMeses = false, id_empresa, arrayFechas }) => {
	const { obtenerIngresosxFecha, dataIngresosxFecha: dataIngresosxFechaFetched, obtenerEgresosxFecha, dataGastosxFecha: dataGastosxFechaFetched } = useFlujoCaja()
	const dataIngresosxFecha = dataIngresosxFechaProp ?? dataIngresosxFechaFetched
	const dataGastosxFecha = dataGastosxFechaProp ?? dataGastosxFechaFetched
	useEffect(() => {
		if (!dataIngresosxFechaProp) obtenerIngresosxFecha(id_empresa, arrayFechas)
		if (!dataGastosxFechaProp) obtenerEgresosxFecha(id_empresa, arrayFechas)
	}, [])
	const porMes = generarMesYanio(
		new Date('2024-01-01 15:45:47.6640000 +00:00'),
		new Date('2024-12-31 15:45:47.6640000 +00:00')
	).map((e) => {
		const ingresosxMes = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
						?.filter((f) => f.mes === e.mes)
						.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0) ?? 0
		const gastosxMes = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
						?.filter((f) => f.mes === e.mes)
						.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0) ?? 0
		const utilidadxMes = ingresosxMes - gastosxMes
		return {
			ingresosxMes,
			utilidadxMes,
			margenxMes: ingresosxMes > 0 ? (utilidadxMes * 100) / ingresosxMes : 0,
		}
	})
	const ingresosTotal = porMes.reduce((total, m) => total + m.ingresosxMes, 0)
	const utilidadTotal = porMes.reduce((total, m) => total + m.utilidadxMes, 0)
	const margenTotal = ingresosTotal > 0 ? (utilidadTotal * 100) / ingresosTotal : 0
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa ?? ID_EMPRESA_TOTAL} text-center text-white fs-1`}>UTILIDAD / PERDIDA %</td>
			{!ocultarMeses && porMes.map((m, i) => (
				<td key={i} className='text-center'>
					<div className={m.margenxMes < 0 ? 'text-change' : ''}>
						<NumberFormatMoney className={className} amount={m.margenxMes} />%
					</div>
				</td>
			))}
			<td className={classNameTotal}>
				<div className={margenTotal < 0 ? 'text-change' : ''}>
					<NumberFormatMoney style={{ fontSize: anio !== 2020 ? '35px' : '45px' }} amount={margenTotal} />%
				</div>
			</td>
			<td className={classNameTotal}>-</td>
		</tr>
	)
}

// Cuadro "RESULTADO ANUAL {EMPRESA}" reducido: solo Ingresos, Egresos y el
// margen Utilidad/Perdida %, para UNA sola empresa (sin consolidar), sumando
// los 3 años (2024-2026) con desglose mensual. Usado para Circus, Reducto y
// Ral — ninguna de las 3 maneja Bono Gerencias, a diferencia de Change.
const TablaResultadoAnualSimple = ({ empresa, onOpenModalDataItems }) => (
	<div>
		<div style={{ fontSize: '70px' }} className='text-black text-center'>RESULTADO ACUMULADO ANUAL(2024, 2025, 2026)<br/>{` ${empresa.label}`}</div>
		<div className='tab-scroll-container'>
			<Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
				<HeaderConceptoTabla periodoLabel='TOTAL ACUMULADO' colorMeses={empresa.classNameEmpresa} />
				<tbody>
					<TrItemVentas
						anio={ANIO_SENTINEL_ACUMULADO_CON_MESES}
						className='fs-2'
						classNameTotal='text-center border-left-10 border-right-10'
						label='INGRESOS'
						arrayFechas={ARRAY_FECHAS_TODOS_LOS_ANIOS}
						id_empresa={empresa.id_empresa}
					/>
					<TrItemEgresos
						anio={ANIO_SENTINEL_ACUMULADO_CON_MESES}
						className='fs-2'
						classNameTotal='text-center border-left-10 border-right-10'
						label='EGRESOS'
						arrayFechas={ARRAY_FECHAS_TODOS_LOS_ANIOS}
						id_empresa={empresa.id_empresa}
						onOpenModalDataItems={onOpenModalDataItems}
					/>
					<TrItemMargenUtilidad
						anio={ANIO_SENTINEL_ACUMULADO_CON_MESES}
						className='fs-2'
						classNameTotal='text-center border-left-10 border-right-10 border-bottom-10'
						id_empresa={empresa.id_empresa}
						arrayFechas={ARRAY_FECHAS_TODOS_LOS_ANIOS}
					/>
				</tbody>
			</Table>
		</div>
	</div>
)

// Cuadro "RESULTADO ANUAL CHANGE" completo, sumando los 3 años (2024-2026)
// con desglose mensual. Replica las mismas fórmulas que ya usa la tabla
// "RESULTADO ANUAL" de la pestaña individual de Change
// (ViewResumenTotal.jsx), incluyendo Bono Gerencias Trimestral, solo que acá
// escaladas a los 3 años en vez de a un año puntual:
//  - EGRESOS = gastos reales + gastos proyectados (igual que "EGRESOS
//    PROYECTADO" en la vista de Change).
//  - BONO GERENCIAS TRIMESTRAL = gasto ya registrado bajo el concepto 1272
//    (3% de la utilidad última línea) — NO la fórmula "proyectada" al 10%
//    de la segunda tabla, que no se usa acá.
//  - UTILIDAD/PERDIDA ÚLTIMA LÍNEA = Utilidad/Perdida − Bono Gerencias.
//  - UTILIDAD/PERDIDA ÚLTIMA LÍNEA % = (Última línea * 100) / Ingresos.
const IDS_GRUPO_GASTO_EXCLUIDOS_CHANGE = [97, 110, 153, 103, 150, 157]
const ID_CONCEPTO_BONO_GERENCIAL = 1272

// TOTAL ACUMULADO (2024-2026): los años ya cerrados (2024 y 2025) aportan 12
// meses cada uno; el año en curso solo aporta los meses ya cerrados
// (mesActual-1), sin contar el mes en curso que todavía no cierra. Misma
// fórmula que MESES_ACUMULADO_ANIO_EN_CURSO en TrItem.jsx.
// "Hoy" en hora peruana (UTC-5 fijo), no en la zona horaria del entorno donde
// corra el código.
const { anioActual: anioActualAcumulado, mesActual: mesActualAcumulado } = obtenerAnioMesDiaActualPeru()
const MESES_ACUMULADO_ANIO_EN_CURSO = (anioActualAcumulado - 2024) * 12 + (mesActualAcumulado - 1)

const TablaResultadoAnualChange = ({ onOpenModalDataItems }) => {
	const { obtenerIngresosxFecha, dataIngresosxFecha, obtenerEgresosxFecha, dataGastosxFecha } = useFlujoCaja()
	useEffect(() => {
		obtenerIngresosxFecha(ID_EMPRESA_CHANGE, ARRAY_FECHAS_TODOS_LOS_ANIOS)
		obtenerEgresosxFecha(ID_EMPRESA_CHANGE, ARRAY_FECHAS_TODOS_LOS_ANIOS)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	console.log('DEBUG TablaResultadoAnualChange', {
		ingresosGrupos: dataIngresosxFecha.flujoxGrupo?.length,
		gastosGrupos: dataGastosxFecha.flujoxGrupo?.length,
		ingresosSample: dataIngresosxFecha.flujoxGrupo?.[0],
	})
	const gruposGastoIncluidos = dataGastosxFecha.flujoxGrupo?.filter(
		(f) => !IDS_GRUPO_GASTO_EXCLUIDOS_CHANGE.includes(f.id)
	) ?? []

	const porMes = generarMesYanio(
		new Date('2024-01-01 15:45:47.6640000 +00:00'),
		new Date('2024-12-31 15:45:47.6640000 +00:00')
	).map((e) => {
		const ingresosxMes = dataIngresosxFecha.flujoxGrupo?.filter((f) => f.id !== 121).flatMap((f) => f.itemsxDia)
						?.filter((f) => f.mes === e.mes)
						.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0) ?? 0
		const gastosItemsxMes = gruposGastoIncluidos.flatMap((f) => f.itemsxDia)
						?.filter((f) => f.mes === e.mes)
						.flatMap((f) => f.items) ?? []
		const gastosxMes = gastosItemsxMes.reduce((total, item) => total + item.monto, 0)
		const proyectadoxMes = gruposGastoIncluidos.flatMap((f) => f.parametro_grupo_gasto ?? [])
						.flatMap((f) => f.itemsxDia ?? [])
						.filter((f) => f.mes === e.mes)
						.reduce((total, item) => total + (item.monto_proyectado ?? 0), 0)
		const bonoGerencialxMes = dataGastosxFecha.flujoxGrupo?.flatMap((f) => f.parametro_grupo_gasto ?? [])
						.filter((f) => f.id === ID_CONCEPTO_BONO_GERENCIAL)
						.flatMap((f) => f.itemsxDia ?? [])
						.filter((f) => f.mes === e.mes)
						.reduce((total, item) => total + (item.monto ?? 0), 0) ?? 0
		const egresosxMes = gastosxMes + proyectadoxMes
		const utilidadxMes = ingresosxMes - egresosxMes
		const ultimaLineaxMes = utilidadxMes - bonoGerencialxMes
		return { ingresosxMes, egresosxMes, utilidadxMes, bonoGerencialxMes, ultimaLineaxMes, gastosItemsxMes }
	})

	const sumar = (campo) => porMes.reduce((total, m) => total + m[campo], 0)
	const ingresosTotal = sumar('ingresosxMes')
	const egresosTotal = sumar('egresosxMes')
	const utilidadTotal = sumar('utilidadxMes')
	const bonoTotal = sumar('bonoGerencialxMes')
	const ultimaLineaTotal = sumar('ultimaLineaxMes')
	const margenUltimaLineaTotal = ingresosTotal > 0 ? (ultimaLineaTotal * 100) / ingresosTotal : 0

	const stickyTd = `sticky-td-${ID_EMPRESA_CHANGE}`
	// `itemsPorMes(m)` es opcional: solo lo pasa la fila EGRESOS (única fila de
	// "gasto" acá, ver [[TrItemEgresos]]). Cuando está presente, cada celda de
	// mes abre el modal con los items de ese mes, y la celda TOTAL con todos
	// los items del acumulado (2024-2026) — mismo ModalTableItems de siempre.
	const filaMoneda = (label, campo, total, promedio, { negativo = false, fs = 'fs-2', fsTotal = '35px', itemsPorMes } = {}) => (
		<tr>
			<td className={`border-left-10 border-right-10 ${stickyTd} text-center text-white fs-1`}>{label}</td>
			{porMes.map((m, i) => (
				<td key={i} className='text-center'>
					<div onClick={itemsPorMes ? () => onOpenModalDataItems?.(itemsPorMes(m)) : undefined}>
						<div className={(negativo ? -m[campo] : m[campo]) < 0 ? 'text-change' : ''}>
							<NumberFormatMoney className={fs} amount={negativo ? -m[campo] : m[campo]} />
						</div>
					</div>
				</td>
			))}
			<td className='text-center border-left-10 border-right-10'>
				<div onClick={itemsPorMes ? () => onOpenModalDataItems?.(porMes.flatMap((m) => itemsPorMes(m))) : undefined}>
					<div className={(negativo ? -total : total) < 0 ? 'text-change' : ''}>
						<NumberFormatMoney style={{ fontSize: fsTotal }} amount={negativo ? -total : total} />
					</div>
				</div>
			</td>
			<td className='text-center border-left-10 border-right-10'>
				<div className={(negativo ? -promedio : promedio) < 0 ? 'text-change' : ''}>
					<NumberFormatMoney style={{ fontSize: fsTotal }} amount={negativo ? -promedio : promedio} />
				</div>
			</td>
		</tr>
	)

	return (
		<div>
			<div style={{ fontSize: '70px' }} className='text-black text-center'>RESULTADO ACUMULADO ANUAL(2024, 2025, 2026) CHANGE</div>
			<div className='tab-scroll-container'>
				<Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
					<HeaderConceptoTabla periodoLabel='TOTAL ACUMULADO' colorMeses='bg-change text-white' />
					<tbody>
						{filaMoneda('INGRESOS', 'ingresosxMes', ingresosTotal, ingresosTotal / MESES_ACUMULADO_ANIO_EN_CURSO)}
						{filaMoneda('EGRESOS', 'egresosxMes', egresosTotal, egresosTotal / MESES_ACUMULADO_ANIO_EN_CURSO, { negativo: true, itemsPorMes: (m) => m.gastosItemsxMes })}
						{filaMoneda('UTILIDAD / PERDIDA', 'utilidadxMes', utilidadTotal, utilidadTotal / MESES_ACUMULADO_ANIO_EN_CURSO)}
						{filaMoneda('BONO GERENCIAS TRIMESTRAL', 'bonoGerencialxMes', bonoTotal, bonoTotal / MESES_ACUMULADO_ANIO_EN_CURSO, { negativo: true })}
						{filaMoneda('UTILIDAD / PERDIDA ULTIMA LINEA', 'ultimaLineaxMes', ultimaLineaTotal, ultimaLineaTotal / MESES_ACUMULADO_ANIO_EN_CURSO, { fs: 'fs-1', fsTotal: '45px' })}
						<tr>
							<td className={`border-left-10 border-right-10 border-bottom-10 ${stickyTd} text-center text-white fs-1`}>UTILIDAD / PERDIDA ULTIMA LINEA %</td>
							{porMes.map((m, i) => {
								const margenxMes = m.ingresosxMes > 0 ? (m.ultimaLineaxMes * 100) / m.ingresosxMes : 0
								return (
									<td key={i} className='text-center'>
										<div className={margenxMes < 0 ? 'text-change' : ''}>
											<NumberFormatMoney className='fs-1' amount={margenxMes} />%
										</div>
									</td>
								)
							})}
							<td className='text-center border-left-10 border-right-10 border-bottom-10'>
								<div className={margenUltimaLineaTotal < 0 ? 'text-change' : ''}>
									<NumberFormatMoney style={{ fontSize: '45px' }} amount={margenUltimaLineaTotal} />%
								</div>
							</td>
							<td className='text-center border-left-10 border-right-10 border-bottom-10'>-</td>
						</tr>
					</tbody>
				</Table>
			</div>
		</div>
	)
}

// "RESULTADO ANUAL": un cuadro por período con la suma de las 4 empresas
// (no desglosada por empresa, a diferencia de las secciones de abajo):
// INGRESOS, GASTOS, UTILIDAD y, como última línea, el margen
// UTILIDAD/PERDIDA = (utilidad*100)/ingresos.
const TablaResultadoAnual = ({ periodo, dataConsolidada, onOpenModalDataItems }) => (
	<div>
		<div style={{ fontSize: '70px' }} className='text-black text-center'>RESULTADO ACUMULADO DE <br/> CHANGE + RAL + CIRCUS + REDUCTO <br/> {`${periodo.label}`}</div>
		<div className='tab-scroll-container'>
			<Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
				<HeaderConceptoTabla colorMeses='bg-dark-3 text-white' periodoLabel={periodo.label} soloTotal={periodo.soloTotal} />
				<tbody>
					<TrItemVentas
						anio={periodo.anio}
						className='fs-2'
						classNameTotal='text-center border-left-10 border-right-10'
						label='INGRESOS'
						arrayFechas={periodo.arrayFechas}
						id_empresa={ID_EMPRESA_TOTAL}
						dataIngresosxFecha={dataConsolidada.dataIngresosxFecha}
						ocultarMeses={periodo.soloTotal}
					/>
					<TrItemEgresos
						anio={periodo.anio}
						className='fs-2'
						classNameTotal='text-center border-left-10 border-right-10'
						label='GASTOS'
						arrayFechas={periodo.arrayFechas}
						id_empresa={ID_EMPRESA_TOTAL}
						dataGastosxFecha={dataConsolidada.dataGastosxFecha}
						ocultarMeses={periodo.soloTotal}
						onOpenModalDataItems={onOpenModalDataItems}
					/>
					<TrItemUtilidad
						anio={periodo.anio}
						className='fs-2'
						classNameTotal='text-center border-left-10 border-right-10'
						label='UTILIDAD'
						arrayFechas={periodo.arrayFechas}
						id_empresa={ID_EMPRESA_TOTAL}
						dataIngresosxFecha={dataConsolidada.dataIngresosxFecha}
						dataGastosxFecha={dataConsolidada.dataGastosxFecha}
						ocultarMeses={periodo.soloTotal}
					/>
					<TrItemMargenUtilidad
						anio={periodo.anio}
						className='fs-2'
						classNameTotal='text-center border-left-10 border-right-10 border-bottom-10'
						dataIngresosxFecha={dataConsolidada.dataIngresosxFecha}
						dataGastosxFecha={dataConsolidada.dataGastosxFecha}
						ocultarMeses={periodo.soloTotal}
					/>
				</tbody>
			</Table>
		</div>
	</div>
)

// Un concepto completo (p.ej. INGRESOS), repetido para los 4 períodos.
// Reutiliza una sola consolidación de datos por período (no una por concepto)
// para no repetir 7 veces el mismo fetch de las 4 empresas.
const SeccionConcepto = ({ titulo, RowComponent, consolidadoPorPeriodo, onOpenModalDataItems, necesitaIngresos, necesitaGastos }) => (
	<>
		{PERIODOS.map((periodo, i) => (
			<TablaConceptoConsolidada
				key={periodo.label}
				titulo={`${titulo} ${periodo.label}`}
				periodo={periodo}
				RowComponent={RowComponent}
				dataConsolidada={consolidadoPorPeriodo[i]}
				onOpenModalDataItems={onOpenModalDataItems}
				necesitaIngresos={necesitaIngresos}
				necesitaGastos={necesitaGastos}
			/>
		))}
	</>
)

export const TablesResumenTodo = () => {
	const [dataItems, setdataItems] = useState({ data: [], isOpen: false })
	const onOpenModalDataItems = (data) => setdataItems({ data, isOpen: true })
	const onCloseModalDataItems = () => setdataItems({ data: [], isOpen: false })

	// Una consolidación (Change + Circus + Reducto + Ral) por cada período
	// mostrado, compartida entre las 7 secciones de abajo.
	const consolidado2026 = useFlujoCajaConsolidado(PERIODOS[0].arrayFechas)
	const consolidado2025 = useFlujoCajaConsolidado(PERIODOS[1].arrayFechas)
	const consolidado2024 = useFlujoCajaConsolidado(PERIODOS[2].arrayFechas)
	const consolidadoAcumulado = useFlujoCajaConsolidado(PERIODOS[3].arrayFechas)
	const consolidadoPorPeriodo = [consolidado2026, consolidado2025, consolidado2024, consolidadoAcumulado]

	return (
		<div>
			{/* Arriba del todo: 4 cuadros "RESULTADO ANUAL {EMPRESA}", uno por
			   empresa (sin consolidar), sumando los 3 años. Change trae el
			   detalle completo (con Bono Gerencias); Circus, Reducto y Ral solo
			   Ingresos, Egresos y Utilidad/Perdida %. */}
			<TablaResultadoAnualChange onOpenModalDataItems={onOpenModalDataItems} />
			{EMPRESAS_FLUJO_CAJA.filter((empresa) => empresa.id_empresa !== ID_EMPRESA_CHANGE).map((empresa) => (
				<TablaResultadoAnualSimple key={empresa.id_empresa} empresa={empresa} onOpenModalDataItems={onOpenModalDataItems} />
			))}

			{PERIODOS.map((periodo, i) => (
				<TablaResultadoAnual key={periodo.label} periodo={periodo} dataConsolidada={consolidadoPorPeriodo[i]} onOpenModalDataItems={onOpenModalDataItems} />
			))}

			<SeccionConcepto titulo='INGRESOS' RowComponent={TrItemVentas} consolidadoPorPeriodo={consolidadoPorPeriodo} onOpenModalDataItems={onOpenModalDataItems} necesitaIngresos />
			<SeccionConcepto titulo='EGRESOS' RowComponent={TrItemEgresos} consolidadoPorPeriodo={consolidadoPorPeriodo} onOpenModalDataItems={onOpenModalDataItems} necesitaGastos />
			<SeccionConcepto titulo='RESULTADO' RowComponent={TrItemUtilidad} consolidadoPorPeriodo={consolidadoPorPeriodo} onOpenModalDataItems={onOpenModalDataItems} necesitaIngresos necesitaGastos />
			<SeccionConcepto titulo='BOLSA' RowComponent={TrItemExtraordionario} consolidadoPorPeriodo={consolidadoPorPeriodo} onOpenModalDataItems={onOpenModalDataItems} necesitaIngresos necesitaGastos />
			<SeccionConcepto titulo='RESULTADO + BOLSA' RowComponent={TrItemUtilidadesSuma} consolidadoPorPeriodo={consolidadoPorPeriodo} onOpenModalDataItems={onOpenModalDataItems} necesitaIngresos necesitaGastos />
			<SeccionConcepto titulo='COMPRA ACTIVOS' RowComponent={TrItemInventario} consolidadoPorPeriodo={consolidadoPorPeriodo} onOpenModalDataItems={onOpenModalDataItems} necesitaGastos />
			<SeccionConcepto titulo='NO PAGADOS' RowComponent={TrItemEgresosNoPagados} consolidadoPorPeriodo={consolidadoPorPeriodo} onOpenModalDataItems={onOpenModalDataItems} necesitaGastos />

			<ModalTableItems
				link={''}
				bgHeader={'bg-todo text-white'}
				textEmpresa={'text-todo'}
				isShowConceptos={false}
				mes={'data.mes'}
				anio={'data.anio'}
				show={dataItems.isOpen}
				onHide={onCloseModalDataItems}
				items={dataItems.data}
				id_empresa={ID_EMPRESA_TOTAL}
			/>
		</div>
	)
}
