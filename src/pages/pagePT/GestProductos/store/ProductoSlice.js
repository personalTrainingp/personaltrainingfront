import { createSlice } from '@reduxjs/toolkit';
export const ProductoSlice = createSlice({
	name: 'PRODUCTO',
	initialState: {
		dataView: [
			{
				
				nombre_producto: '',
				prec_venta: 0,
				prec_compra: 0,
				stock_producto: 0,
				estado_product: 0,
				id_empresa: 0
			},
		],
	},
	reducers: {
		onSetDataViewProducto: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewProducto } = ProductoSlice.actions;
