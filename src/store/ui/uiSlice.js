import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
	name: 'ui',
	initialState: {
		minutosperCita: 0,
		dataView: [],
		loading: false,
		viewSubTitle: '',
		cadenaBLOB: '',
		colorEmpresa: 'bg-change',
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
		onSetColorView: (state, { payload }) => {
			state.colorEmpresa = payload;
		},
		onSetMinPerCita: (state, { payload }) => {
			state.minutosperCita = payload;
		},
	},
});
export const {
	onSetData,
	onSetMinPerCita,
	onSetViewSubTitle,
	onSetColorView,
	onSetCadenaBLOB,
	onSetFileBLOB,
	onClearFileBLOB,
} = uiSlice.actions;
