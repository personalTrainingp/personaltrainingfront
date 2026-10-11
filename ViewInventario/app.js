// ================== CONFIGURACION ==================
const API_URL = 'http://api-sistema-luroga2.azurewebsites.net/api';
const ID_EMPRESA = 2599;
const URL_IMG_ARTICULO = 'https://archivosluroga.blob.core.windows.net/avatar-articulos/';
const SIN_IMAGEN = '../src/assets/images/SinImage.jpg';
const TC_DEFAULT = { precio_venta: 3.35 };

const CHECKS = [
	{ id: 1, label: 'RAL', color: '#2c10cd', textColor: '#fff' },
	{ id: 2, label: 'CIRCUS', color: '#EEBE00', textColor: '#000' },
	{ id: 3, label: 'REDUCTO', color: '#17a700', textColor: '#000' },
	{ id: 4, label: 'INSUMOS', color: '#C8A2C8', textColor: '#000' },
];
const ROWS_OPTIONS = [10, 100, 250, 500];

// ================== ESTADO ==================
const state = {
	articulos: [],
	grupos: [],
	tabActivo: 'todos',
	filtroCheckId: null,
	search: '',
	rows: 10,
	firstxTab: {}, // fila inicial de la paginacion por pestaña
	sort: { field: null, order: 1 },
};

// ================== HELPERS ==================
const $ = (id) => document.getElementById(id);

const escapeHtml = (v) =>
	String(v ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');

const formatMoney = (amount) => {
	const n = amount === Infinity || isNaN(amount) ? 0 : Number(amount);
	const txt = n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	return `<span class="${n === 0 ? 'text-gray' : ''}">${txt}</span>`;
};

const apiGet = async (path) => {
	const res = await fetch(`${API_URL}${path}`);
	if (!res.ok) throw new Error(`${res.status} ${res.statusText} en ${path}`);
	return res.json();
};

const costoTotalSoles = (item) => item.costo_unitario_soles * item.cantidad + item.mano_obra_soles;
const costoUnitarioDolares = (item) => item.costo_unitario_soles / item.tipoCambio.precio_venta;
const costoTotalDolares = (item) =>
	(item.costo_unitario_soles / item.tipoCambio.precio_venta) * item.cantidad +
	item.mano_obra_soles / item.tipoCambio.precio_venta;

const calcularTotales = (items) =>
	items.reduce(
		(acc, item) => {
			const soles = costoTotalSoles(item);
			const precio_venta = item.tipoCambio?.precio_venta;
			acc.cantidad += Number(item.cantidad) || 0;
			acc.soles += soles || 0;
			acc.dolares += precio_venta ? soles / precio_venta : 0;
			return acc;
		},
		{ cantidad: 0, soles: 0, dolares: 0 }
	);

// ================== CARGA DE DATOS ==================
const obtenerArticulos = async () => {
	const [dataInv, dataTC, dataEtiq] = await Promise.all([
		apiGet(`/inventario/obtener-inventario/${ID_EMPRESA}`),
		apiGet('/tipocambio/'),
		apiGet('/parametros/get_params/etiquetas/articulo/etiqueta_busqueda'),
	]);
	const etiquetas = (dataEtiq.etiquetasxID || []).map((t) => ({
		id_fila: t.id_fila,
		value: t.parametro_etiqueta?.id_param,
		label: t.parametro_etiqueta?.label_param,
	}));
	return dataInv.articulos.map((m) => {
		const TC = dataTC.tipoCambios.find(
			(f) => new Date(f.fecha).toISOString().split('T')[0] === m.fecha_entrada
		);
		const etiquetas_busquedas = etiquetas.filter((f) => f.id_fila === m.id);
		return {
			tipoCambio: TC ? TC : TC_DEFAULT,
			etiquetas_busquedas,
			...m,
			etiquetas_str: etiquetas_busquedas.map((e) => `${e.label}`).join(', '),
		};
	});
};

const agruparxLugar = (articulos) => {
	const grupos = Object.values(
		articulos.reduce((acc, item) => {
			const lugar = item.parametro_lugar_encuentro || {};
			const nivel = lugar.nivel ? `NIVEL ${lugar.nivel}` : '';
			const key = `${lugar.nivel ? `NIVEL ${lugar.nivel} ` : ''}${lugar.label_param}`;
			if (!acc[key]) {
				acc[key] = { lugar: key, nivel, zona: lugar.label_param, orden_param: lugar.orden_param, items: [] };
			}
			acc[key].items.push(item);
			return acc;
		}, {})
	);
	grupos.sort((a, b) => a.orden_param - b.orden_param);
	grupos.unshift({ lugar: 'todos', nivel: '', zona: 'TODOS', orden_param: -1, items: articulos });
	return grupos;
};

// ================== FILTRO + ORDEN ==================
const valorSort = (item, field) => {
	switch (field) {
		case 'marca':
			return item.parametro_marca?.label_param ?? '';
		case 'ubicacion':
			return item.parametro_lugar_encuentro?.label_param ?? '';
		case 'costo_unitario_dolares':
			return costoUnitarioDolares(item);
		case 'costo_total_soles':
			return costoTotalSoles(item);
		case 'costo_total_dolares':
			return costoTotalDolares(item);
		default:
			return item[field];
	}
};

const datosFiltrados = () => {
	const grupo = state.grupos.find((g) => g.lugar === state.tabActivo) || state.grupos[0];
	if (!grupo) return [];
	const search = state.search.toLowerCase();
	let data = grupo.items
		.filter((item) => (state.filtroCheckId ? item.id_color_subrayado === state.filtroCheckId : true))
		.filter((item) => Object.values(item).some((v) => String(v).toLowerCase().includes(search)));

	const { field, order } = state.sort;
	if (field) {
		data = [...data].sort((a, b) => {
			const va = valorSort(a, field);
			const vb = valorSort(b, field);
			if (va == null && vb == null) return 0;
			if (va == null) return 1;
			if (vb == null) return -1;
			if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * order;
			return String(va).localeCompare(String(vb), 'es', { numeric: true }) * order;
		});
	}
	return data;
};

// ================== RENDER ==================
const renderTotales = () => {
	const total = calcularTotales(state.articulos);
	$('totalCantidad').textContent = total.cantidad;
	$('totalSoles').innerHTML = formatMoney(total.soles);
	$('totalDolares').innerHTML = formatMoney(total.dolares);
};

const renderCardsCheck = () => {
	$('cardsCheck').innerHTML = CHECKS.map((c) => {
		const t = calcularTotales(state.articulos.filter((i) => i.id_color_subrayado === c.id));
		const clases = [
			state.filtroCheckId === c.id ? 'activo' : '',
			state.filtroCheckId && state.filtroCheckId !== c.id ? 'atenuado' : '',
		].join(' ');
		return `
		<div class="card my-3 card-check ${clases}" data-check="${c.id}"
			style="background-color:${c.color};color:${c.textColor}"
			title="Click para filtrar la tabla por CHECK ${c.label}">
			<div class="card-header font-24 fw-bold" style="background-color:${c.color};color:${c.textColor}">CHECK ${c.label}</div>
			<div class="card-body d-flex flex-wrap gap-5 font-24">
				<div><div>TOTAL CANTIDAD</div><div class="fw-bold">${t.cantidad}</div></div>
				<div><div>TOTAL MONTO S/.</div><div class="fw-bold">${formatMoney(t.soles)}</div></div>
				<div><div>TOTAL MONTO $</div><div class="fw-bold">${formatMoney(t.dolares)}</div></div>
			</div>
		</div>`;
	}).join('');

	const btn = $('btnLimpiarFiltro');
	if (state.filtroCheckId) {
		const c = CHECKS.find((x) => x.id === state.filtroCheckId);
		btn.textContent = `LIMPIAR FILTRO (CHECK ${c.label})`;
		btn.classList.remove('d-none');
	} else {
		btn.classList.add('d-none');
	}
};

const renderLeyenda = () => {
	$('leyenda').insertAdjacentHTML(
		'beforeend',
		CHECKS.map(
			(c) => `
			<div class="d-flex align-items-center gap-2">
				<span class="cuadro-leyenda" style="background-color:${c.color}"></span>
				<span><span class="fw-bold">${c.id}</span> = ${c.label}</span>
			</div>`
		).join('')
	);
};

const renderTabs = () => {
	$('tabs').innerHTML = state.grupos
		.map(
			(g) => `
		<li class="nav-item">
			<button class="nav-link ${g.lugar === state.tabActivo ? 'active' : ''}" data-tab="${escapeHtml(g.lugar)}">
				${escapeHtml(g.nivel)}<br/>${escapeHtml(g.zona)}
			</button>
		</li>`
		)
		.join('');
};

const renderSortIcons = () => {
	document.querySelectorAll('th.sortable').forEach((th) => {
		th.querySelector('.sort-icon')?.remove();
		const icono = state.sort.field === th.dataset.sort ? (state.sort.order === 1 ? '▲' : '▼') : '⇅';
		th.insertAdjacentHTML('beforeend', `<span class="sort-icon">${icono}</span>`);
	});
};

const imagenUrl = (item) => {
	const images = [...(item.tb_images || [])].sort((a, b) => b.id - a.id);
	const latest = images[0]?.name_image;
	return latest ? `${URL_IMG_ARTICULO}${latest}` : SIN_IMAGEN;
};

const renderFila = (item) => {
	const lugar = item.parametro_lugar_encuentro || {};
	return `
	<tr class="${item.id_color_subrayado ? `row-color-subrayado-${item.id_color_subrayado}` : ''}">
		<td class="fs-4">${escapeHtml(item.id)}</td>
		<td class="font-24">${escapeHtml(item.orden ?? '-')}</td>
		<td class="font-24 fw-bold">${escapeHtml(item.id_color_subrayado ?? '-')}</td>
		<td><img class="img-articulo" src="${escapeHtml(imagenUrl(item))}" alt="Image" loading="lazy" /></td>
		<td><div class="lbl">PRODUCTO</div><div class="font-24 fw-bold">${escapeHtml(item.producto)}</div></td>
		<td><div class="lbl">MARCA</div><div class="font-24 fw-bold">${escapeHtml(item.parametro_marca?.label_param)}</div></td>
		<td style="min-width:10rem">
			<div class="lbl">DESCRIPCION</div><div class="font-24 fw-bold">${escapeHtml(item.descripcion)}</div>
			<div class="lbl">ETIQUETAS</div><div class="font-24 fw-bold">${escapeHtml(item.etiquetas_str)}</div>
		</td>
		<td><div class="lbl">UBICACION</div><div class="font-24 fw-bold">${escapeHtml(lugar.label_param)} - NIVEL ${escapeHtml(lugar.nivel)}</div></td>
		<td><div class="lbl">CANT.</div><div class="font-24 fw-bold text-end">${escapeHtml(item.cantidad)}</div></td>
		<td><div class="lbl">COSTO UNIT. S/.</div><div class="font-24 fw-bold text-end">${formatMoney(item.costo_unitario_soles)}</div></td>
		<td style="min-width:180px"><div class="lbl text-color-dolar">COSTO UNITARIO $.</div><div class="font-24 fw-bold text-end text-color-dolar">${formatMoney(costoUnitarioDolares(item))}</div></td>
		<td><div class="lbl">COSTO MANO OBRA S/.</div><div class="font-24 fw-bold text-end">${formatMoney(item.mano_obra_soles)}</div></td>
		<td><div class="lbl">COSTO TOTAL S/.</div><div class="font-24 fw-bold text-end">${formatMoney(costoTotalSoles(item))}</div></td>
		<td style="min-width:180px"><div class="lbl text-color-dolar">COSTO TOTAL $.</div><div class="font-24 fw-bold text-end text-color-dolar">${formatMoney(costoTotalDolares(item))}</div></td>
	</tr>`;
};

const renderTabla = () => {
	const data = datosFiltrados();
	const total = data.length;
	let first = state.firstxTab[state.tabActivo] ?? 0;
	if (first >= total) first = 0;
	const pagina = data.slice(first, first + state.rows);

	$('tbody').innerHTML = pagina.length
		? pagina.map(renderFila).join('')
		: `<tr><td colspan="14" class="text-center">ARTICULOS NO ENCONTRADOS.</td></tr>`;

	renderPaginador(total, first);
};

const renderPaginador = (total, first) => {
	const totalPaginas = Math.max(1, Math.ceil(total / state.rows));
	const actual = Math.floor(first / state.rows);
	const inicio = Math.max(0, Math.min(actual - 2, totalPaginas - 5));
	const fin = Math.min(totalPaginas, inicio + 5);

	const btn = (label, pagina, disabled, active = false) =>
		`<button class="btn btn-sm ${active ? 'btn-primary' : 'btn-outline-secondary'}" data-page="${pagina}" ${disabled ? 'disabled' : ''}>${label}</button>`;

	let html = btn('«', 0, actual === 0) + btn('‹', actual - 1, actual === 0);
	for (let p = inicio; p < fin; p++) html += btn(p + 1, p, false, p === actual);
	html += btn('›', actual + 1, actual >= totalPaginas - 1) + btn('»', totalPaginas - 1, actual >= totalPaginas - 1);
	html += `<span class="ms-2">(${actual + 1} de ${totalPaginas})</span>`;
	html += `<select class="form-select form-select-sm w-auto ms-2" id="selRows">
		${ROWS_OPTIONS.map((r) => `<option value="${r}" ${r === state.rows ? 'selected' : ''}>${r}</option>`).join('')}
	</select>`;
	$('paginador').innerHTML = html;
};

const renderTodo = () => {
	renderTotales();
	renderCardsCheck();
	renderTabs();
	renderSortIcons();
	renderTabla();
};

// ================== EVENTOS ==================
const onClickFiltroCheck = (id) => {
	state.filtroCheckId = state.filtroCheckId === id ? null : id;
	state.firstxTab = {};
	renderCardsCheck();
	renderTabla();
};

const bindEventos = () => {
	$('cardsCheck').addEventListener('click', (e) => {
		const card = e.target.closest('[data-check]');
		if (card) onClickFiltroCheck(Number(card.dataset.check));
	});

	$('btnLimpiarFiltro').addEventListener('click', () => {
		state.filtroCheckId = null;
		state.firstxTab = {};
		renderCardsCheck();
		renderTabla();
	});

	$('tabs').addEventListener('click', (e) => {
		const b = e.target.closest('[data-tab]');
		if (!b) return;
		state.tabActivo = b.dataset.tab;
		renderTabs();
		renderTabla();
	});

	$('txtBuscar').addEventListener('input', (e) => {
		state.search = e.target.value;
		state.firstxTab = {};
		renderTabla();
	});

	document.querySelector('thead').addEventListener('click', (e) => {
		const th = e.target.closest('th.sortable');
		if (!th) return;
		const field = th.dataset.sort;
		state.sort = { field, order: state.sort.field === field ? -state.sort.order : 1 };
		renderSortIcons();
		renderTabla();
	});

	$('paginador').addEventListener('click', (e) => {
		const b = e.target.closest('[data-page]');
		if (!b || b.disabled) return;
		state.firstxTab[state.tabActivo] = Number(b.dataset.page) * state.rows;
		renderTabla();
	});

	$('paginador').addEventListener('change', (e) => {
		if (e.target.id !== 'selRows') return;
		state.rows = Number(e.target.value);
		state.firstxTab = {};
		renderTabla();
	});

	$('tbody').addEventListener('click', (e) => {
		const img = e.target.closest('.img-articulo');
		if (!img) return;
		$('imgPreview').querySelector('img').src = img.src;
		$('imgPreview').classList.remove('d-none');
	});
	$('imgPreview').addEventListener('click', () => $('imgPreview').classList.add('d-none'));
};

// ================== INICIO ==================
const init = async () => {
	$('lblEmpresa').textContent = `(${ID_EMPRESA})`;
	renderLeyenda();
	bindEventos();
	try {
		state.articulos = await obtenerArticulos();
		state.grupos = agruparxLugar(state.articulos);
		renderTodo();
	} catch (error) {
		console.log(error);
		$('errorBox').textContent = `Error al cargar el inventario: ${error.message}`;
		$('errorBox').classList.remove('d-none');
	} finally {
		$('loading').classList.add('d-none');
	}
};

init();
