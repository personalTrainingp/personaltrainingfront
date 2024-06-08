import { createSlice } from '@reduxjs/toolkit';
export const parametroSlice = createSlice({
	name: 'param',
	initialState: {
		dataparametro: [],
	},
	reducers: {
		onSetParametro: (state, { payload }) => {
			state.dataparametro = payload;
		},
		buscarLabelPorValue: (state, { payload }) => {
			const objetoEncontrado = state.dataparametro.find((objeto) => objeto.value === payload);
			return objetoEncontrado ? objetoEncontrado.label : null;
		},
	},
});
export const { onSetParametro, buscarLabelPorValue } = parametroSlice.actions;
