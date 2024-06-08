import { createSlice } from '@reduxjs/toolkit';

export const metaSlice = createSlice({
	name: 'metaSlice',
	initialState: {
		dataMetas: [],
	},
	reducers: {
		onGetMetas: (state, { payload }) => {
			state.dataMetas = payload;
		},
	},
});
export const { onGetMetas } = metaSlice.actions;
