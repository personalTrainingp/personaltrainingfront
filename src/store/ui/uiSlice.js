import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
	name: 'ui',
	initialState: {
		dataView: [],
		loading: false,
		viewSubTitle: '',
	},
	reducers: {
		onSetData: (state, { payload }) => {
			state.dataView = payload;
		},
		RESET_DATA: () => {
			state.dataView = [];
		},
		onSetViewSubTitle: (state, { payload }) => {
			state.viewSubTitle = payload;
		},
	},
});
export const { onSetData, onSetViewSubTitle } = uiSlice.actions;
