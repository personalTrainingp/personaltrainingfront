import { createSlice } from '@reduxjs/toolkit';
export const gfGvSlice = createSlice({
	name: 'gf_gv',
	initialState: {
		dataGastosFijo: [],
		gastoFijo: {
			sigla_gf: '',
			nombre_gf: '',
			diaPago_gf: 0,
		},
		dataGastosVariable: [],
		gastoVariable: {
			sigla_gv: '',
			nombre_gv: '',
		},
	},
	reducers: {
		getGastosFijo: (state, action) => {
			state.dataGastosFijo = action.payload;
		},
		onRegisterGastoFijo: (state, action) => {
			state.gastoFijo = action.payload;
		},
		onRegisterGastoVariable: (state, action) => {
			state.gastoVariable = action.payload;
		},
		getGastosVariable: (state, action) => {
			state.dataGastosVariable = action.payload;
		},
	},
});
export const { getGastosFijo, onRegisterGastoFijo, getGastosVariable, onRegisterGastoVariable } = gfGvSlice.actions;
