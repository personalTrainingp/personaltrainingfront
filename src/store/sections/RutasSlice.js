import { createSlice } from '@reduxjs/toolkit';
const initialState = {
	sections: [],
	modulos: [],
	// modulo elegido en el selector de la barra superior ({name, path, key})
	moduloActual: null,
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
		onSetModuloActual: (state, { payload }) => {
			state.moduloActual = payload;
		},
		RESET_INITIAL_RUTAS: () => initialState,
	},
});
export const { onSetSections, onSetModulos, onSetModuloActual, RESET_INITIAL_RUTAS } = rutasSlice.actions;
