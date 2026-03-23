import { createSlice } from '@reduxjs/toolkit';
export const terminologiasSlice = createSlice({
	name: 'TERM',
	initialState: {
		dataViewTerm: [],
		dataViewTerm2: [
			{
				id_tipoGasto: 0,
				id_grupo: 0,
				nombre_gasto: '',
				orden: 0,
			},
		],
		dataViewTerm3: [
			{
				id_tipoGasto: 0,
				id_grupo: 0,
				nombre_gasto: '',
				orden: 0,
			},
		],
		dataViewTerm4: [
			{
				id: 0,
				param_label: '',
				orden: 0,
			},
		],
	},
	reducers: {
		onSetDataViewTerm2: (state, { payload }) => {
			state.dataViewTerm2 = payload;
		},
		onSetDataViewTerm: (state, { payload }) => {
			state.dataViewTerm = payload;
		},
		onSetDataViewTerm4: (state, { payload }) => {
			state.dataViewTerm4 = payload;
		},
	},
});
export const { onSetDataViewTerm2, onSetDataViewTerm, onSetDataViewTerm4 } =
	terminologiasSlice.actions;
