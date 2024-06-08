import { createSlice } from '@reduxjs/toolkit';
export const proveedorSlice = createSlice({
	name: 'prov',
	initialState: {
		errorMessage: undefined,
		status: 'undefined',
		proveedor: {
			ruc_prov: '',
			razon_social_prov: '',
			tel_prov: '',
			email_prov: '',
			direccion_prov: '',
			dni_vend_prov: '',
			nombre_vend_prov: '',
			tel_vend_prov: '',
			email_vend_prov: '',
			estado_prov: true,
		},
		dataProveedores: [],
		modalProvSlice: false,
	},
	reducers: {
		onSetProveedores: (state, { payload }) => {
			state.dataProveedores = payload;
		},
		onRegisterProveedor: (state, action) => {
			state.proveedor = action.payload;
		},
		onViewProveedor: (state, action) => {
			state.proveedor = action.payload;
		},
	},
});
export const { onModalInfoProv, onSetProveedores, onRegisterProveedor } = proveedorSlice.actions;
