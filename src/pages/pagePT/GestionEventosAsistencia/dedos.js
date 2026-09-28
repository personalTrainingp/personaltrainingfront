// Numeración de dedos de ZKTeco (FingerID 0-9)
export const DEDOS = [
	{ value: 0, label: 'Meñique izquierdo' },
	{ value: 1, label: 'Anular izquierdo' },
	{ value: 2, label: 'Medio izquierdo' },
	{ value: 3, label: 'Índice izquierdo' },
	{ value: 4, label: 'Pulgar izquierdo' },
	{ value: 5, label: 'Pulgar derecho' },
	{ value: 6, label: 'Índice derecho' },
	{ value: 7, label: 'Medio derecho' },
	{ value: 8, label: 'Anular derecho' },
	{ value: 9, label: 'Meñique derecho' },
];

export const nombreDedo = (numero) => DEDOS.find((d) => d.value === numero)?.label ?? `Dedo ${numero}`;
