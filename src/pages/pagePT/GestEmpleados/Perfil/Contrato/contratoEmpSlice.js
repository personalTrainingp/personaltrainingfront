import { createSlice } from '@reduxjs/toolkit';
export const contratoEmpSlice = createSlice({
    name: 'CONTRATOEMP',
    initialState: {
        dataView: [],
    },
    reducers: {
        onSetDataView: (state, { payload }) => {
            state.dataView = payload;
        },
    },
});
export const { onSetDataView } = contratoEmpSlice.actions;
