export const formatear = (valor, unidad) => {
	const n = Number(valor) || 0;
	if (unidad === 'soles') return 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	return n.toLocaleString('es-PE', { maximumFractionDigits: Math.abs(n) < 10 ? 2 : 0 });
};

export const formatearCorto = (valor, unidad) => {
	const n = Number(valor) || 0;
	const abs = Math.abs(n);
	const prefijo = unidad === 'soles' ? 'S/ ' : '';
	if (abs >= 1000000) return `${prefijo}${(n / 1000000).toLocaleString('es-PE', { maximumFractionDigits: 1 })} M`;
	if (abs >= 10000) return `${prefijo}${(n / 1000).toLocaleString('es-PE', { maximumFractionDigits: 0 })} k`;
	return `${prefijo}${n.toLocaleString('es-PE', { maximumFractionDigits: abs < 10 ? 2 : 0 })}`;
};

export const ETIQUETAS_PERIODO = {
	hoy: 'Hoy',
	ayer: 'Ayer',
	anteayer: 'Anteayer',
	esta_semana: 'Esta semana',
	semana_pasada: 'Semana pasada',
	este_mes: 'Este mes',
	mes_pasado: 'Mes pasado',
	mtd: 'Lo que va del mes',
	este_anio: 'Este año',
	anio_pasado: 'Año pasado',
	ytd: 'Lo que va del año',
	trimestre_actual: 'Trimestre actual',
	trimestre_pasado: 'Trimestre pasado',
	ultimos_7_dias: 'Últimos 7 días',
	ultimos_30_dias: 'Últimos 30 días',
	ultimos_90_dias: 'Últimos 90 días',
	ultimos_3_meses: 'Últimos 3 meses',
	ultimos_6_meses: 'Últimos 6 meses',
	ultimos_12_meses: 'Últimos 12 meses',
	mismo_periodo_mes_pasado: 'Mismo periodo del mes pasado',
	mismo_periodo_anio_pasado: 'Mismo periodo del año pasado',
	todo: 'Histórico completo',
};

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const etiquetaPeriodo = (periodo) => {
	const p = String(periodo || '');
	if (ETIQUETAS_PERIODO[p]) return ETIQUETAS_PERIODO[p];
	if (/^\d{4}-\d{2}$/.test(p)) return `${MESES[Number(p.slice(5, 7)) - 1]} ${p.slice(0, 4)}`;
	if (/^\d{4}$/.test(p)) return p;
	if (/^\d{4}-\d{2}-\d{2}$/.test(p)) return `${Number(p.slice(8, 10))} de ${MESES[Number(p.slice(5, 7)) - 1]} de ${p.slice(0, 4)}`;
	const r = p.match(/^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/);
	if (r) return `${r[1]} a ${r[2]}`;
	const u = p.match(/^ultimos_(\d+)_(dias|meses)$/);
	if (u) return `Últimos ${u[1]} ${u[2] === 'dias' ? 'días' : 'meses'}`;
	const a = p.match(/^anteriores_(\d+)_dias$/);
	if (a) return `Los ${a[1]} días anteriores`;
	const q = p.match(/^q([1-4])(?:_(\d{4}))?$/);
	if (q) return `Trimestre ${q[1]}${q[2] ? ` de ${q[2]}` : ''}`;
	const z = p.match(/^quincena_([12])_(\d{4})-(\d{2})$/);
	if (z) return `${z[1] === '1' ? 'Primera' : 'Segunda'} quincena de ${MESES[Number(z[3]) - 1]} ${z[2]}`;
	return p;
};

export const fechaFoto = (fecha) => {
	const f = new Date(fecha);
	return `${f.getDate()} de ${MESES[f.getMonth()]} de ${f.getFullYear()}`;
};
