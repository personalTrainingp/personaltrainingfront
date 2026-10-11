import { PTApi } from '@/common/api/';
import { useState } from 'react';

const TC_DEFAULT = { precio_venta: 3.35 };

// Vista publica (sin login): guarda los articulos en estado local, no en redux
export const useViewInventario = () => {
	const [articulos, setArticulos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const obtenerArticulos = async (id_enterprice) => {
		setIsLoading(true);
		setError(null);
		try {
			const [{ data }, { data: dataTC }, { data: dataEtiq }] = await Promise.all([
				PTApi.get(`/inventario/obtener-inventario/${id_enterprice}`),
				PTApi.get('/tipocambio/'),
				PTApi.get('/parametros/get_params/etiquetas/articulo/etiqueta_busqueda'),
			]);
			const arrayEtiquetas = (dataEtiq.etiquetasxID || []).map((t) => ({
				id_fila: t.id_fila,
				value: t.parametro_etiqueta?.id_param,
				label: t.parametro_etiqueta?.label_param,
			}));
			const data_articulos = data.articulos.map((m) => {
				const TC = dataTC.tipoCambios.find(
					(f) => new Date(f.fecha).toISOString().split('T')[0] === m.fecha_entrada
				);
				const etiquetas_busquedas = arrayEtiquetas.filter((f) => f.id_fila === m.id);
				return {
					tipoCambio: TC ? TC : TC_DEFAULT,
					etiquetas_busquedas,
					...m,
					etiquetas_str: etiquetas_busquedas.map((e) => `${e.label}`).join(', '),
				};
			});
			setArticulos(data_articulos);
		} catch (error) {
			console.log(error);
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return { articulos, isLoading, error, obtenerArticulos };
};
