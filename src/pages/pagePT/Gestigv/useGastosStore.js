import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewEgresos } from './egresosSlice';
import { arrayFinanzas, arrayTipoIngresos } from '@/types/type';
import Swal from 'sweetalert2';
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio';

export const useGastosStore = () => {
	const [dataGasto, setdataGasto] = useState({
		id_tipoGasto: 0,
		id_oficio: 0,
		id_gasto: 0,
		grupo: '',
		moneda: '',
		monto: 0,
		id_tipo_comprobante: 0,
		id_estado_gasto: 1423,
		n_comprabante: '',
		impuesto_igv: false,
		impuesto_renta: false,
		fec_pago: '',
		fec_comprobante: '',
		id_forma_pago: 0,
		id_banco_pago: 0,
		n_operacion: '',
		id_prov: 0,
		id_contrato_prov: 0,
		id_porCobrar: 0,
		descripcion: '',
		esCompra: 0,
		id_empresa: 0,
	});
	const [loading, setloading] = useState(false);
	const dispatch = useDispatch();
	const [dataTC, setdataTC] = useState([]);
	const obtenerTc = async () => {
		try {
			const dataTipoTC = await obtenerTipoDeCambio();
			setdataTC(dataTipoTC);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastos = async (id_empresa) => {
		try {
			setloading(true);
			const { data } = await PTApi.get(`/gastosigv/empresa/${id_empresa}`);

			setloading(false);
			dispatch(onSetDataViewEgresos(data.gastosIgv));
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		} finally {
			setloading(false);
		}
	};
	const obtenerGastoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/gastosigv/id/${id}`);

			const dataGasto = {
				...data.gasto,
				id_empresa: data.gasto?.tb_parametros_gasto?.id_empresa,
				id_tipoGasto: data.gasto?.tb_parametros_gasto?.id_tipoGasto,
				grupo: data.gasto?.tb_parametros_gasto?.grupo,
			};
			setdataGasto(dataGasto);
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		}
	};
	const postGasto = async (formState, id_empresa) => {
		try {
			await PTApi.post(`/gastosigv/${id_empresa}`, formState);
			obtenerGastos(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'GASTO REGISTRADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		}
	};
	const updateGastoxID = async (id, formState, id_empresa) => {
		try {
			await PTApi.put(`/gastosigv/id/${id}`, formState);
			obtenerGastos(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'GASTO ACTUALIZADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		}
	};
	const deleteGastoxID = async (id, id_empresa) => {
		try {
			console.log({ id_empresa }, 4);
			await PTApi.put(`/gastosigv/delete/id/${id}`);
			obtenerGastos(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'GASTO ELIMINADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		}
	};
	return {
		dataTC,
		obtenerTc,
		obtenerGastos,
		updateGastoxID,
		deleteGastoxID,
		obtenerGastoxID,
		postGasto,
		dataGasto,
		loading,
	};
};
