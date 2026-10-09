import dayjs from 'dayjs';
import { arraySexo } from '@/types/type';

export const SIN_DATO = 'SIN DATO';

// sexo_cli: 9 Femenino / 8 Masculino (arraySexo); otros ids traen su etiqueta de tb_parametros
export const generoCliente = (c) =>
	arraySexo.find((s) => s.value === c.sexo_cli)?.label?.toUpperCase() ||
	c.sexo_label?.toUpperCase() ||
	SIN_DATO;

const RANGOS_EDAD = [
	{ label: 'MENOS DE 18', hasta: 17 },
	{ label: '18 - 25', hasta: 25 },
	{ label: '26 - 35', hasta: 35 },
	{ label: '36 - 45', hasta: 45 },
	{ label: '46 - 55', hasta: 55 },
	{ label: '56 - 65', hasta: 65 },
	{ label: 'MAS DE 65', hasta: 120 },
];
// Edad a la fecha del reporte
export const edadCliente = (c, hasta) => {
	if (!c.fecha_nacimiento) return null;
	const edad = dayjs(hasta).diff(dayjs(c.fecha_nacimiento), 'year');
	return edad >= 0 && edad <= 120 ? edad : null;
};
const rangoEdad = (c, hasta) => {
	const edad = edadCliente(c, hasta);
	return edad === null ? SIN_DATO : RANGOS_EDAD.find((r) => edad <= r.hasta).label;
};

const RANGOS_MONTO = [
	{ label: 'S/ 0 (SIN COSTO)', hasta: 0 },
	{ label: 'S/ 1 - 999', hasta: 999.99 },
	{ label: 'S/ 1,000 - 1,499', hasta: 1499.99 },
	{ label: 'S/ 1,500 - 1,999', hasta: 1999.99 },
	{ label: 'S/ 2,000 - 2,499', hasta: 2499.99 },
	{ label: 'S/ 2,500 - 2,999', hasta: 2999.99 },
	{ label: 'S/ 3,000 A MAS', hasta: Infinity },
];
const rangoMonto = (c) => RANGOS_MONTO.find((r) => c.monto <= r.hasta).label;

// horario 'HH:mm' -> 'hh:mm AM'
export const horarioCliente = (c) =>
	c.horario ? dayjs(`2000-01-01T${c.horario}`).format('hh:mm A') : SIN_DATO;

// Orden fijo por posición en la lista (edad, monto) o por cantidad de socios (el resto)
const ordenPorLista = (lista) => (a, b) =>
	lista.indexOf(a.label) - lista.indexOf(b.label);

export const AGRUPACIONES = [
	{ titulo: 'GENERO', clave: (c) => generoCliente(c) },
	{
		titulo: 'EDAD',
		clave: (c, hasta) => rangoEdad(c, hasta),
		orden: ordenPorLista([...RANGOS_EDAD.map((r) => r.label), SIN_DATO]),
	},
	{ titulo: 'DISTRITO', clave: (c) => c.distrito || SIN_DATO },
	{
		titulo: 'HORARIO',
		clave: (c) => horarioCliente(c),
		// por hora del dia
		orden: (a, b) => (a.items[0]?.horario ?? '99').localeCompare(b.items[0]?.horario ?? '99'),
	},
	{ titulo: 'PROGRAMAS', clave: (c) => c.programa || SIN_DATO },
	{
		titulo: 'MONTOS',
		clave: (c) => rangoMonto(c),
		orden: ordenPorLista(RANGOS_MONTO.map((r) => r.label)),
	},
];

// [{ label, items, cantidad, monto }] para una agrupación
export const agrupar = (clientes, agrupacion, hasta) => {
	const grupos = {};
	clientes.forEach((c) => {
		const label = agrupacion.clave(c, hasta);
		grupos[label] ??= { label, items: [], cantidad: 0, monto: 0 };
		grupos[label].items.push(c);
		grupos[label].cantidad += 1;
		grupos[label].monto += c.monto;
	});
	const orden = agrupacion.orden ?? ((a, b) => b.cantidad - a.cantidad);
	return Object.values(grupos).sort(orden);
};
