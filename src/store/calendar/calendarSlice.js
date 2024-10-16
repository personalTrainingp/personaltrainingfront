import { createSlice } from '@reduxjs/toolkit';
export const CalendarSlice = createSlice({
	name: 'calendar',
	initialState: {
		daySelected: new Date(),
		data: []
	},
	reducers: {
		onChangeDaySelected: (state, { payload }) => {
			state.daySelected = payload;
		},
		onGetCitas: (state, {payload})=>{
			state.data = payload;
		}
	},
});
export const { onGetImpuestos, onChangeDaySelected, onGetCitas } = CalendarSlice.actions;
