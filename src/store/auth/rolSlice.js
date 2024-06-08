import { createSlice } from '@reduxjs/toolkit';
export const rolSlice = createSlice({
	name: 'auth',
	initialState: {
		status: 'authenticated', //'aunthenticated', 'not-authenticated'
		user: {
			name: '',
			uid: '',
			email: '',
			role: '',
		},
		errorMessage: undefined,
	},
	reducers: {
		onChecking: (state) => {
			(state.status = 'checking'), (state.user = {}), (state.errorMessage = undefined);
		},
		onLogin: (state, { payload }) => {
			(state.status = 'authenticated'),
				(state.user = payload),
				(state.errorMessage = undefined);
		},
		clearErrorMessage: (state) => {
			state.errorMessage = undefined;
		},
		onLogout: (state, { payload }) => {
			(state.status = 'not-authenticated'), (state.user = {}), (state.errorMessage = payload);
		},
		onRegisterUser: (state, { payload }) => {
			state.user = payload;
		},
	},
});
export const { onChecking, onLogin, onLogout, clearErrorMessage, onRegisterUser } =
	rolSlice.actions;
