import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
	name: 'ui',
	initialState: {
		dataView: [],
		loading: false,
	},
	reducers: {
		onSetData: (state, {payload}) => {
			state.dataView=payload
		},
		RESET_DATA: () => {
			state.dataView=[]
		},
	},
});
export const { onSetData } = uiSlice.actions;
