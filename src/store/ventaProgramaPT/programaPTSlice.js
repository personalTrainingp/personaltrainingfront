import { createSlice } from '@reduxjs/toolkit';
export const programaPTSlice = createSlice({
	name: 'pgmPT',
	initialState: {
		datapgmPT: [],
		// gastoFijo: {
		// 	sigla_gf: '',
		// 	nombre_gf: '',
		// 	diaPago_gf: 0,
		// },
		select_SEMANA: {},
		select_TARIFA: {
			id_tt: 0,
			nombreTarifa_tt: '',
			descripcionTarifa_tt: '',
			tarifaCash_tt: '',
			estado_tt: true,
		},
		select_HORARIO: {
			id_hr: 0,
			hora: '',
		},
		data_PGM: {},
	},
	reducers: {
		getProgramaSPT: (state, action) => {
			state.datapgmPT = action.payload;
		},
		setProgramaPT: (state, action) => {
			state.data_PGM = action.payload;
		},
		GETSEMANASxpt: (state, action) => {
			state.select_SEMANA = action.payload;
		},
		GETTARIFAxpt: (state, action) => {
			state.select_TARIFA = action.payload;
		},
	},
});
export const { getProgramaSPT, GETSEMANASxpt, GETTARIFAxpt, setProgramaPT } =
	programaPTSlice.actions;
