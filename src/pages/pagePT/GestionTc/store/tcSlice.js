import { createSlice } from '@reduxjs/toolkit';
export const TcSlice = createSlice({
	name: 'TC',
	initialState: {
		dataView: [
			{
				precio_venta: 0.00,
                precio_compra: 0.00,
                fecha: '',
			},
		],
	},
	reducers: {
		onSetDataViewTc: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewTc } = TcSlice.actions;
