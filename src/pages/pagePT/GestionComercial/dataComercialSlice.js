import { createSlice } from '@reduxjs/toolkit';
export const ComercialSlice = createSlice({
	name: 'COMERCIAL',
	initialState: {
		dataView: [
			{
				nombres: '',
				apellidos: '',
				celular: '',
				ubigeo_distrito_residencia: '',
				id_canal: 0,
				id_medio_comunicacion: 0,
				id_pgm: 0,
				id_estado: 0,
				id_empl: 0,
			},
		],
	},
	reducers: {
		onSetDataViewComercial: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewComercial } = ComercialSlice.actions;
