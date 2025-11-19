import { createSlice } from '@reduxjs/toolkit';
export const dataPenalidadSlice = createSlice({
	name: 'PENALIDAD',
	initialState: {
		dataView: [
			{
				id_tipo_penalidad: 0,
				fecha: '',
				monto: 0,
				observacion: '',
			},
		],
	},
	reducers: {
		onSetDataView: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const {
	onUpdateDataRes,
	onSetMultiDate,
	onSetDataView,
	onSetBase64Firma,
	onViewSection,
	onSetRangeDate,
	onDataFail,
} = dataSlice.actions;
