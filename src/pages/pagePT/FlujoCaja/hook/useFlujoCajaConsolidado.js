import { useEffect } from 'react'
import { useFlujoCaja } from './useFlujoCajaStore'
import { ID_EMPRESA_CHANGE, ID_EMPRESA_CIRCUS, ID_EMPRESA_REDUCTO, ID_EMPRESA_RAL } from '../constants/empresas'

/**
 * Trae ingresos y egresos de las 4 empresas (Change, Circus, Reducto, Ral)
 * para un mismo rango de fechas y los junta en un solo `flujoxGrupo`/`items`,
 * con la misma forma que devuelve `useFlujoCaja()` para UNA empresa.
 *
 * Por qué concatenar y no sumar acá: los componentes TrItem* (TrItemVentas,
 * TrItemEgresos, TrItemUtilidad, etc.) ya saben filtrar por grupo/concepto y
 * sumar montos por mes a partir de `flujoxGrupo`. Si les pasamos la unión de
 * los 4 arreglos de grupos, el mismo filtro+reduce que usan para una sola
 * empresa calcula automáticamente el TOTAL de las 4, sin duplicar esa lógica
 * aquí ni tener que mantenerla en dos lugares.
 *
 * Se llaman 4 veces `useFlujoCaja()` de forma fija (no en un loop/condicional)
 * para respetar las reglas de hooks de React.
 */
export const useFlujoCajaConsolidado = (arrayFechas) => {
	const change = useFlujoCaja()
	const circus = useFlujoCaja()
	const reducto = useFlujoCaja()
	const ral = useFlujoCaja()

	useEffect(() => {
		change.obtenerIngresosxFecha(ID_EMPRESA_CHANGE, arrayFechas)
		change.obtenerEgresosxFecha(ID_EMPRESA_CHANGE, arrayFechas)
		circus.obtenerIngresosxFecha(ID_EMPRESA_CIRCUS, arrayFechas)
		circus.obtenerEgresosxFecha(ID_EMPRESA_CIRCUS, arrayFechas)
		reducto.obtenerIngresosxFecha(ID_EMPRESA_REDUCTO, arrayFechas)
		reducto.obtenerEgresosxFecha(ID_EMPRESA_REDUCTO, arrayFechas)
		ral.obtenerIngresosxFecha(ID_EMPRESA_RAL, arrayFechas)
		ral.obtenerEgresosxFecha(ID_EMPRESA_RAL, arrayFechas)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const porEmpresa = [change, circus, reducto, ral]

	return {
		dataIngresosxFecha: {
			flujoxGrupo: porEmpresa.flatMap((f) => f.dataIngresosxFecha.flujoxGrupo ?? []),
			items: porEmpresa.flatMap((f) => f.dataIngresosxFecha.items ?? []),
		},
		dataGastosxFecha: {
			flujoxGrupo: porEmpresa.flatMap((f) => f.dataGastosxFecha.flujoxGrupo ?? []),
			items: porEmpresa.flatMap((f) => f.dataGastosxFecha.items ?? []),
		},
	}
}
