import { createSlice } from '@reduxjs/toolkit';

export const usuarioSlice = createSlice({
	name: 'usuario',
	initialState: {
		usuarioCliente: {
			uidUser: '',
			uid_avatar_cli: '',
			nombre_cli: '',
			apPaterno_cli: '',
			apMaterno_cli: '',
			fecNac_cli: '',
			fecha_nacimiento: '',
			estCivil_cli: 0,
			sexo_cli: 0,
			tipoDoc_cli: 0,
			numDoc_cli: '',
			nacionalidad_cli: 0,
			ubigeo_distrito_cli: 0,
			direccion_cli: '',
			tipoCli_cli: 0,
			trabajo_cli: '',
			cargo_cli: '',
			email_cli: '',
			tel_cli: '',
			comentarios: [],
		},
		usuarioEmpleado: {},
		dataContactsEmerg: [],
		dataErrors: [],
		modelContsEmerg: {
			nombresCompletos_emerg: '',
			tel_emerg: '',
			relacion_emerg: 0,
		},
		comentarios: {
			comentario_com: '',
		},
	},
	reducers: {
		onSetUsuarioCliente: (state, action) => {
			state.usuarioCliente = action.payload;
		},
		onSetUsuarioEmpleado: (state, action) => {
			state.usuarioEmpleado = action.payload;
		},
		onSetUsuario_CE: (state, action) => {
			state.modelContsEmerg = action.payload;
		},
		onSetComentario: (state, action) => {
			state.comentarios = action.payload;
		},
		onResetComentario: (state, action) => {
			state.comentarios = {};
		},
		onOnePush_CE: (state, action) => {
			// console.log(state.dataContactsEmerg = [...state.dataContactsEmerg, {id: state.dataContactsEmerg.length + 1, ...action.payload}]);
			state.dataContactsEmerg = [
				...state.dataContactsEmerg,
				{ id: state.dataContactsEmerg.length + 1, ...action.payload },
			];
		},
		onOneDelete_CE: (state, action) => {
			state.dataContactsEmerg = state.dataContactsEmerg.filter(
				(CE) => CE.id !== action.payload
			);
		},
		onReset_CE: (state, action) => {
			state.dataContactsEmerg = [];
		},

		onDataErrors_PUSH: (state, action) => {
			state.dataErrors = [...state.dataErrors, action.payload];
		},
		onDataErrors_RESET: (state, action) => {
			state.dataErrors = [];
		},
	},
});
export const {
	onSetUsuarioEmpleado,
	onSetUsuarioCliente,
	onSetUsuario_CE,
	onSetComentario,
	onOnePush_CE,
	onOneDelete_CE,
	onReset_CE,
	onResetComentario,
	onDataErrors_PUSH,
	onDataErrors_RESET,
} = usuarioSlice.actions;
