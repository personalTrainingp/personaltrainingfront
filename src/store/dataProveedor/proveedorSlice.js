import { createSlice } from '@reduxjs/toolkit';
export const proveedorSlice = createSlice({
	name: 'prov',
	initialState: {
		errorMessage: undefined,
		status: 'undefined',
		proveedor: {
			id: 0,
			ruc_prov: '',
			razon_social_prov: '',
			tel_prov: '',
			cel_prov: '',
			email_prov: '',
			direccion_prov: '',
			dni_vend_prov: '',
			nombre_vend_prov: '',
			tel_vend_prov: '',
			email_vend_prov: '',
			estado_prov: true,
			uid_comentario: '',
			uid_contrato_proveedor: '',
			uid_presupuesto_proveedor: '',
			uid_documentso_proveedor: '',
			parametro_oficio: { label_param: '' },
			parametro_marca: { label_param: '' },
			tb_images: [{ name_image: '' }],
			id_oficio: 0,
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
		onDataPerfil: (state, action) => {
			state.proveedor = action.payload;
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
	onDataPerfil,
} = proveedorSlice.actions;
