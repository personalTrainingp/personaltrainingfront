import { createSlice } from '@reduxjs/toolkit';
export const authEmplSlice = createSlice({
	name: 'authEmpl',
	initialState: {
		status: 'empty', //'empty', 'full'
		userEmpleado: {},
		userAvatar: {},
		errorMessage: undefined,
		Dataempleados: [],
		DataUsuarios: [],
	},
	reducers: {
		onLoadingEmpl: (state) => {
			(state.status = 'load'), (state.user = {}), (state.errorMessage = undefined);
		},
		onSetEmpl: (state, { payload }) => {
			(state.status = 'full'),
				(state.userEmpleado = payload),
				(state.errorMessage = undefined);
		},
		clearErrorMessage: (state) => {
			state.errorMessage = undefined;
		},
		onSetEmpleados: (state, { payload }) => {
			state.Dataempleados = payload;
		},
		onSetUsuarios: (state, { payload }) => {
			state.DataUsuarios = payload;
		},
	},
});
export const { onLoadingEmpl, onSetEmpl, onSetEmpleados, clearErrorMessage, onSetUsuarios } =
	authEmplSlice.actions;
