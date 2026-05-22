import { createSlice } from '@reduxjs/toolkit';
export const cambioProgramaSlice = createSlice({
	name: 'CAMBIOPROGRAMA',
	initialState: {
		dataView: [],
	},
	reducers: {
		onSetCambioPrograma: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetCambioPrograma } = cambioProgramaSlice.actions;
