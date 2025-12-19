import { createSlice } from '@reduxjs/toolkit';
export const AporteSlice = createSlice({
	name: 'APORTE',
	initialState: {
		dataView: [
			{
				id_concepto: 0,
				n_comprobante: '',
				n_operacion: '',
				id_prov: 0,
				id_estado: 0,
				descripcion: '',
				monto: 0.0,
				id_comprobante: 0,
				fecha_comprobante: '',
				fecha_pago: '',
				id_forma_pago: 0,
				id_tipo_moneda: 0,
				id_banco: 0,
				id_tarjeta: 0,
			},
		],
	},
	reducers: {
		onSetDataViewAportes: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewAportes } = AporteSlice.actions;
