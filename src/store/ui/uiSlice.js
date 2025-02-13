import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
	name: 'ui',
	initialState: {
		dataView: [],
		loading: false,
		viewSubTitle: '',
		cadenaBLOB: '',
		BLOB: {
			cadenaBLOB: '',
			FILE: {},
		},
	},
	reducers: {
		onSetCadenaBLOB: (state, { payload }) => {
			state.BLOB.cadenaBLOB = payload;
		},
		onClearFileBLOB: (state) => {
			state.BLOB.FILE = {};
		},
		onSetFileBLOB: (state, { payload }) => {
			state.BLOB.FILE = payload;
		},
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
export const { onSetData, onSetViewSubTitle, onSetCadenaBLOB, onSetFileBLOB, onClearFileBLOB } =
	uiSlice.actions;
