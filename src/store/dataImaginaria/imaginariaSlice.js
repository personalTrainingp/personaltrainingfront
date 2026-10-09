import { createSlice } from '@reduxjs/toolkit';

// Montos del flujo de caja cambiados solo en la vista: se guardan en el localStorage
// (solo en esta PC/navegador), nunca en la base de datos.
const STORAGE_MONTOS_EDITADOS = 'flujoCaja.montosEditados';
const leerMontosEditados = () => {
	try {
		const guardado = JSON.parse(localStorage.getItem(STORAGE_MONTOS_EDITADOS) || '{}');
		return guardado && typeof guardado === 'object' && !Array.isArray(guardado) ? guardado : {};
	} catch {
		return {};
	}
};
const guardarMontosEditados = (montos) => {
	try {
		localStorage.setItem(STORAGE_MONTOS_EDITADOS, JSON.stringify(montos));
	} catch {
		// sin localStorage (modo privado, bloqueado): el cambio queda solo mientras la pagina este abierta
	}
};
export const imaginariaSlice = createSlice({
	name: 'IMAGINARIA_FLUJO_CAJA',
	initialState: {
		errorMessage: undefined,
		dataGrupoGastos: [],
		dataGrupoIngresos: [],
		terminologiasUsadasGastos: [],
		terminologiasUsadasIngresos: [],
		// Flujo de caja: montos cambiados solo en la vista (localStorage, no se envian a la BD).
		// clave "empresa|anio|cat|grupo|concepto|mes" -> monto
		montosEditados: leerMontosEditados(),
		// Modo "Editar montos": doble click edita el monto y el click no abre el modal de detalle
		modoEditarMontos: false,
	},
	reducers: {
		onToggleModoEditarMontos: (state) => {
			state.modoEditarMontos = !state.modoEditarMontos;
		},
		onSetMontoEditado: (state, action) => {
			const { clave, monto } = action.payload;
			state.montosEditados[clave] = monto;
			guardarMontosEditados({ ...state.montosEditados });
		},
		onQuitarMontoEditado: (state, action) => {
			delete state.montosEditados[action.payload];
			guardarMontosEditados({ ...state.montosEditados });
		},
		onSetDataGrupoGastos: (state, action) => {
			state.dataGrupoGastos = [...action.payload].sort((a, b) => a.orden - b.orden);
		},
		onSetDataGruposIngresos: (state, action) => {
			state.dataGrupoIngresos = [...action.payload].sort((a, b) => a.orden - b.orden);
		},
		onSetDataTerminologiasUsadasIngresos: (state, action) => {
			state.terminologiasUsadasIngresos = [
				...state.terminologiasUsadasIngresos,
				...action.payload,
			];
		},
		onSetDataTerminologiasUsadasGastos: (state, action) => {
			state.terminologiasUsadasGastos = [
				...state.terminologiasUsadasGastos,
				...action.payload,
			];
		},
		onUpdateGrupoGastos: (state, action) => {
			state.dataGrupoGastos = state.dataGrupoGastos.map((grupo) => {
				return {
					...grupo,
					parametro_grupo_gasto: grupo.parametro_grupo_gasto.map((gasto) => {
						if (gasto.id === action.payload.id_gasto) {
							return {
								...gasto,
								itemsxDia: gasto.itemsxDia.map((item) => {
									if (item.fecha === action.payload.fecha) {
										return {
											...item,
											monto: action.payload.monto,
											monto_pagados: action.payload.monto_pagados,
											monto:
												action.payload.monto_pagados +
												item.monto_no_pagados,
										};
									}

									return item;
								}),
							};
						}
						return gasto;
					}),
				};
			});
		},
		onUpdateGrupoIngresos: (state, action) => {
			state.dataGrupoIngresos = state.dataGrupoIngresos.map((grupo) => {
				return {
					...grupo,
					parametro_grupo_gasto: grupo.parametro_grupo_gasto.map((gasto) => {
						if (gasto.id === action.payload.id_gasto) {
							return {
								...gasto,
								itemsxDia: gasto.itemsxDia.map((item) => {
									if (item.fecha === action.payload.fecha) {
										return {
											...item,
											monto: action.payload.monto,
											monto_pagados: action.payload.monto_pagados,
											monto:
												action.payload.monto_pagados +
												item.monto_no_pagados,
										};
									}

									return item;
								}),
							};
						}
						return gasto;
					}),
				};
			});
		},
	},
});
export const {
	onToggleModoEditarMontos,
	onSetMontoEditado,
	onQuitarMontoEditado,
	onUpdateGrupoIngresos,
	onUpdateGrupoGastos,
	onSetDataGrupoGastos,
	onSetDataGruposIngresos,
	onSetDataTerminologiasUsadasGastos,
	onSetDataTerminologiasUsadasIngresos,
} = imaginariaSlice.actions;
