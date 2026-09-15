// IDs de empresa (id_empresa) usados en toda la app de Flujo de Caja.
// Centralizados aquí para no repetir "numeros magicos" (598, 601, 599, 800)
// en cada componente/tab.
export const ID_EMPRESA_CHANGE = 598
export const ID_EMPRESA_CIRCUS = 601
export const ID_EMPRESA_REDUCTO = 599
export const ID_EMPRESA_RAL = 800

// CIRCUS usa id_empresa=601 para ingresos/egresos manuales del flujo de
// caja, pero sus ventas (producto + servicio) quedan grabadas en la tabla
// `venta` con id_empresa=599 (numeración heredada de otro módulo, distinta
// a la de flujo de caja). Sin este mapeo, GET /venta/fecha-venta/id_empresa/601
// no devuelve nada y la fila VENTAS de Circus sale vacía.
export const ID_EMPRESA_VENTA_CIRCUS = 599
export const idEmpresaVenta = (id_empresa) =>
	id_empresa === ID_EMPRESA_CIRCUS ? ID_EMPRESA_VENTA_CIRCUS : id_empresa

// Conceptos (id_gasto) del terminologiario de CIRCUS para sus dos únicas
// líneas de venta: PRODUCTOS (detalle_ventaProductos) y SERVICIOS
// (detalle_ventaservicios, ligado a tb_ServiciosCircus). Circus no separa
// productos por categoría (17/18) como CHANGE, así que no reutilizamos
// dataIngresosOrden: ver construirVentasCircus en helpers/ventasCircus.js.
export const ID_CONCEPTO_PRODUCTOS_CIRCUS = 1151
export const ID_CONCEPTO_SERVICIOS_CIRCUS = 1152

// id_empresa "virtual" para la fila/tabla TOTAL (suma de las 4 empresas).
// No corresponde a ninguna empresa real en la BD: solo se usa para pintar
// la fila TOTAL (clases sticky-td-total / bg-todo) y para que los
// componentes TrItem* no intenten hacer fetch por este id.
export const ID_EMPRESA_TOTAL = 'total'

// Empresas que se muestran en la pestaña TODO, en el orden en que aparecen
// las filas de cada tabla. classNameEmpresa/bgPastel reutilizan las mismas
// clases de color ya usadas en las pestañas individuales de cada empresa.
export const EMPRESAS_FLUJO_CAJA = [
	{
		id_empresa: ID_EMPRESA_CHANGE,
		label: 'CHANGE',
		classNameEmpresa: 'bg-change text-white',
		bgPastel: 'bg-change-pastel text-white',
	},
	{
		id_empresa: ID_EMPRESA_RAL,
		label: 'RAL',
		classNameEmpresa: 'bg-ral text-white',
		bgPastel: 'bg-ral-pastel text-white',
	},
	{
		id_empresa: ID_EMPRESA_REDUCTO,
		label: 'REDUCTO',
		classNameEmpresa: 'bg-greenISESAC text-white',
		bgPastel: 'bg-greenISESAC-pastel text-white',
	},
	{
		id_empresa: ID_EMPRESA_CIRCUS,
		label: 'CIRCUS',
		classNameEmpresa: 'bg-circus text-white',
		bgPastel: 'bg-circus-pastel text-white',
	},
]
