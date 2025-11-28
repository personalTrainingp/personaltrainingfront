import { createSlice } from '@reduxjs/toolkit';
export const MovimientosSlice = createSlice({
	name: 'MOVIMIENTO',
	initialState: {
		dataView: [
			{
				id_articulo: 0,
				id_lugar_destino: 0,
				fechaCambio: 0,
				movimiento: '',
				observacion: '',
				id_motivo: 0,
				id_empresa: 0,
			},
		],
	},
	reducers: {
		onSetDataViewMovimiento: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewMovimiento } = MovimientosSlice.actions;
