import { createSlice } from '@reduxjs/toolkit';
export const GastosSlice = createSlice({
	name: 'finanzas',
	initialState: {
		dataParametrosGastos: [],
		dataGastos: [],
		dataProvUnicosxGasto: [],
		dataNombreGastoxGasto:[]
	},
	reducers: {
		onSetParametrosGastos: (state, { payload }) => {
			state.dataParametrosGastos = payload;
		},
		onSetGastos: (state, { payload }) => {
			state.dataGastos = payload;
		},
		onSetProveedoresUnicosxGasto: (state, { payload }) => {
			state.dataProvUnicosxGasto = payload;
		},
		onSetNombreGastoxGasto: (state, { payload }) => {
            state.dataNombreGastoxGasto = payload;
        },
	},
});
export const { onSetParametrosGastos, onSetGastos, onSetProveedoresUnicosxGasto, onSetNombreGastoxGasto } =
	GastosSlice.actions;
