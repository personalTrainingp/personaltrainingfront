// Perú no usa horario de verano: su offset respecto a UTC es fijo, -5 horas
// todo el año.
const OFFSET_HORAS_PERU = 5

// Fecha "desplazada" cuyos métodos getUTC* devuelven el año/mes/día/hora de
// Perú en este instante, sin importar en qué zona horaria corra el código
// (navegador del usuario o el servidor donde se despliega la app). Evita el
// bug de que, cerca de la medianoche UTC (7pm-12am hora Perú), el mes/día ya
// se adelantaba al siguiente porque se leía `new Date()` con
// getFullYear()/getMonth()/getDate() (hora local del entorno, no la de Perú).
export const obtenerFechaActualPeru = () => new Date(Date.now() - OFFSET_HORAS_PERU * 60 * 60 * 1000)

// Año/mes/día de hoy en Perú, listos para usar (mes en base 1, como getMonth()+1).
export const obtenerAnioMesDiaActualPeru = () => {
	const fecha = obtenerFechaActualPeru()
	return {
		anioActual: fecha.getUTCFullYear(),
		mesActual: fecha.getUTCMonth() + 1,
		dateActual: fecha.getUTCDate(),
	}
}
