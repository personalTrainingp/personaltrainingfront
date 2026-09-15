import { ID_CONCEPTO_PRODUCTOS_CIRCUS, ID_CONCEPTO_SERVICIOS_CIRCUS } from '../constants/empresas'

// CIRCUS no vende por MEMBRESIA/ACCESORIOS/SUPLEMENTOS como CHANGE (ver
// dataIngresosOrden en @/helper/dataIngresosOrden.js): sus ventas son solo
// PRODUCTOS (detalle_ventaProductos, sin separar por id_categoria) y
// SERVICIOS (detalle_ventaservicios, ligado a tb_ServiciosCircus). Por eso
// se arma acá aparte en vez de reusar ese helper.
//
// El id de "grupo" (parametro_grupo.id) no se hardcodea: cada empresa tiene
// su propia fila de INGRESOS en la BD (ver comentario en TrItemUtilidad,
// view/TrItem.jsx), así que se busca dinámicamente en dataGrupos (la
// terminología ya cargada para esta empresa) el grupo que contiene el
// concepto 1151/1152 y se usa ESE id.
const encontrarGrupoDeConcepto = (dataGrupos = [], idConcepto) =>
	dataGrupos.find((g) => g.parametro_grupo_gasto?.some((c) => c.id === idConcepto))

export const construirVentasCircus = (dataVentas = [], dataGrupos = []) => {
	const grupoProductos = encontrarGrupoDeConcepto(dataGrupos, ID_CONCEPTO_PRODUCTOS_CIRCUS)
	const grupoServicios = encontrarGrupoDeConcepto(dataGrupos, ID_CONCEPTO_SERVICIOS_CIRCUS)

	const base = (v) => ({
		...v,
		id_cli: v.id_cli,
		id_origen: v.id_origen,
		id_venta: v.id,
		fecha_primaria: v.fecha_venta,
		fecha_pago: v.fecha_venta,
		fecha_comprobante: v.fecha_venta,
		empl: v?.tb_empleado?.nombres_apellidos_empl || '',
		moneda: 'PEN',
	})

	const dataProductos = dataVentas
		.map((v) => {
			const detalle = v.detalle_ventaProductos || []
			const monto = detalle.reduce((total, p) => total + Number(p.tarifa_monto || 0), 0)
			const cantidadTotal = detalle.reduce((total, p) => total + Number(p.cantidad || 0), 0)
			return {
				...base(v),
				detalle_productos: detalle,
				cantidadTotal,
				descripcion: detalle[0]?.tb_producto?.nombre_producto || '',
				subConcepto: detalle[0]?.tb_producto?.nombre_producto || '',
				monto,
				concepto: 'PRODUCTOS',
				id_gasto: ID_CONCEPTO_PRODUCTOS_CIRCUS,
				tb_parametros_gasto: {
					grupo: grupoProductos?.param_label ?? 'INGRESOS',
					nombre_gasto: 'PRODUCTOS',
					parametro_grupo: {
						param_label: grupoProductos?.param_label ?? 'INGRESOS',
						id: grupoProductos?.id,
					},
				},
			}
		})
		.filter((v) => v.detalle_productos.length !== 0)

	const dataServicios = dataVentas
		.map((v) => {
			const detalle = v.detalle_ventaservicios || []
			const monto = detalle.reduce((total, s) => total + Number(s.tarifa_monto || 0), 0)
			const cantidadTotal = detalle.reduce((total, s) => total + Number(s.cantidad || 0), 0)
			return {
				...base(v),
				detalle_servicios: detalle,
				cantidadTotal,
				// Alias por defecto de Sequelize para el join detalleventa_servicios ->
				// ServiciosCircus (modelo "circus_servicios", sin "as" en Venta.js).
				descripcion: detalle[0]?.circus_servicios?.nombre_servicio || '',
				subConcepto: detalle[0]?.circus_servicios?.nombre_servicio || '',
				monto,
				concepto: 'SERVICIOS',
				id_gasto: ID_CONCEPTO_SERVICIOS_CIRCUS,
				tb_parametros_gasto: {
					grupo: grupoServicios?.param_label ?? 'INGRESOS',
					nombre_gasto: 'SERVICIOS',
					parametro_grupo: {
						param_label: grupoServicios?.param_label ?? 'INGRESOS',
						id: grupoServicios?.id,
					},
				},
			}
		})
		.filter((v) => v.detalle_servicios.length !== 0)

	return { dataProductos, dataServicios }
}
