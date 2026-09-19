import { DateMaskStr1 } from '@/components/CurrencyMask';

// Busca el tipo de cambio (USD -> PEN) vigente para una fecha dada, dentro de los
// tramos que arma obtenerTipoDeCambio() (@/middleware/obtenerTipoDeCambio) a partir
// de la misma data que administra la página "Gestión TC".
// Cada tramo va desde tc.fecha_inicio_tc hasta el fecha_inicio_tc del siguiente
// registro (tc.fecha_fin_tc); el tramo más reciente tiene fecha_fin_tc null (sigue abierto).
export function encontrarTipoCambio(dataTC = [], fecha) {
	if (!fecha) return null;
	const fechaRef = DateMaskStr1(fecha);

	return (
		dataTC.find((tc) => {
			const inicio = DateMaskStr1(tc.fecha_inicio_tc);
			if (fechaRef < inicio) return false;

			if (tc.fecha_fin_tc) {
				const fin = DateMaskStr1(tc.fecha_fin_tc);
				if (fechaRef > fin) return false;
			}
			return true;
		}) || null
	);
}
