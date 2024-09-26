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
		trabajoProv:{
			codTrabajo: '',
			id_prov: 0,
			fecha_inicio: '',
			fecha_fin: '',
			hora_fin: '',
		},
		dataProveedores: [],
		dataProvCOMBO: [],
		modalProvSlice: false,
	},
	reducers: {
		onSetProveedores: (state, { payload }) => {
			state.dataProveedores = payload;
		},
		onSetProveedoresCOMBO: (state, { payload }) => {
			state.dataProvCOMBO = payload;
		},
		onRegisterProveedor: (state, action) => {
			state.proveedor = action.payload;
		},
		onViewProveedor: (state, action) => {
			state.proveedor = action.payload;
		},
	},
});
export const { onModalInfoProv, onSetProveedores, onSetProveedoresCOMBO, onRegisterProveedor } = proveedorSlice.actions;
