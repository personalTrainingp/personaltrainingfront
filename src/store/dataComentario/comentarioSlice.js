import { createSlice } from '@reduxjs/toolkit';
export const comentarioSlice = createSlice({
	name: 'comentarios',
	initialState: {
		dataComentarios: [],
	},
	reducers: {
		onSetComentarios: (state, { payload }) => {
			state.dataComentarios = payload;
		},
	},
});
export const { onSetComentarios } = comentarioSlice.actions;
