import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewhistCamInventarioSlice } from '../Store/histCamInventarioSlice';
import { MaskDate } from '@/components/CurrencyMask';
import { arrayEmpresaFinanAbrev } from '@/types/type';

export const useHistCamInventario = () => {
	const dispatch = useDispatch();
	const obtenerArticulosHistorialxIdEmpresa = async (idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/articulo/historial/${idEmpresa}`);
			dispatch(onSetDataViewhistCamInventarioSlice(data.historialArticulos));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerArticulosHistorialxIdEmpresa,
	};
};
