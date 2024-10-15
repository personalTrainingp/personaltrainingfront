import { createSlice } from '@reduxjs/toolkit';
const initialState = {
	detalle_cli_modelo: {
		id_venta: '',
		id_empl: 0,
		id_cli: 0,
		id_tipo_transaccion: 0,
		numero_transac: '',
		id_origen: 0,
		observacion: '',
	},
	datos_pagos: [],
	venta: {
		detalle_venta_programa: [],
		detalle_venta_fitology: [],
		detalle_venta_nutricion: [],
		detalle_venta_transferencia: [],
		detalle_venta_accesorio: [],
		detalle_venta_suplementos: [],
		detalle_traspaso: [],
	},
};
export const uiNuevaVentaSlice = createSlice({
	name: 'nuevaVenta',
	initialState,
	reducers: {
		// FORMAS DE PAGO
		onAddOneDetallePago: (state, action) => {
			const nuevoPago = action.payload;
			const pagosFiltrados = state.datos_pagos.filter(
				(pagos) => pagos.value !== nuevoPago.value
			);
			state.datos_pagos = [nuevoPago, ...pagosFiltrados];
		},
		onDeleteOneDetallePago: (state, action) => {
			const pagos = state.datos_pagos.filter((e) => {
				return e.value !== action.payload;
			});
			state.datos_pagos = pagos;
		},
		//CLIENTES DETALLES
		onSetDetalleCli: (state, action) => {
			state.detalle_cli_modelo = action.payload;
		},
		onSetDetalleTraspaso: (state, action) => {
			state.venta.detalle_traspaso = [action.payload];
		},
		onSetDetallePrograma: (state, action) => {
			state.venta.detalle_venta_programa = [action.payload];
		},
		onSetDetalleTransferencia: (state, action) => {
			state.venta.detalle_venta_transferencia = [action.payload];
		},
		onAllDeleteTraspaso: (state) => {
			state.venta.detalle_traspaso = [];
		},
		onDeleteAllPrograma: (state) => {
			state.venta.detalle_venta_programa = [];
		},
		onSetFirmaPgm: (state, action) => {
			state.venta.detalle_venta_programa[0] = {
				...state.venta.detalle_venta_programa[0],
				firmaCli: action.payload,
			};
		},

		onAddDetalleProductoSuplementos: (state, action) => {
			const nuevoSuplemento = action.payload;
			const suplementosFiltrados = state.venta.detalle_venta_suplementos.filter(
				(supl) => supl.id_producto !== nuevoSuplemento.id_producto
			);
			state.venta.detalle_venta_suplementos = [nuevoSuplemento, ...suplementosFiltrados];
		},
		onDeleteOneSuplemento: (state, action) => {
			const suplementos = state.venta.detalle_venta_suplementos.filter((a) => {
				return a.id !== action.payload;
			});
			state.venta.detalle_venta_suplementos = suplementos;
		},
		onAddDetalleProductoAccesorios: (state, action) => {
			const nuevoAccesorio = action.payload;
			const accesoriosFiltrados = state.venta.detalle_venta_accesorio.filter(
				(accesorio) => accesorio.id_producto !== nuevoAccesorio.id_producto
			);
			state.venta.detalle_venta_accesorio = [nuevoAccesorio, ...accesoriosFiltrados];
		},
		onDeleteOneProducto: (state, action) => {
			const accesorios = state.venta.detalle_venta_accesorio.filter((a) => {
				return a.id !== action.payload;
			});
			state.venta.detalle_venta_accesorio = accesorios;
		},
		onDeleteOneFitology: (state, action) => {
			const Fitology = state.venta.detalle_venta_fitology.filter((a) => {
				return a.value !== action.payload;
			});
			state.venta.detalle_venta_fitology = Fitology;
		},
		onAddDetalleFitology: (state, action) => {
			const nuevaCitaFit = action.payload;
			const citasFit = state.venta.detalle_venta_fitology.filter(
				(e) => e.value !== nuevaCitaFit.value
			);
			state.venta.detalle_venta_fitology = [nuevaCitaFit, ...citasFit];
		},
		onDeleteOneNutricion: (state, action) => {
			const Nutricion = state.venta.detalle_venta_nutricion.filter((a) => {
				return a.value !== action.payload;
			});
			state.venta.detalle_venta_nutricion = Nutricion;
		},
		onAddOneNutricion: (state, action) => {
			const nuevaCitaNut = action.payload;
			const citasNut = state.venta.detalle_venta_nutricion.filter(
				(e) => e.value !== nuevaCitaNut.value
			);
			state.venta.detalle_venta_nutricion = [nuevaCitaNut, ...citasNut];
		},
		RESET_STATE_VENTA: (state, action) => initialState,
	},
});
export const {
	onSetDetalleCli,
	onSetDetalleTransferencia,
	onSetDetallePrograma,
	onSetDetalleTraspaso,
	onAllDeleteTraspaso,
	onSetFirmaPgm,
	onDeleteAllPrograma,
	onAddDetalleProductoAccesorios,
	onDeleteOneProducto,
	RESET_STATE_VENTA,
	onDeleteOneSuplemento,
	onAddDetalleProductoSuplementos,
	onAddDetalleFitology,
	onDeleteOneFitology,
	onDeleteOneNutricion,
	onAddOneNutricion,
	onAddOneDetallePago,
	onDeleteOneDetallePago,
} = uiNuevaVentaSlice.actions;
