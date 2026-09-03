export const DIMENSIONES = ['empresa', 'anio', 'mes', 'genero', 'tipo', 'producto'];
export const MEDIDAS = ['monto', 'cantidad'];
export const TOPE_CATEGORIAS = 200;

export const valorCelda = (grupo, operacion) => {
	if (!grupo) return 0;
	if (operacion === 'Count') return grupo.conteo;
	return Math.round(grupo.suma * 100) / 100;
};

export const agrupar = (datos, dimFila, dimColumna, medida, operacion) => {
	const mapa = new Map();
	const filas = new Set();
	const columnas = new Set();
	for (const d of datos) {
		const f = dimFila ? String(d[dimFila] ?? '—') : 'Total';
		const c = dimColumna ? String(d[dimColumna] ?? '—') : 'Total';
		filas.add(f);
		columnas.add(c);
		const clave = f + '||' + c;
		const actual = mapa.get(clave) || { suma: 0, conteo: 0 };
		actual.suma += Number(d[medida]) || 0;
		actual.conteo += 1;
		mapa.set(clave, actual);
	}
	const ordenar = (a, b) => a.localeCompare(b, 'es', { numeric: true });
	const listaFilas = [...filas].sort(ordenar).slice(0, TOPE_CATEGORIAS);
	const listaColumnas = [...columnas].sort(ordenar).slice(0, TOPE_CATEGORIAS);
	const celdas = listaFilas.map(f => listaColumnas.map(c => valorCelda(mapa.get(f + '||' + c), operacion)));
	const totalesFila = celdas.map(fila => fila.reduce((a, b) => a + b, 0));
	const totalesColumna = listaColumnas.map((_, i) => celdas.reduce((a, fila) => a + fila[i], 0));
	const total = totalesFila.reduce((a, b) => a + b, 0);
	return { listaFilas, listaColumnas, celdas, totalesFila, totalesColumna, total };
};

export const formatear = (n) => Number(n || 0).toLocaleString('es-PE', { maximumFractionDigits: 2 });
