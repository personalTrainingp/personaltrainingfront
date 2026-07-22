import { createSlice } from '@reduxjs/toolkit';
export const imaginariaSlice = createSlice({
	name: 'IMAGINARIA_FLUJO_CAJA',
	initialState: {
		errorMessage: undefined,
		dataGrupoGastos: [],
		dataGrupoIngresos: [],
		terminologiasUsadasGastos: [],
		terminologiasUsadasIngresos: [],
	},
	reducers: {
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
	onUpdateGrupoIngresos,
	onUpdateGrupoGastos,
	onSetDataGrupoGastos,
	onSetDataGruposIngresos,
	onSetDataTerminologiasUsadasGastos,
	onSetDataTerminologiasUsadasIngresos,
} = imaginariaSlice.actions;
