import { DateMaskStr1 } from '@/components/CurrencyMask';

// Variante local de @/helper/aplicarTipoCambio, exclusiva de ReporteProveedores.
// A diferencia del helper compartido, NO sobreescribe `monto` (se deja tal cual
// viene en la data, en su moneda original, dólares para los gastos en USD);
// la conversión a soles se guarda aparte en `montoSoles`, que es lo que debe
// mostrarse en el reporte/flujo.
export function aplicarTipoDeCambioProveedores(dataTC, dataGastos) {
	return dataGastos?.map((gasto) => {
		const fechaGasto = DateMaskStr1(gasto.fec_pago);

		const tcMatch = dataTC.find((tc) => {
			if (tc.moneda === gasto.moneda) return false;

			const inicio = DateMaskStr1(tc.fecha_inicio_tc);
			// Debe ser posterior o igual al inicio
			if (fechaGasto < inicio) return false;

			// Si hay fecha_fin_tc, también debe ser ≤ fin
			if (tc.fecha_fin_tc) {
				const fin = DateMaskStr1(tc.fecha_fin_tc);
				if (fechaGasto > fin) return false;
			}
			// Si fecha_fin_tc es null, este tramo sigue abierto
			return true;
		});

		const resultado = { tc: 1, monto: 1, ...gasto };
		if (tcMatch) {
			resultado.tc = tcMatch.multiplicador;
		}
		resultado.montoSoles = Number(resultado.monto || 0) * Number(resultado.tc || 0);
		return resultado;
	});
}
