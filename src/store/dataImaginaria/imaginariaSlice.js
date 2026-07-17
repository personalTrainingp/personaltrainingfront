import { createSlice } from "@reduxjs/toolkit";
export const imaginariaSlice = createSlice({
  name: "IMAGINARIA_FLUJO_CAJA",
  initialState: {
    errorMessage: undefined,
    dataGrupo: [],
    items: [],
    terminologiasUsadas: [],
  },
  reducers: {
    onSetDataGrupo: (state, action) => {
      state.dataGrupo = [...state.dataGrupo, ...action.payload];
    },
    onSetDataItems: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    onSetDataTerminologiasUsadas: (state, action) => {
      state.terminologiasUsadas = [
        ...state.terminologiasUsadas,
        ...action.payload,
      ];
    },
  },
});
export const { onSetDataGrupo, onSetDataItems, onSetDataTerminologiasUsadas } =
  imaginariaSlice.actions;
