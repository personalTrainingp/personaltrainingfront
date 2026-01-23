import { createSlice } from '@reduxjs/toolkit';
export const terminologiasSlice = createSlice({
	name: 'TERMINOLOGIAS',
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
	},
	reducers: {
		onSetDataViewTerm2: (state, { payload }) => {
			state.dataViewTerm2 = payload;
		},
		onSetDataViewTerm: (state, { payload }) => {
			state.dataViewTerm = payload;
		},
	},
});
export const { onSetDataViewTerm2, onSetDataViewTerm } = terminologiasSlice.actions;
