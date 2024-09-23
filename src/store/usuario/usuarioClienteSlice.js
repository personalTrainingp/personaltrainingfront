import { createSlice } from '@reduxjs/toolkit';
export const authClientSlice = createSlice({
	name: 'authClient',
	initialState: {
		status: 'empty', //'empty', 'full'
		userCliente: {},
		userAvatar: {},
		errorMessage: undefined,
		Dataclientes: [],
		dataNutricion_DIETA: [],
		dataNutricion_HISTORIAL_CLINICO: [],
	},
	reducers: {
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
		clearErrorMessage: (state) => {
			state.errorMessage = undefined;
		},
		onSetClientes: (state, { payload }) => {
			state.Dataclientes = payload;
		},
		onSetNutricionDIETA: (state, { payload }) => {
			state.dataNutricion_DIETA = payload;
		},
	},
});
export const {
	onLoadingClient,
	onSetNutricionDIETA,
	onSetClient,
	onSetClientes,
	clearErrorMessage,
	onFinishSuccessStatus,
} = authClientSlice.actions;
