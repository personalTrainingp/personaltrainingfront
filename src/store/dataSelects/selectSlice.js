import { createSlice } from '@reduxjs/toolkit';
export const selectSlice = createSlice({
	name: 'options',
	initialState: {
		optionsGeneros: [],
		optionsEstCivil: [],
		optionsNacionalidad: [],
		optionsTipoDoc: [],
		optionsTipoCliente: [],
		optionsDistritos: [],
		optionsFamilia: [],

		optionsClasificacionProd: [],
		optionsArticuloProd: [],
		optionsUnidMedidasProd: [],
		optionsAlmacenProd: [],
		optionsUsoArtProd: [],
	},
	reducers: {
		onGetGeneros: (state, action) => {
			state.optionsGeneros = action.payload;
		},
		onGetEstadoCivil: (state, action) => {
			state.optionsEstCivil = action.payload;
		},
		onGetNacionalidad: (state, action) => {
			state.optionsNacionalidad = action.payload;
		},
		onGetTipoDoc: (state, action) => {
			state.optionsTipoDoc = action.payload;
		},
		onGetTipoCliente: (state, action) => {
			state.optionsTipoCliente = action.payload;
		},
		onGetDistrito: (state, action) => {
			state.optionsDistritos = action.payload;
		},
		onGetFamilia: (state, action) => {
			state.optionsFamilia = action.payload;
		},

		onGetClasificacionProd: (state, action) => {
			state.optionsClasificacionProd = action.payload
		},
		onGetArticuloProd: (state, action) => {
			state.optionsArticuloProd= action.payload
		},
		onGetUnidMedidasProd: (state, action) => {
			state.optionsUnidMedidasProd = action.payload
		},
		onGetAlmacenProd: (state, action) => {
			state.optionsAlmacenProd = action.payload
		},
		onGetUsoArtProd: (state, action) => {
			state.optionsUsoArtProd = action.payload
		},
	},
});
export const {
	onGetGeneros,
	onGetEstadoCivil,
	onGetNacionalidad,
	onGetTipoDoc,
	onGetTipoCliente,
	onGetDistrito,
	onGetFamilia,
	//OPCIONES PARA EL CONTROL DE INVENTARIO
	onGetUsoArtProd,
	onGetAlmacenProd,
	onGetUnidMedidasProd,
	onGetArticuloProd,
	onGetClasificacionProd
} = selectSlice.actions;
