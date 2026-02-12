import { createSlice } from '@reduxjs/toolkit';
export const EgresosSlice = createSlice({
	name: 'EGRESOS',
	initialState: {
		dataView: [],
	},
	reducers: {
		onSetDataViewEgresos: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewEgresos } = EgresosSlice.actions;
