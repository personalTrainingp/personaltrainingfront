import { createSlice } from '@reduxjs/toolkit';
export const cuentasBalancesSlice = createSlice({
	name: 'CUENTASBALANCES',
	initialState: {
		dataView: [
			{
				id_concepto: 0,
				monto: 0,
				moneda: 'PEN',
				fecha_comprobante: '',
				id_prov: 0,
				descripcion: '',
				id_empresa: 0,
			},
		],
	},
	reducers: {
		onSetDataViewCuentasBalances: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewCuentasBalances } = cuentasBalancesSlice.actions;
