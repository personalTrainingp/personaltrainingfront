import { createSlice } from '@reduxjs/toolkit';
export const rutasSlice = createSlice({
	name: 'rutas',
	initialState: {
		sections: [],
		modulos: [],
	},
	reducers: {
		onSetSections: (state, { payload }) => {
			state.sections = payload;
		},
		onSetModulos: (state, { payload }) => {
			state.modulos = payload;
		},
	},
});
export const { onSetSections, onSetModulos } = rutasSlice.actions;
