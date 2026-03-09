import { createSlice } from '@reduxjs/toolkit';
export const ColaboradoresSlice = createSlice({
	name: 'COLABORADORES',
	initialState: {
		dataView: [],
	},
	reducers: {
		onSetDataView: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataView } = ColaboradoresSlice.actions;
