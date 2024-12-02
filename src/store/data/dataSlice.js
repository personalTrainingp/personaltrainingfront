import { createSlice } from '@reduxjs/toolkit';
export const dataSlice = createSlice({
	name: 'DATA',
	initialState: {
		dataView: [],
		BASE64_FIRMA: null,
		section_item: null,
		RANGE_DATE: [new Date(new Date().getFullYear(), 8, 16), new Date()],
	},
	reducers: {
		onSetDataView: (state, { payload }) => {
			if (state.dataView.length > 0) {
				state.dataView = [];
				state.dataView = payload;
			}
			state.dataView = payload;
		},
		onSetBase64Firma: (state, { payload }) => {
			state.BASE64_FIRMA = payload;
		},
		onViewSection: (state, { payload }) => {
			state.section_item = payload;
		},
		onSetRangeDate: (state, { payload }) => {
			state.RANGE_DATE = payload;
		},
	},
});
export const { onSetDataView, onSetBase64Firma, onViewSection, onSetRangeDate } = dataSlice.actions;
