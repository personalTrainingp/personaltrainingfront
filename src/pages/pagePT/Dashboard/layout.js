export const BREAKPOINTS = { lg: 1100, md: 800, sm: 560, xs: 0 };
export const COLS = { lg: 12, md: 12, sm: 6, xs: 2 };
export const TAMANOS = { kpi: [3, 2], lineas: [6, 4], area: [6, 4], barras: [6, 4], dona: [4, 4], tabla: [6, 5], ranking: [4, 5], texto: [4, 2] };
export const TIPOS = [
	{ id: 'kpi', etiqueta: 'KPI (valor único)' },
	{ id: 'lineas', etiqueta: 'Líneas' },
	{ id: 'area', etiqueta: 'Área' },
	{ id: 'barras', etiqueta: 'Barras' },
	{ id: 'dona', etiqueta: 'Dona' },
	{ id: 'tabla', etiqueta: 'Tabla' },
	{ id: 'ranking', etiqueta: 'Ranking' },
];

const ordenados = (widgets) => [...widgets].sort((a, b) => (a.y - b.y) || (a.x - b.x) || (a.id - b.id));

export const aLayouts = (widgets) => {
	const lg = widgets.map(w => ({ i: String(w.id), x: w.x, y: w.y, w: Math.max(2, w.w), h: Math.max(2, w.h), minW: 2, minH: 2 }));
	let cx = 0;
	let cy = 0;
	let alturaFila = 0;
	const sm = ordenados(widgets).map(w => {
		const ancho = w.w <= 3 ? 3 : 6;
		if (cx + ancho > 6) { cx = 0; cy += alturaFila; alturaFila = 0; }
		const item = { i: String(w.id), x: cx, y: cy, w: ancho, h: Math.max(2, w.h), minW: 2, minH: 2 };
		cx += ancho;
		alturaFila = Math.max(alturaFila, item.h);
		return item;
	});
	let y = 0;
	const xs = ordenados(widgets).map(w => {
		const item = { i: String(w.id), x: 0, y, w: 2, h: Math.max(2, w.h), minW: 2, minH: 2 };
		y += item.h;
		return item;
	});
	return { lg, md: lg, sm, xs };
};

export const deLayout = (layout) => layout.map(l => ({ id: Number(l.i), x: l.x, y: l.y, w: l.w, h: l.h }));

export const siguientePosicion = (widgets) => ({ x: 0, y: widgets.reduce((m, w) => Math.max(m, w.y + w.h), 0) });

export const tamanoPorTipo = (tipo) => {
	const [w, h] = TAMANOS[tipo] || [4, 4];
	return { w, h };
};
