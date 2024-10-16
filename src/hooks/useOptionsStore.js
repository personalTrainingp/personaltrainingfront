import { PTApi } from '@/common';
import {
	onGetAlmacenProd,
	onGetArticuloProd,
	onGetClasificacionProd,
	onGetDistrito,
	onGetEstadoCivil,
	onGetFamilia,
	onGetGeneros,
	onGetNacionalidad,
	onGetTipoCliente,
	onGetTipoDoc,
	onGetUnidMedidasProd,
	onGetUsoArtProd,
} from '@/store/dataSelects/selectSlice';
import { useDispatch } from 'react-redux';

export const useOptionsStore = () => {
	const dispatch = useDispatch();

	const obtenerTipoGeneros = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/sexo');
			dispatch(onGetGeneros(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTipoEstadoCivil = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/estado-civil');
			dispatch(onGetEstadoCivil(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTipoDoc = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/tipo-doc');
			dispatch(onGetTipoDoc(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTipoNacionalidad = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/nacionalidad');
			dispatch(onGetNacionalidad(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDistrito = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/ubigeo');
			dispatch(onGetDistrito(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTipoCliente = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/tipo-cliente');
			dispatch(onGetTipoCliente(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerFamilia = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/familia');
			dispatch(onGetFamilia(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerUsoArticuloProd = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/usoArt-inventario');
			dispatch(onGetUsoArtProd(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerAlmacenProd = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/almacen-inventario');
			dispatch(onGetAlmacenProd(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerUnidMedidasProd = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/unMed-inventario');
			dispatch(onGetUnidMedidasProd(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArticuloProd = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/articulos-inventario');
			dispatch(onGetArticuloProd(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerClasificacionProd = async () => {
		try {
			const { data } = await PTApi.get('/dataselect/clasificacion-inventario');
			dispatch(onGetClasificacionProd(data));
		} catch (error) {
			console.log(error);
		}
	};

	return {
		//Propiedades
		//Metodos
		obtenerTipoGeneros,
		obtenerTipoEstadoCivil,
		obtenerTipoNacionalidad,
		obtenerTipoDoc,
		obtenerTipoCliente,
		obtenerDistrito,
		obtenerFamilia,
		//FUNCIONES DE INVENTARIO
		obtenerUsoArticuloProd,
		obtenerAlmacenProd,
		obtenerUnidMedidasProd,
		obtenerArticuloProd,
		obtenerClasificacionProd
	};
};
