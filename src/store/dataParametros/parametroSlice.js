import { createSlice } from '@reduxjs/toolkit';
export const parametroSlice = createSlice({
	name: 'param',
	initialState: {
		dataparametro: [],
		dataUltimaMembresiaPorCliente:[]
	},
	reducers: {
		onSetParametro: (state, { payload }) => {
			state.dataparametro = payload;
		},
		buscarLabelPorValue: (state, { payload }) => {
			const objetoEncontrado = state.dataparametro.find((objeto) => objeto.value === payload);
			return objetoEncontrado ? objetoEncontrado.label : null;
		},
		onSetUltimaMembresiaPorCliente: (state, { payload }) => {
            state.dataUltimaMembresiaPorCliente = payload;
        }
		
	},
});
export const { onSetParametro, buscarLabelPorValue, onSetUltimaMembresiaPorCliente } = parametroSlice.actions;
