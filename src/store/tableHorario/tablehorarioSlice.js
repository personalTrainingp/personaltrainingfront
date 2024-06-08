import { createSlice } from '@reduxjs/toolkit';
export const tablehorarioSlice = createSlice({
	name: 'hrpgmPT',
	initialState: {
		datahrpgm: [],
		hrpgm: {
			id_horarioPgm: 0,
			aforo_HorarioPgm: 0,
			time_HorarioPgm: '00:00:00',
			trainer_HorarioPgm: '',
			estado_HorarioPgm: false,
		},
	},
	reducers: {
		getHorarioPgm: (state, action) => {
			state.hrpgm = action.payload;
		},
	},
});
export const { getHorarioPgm } = tablehorarioSlice.actions;
