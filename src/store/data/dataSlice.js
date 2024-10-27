import { createSlice } from '@reduxjs/toolkit';
export const dataSlice = createSlice({
	name: 'DATA',
	initialState: {
		dataView: [],
		BASE64_FIRMA: '',
	},
	reducers: {
		onSetDataView: (state, { payload }) => {
			state.dataView = payload;
		},
		onSetBase64Firma: (state, { payload }) => {
			state.BASE64_FIRMA = payload;
		},
	},
});
export const { onSetDataView, onSetBase64Firma } = dataSlice.actions;
