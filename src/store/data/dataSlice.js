import { createSlice } from '@reduxjs/toolkit';
export const dataSlice = createSlice({
	name: 'DATA',
	initialState: {
		dataView: [],
		dataF: [],
		BASE64_FIRMA: null,
		section_item: null,
		RANGE_DATE: [new Date(2024, 8, 16), new Date()],
		MULTI_DATE: [],
	},
	reducers: {
		onDataFail: (state, { payload }) => {
			state.dataF = [...state.dataF, payload];
		},
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
		onSetMultiDate: (state, { payload }) => {
			state.MULTI_DATE = payload;
		},
	},
});
export const {
	onSetMultiDate,
	onSetDataView,
	onSetBase64Firma,
	onViewSection,
	onSetRangeDate,
	onDataFail,
} = dataSlice.actions;
