import { createSlice } from '@reduxjs/toolkit';
export const authClientSlice = createSlice({
	name: 'authClient',
	initialState: {
		status: 'empty', //'empty', 'full'
		userCliente: [],
		userAvatar: {},
		errorMessage: [],
		Dataclientes: [],
		datafilesAdj: [],
		dataNutricion_DIETA: [],
		dataNutricion_HISTORIAL_CLINICO: [],
	},
	reducers: {
		onSetDataFileAdj: (state, { payload }) => {
			state.datafilesAdj = payload;
		},
		onLoadingClient: (state) => {
			(state.status = 'load'), (state.user = {}), (state.errorMessage = undefined);
		},
		onSetClient: (state, { payload }) => {
			(state.status = 'full'),
				(state.userCliente = payload),
				(state.errorMessage = undefined);
		},
		onFinishSuccessStatus: (state, action) => {
			state.status = 'full';
		},
		onAddArrayErrors: (state, action) => {
			state.errorMessage = [...state.errorMessage, ...action.payload];
		},
		clearErrorMessage: (state) => {
			state.errorMessage = [];
		},
		onSetClientes: (state, { payload }) => {
			state.Dataclientes = payload;
		},
		onSetNutricionDIETA: (state, { payload }) => {
			state.dataNutricion_DIETA = payload;
		},
		onSetHistorialClinico: (state, { payload }) => {
			state.dataNutricion_HISTORIAL_CLINICO = payload;
		},
	},
});
export const {
	onAddArrayErrors,
	onSetDataFileAdj,
	onLoadingClient,
	onSetNutricionDIETA,
	onSetClient,
	onSetClientes,
	clearErrorMessage,
	onFinishSuccessStatus,
	onSetHistorialClinico,
} = authClientSlice.actions;
