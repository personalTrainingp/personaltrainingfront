import { createSlice } from '@reduxjs/toolkit';
export const dataSlice = createSlice({
	name: 'DATA',
	initialState: {
		dataView: [],
		BASE64_FIRMA: null,
		section_item: null,
	},
	reducers: {
		onSetDataView: (state, { payload }) => {
			state.dataView = payload;
		},
		onSetBase64Firma: (state, { payload }) => {
			state.BASE64_FIRMA = payload;
		},
		onViewSection: (state, { payload }) => {
			state.section_item = payload;
		},
	},
});
export const { onSetDataView, onSetBase64Firma, onViewSection } = dataSlice.actions;
