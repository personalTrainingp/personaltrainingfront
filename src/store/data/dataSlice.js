import { createSlice } from '@reduxjs/toolkit';
export const dataSlice = createSlice({
	name: 'dataV',
	initialState: {
		dataView: [],
	},
	reducers: {
		onSetDataView: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataView } = dataSlice.actions;
