import { createSlice } from '@reduxjs/toolkit';
const initialState = {
	sections: [],
	modulos: [],
};
export const rutasSlice = createSlice({
	name: 'rutas',
	initialState: initialState,
	reducers: {
		onSetSections: (state, { payload }) => {
			state.sections = payload;
		},
		onSetModulos: (state, { payload }) => {
			state.modulos = payload;
		},
		RESET_INITIAL_RUTAS: () => initialState,
	},
});
export const { onSetSections, onSetModulos, RESET_INITIAL_RUTAS } = rutasSlice.actions;
