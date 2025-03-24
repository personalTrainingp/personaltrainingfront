import { createSlice } from '@reduxjs/toolkit';
export const dataSlice = createSlice({
	name: 'DATA',
	initialState: {
		dataEntrada: [],
		dataView: [],
		dataF: [],
		dataRes: [],
		BASE64_FIRMA: null,
		section_item: null,
		RANGE_DATE: [new Date(2024, 8, 16), new Date()],
		MULTI_DATE: [],
	},
	reducers: {
		onDataFail: (state, { payload }) => {
			if (state.dataRes?.length > 0) {
				state.dataRes = [];
				state.dataRes = payload;
			}
			state.dataRes = payload;
		},
		onUpdateDataRes: (state, { payload }) => {
			const { index, field, value } = payload;
			state.dataRes = state.dataRes.map((item, i) =>
				i === index ? { ...item, [field]: value } : item
			);
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
	onUpdateDataRes,
	onSetMultiDate,
	onSetDataView,
	onSetBase64Firma,
	onViewSection,
	onSetRangeDate,
	onDataFail,
} = dataSlice.actions;
