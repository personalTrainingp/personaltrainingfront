import { createSlice } from '@reduxjs/toolkit';
export const ContratoProvSlice = createSlice({
	name: 'CONTRATOPROV',
	initialState: {
		dataView: [
			{
				id_prov: 0,
				fecha_inicio: '',
				fecha_fin: '',
				hora_fin: '',
				monto_contrato: 0.0,
				observacion: '',
				estado_contrato: 0,
				uid_presupuesto: '',
				uid_contrato: '',
				uid_compromisoPago: '',
				id_empresa: 0,
				mano_obra_soles: 0.0,
				mano_obra_dolares: 0.0,
				id_zona: 0,
				observacion: '',
			},
		],
	},
	reducers: {
		onSetDataViewContratoProv: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewContratoProv } = ContratoProvSlice.actions;
