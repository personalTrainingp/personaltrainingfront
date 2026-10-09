// PIN (key del huellero) a partir del DNI. Misma regla que pinDesdeDni del backend
// (services/personaHuelleroService.js): el lector no acepta un PIN que empiece con 0,
// así que a esos DNI se les antepone un 1: "01234567" -> 101234567.
// Retorna null si el DNI no es numérico o el PIN no entra en 9 dígitos.
export const pinDesdeDni = (dni) => {
	const texto = String(dni ?? '').trim();
	if (!/^\d+$/.test(texto)) return null;
	const pin = parseInt(texto.startsWith('0') ? `1${texto}` : texto, 10);
	return pin > 0 && pin <= 999999999 ? pin : null;
};

// ¿El DNI tiene huella? pines: Set de PINs con huella (GET /eventos-asistencia/personas/con-huella).
// Busca el PIN actual y el de antes (que solo quitaba el 0 inicial), para personas ya registradas.
export const dniTieneHuella = (pines, dni) => {
	const pin = pinDesdeDni(dni);
	const pinAnterior = parseInt(String(dni ?? '').trim(), 10);
	return (pin !== null && pines.has(pin)) || pines.has(pinAnterior);
};
