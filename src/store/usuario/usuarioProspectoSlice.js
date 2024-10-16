import { createSlice } from '@reduxjs/toolkit';
export const authProspectoSlice = createSlice({
	name: 'authProspec',
	initialState: {
		status: 'empty', //'empty', 'full'
		userProspecto: {},
		userAvatar: {},
		errorMessage: undefined,
		Dataprospectos: [],
	},
	reducers: {
		onLoadingProspec: (state) => {
			(state.status = 'load'), (state.user = {}), (state.errorMessage = undefined);
		},
		onSetProspec: (state, { payload }) => {
			(state.status = 'full'),
				(state.userProspecto = payload),
				(state.errorMessage = undefined);
		},
		onFinishSuccessStatus: (state, action) => {
			state.status = 'full';
		},
		clearErrorMessage: (state) => {
			state.errorMessage = undefined;
		},
		onSetProspectos: (state, { payload }) => {
			state.Dataprospectos = payload;
		},
	},
});
export const {
	onLoadingProspec,
	onSetProspec,
	onSetProspectos,
	clearErrorMessage,
	onFinishSuccessStatus,
} = authProspectoSlice.actions;