import { createSlice } from '@reduxjs/toolkit';
export const dataSlice = createSlice({
	name: 'DATA',
	initialState: {
		dataEntrada: [],
		dataView: [],
		dataF: [],
		dataRes: [],
		BASE64_FIRMA: null,
		section_item: null,
		RANGE_DATE: [
			new Date(new Date().getFullYear(), new Date().getMonth(), 1),
			new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
		],
		MULTI_DATE: [],
		corte: {
			inicio: 1,
			corte: 31,
			dia: [1, 31],
		},
		modalProveedor: {
			ruc_prov: '',
			razon_social_prov: '',
			tel_prov: '',
			cel_prov: '',
			email_prov: '',
			direc_prov: '',
			dni_vend_prov: '',
			nombre_vend_prov: '',
			cel_vend_prov: '',
			email_vend_prov: '',
			estado_prov: false,
			id_oficio: 0,
			nombre_contacto: '',
			es_agente: false,
			id_empresa: 0,
		},
	},
	reducers: {
		registroProveedor: (state, action) => {

			return {
				...state,
				...action.payload,
			};
		},
		onDataFail: (state, { payload }) => {
			if (state.dataRes?.length > 0) {
				state.dataRes = [];
				state.dataRes = payload;
			}
			state.dataRes = payload;
		},
		onUpdateDataRes: (state, { payload }) => {
			const { index, field, value } = payload;
			state.dataRes = state.dataRes.map((item, i) =>
				i === index ? { ...item, [field]: value } : item
			);
		},
		onSetDataView: (state, { payload }) => {
			if (state.dataView?.length > 0) {
				state.dataView = [];
				state.dataView = payload;
			}
			state.dataView = payload;
		},
		onSetBase64Firma: (state, { payload }) => {
			state.BASE64_FIRMA = payload;
		},
		onViewSection: (state, { payload }) => {
			state.section_item = payload;
		},
		onSetRangeDate: (state, { payload }) => {
			state.RANGE_DATE = payload;
		},
		onSetCorte: (state, { payload }) => {
			state.corte = payload;
			state.corte.dia = Array.from(
				{ length: payload.corte - payload.inicio + 1 },
				(_, i) => payload.inicio + i
			);
		},
		onSetMultiDate: (state, { payload }) => {
			state.MULTI_DATE = payload;
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
	onSetCorte,
	onDataFail,
	registroProveedor,
} = dataSlice.actions;
