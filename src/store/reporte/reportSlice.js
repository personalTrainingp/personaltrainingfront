import { createSlice } from '@reduxjs/toolkit';
export const reportSlice = createSlice({
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
	},
});
export const {  } = reportSlice.actions;
