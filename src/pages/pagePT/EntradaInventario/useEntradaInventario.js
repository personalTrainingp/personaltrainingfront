import { PTApi } from '@/common';
import { useState } from 'react';

export const useEntradaInventario = () => {
	const [dataArticulos, setdataArticulos] = useState([]);
	const [dataMotivos, setdataMotivos] = useState([]);
	const [dataPrincipal, setdataPrincipal] = useState([]);
	const obtenerArticulosInventario = async () => {
		try {
			const { data } = await PTApi.get('/inventario/obtener-inventario/598');
			console.log(data, 'dddd');
			const dataAlter = data.articulos.map((a) => {
				return {
					value: a.id,
					label: a.producto,
				};
			});
			setdataArticulos(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTablePrincipal = async () => {
		try {
            const alter = [
                {
                    
                }
            ]
			setdataPrincipal();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMotivos = async () => {
		try {
			const { data } = await PTApi.get('');
			setdataMotivos(data.articulos);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTablePrincipal,
		obtenerArticulosInventario,
		dataArticulos,
		obtenerMotivos,
		dataMotivos,
	};
};
