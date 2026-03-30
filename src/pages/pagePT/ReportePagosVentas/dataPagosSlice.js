import { createSlice } from '@reduxjs/toolkit';
export const dataPagosSlice = createSlice({
	name: 'PAGOSVENTAS',
	initialState: {
		dataView: [],
	},
	reducers: {
		onSetDataViewPagosVentas: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewPagosVentas } = dataPagosSlice.actions;
