import { createSlice } from '@reduxjs/toolkit';
export const serviciosSlice = createSlice({
	name: 'serv',
	initialState: {
		errorMessage: undefined,
		dataview: [],
		modalProdSlice: false,
	},
	reducers: {
		onSetServicios: (state, { payload }) => {
			state.dataview = payload;
		},
	},
});
export const { onSetServicios } = serviciosSlice.actions;
