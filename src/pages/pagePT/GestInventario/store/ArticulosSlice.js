import { createSlice } from '@reduxjs/toolkit';
export const ArticuloSlice = createSlice({
	name: 'ARTICULOS',
	initialState: {
		dataView: [
			{
				producto: '',
				id_marca: 0,
				descripcion: '',
				cantidad: 0,
				id_lugar: 0,
				id_empresa: 0,
				costo_unitario_soles: 0,
				costo_unitario_dolares: 0,
				mano_obra_soles: 0,
				mano_obra_dolares: 0,
				modelo: '',
				fecha_entrada: '',
			},
		],
	},
	reducers: {
		onSetDataViewArticulos: (state, { payload }) => {
			state.dataView = payload;
		},
	},
});
export const { onSetDataViewArticulos } = ArticuloSlice.actions;
