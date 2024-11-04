import { createSlice } from "@reduxjs/toolkit";
import { actions } from "react-table";
import { proveedorSlice } from "../dataProveedor/proveedorSlice";
export const terminologiaSlice = createSlice({
    name:'terminologia',
    initialState:{
        errorMessage:undefined,
        status:undefined,
        terminologia:{
            id_param: '',
            entidad_param: '',
            grupo_param: '',
            sigla_param: '',
            label_param: '',
            estado_param: '',
            flag: true,
        },
    },
    reducers:{
        onSetTerminologia: (state , { payload })=>{
            state.terminologia = payload;
        },
    },
});

export const {
    onSetTerminologia,
} = terminologiaSlice.actions;
export default terminologiaSlice.reducer;