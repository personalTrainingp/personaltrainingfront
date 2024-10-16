import { createSlice } from '@reduxjs/toolkit';
export const productoSlice = createSlice({
	name: 'prod',
	initialState: {
		errorMessage: undefined,
		dataproductos: [],
		modalProdSlice: false,
	},
	reducers: {
		onGetProductos: (state, { payload }) => {
			state.dataproductos = payload;
		},
	},
});
export const { onGetProductos } = productoSlice.actions;
