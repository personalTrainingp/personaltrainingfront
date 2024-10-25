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
		trabajoProv: {
			id_prov: 0,
			cod_trabajo: '',
			penalidad_fijo: '',
			fecha_inicio: new Date(),
			fecha_fin: new Date(),
			hora_fin: '',
			penalidad_fijo: 0,
			penalidad_porcentaje: 0,
			estado_prov: '',
			monto_contrato: 0,
			observaciones: '',
		},
		dataContratoProv: [],
		dataAgentes: [],
		dataProveedores: [],
		dataProvCOMBO: [],
		modalProvSlice: false,
	},
	reducers: {
		onSetProveedores: (state, { payload }) => {
			state.dataProveedores = payload;
		},
		onSetAgentes: (state, { payload }) => {
			state.dataAgentes = payload;
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
		onViewContratoxProv: (state, action) => {
			state.dataContratoProv = action.payload;
		},
	},
});
export const {
	onModalInfoProv,
	onSetProveedores,
	onSetAgentes,
	onSetProveedoresCOMBO,
	onRegisterProveedor,
	onViewContratoxProv,
} = proveedorSlice.actions;
