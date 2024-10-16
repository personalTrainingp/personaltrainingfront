import { createSlice } from '@reduxjs/toolkit';
export const ImpuestoSlice = createSlice({
	name: 'impuestos',
	initialState: {
		errorMessage: undefined,
		impuesto: {
			id_marca: 0,
			id_categoria: 0,
			id_presentacion: 0,
			codigo_lote: '',
			codigo_producto: '',
			codigo_contable: '',
			id_prov: 0,
			nombre_producto: '',
			prec_venta: '',
			prec_compra: '',
			stock_minimo: '',
			stock_producto: '',
			almacen_producto: 0,
			fec_vencimiento: 0,
			estado_product: true,
		},
		dataImpuesto: [],
		dataHistoricoImpuestxImpuest: [],
	},
	reducers: {
        onGetImpuestos: (state, action) => {
			state.dataImpuesto = action.payload;
		},
		onGetHistoryImpues: (state, action) => {
			state.dataHistoricoImpuestxImpuest = action.payload;
		},
    },
});
export const {onGetImpuestos, onGetHistoryImpues} = ImpuestoSlice.actions;
