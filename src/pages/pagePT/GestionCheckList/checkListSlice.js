import { createSlice } from '@reduxjs/toolkit';

export const CheckListSlice = createSlice({
	name: 'CHECKLIST',
	initialState: {
		dataView: [],
		dataViewHistorial: [],
	},
	reducers: {
		onSetDataViewCheckList: (state, { payload }) => {
			state.dataView = payload;
		},
		onSetDataViewHistorialCheckList: (state, { payload }) => {
			state.dataViewHistorial = payload;
		},
	},
});

export const { onSetDataViewCheckList, onSetDataViewHistorialCheckList } =
	CheckListSlice.actions;
